import os
import time
import uuid
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from groq import Groq
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from collections import OrderedDict

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PORTFOLIO_URL = os.getenv("PORTFOLIO_URL", "https://jyotirmoy-portfolio.onrender.com")
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "https://jyotirmoy-portfolio.onrender.com")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "X-Session-ID"],
)

groq_client = Groq(api_key=GROQ_API_KEY)

# ─── Rate Limiting ───────────────────────────────────────────
rate_limit_store = {}
RATE_LIMIT = 20
RATE_WINDOW = 3600

# ─── Conversation Memory ─────────────────────────────────────
# LRU cache for conversation history (max 500 sessions, 10 messages each)
# NOTE: This in-memory store is NOT thread-safe and won't persist across
# multiple Uvicorn/Gunicorn workers. For a portfolio chatbot this is acceptable.
# For production with session continuity needs, consider Redis or similar.
class ConversationStore:
    def __init__(self, max_sessions=500, max_messages=10, session_ttl=3600):
        self.store = OrderedDict()
        self.max_sessions = max_sessions
        self.max_messages = max_messages
        self.session_ttl = session_ttl

    def _cleanup_old_sessions(self):
        now = time.time()
        expired = [sid for sid, data in self.store.items() 
                   if now - data["timestamp"] > self.session_ttl]
        for sid in expired:
            del self.store[sid]

    def get(self, session_id: str) -> list:
        self._cleanup_old_sessions()
        if session_id in self.store:
            self.store.move_to_end(session_id)
            return self.store[session_id]["messages"]
        return []

    def add(self, session_id: str, role: str, content: str):
        self._cleanup_old_sessions()
        if session_id not in self.store:
            if len(self.store) >= self.max_sessions:
                self.store.popitem(last=False)
            self.store[session_id] = {"messages": [], "timestamp": time.time()}
        
        self.store[session_id]["messages"].append({"role": role, "content": content})
        self.store[session_id]["timestamp"] = time.time()
        
        # Keep only last N messages
        if len(self.store[session_id]["messages"]) > self.max_messages:
            self.store[session_id]["messages"] = self.store[session_id]["messages"][-self.max_messages:]

conversation_store = ConversationStore()

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
College Subjects (Curriculum): DBMS, Software Engineering, Operating System
Self-Learning (alongside college): Advanced Python, AI/ML, Web Technologies, Core CS fundamentals

[PROJECTS]
1. Portfolio Website — HTML5, Tailwind CSS, JavaScript
   Live Demo: https://jyotirmoy-portfolio.onrender.com/
   GitHub: https://github.com/JyotirmoyLaha/j.portfolio

2. J.SkyCast — Dynamic weather tracking dashboard with real-time API data
   Stack: JavaScript, Weather API, Tailwind CSS
   Live Demo: https://j-weather.onrender.com/
   GitHub: https://github.com/JyotirmoyLaha/j.weather

3. AI Resume Analyzer — NLP-based resume evaluation platform, identifies skill gaps against job roles
   Stack: Python, FastAPI, NLP
   Live Demo: https://ai-resume-analyzer-hhhb.onrender.com/
   GitHub Frontend: https://github.com/JyotirmoyLaha/ai_resume_analyzer_frontend
   GitHub Backend: https://github.com/JyotirmoyLaha/ai-resume-analyzer-backend

4. Mess Manager — Firebase real-time expense tracker for hostel groups, Google auth, PDF reports
   Stack: JavaScript, Firebase, Tailwind CSS
   Live Demo: https://mess-maneger.onrender.com/
   GitHub: https://github.com/JyotirmoyLaha/mess-maneger

5. StudyVerse — Zen-inspired personal journal, cherry blossom aesthetic, Firebase, Google auth
   Stack: HTML, CSS, JavaScript, Firebase
   Live Demo: https://studyverse-vlzh.onrender.com/
   GitHub: https://github.com/JyotirmoyLaha/studyverse

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

    return f"""You are Jyotirmoy's AI assistant — a sharp, witty, and helpful bot embedded on his developer portfolio.
Your personality: Think of yourself as a friendly senior dev who's genuinely excited to help. 
Use a conversational, slightly informal tone with occasional tech humor. Be direct but warm.

============================================================
JYOTIRMOY'S COMPLETE PROFILE:
============================================================
{portfolio_content}
============================================================
{page_context_block}

RESPONSE GUIDELINES:
1. **Format with Markdown** - Use **bold**, *italics*, `code`, and bullet points for clarity
2. **Be concise** - Lead with the answer, then add context if needed
3. **Include links** - When mentioning projects/profiles, include the actual URLs
4. **Smart suggestions** - End responses with 1-2 relevant follow-up questions when appropriate
5. **Code-aware** - If discussing technical topics, use proper terminology
6. **Emoji sparingly** - One or two max, only when it adds value

PERSONALITY TRAITS:
- Enthusiastic about Jyotirmoy's work without being salesy
- Quick wit and occasional dev humor ("That's a feature, not a bug!")
- Helpful and patient with all questions
- Honest about limitations ("I can only help with questions about Jyotirmoy")

SPECIAL BEHAVIORS:
- For contact queries: Always provide the actual email, phone, and links
- For project questions: Include tech stack and live links
- For "who are you": Introduce yourself with personality, mention you're AI-powered
- For greetings: Be warm and suggest what you can help with
- If asked something unrelated: Politely redirect with humor

Remember: You have conversation history, so reference previous messages naturally.
Keep responses focused but engaging. You're here to make Jyotirmoy look good!
"""


# ─── Routes ──────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/session")
async def create_session():
    """Generate a new session ID for conversation tracking."""
    session_id = str(uuid.uuid4())
    return {"session_id": session_id}


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
    session_id = body.get("session_id", "")

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

    # Generate session ID if not provided
    if not session_id:
        session_id = str(uuid.uuid4())

    portfolio_content = await scrape_portfolio_content()
    system_prompt = build_system_prompt(portfolio_content, page_context)

    # Build messages with conversation history
    conversation_history = conversation_store.get(session_id)
    
    messages_for_api = [{"role": "system", "content": system_prompt}]
    messages_for_api.extend(conversation_history)
    messages_for_api.append({"role": "user", "content": message})

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            temperature=0.7,
            messages=messages_for_api,
        )
        reply = completion.choices[0].message.content
        
        # Store conversation in memory
        conversation_store.add(session_id, "user", message)
        conversation_store.add(session_id, "assistant", reply)
        
        # Detect suggested follow-ups based on content
        suggestions = generate_suggestions(message, reply)
        
        return {
            "reply": reply, 
            "session_id": session_id,
            "suggestions": suggestions
        }

    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "Something went wrong. Please try again."},
        )


def generate_suggestions(user_message: str, bot_reply: str) -> list:
    """Generate contextual follow-up suggestions based on conversation."""
    user_lower = user_message.lower()
    reply_lower = bot_reply.lower()
    
    suggestions = []
    
    # Context-aware suggestions
    if any(word in user_lower for word in ["hi", "hello", "hey", "who"]):
        suggestions = ["What projects has he built?", "What are his skills?", "How can I contact him?"]
    elif any(word in user_lower for word in ["project", "built", "work"]):
        suggestions = ["Tell me about AI Resume Analyzer", "What's Mess Manager?", "Any live demos?"]
    elif any(word in user_lower for word in ["skill", "tech", "stack", "know"]):
        suggestions = ["What's he learning now?", "Backend or frontend?", "Any AI/ML experience?"]
    elif any(word in user_lower for word in ["contact", "email", "phone", "reach"]):
        suggestions = ["Is he available for freelance?", "Download his resume", "Check his GitHub"]
    elif any(word in user_lower for word in ["resume", "cv", "download"]):
        suggestions = ["What are his projects?", "Contact details?", "Education background?"]
    elif any(word in user_lower for word in ["blog", "article", "post"]):
        suggestions = ["Summarize this blog", "More blog posts?", "His writing style?"]
    elif any(word in user_lower for word in ["education", "college", "study"]):
        suggestions = ["What's he studying?", "Self-learning topics?", "Any certifications?"]
    else:
        # Default suggestions
        suggestions = ["Show me his projects", "What's his tech stack?", "How to contact him?"]
    
    return suggestions[:3]  # Return max 3 suggestions