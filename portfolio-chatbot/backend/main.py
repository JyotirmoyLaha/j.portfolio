import os
import time
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from groq import Groq
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PORTFOLIO_URL = os.getenv("PORTFOLIO_URL", "https://jyotirmoy-portfolio.onrender.com")
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "https://jyotirmoy-portfolio.onrender.com")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

groq_client = Groq(api_key=GROQ_API_KEY)

# ─── Rate Limiting ───────────────────────────────────────────
rate_limit_store = {}
RATE_LIMIT = 20
RATE_WINDOW = 3600

def check_rate_limit(ip: str) -> bool:
    now = time.time()
    if ip not in rate_limit_store:
        rate_limit_store[ip] = []
    rate_limit_store[ip] = [t for t in rate_limit_store[ip] if now - t < RATE_WINDOW]
    if len(rate_limit_store[ip]) >= RATE_LIMIT:
        return False
    rate_limit_store[ip].append(now)
    return True

# ─── Cache ───────────────────────────────────────────────────
portfolio_cache = {"content": None, "timestamp": None}
CACHE_TTL = 300  # 5 minutes

# ─── Scraper ─────────────────────────────────────────────────
async def scrape_portfolio_content() -> str:
    now = time.time()

    if (
        portfolio_cache["content"] is not None
        and portfolio_cache["timestamp"] is not None
        and now - portfolio_cache["timestamp"] < CACHE_TTL
    ):
        return portfolio_cache["content"]

    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as http:
            res = await http.get(PORTFOLIO_URL)
            res.raise_for_status()

        soup = BeautifulSoup(res.text, "html.parser")

        for tag in soup.find_all(["script", "style", "noscript", "head", "meta", "link", "svg", "img"]):
            tag.decompose()

        section_keywords = {
            "[PERSONAL INFO]":  ["hero", "intro", "about", "profile", "bio"],
            "[PROJECTS]":       ["project", "work", "code:projects"],
            "[SKILLS]":         ["skill", "stack", "tech", "tools"],
            "[EDUCATION]":      ["academic", "education", "college", "degree"],
            "[BLOGS]":          ["blog", "article", "thoughts", "code:thoughts"],
            "[CONTACT]":        ["contact", "reach", "connect"],
            "[EXPERIENCE]":     ["experience", "extracurricular", "activity"],
        }

        sections = []

        for label, keywords in section_keywords.items():
            for keyword in keywords:
                found = soup.find_all(
                    lambda tag, kw=keyword: (
                        kw in tag.get("id", "").lower()
                        or any(kw in c.lower() for c in tag.get("class", []))
                    )
                )
                if found:
                    text = " ".join(el.get_text(separator=" ", strip=True) for el in found)
                    text = " ".join(text.split())
                    if len(text) > 20:
                        sections.append(f"{label}\n{text}")
                    break

        if not sections:
            raw = soup.get_text(separator=" ", strip=True)
            raw = " ".join(raw.split())
            sections.append(f"[PORTFOLIO CONTENT]\n{raw}")

        combined = "\n\n".join(sections)[:6000]

        portfolio_cache["content"] = combined
        portfolio_cache["timestamp"] = now

        return combined

    except Exception:
        return "SCRAPE_FAILED: Could not load portfolio content right now."


# ─── System Prompt Builder ───────────────────────────────────
def build_system_prompt(portfolio_content: str) -> str:
    if portfolio_content.startswith("SCRAPE_FAILED"):
        return (
            "You are Jyotirmoy's portfolio assistant. You could not load his portfolio "
            "content right now due to a technical issue. Politely tell visitors you are "
            "having trouble loading the data and ask them to visit "
            "https://jyotirmoy-portfolio.onrender.com/ directly or contact Jyotirmoy at "
            "jyotirmoy713128@gmail.com"
        )

    return f"""You are Jyotirmoy's personal portfolio assistant — an intelligent, friendly
chatbot embedded on his developer portfolio website. Help visitors (recruiters,
collaborators, fellow students) learn about Jyotirmoy quickly and accurately.

The following content was scraped LIVE from his portfolio website just now.
This is your ONLY source of truth. Answer strictly based on this.

============================================================
LIVE PORTFOLIO CONTENT:
============================================================
{portfolio_content}
============================================================

STRICT RULES:
- Answer ONLY from the content above. Never fabricate anything.
- If info is missing, say you don't have it and direct to jyotirmoy713128@gmail.com
- For availability/freelance questions: direct to email or LinkedIn — don't confirm yourself.
- For blog questions: summarise from [BLOGS] section above if present.
- Tone: friendly, direct, slightly informal — match the terminal/dev vibe of the site.
- Keep answers short unless visitor clearly wants detail.
- If asked something unrelated to Jyotirmoy, say:
  "I'm Jyotirmoy's portfolio assistant — I can only help with questions about him and his work!"
"""


# ─── Routes ──────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/chat")
async def chat(request: Request):
    ip = request.client.host

    if not check_rate_limit(ip):
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests. Please wait a while before trying again."},
        )

    try:
        body = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid request body."})

    message = body.get("message", "")

    if not message or not isinstance(message, str):
        return JSONResponse(status_code=400, content={"error": "Message must be a non-empty string."})

    message = message.strip()

    if len(message) == 0:
        return JSONResponse(status_code=400, content={"error": "Message cannot be empty."})

    if len(message) > 500:
        return JSONResponse(status_code=400, content={"error": "Message too long. Max 500 characters."})

    portfolio_content = await scrape_portfolio_content()
    system_prompt = build_system_prompt(portfolio_content)

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            temperature=0.7,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
        )
        reply = completion.choices[0].message.content
        return {"reply": reply}

    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "Something went wrong. Please try again."},
        )