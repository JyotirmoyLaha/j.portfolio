<p align="center">
  <img src="images/profile.webp" alt="Jyotirmoy Laha" width="120" style="border-radius: 50%; border: 3px solid #22d3ee; box-shadow: 0 4px 20px rgba(34, 211, 238, 0.25);" />
</p>

<h1 align="center">Jyotirmoy Laha — Developer Portfolio</h1>

<p align="center">
  <a href="https://jyotirmoy-portfolio.onrender.com"><img src="https://img.shields.io/badge/Live-Demo-22d3ee?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo" /></a>
  <a href="https://www.npmjs.com/package/jyotirmoy-laha"><img src="https://img.shields.io/npm/v/jyotirmoy-laha?style=for-the-badge&color=cb3837&logo=npm" alt="NPM Version" /></a>
  <a href="https://www.linkedin.com/in/jyotirmoylaha2005/"><img src="https://img.shields.io/badge/LinkedIn-Jyotirmoy_Laha-0077b5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vanilla_JS-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="Vanilla JS" />
</p>

---

## 🏗️ Architecture Overview

A high-performance, single-page developer portfolio featuring an integrated blog engine and an AI-powered chatbot assistant. Built with clean, modern web practices—optimized for fast load times, smooth rendering, and responsiveness.

```text
j.portfolio.github/
├── index.html              # Frontend entry point (SPA)
├── styles.css              # Custom layout & animation design
├── script.js               # Core DOM logic & interactivity
├── blog-posts.js           # Static blog database structure
├── cli-card/               # Standalone Node.js CLI business card package
└── portfolio-chatbot/
    ├── frontend/           # Chatbot UI files
    └── backend/            # FastAPI + LLM query engine
```

---

## 🚀 Core Technical Features

### 1. 🖼️ Interactive 3D Parallax Profile Card
- **3D Transform Space**: Constructed using CSS 3D perspective context (`perspective: 1200px`) and nested coordinate layers (`transform-style: preserve-3d`).
- **Parallax Accent Corners**: Floating corners translated dynamically (`translateZ(35px)`) in front of the base card layer.
- **Cursor Tracking**: Coordinates mapped in real-time to calculate dynamic rotation degrees (max 12 deg) and adjust the specular gloss sheen overlay (`--sheen-x`, `--sheen-y`) alongside the backdrop ambient light glow.
- **Animation Suspension**: Gently floats via CSS keyframes, disabling automatically on active hover (`:not(.tilting)`) to prevent animation-script conflicts.

### 2. 🛣️ Client-Side History Router (Vanilla JS)
- **Zero-Dependency Routing**: Leverages window location hashes (`#blog` / `#blog/:id`) to handle routing between portfolio and blog views without loading heavy framework routers.
- **Browser History Integration**: Uses `history.pushState` and `popstate` listeners to capture back/forward navigation, allowing users to bookmark or share direct links to individual articles.
- **State Preservation**: Stores current scroll positions during detail transitions, returning the user exactly to their last active position when reverting to the listing screen.

### 3. 📊 Live GitHub Contribution Heatmap
- **Asynchronous Hydration**: Pulls real-time public contribution arrays from the GitHub metrics API upon section view.
- **Dynamic Grid Rendering**: Generates grid cells classified into level-based opacity states (0 to 4 contributions) resembling standard GitHub profiles.
- **Tooltip Integration**: Implements absolute-positioned viewport tooltips mapping cell metadata on mouseover events.

### 4. 🤖 Context-Aware AI Chatbot Assistant
- **Automatic Scraper Backend**: FastAPI web service using `BeautifulSoup4` and asynchronous HTTP clients to scrape live frontend copy upon initialization, generating context vector tables dynamically.
- **Inference Engine**: Connects to the Groq SDK using low-latency Llama inference models for instant answering based on parsed portfolio content.
- **Security & Rate Limiting**: Integrates CORS configuration and sliding window rate limits (20 requests/hour per IP) to prevent system abuse.

### 5. 💻 Interactive CLI Business Card (`npx jyotirmoy-laha`)
- **NPM Package**: A standalone, interactive terminal-based business card deployed as a Node.js package.
- **Zero-Dependency CLI**: Powered by Node's built-in `readline` events and standard ANSI escape sequences.
- **Interactive Navigation**: Features arrow-key and numeric navigation to explore sections: *About Me*, *Skills*, *Projects*, and *Socials*.
- **Cross-Platform Link Launcher**: Auto-detects operating systems (Windows, macOS, Linux) to open selected hyperlinks in default web browsers.
- **Dripping Laser FX**: Renders a custom terminal intro animation with a dripping logo animation and animated border drawing.

---

## 💻 Detailed Tech Stack

### Frontend & Layout
* **HTML5** — Semantic, optimized page hierarchy, and keyboard accessibility indicators (`skip-to-content`).
* **Tailwind CSS (CDN)** — Custom extended configurations for color schemes, typography overrides, and shadow values.
* **Vanilla CSS (1,700+ lines)** — Glassmorphism navigation panels, slider tracks, core layout utilities, and custom scrollbars.
* **Lenis Smooth Scroll** — Custom easing interpolation equations resolving scroll inertia cleanly.
* **AOS (Animate On Scroll)** — Triggered element animations optimized with hardware-accelerated transforms.

### Backend (Chatbot Service)
* **Python 3** + **FastAPI** — Async endpoints with rate-limiting middleware.
* **SQLAlchemy** + **Alembic** — Database management.
* **Groq API** — Low-latency LLM completions.

### CLI Package
* **Node.js** — Zero-dependency interactive readline CLI application.
* **NPM** — Packaged and published for global execution via `npx jyotirmoy-laha`.

---

## ⚙️ Getting Started

### 1. Running the Frontend Locally

Serve the root project folder using any static web server:

```bash
# Using Python
python -m http.server 5500
```

Access the frontend via `http://localhost:5500`.

### 2. Setting Up the Chatbot Backend

Navigate to the chatbot directory, set up the virtual environment, and install dependencies:

```bash
cd portfolio-chatbot/backend
python -m venv .venv

# Activate on Windows
.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

Create a `.env` file inside `portfolio-chatbot/backend/`:

```env
GROQ_API_KEY=your_groq_api_key
PORTFOLIO_URL=http://localhost:5500
ALLOWED_ORIGIN=http://localhost:5500
```

> [!IMPORTANT]
> The chatbot backend relies on `GROQ_API_KEY` for AI completions. Make sure this environment variable is correctly set before running the service.

Start the FastAPI application:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Running the CLI Card Locally

Navigate to the `cli-card` directory, link the binary, and run it:

```bash
cd cli-card
npm link
jyotirmoy-laha
# Or execute directly:
node bin/index.js
```

> [!TIP]
> Linking the package locally with `npm link` allows you to test the `jyotirmoy-laha` command globally on your machine before publishing.

---

## 🌐 Production Deployment

| Component | Target Platform | Setup Notes |
|---|---|---|
| **Frontend (Static)** | Render / GitHub Pages | Ensure all image paths and JS imports are relative. |
| **Chatbot Backend** | Render Web Service | Set `ALLOWED_ORIGIN` in environment variables to match production domains to prevent CORS issues. |
| **CLI Package** | NPM | Versioned and published to the NPM registry as `jyotirmoy-laha`. |
