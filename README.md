<p align="center">
  <img src="profile.jpg" alt="Jyotirmoy Laha" width="120" style="border-radius: 50%;" />
</p>

<h1 align="center">JYOTIRMOY.DEV — Developer Portfolio</h1>

<p align="center">
  <strong>Single-page portfolio · Custom blog engine · AI chatbot assistant</strong><br>
  Built from scratch with HTML5, Tailwind CSS, and vanilla JavaScript — no frameworks.
</p>

<p align="center">
  <a href="https://jyotirmoy-portfolio.onrender.com">🌐 Live Site</a> &nbsp;·&nbsp;
  <a href="https://github.com/JyotirmoyLaha">GitHub</a> &nbsp;·&nbsp;
  <a href="https://www.linkedin.com/in/jyotirmoylaha2005/">LinkedIn</a>
</p>

---

## ✨ Highlights

| Feature | Details |
|---------|---------|
| **Animated Splash Screen** | Full-screen intro with orbiting tech-stack cards (JavaScript, Python, React, Firebase, etc.), typewriter terminal animation, and a smooth exit transition |
| **Portfolio View** | Hero section with 3D tilt profile image, social links with tooltips, terminal-style dev card, and a "How I Work" methodology timeline |
| **Projects Showcase** | Card grid for 5 live projects — Portfolio, J.SkyCast, AI Resume Analyzer, Mess Manager, StudyVerse — plus an "In Progress" placeholder |
| **Skills & Tools** | Categorized skill### Frontend
- **HTML5** — semantic structure, single `index.html` entry point
- **Tailwind CSS (CDN)** — utility-first styling extended with custom config (brand colors, premium shadows)
- **Vanilla CSS** — 1 700+ lines of custom styles for splash screen, glassmorphism components, dark mode overrides, scroll-reveal animations, contribution graph, and mobile responsiveness
- **Vanilla JavaScript** — no frameworks or build tools
- **[AOS](https://michalsnik.github.io/aos/)** — scroll-triggered reveal animations (`once: true`)
- **[Lenis](https://lenis.darkroom.engineering/)** — smooth scrolling (custom easing, wheel/touch multipliers)
- **Font Awesome 6.4** — icons throughout the UI
- **Google Fonts** — Inter, Space Grotesk, JetBrains Mono, Plus Jakarta Sans

### Chatbot Backend
- **Python 3** + **FastAPI** — async API with CORS middleware
- **Groq SDK** — LLM inference (Llama 3.3 70B Versatile, temperature 0.7)
- **httpx** + **BeautifulSoup4** — live portfolio scraping with 5-minute cache
- **python-dotenv** — environment variable management
- **Rate limiting** — 20 requests/hour per IP (in-memory sliding window)
| **Dark Mode** | Glassmorphism toggle switch with smooth CSS transitions, localStorage persistence, and system-preference detection |
| **Responsive Design** | Mobile-first breakpoints, touch-device optimizations, landscape handling, and desktop-mode-on-phone layout fixes |

---

## 🏗️ Project Structure

```text
j.portfolio.github/
├─ index.html
├─ styles.css
├─ script.js
├─ blog-posts.js
└─ portfolio-chatbot/
	├─ frontend/
	│  ├─ chatbot.js
	│  └─ chatbot.css
	└─ backend/
		├─ main.py
		└─ requirements.txt
```

## Chatbot Features (Current)

- Floating robot launcher icon
- Smooth open/close chat panel with modern UI
- Auto-scroll and isolated chat scroll behavior
- Splash-aware rendering (chatbot appears only after splash fully ends)
- Backend Q&A with portfolio context (hardcoded + live scraped)
- Blog summarization improvement using current blog page context from frontend


## Local Development

### 1. Frontend

Serve the root directory with any static server:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

### 2. Chatbot Backend

```bash
cd portfolio-chatbot/backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file inside `portfolio-chatbot/backend/`:

```env
GROQ_API_KEY=your_groq_api_key
PORTFOLIO_URL=https://jyotirmoy-portfolio.onrender.com
ALLOWED_ORIGIN=http://localhost:5500
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — returns `{"status": "ok"}` |
| `POST` | `/chat` | Send `{ "message": "...", "page_context": "..." }` — returns `{ "reply": "..." }` |

### 3. Connect Frontend to Local Backend (optional)

In `portfolio-chatbot/frontend/chatbot.js`, change line 1:

```js
const CHATBOT_API_URL = "http://127.0.0.1:8000/chat";
```

---

## 🌍 Deployment

| Component | Recommended Platform |
|-----------|---------------------|
| Frontend (static) | Render Static Site / Netlify / GitHub Pages |
| Chatbot Backend (Python) | Render Web Service / Railway |

> **Important**: Set `ALLOWED_ORIGIN` in the backend `.env` to match your deployed frontend domain exactly to avoid CORS issues.

--- 

## 📬 Contact

- **Email**: [jyotirmoy713128@gmail.com](mailto:jyotirmoy713128@gmail.com)
- **GitHub**: [JyotirmoyLaha](https://github.com/JyotirmoyLaha)
- **LinkedIn**: [jyotirmoylaha2005](https://www.linkedin.com/in/jyotirmoylaha2005/)
- **WhatsApp**: [+91 8436866473](https://wa.me/8436866473)

---

<p align="center">
  Made with ❤️ by Jyotirmoy Laha
</p>
