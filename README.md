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
| **Skills & Tools** | Categorized skill pills (Frontend, Backend, Tools & DevOps) with devicon logos and an "Exploring" section for AI/ML, LangChain, TensorFlow, NLP |
| **GitHub Activity** | Custom contribution heatmap fetched from GitHub Contributions API, streak stats, and top languages — with year selection pills |
| **Academic Section** | Timeline-style education details (BCA @ Dr. B.C. Roy Academy) |
| **Blog Engine** | 10 in-depth blog articles rendered from a JS data file with card-grid listing, full-article detail view, code block formatting, and smooth view transitions |
| **AI Chatbot** | Floating robot-icon widget powered by Groq (Llama 3.3 70B) via FastAPI — answers questions about skills, projects, and blog content in real time |
| **Dark Mode** | Glassmorphism toggle switch with smooth CSS transitions, localStorage persistence, and system-preference detection |
| **Responsive Design** | Mobile-first breakpoints, touch-device optimizations, landscape handling, and desktop-mode-on-phone layout fixes |

---

## 🏗️ Project Structure

```text
j.portfolio.github/
├── index.html                 # Single-page app — splash, portfolio, blog views
├── styles.css                 # 1 700+ lines — dark mode, animations, components
├── script.js                  # Core JS — splash, view switching, blog, GitHub graph
├── blog-posts.js              # Blog content data (10 articles)
├── profile.jpg                # Profile photo (also used as favicon)
├── Jyotirmoy_Laha_Resume.pdf  # Downloadable CV
│
├── portfolio-chatbot/
│   ├── frontend/
│   │   ├── chatbot.js         # Chat widget — splash-aware, blog-context-aware
│   │   └── chatbot.css        # Chat panel & bubble styling
│   └── backend/
│       ├── main.py            # FastAPI server — Groq LLM, scraper, rate limiter
│       ├── requirements.txt   # Python dependencies
│       ├── .env.example       # Environment variable template
│       └── .gitignore         # Keeps .env and __pycache__ out of version control
│
└── *.jpg / *.png / *.jpeg     # Blog cover images and project screenshots
```

---

## 🛠️ Tech Stack

### Frontend
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

---

## ⚙️ Key Implementation Details

### Splash Screen (`script.js`)
- **Desktop**: semicircle arch of 12 tech-logo cards with staggered spring-in reveals, macOS Dock-style magnification on hover, and subtle floating animation
- **Mobile**: full 360° orbiting ring around center content, smooth `requestAnimationFrame` rotation
- Typewriter effect types `boot --portfolio` in a terminal prompt
- Auto-dismisses after 6 seconds or on "Enter Portfolio" button click

### View Switching
- Portfolio ↔ Blog toggle with CSS fade transitions and `history.pushState` for proper back/forward navigation
- Blog list ↔ article detail view with URL-hash routing (`#blog`, `#blog/{id}`)
- Deep-linking support — direct links to blog articles work on page load

### Blog Renderer
- Posts stored as JavaScript objects in `blog-posts.js` with markdown-like content (triple-backtick code blocks, list items)
- Custom parser splits content by `` ``` ``, renders code blocks with syntax-styled `<pre>` tags, and regular text as `<p>` and `<li>` elements

### GitHub Contribution Graph
- Fetches data from the [GitHub Contributions API](https://github-contributions-api.jogruber.de/) per year
- Renders a pixel-perfect heatmap (week columns × 7 day rows) with month labels, color levels, and hover tooltips
- Streak stats and top languages via GitHub Readme Stats / Streak Stats embeds

### AI Chatbot
- **Frontend widget** waits for splash screen to fully exit (MutationObserver + fallback timeout) before appearing
- Sends optional `page_context` (current blog article title + content) with each message so the LLM can answer "summarize this blog" contextually
- Scroll isolation prevents chat panel scrolling from moving the page
- **Backend** combines hardcoded profile context + live-scraped website content into a structured system prompt for accurate answers

### Dark Mode
- Toggle applies `.dark` class to `<html>`, driving ~120 CSS override rules
- `theme-transitioning` class enables smooth color transitions only during toggle (not during scroll)
- Persisted in `localStorage` with `prefers-color-scheme` fallback

### Performance Optimizations
- `IntersectionObserver`-based scroll reveal (unobserves after first trigger)
- `requestAnimationFrame`-throttled nav hide-on-scroll
- `contain: layout style` on sections for GPU compositing
- `will-change` hints on animated elements
- Lazy-loaded images throughout

---

## 🚀 Local Development

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

## 📝 Blog Posts

| # | Title | Category |
|---|-------|----------|
| 1 | Why I Focus More on Thinking Than Just Writing Code | Philosophy |
| 2 | How I Built My Portfolio Website | Project Breakdown |
| 3 | Mistakes I Made While Building My Portfolio Website | Reflection |
| 4 | How I Built My Weather App (J.SkyCast) | Project Breakdown |
| 5 | Mistakes I Made While Building This Weather App | Development |
| 6 | How AI Helps Me Build Better Websites | Workflow |
| 7 | How I Built My AI Resume Analyzer Tool | Project Breakdown |
| 8 | Mistakes I Made While Building This AI Resume Analyzer | Lessons Learned |
| 9 | How I Built Mess Manager — A Real-Time Expense Tracker for Hostel Life | Project Breakdown |
| 10 | What Building Mess Manager Actually Taught Me | Lessons Learned |

To add a new post, append an object to the `blogPosts` array in `blog-posts.js` with `id`, `title`, `date`, `category`, `image`, and `content` fields.

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
