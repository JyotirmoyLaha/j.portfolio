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
CACHE_TTL = 300

# ─── Hardcoded fallback (always included as base context) ────
HARDCODED_CONTEXT = """
[PERSONAL INFO]
Full Name: Jyotirmoy Laha
Role: BCA Student & Full-Stack Developer
College: Dr. B.C. Roy Academy of Professional Courses (BCRAPC), Durgapur, West Bengal, India
Year: 2nd Year BCA
Email: jyotirmoy713128@gmail.com
WhatsApp: +91 8436866473
GitHub: https://github.com/JyotirmoyLaha
LinkedIn: https://www.linkedin.com/in/jyotirmoylaha2005/
Portfolio: https://jyotirmoy-portfolio.onrender.com/
CV/Resume: https://jyotirmoy-portfolio.onrender.com/Jyotirmoy_Laha_Resume.pdf
Bio: BCA student who converts ideas into code. Strength lies in analytical thinking.
Breaks down tough problems methodically. Builds projects to improve thinking, not just to show skills.

[EDUCATION]
Degree: Bachelor of Computer Applications (BCA)
Institution: Dr. B.C. Roy Academy of Professional Courses, Durgapur
Year: 2nd Year
Subjects: DSA, Web Technologies, Core CS fundamentals, Algorithm optimization

[PROJECTS]
1. Portfolio Website — HTML5, Tailwind CSS, JavaScript
   Live: https://jyotirmoy-portfolio.onrender.com/

2. J.SkyCast — Dynamic weather tracking dashboard with real-time API data
   Stack: JavaScript, Weather API, Tailwind CSS

3. AI Resume Analyzer — NLP-based resume evaluation platform, identifies skill gaps against job roles
   Stack: Python, FastAPI, NLP

4. Mess Manager — Firebase real-time expense tracker for hostel groups, Google auth, PDF reports
   Stack: JavaScript, Firebase, Tailwind CSS

5. StudyVerse — Zen-inspired personal journal, cherry blossom aesthetic, Firebase, Google auth
   Stack: HTML, CSS, JavaScript, Firebase

6. In Progress — Something new being built, details coming soon

[SKILLS]
Frontend: HTML5, CSS3, JavaScript, Tailwind CSS
Backend: Python, FastAPI, Flask, Firebase, SQL (MySQL)
Tools: Git, GitHub, Postman, Render, Netlify
Exploring: AI/ML, LangChain, TensorFlow, NLP, Generative AI

[METHODOLOGY]
1. Understand — Define the problem clearly
2. Design — Plan the architecture
3. Build — Write clean, modular code
4. Test — Break it before users do
5. Ship — Deploy with confidence
6. Iterate — Learn and improve

[EXTRACURRICULARS]
- Active member of Entrepreneurship Development Cell (EDC) at BCRAPC
- Helps organize EDC events like "Ultimate Sales Challenge" (sales pitching competition)

[CONTACT]
Email: jyotirmoy713128@gmail.com
WhatsApp: +91 8436866473
LinkedIn: https://www.linkedin.com/in/jyotirmoylaha2005/
GitHub: https://github.com/JyotirmoyLaha
For availability/freelance: contact directly, Jyotirmoy will respond personally.
"""

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

        for tag in soup.find_all(["script", "style", "noscript", "head",
                                   "meta", "link", "svg", "img", "nav"]):
            tag.decompose()

        # Get all visible text from the page
        raw_text = soup.get_text(separator="\n", strip=True)

        # Clean it up
        lines = [line.strip() for line in raw_text.splitlines()]
        lines = [line for line in lines if len(line) > 2]
        cleaned = "\n".join(lines)[:6000]

        # Combine hardcoded base + scraped live content
        combined = f"{HARDCODED_CONTEXT}\n\n[LIVE SCRAPED CONTENT FROM WEBSITE]\n{cleaned}"

        portfolio_cache["content"] = combined
        portfolio_cache["timestamp"] = now

        return combined

    except Exception:
        # If scraping fails, still return hardcoded context
        return HARDCODED_CONTEXT


# ─── System Prompt Builder ───────────────────────────────────
def build_system_prompt(portfolio_content: str, page_context: str = "") -> str:
    page_context_block = ""
    if page_context:
        page_context_block = f"""

============================================================
CURRENT PAGE CONTEXT (FROM VISITOR'S OPEN PAGE):
============================================================
{page_context}
============================================================
"""

    return f"""You are Jyotirmoy's personal portfolio assistant — intelligent, friendly, 
embedded on his developer portfolio website. Help visitors learn about Jyotirmoy 
quickly and accurately.

Below is Jyotirmoy's complete information including hardcoded key details and 
live scraped content from his website. Use ALL of it to answer questions.

============================================================
JYOTIRMOY'S COMPLETE PROFILE:
============================================================
{portfolio_content}
============================================================
{page_context_block}

RULES:
- Answer based on the above content. Be specific — include phone numbers, 
  emails, links when asked.
- If asked for contact details, always provide them directly.
- For blog questions: prioritize CURRENT PAGE CONTEXT first, then LIVE SCRAPED CONTENT.
- If user says things like "summarize this blog", "summary of this article", or
    "what is this post about", treat "this" as CURRENT PAGE CONTEXT.
- Tone: friendly, direct, slightly informal — match the terminal/dev vibe.
- Keep answers short unless visitor clearly wants detail.
- Never fabricate anything not present above.
- If asked something unrelated to Jyotirmoy: say "I'm Jyotirmoy's portfolio 
  assistant — I can only help with questions about him and his work!"
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
            content={"error": "Too many requests. Please wait before trying again."},
        )

    try:
        body = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid request body."})

    message = body.get("message", "")
    page_context = body.get("page_context", "")

    if not message or not isinstance(message, str):
        return JSONResponse(status_code=400, content={"error": "Message must be a non-empty string."})

    message = message.strip()

    if len(message) == 0:
        return JSONResponse(status_code=400, content={"error": "Message cannot be empty."})

    if len(message) > 500:
        return JSONResponse(status_code=400, content={"error": "Message too long. Max 500 characters."})

    if page_context and not isinstance(page_context, str):
        return JSONResponse(status_code=400, content={"error": "page_context must be a string."})

    if isinstance(page_context, str):
        page_context = page_context.strip()
        if len(page_context) > 12000:
            page_context = page_context[:12000]

    portfolio_content = await scrape_portfolio_content()
    system_prompt = build_system_prompt(portfolio_content, page_context)

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