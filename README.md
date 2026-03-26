<p align="center">
  <img src="profile.jpg" alt="Jyotirmoy Laha" width="120" style="border-radius: 50%;" />
</p>

<h1 align="center">Jyotirmoy Laha — Developer Portfolio</h1>

<p align="center">
  <a href="https://jyotirmoy-portfolio.onrender.com">🌐 Live Site</a> &nbsp;·&nbsp;
  <a href="https://www.linkedin.com/in/jyotirmoylaha2005/">LinkedIn</a> &nbsp;·&nbsp;
  <a href="mailto:jyotirmoy713128@gmail.com">Email</a>
</p>

---

## About

A single-page developer portfolio with an integrated blog engine and AI-powered chatbot assistant — built entirely from scratch using **HTML5**, **Tailwind CSS**, and **vanilla JavaScript** .

---

## Tech Stack

### Frontend
- **HTML5** — semantic, single `index.html` entry point
- **Tailwind CSS (CDN)** — utility-first styling with custom brand config
- **Vanilla CSS** — 1,700+ lines for glassmorphism components, dark mode, scroll-reveal animations, contribution graph, and responsive layouts
- **Vanilla JavaScript** — all interactivity without frameworks or bundlers
- **AOS** — scroll-triggered reveal animations
- **Lenis** — smooth scrolling with custom easing
- **Font Awesome 6.4** — iconography
- **Google Fonts** — Inter, Space Grotesk, JetBrains Mono, Plus Jakarta Sans

### Backend (Chatbot API)
- **Python 3** + **FastAPI** — async REST API with CORS middleware
- **Groq SDK** — LLM inference (Llama 3.3 70B Versatile)
- **httpx** + **BeautifulSoup4** — live portfolio scraping with 5-minute cache
- **python-dotenv** — environment variable management
- **Rate Limiting** — 20 requests/hour per IP (in-memory sliding window)

### Tools & DevOps
- **Git** & **GitHub** — version control
- **Render** — cloud deployment (static site + web service)
- **Postman** — API testing

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Animated Splash Screen** | Full-screen intro with orbiting tech-stack cards, typewriter terminal animation, and smooth exit transition |
| **AI Chatbot** | Contextual Q&A assistant powered by Groq LLM with live portfolio scraping and rate limiting |
| **Blog Engine** | Custom-built blog system with list/detail views — no CMS dependency |
| **Dark Mode** | Glassmorphism toggle with CSS transitions, localStorage persistence, and system-preference detection |
| **GitHub Activity** | Live contribution graph, streak stats, and top languages pulled from GitHub APIs |
| **Responsive Design** | Mobile-first breakpoints, touch optimizations, landscape handling |

---

## Project Structure

```text
j.portfolio.github/
├── index.html              # Single-page app entry point
├── styles.css              # Custom CSS (1,700+ lines)
├── script.js               # Core JavaScript logic
├── blog-posts.js           # Blog content data
└── portfolio-chatbot/
    ├── frontend/
    │   ├── chatbot.js      # Chatbot UI logic
    │   └── chatbot.css     # Chatbot styles
    └── backend/
        ├── main.py         # FastAPI server
        └── requirements.txt
```

---

## Getting Started

### 1. Frontend

Serve the root directory with any static server:

```bash
python -m http.server 5500
```

Open `http://localhost:5500`

### 2. Chatbot Backend

```bash
cd portfolio-chatbot/backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Create `.env` inside `portfolio-chatbot/backend/`:

```env
GROQ_API_KEY=your_groq_api_key
PORTFOLIO_URL=https://jyotirmoy-portfolio.onrender.com
ALLOWED_ORIGIN=http://localhost:5500
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/health` | Health check — returns `{"status": "ok"}` |
| `POST` | `/chat`   | Send `{ "message": "...", "page_context": "..." }` — returns `{ "reply": "..." }` |

---

## Deployment

| Component | Platform |
|-----------|----------|
| Frontend (static) | Render Static Site / GitHub Pages / Netlify |
| Chatbot Backend | Render Web Service / Railway |

> **Note:** Set `ALLOWED_ORIGIN` in the backend `.env` to match your deployed frontend domain to avoid CORS issues.

---

## Contact

- **Email** — [jyotirmoy713128@gmail.com](mailto:jyotirmoy713128@gmail.com)
- **GitHub** — [JyotirmoyLaha](https://github.com/JyotirmoyLaha)
- **LinkedIn** — [jyotirmoylaha2005](https://www.linkedin.com/in/jyotirmoylaha2005/)

---

<p align="center">Made with ❤️ by Jyotirmoy Laha</p>
