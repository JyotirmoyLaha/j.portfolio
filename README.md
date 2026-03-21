# Jyotirmoy Portfolio + AI Chatbot

Personal portfolio website with a custom JavaScript blog engine and an AI assistant powered by FastAPI + Groq.

Live portfolio: [jyotirmoy-portfolio.onrender.com](https://jyotirmoy-portfolio.onrender.com)

## What this repo contains

- Static portfolio frontend (single-page, responsive, animated UI)
- Blog system rendered from `blog-posts.js`
- Embedded chatbot widget (`portfolio-chatbot/frontend`)
- Chatbot backend API (`portfolio-chatbot/backend`) for portfolio Q&A

## Tech Stack

### Frontend
- HTML5
- CSS3 + Tailwind (CDN)
- Vanilla JavaScript
- AOS, Lenis, Font Awesome

### Chatbot Backend
- Python
- FastAPI
- Groq API
- httpx + BeautifulSoup
- python-dotenv

## Project Structure

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

### 1) Frontend

Open `index.html` in your browser, or run a simple static server.

Example using Python:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

### 2) Backend

From project root:

```bash
cd portfolio-chatbot/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `portfolio-chatbot/backend`:

```env
GROQ_API_KEY=your_groq_api_key
PORTFOLIO_URL=https://jyotirmoy-portfolio.onrender.com
ALLOWED_ORIGIN=http://localhost:5500
```

Run API:

```bash
uvicorn main:app --reload --port 8000
```

Health check:

- `GET http://127.0.0.1:8000/health`

Chat endpoint:

- `POST http://127.0.0.1:8000/chat`

### 3) Point frontend chatbot to local backend (optional)

In `portfolio-chatbot/frontend/chatbot.js`, set:

```js
const CHATBOT_API_URL = "http://127.0.0.1:8000/chat";
```

## Deployment Notes

- Frontend can stay static (Render Static Site / Netlify / GitHub Pages)
- Backend should be deployed as a Python web service
- If backend changes are made locally, redeploy backend for live site to use new logic
- Ensure `ALLOWED_ORIGIN` matches your deployed frontend domain exactly

## Contact

- Email: [jyotirmoy713128@gmail.com](mailto:jyotirmoy713128@gmail.com)
- GitHub: [JyotirmoyLaha](https://github.com/JyotirmoyLaha)
- LinkedIn: [jyotirmoylaha2005](https://www.linkedin.com/in/jyotirmoylaha2005/)

