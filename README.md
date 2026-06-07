<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- ✨ ANIMATED HEADER BANNER — 3D wireframe sphere + floating cubes  -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

<p align="center">
  <img src="images/header-animation.svg" alt="Jyotirmoy Laha — Developer Portfolio" width="100%" />
</p>

<!-- Badges Row -->
<p align="center">
  <a href="https://jyotirmoy-portfolio.onrender.com"><img src="https://img.shields.io/badge/🌐_Live_Demo-22d3ee?style=for-the-badge&logoColor=white" alt="Live Demo" /></a>
  <a href="https://www.npmjs.com/package/jyotirmoy-laha"><img src="https://img.shields.io/npm/v/jyotirmoy-laha?style=for-the-badge&color=cb3837&logo=npm&label=CLI%20Card" alt="NPM Version" /></a>
  <a href="https://www.linkedin.com/in/jyotirmoylaha2005/"><img src="https://img.shields.io/badge/LinkedIn-0077b5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:jyotirmoylaha@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/JyotirmoyLaha/j.portfolio?style=social" alt="Stars" />
  <img src="https://img.shields.io/github/forks/JyotirmoyLaha/j.portfolio?style=social" alt="Forks" />
  <img src="https://img.shields.io/github/last-commit/JyotirmoyLaha/j.portfolio?color=22d3ee" alt="Last Commit" />
</p>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<p align="center"><img src="images/divider.svg" width="100%" /></p>
<!-- ═══════════════════════════════════════════════════════════════════ -->

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png" width="25" /> &nbsp;About

> A **high-performance, single-page developer portfolio** featuring an integrated blog engine, a live GitHub contribution heatmap, and an AI-powered chatbot assistant — built with clean, modern web practices optimized for speed, rendering fidelity, and full responsiveness.

<br/>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- 🏗️ ANIMATED ARCHITECTURE DIAGRAM                                   -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" width="25" /> &nbsp;Architecture

<p align="center">
  <img src="images/architecture.svg" alt="System Architecture" width="100%" />
</p>

<details>
<summary>📂 <b>Directory Structure</b></summary>
<br/>

```
j.portfolio.github/
│
├── 📄 index.html                 ← SPA entry point
├── 🎨 styles.css                 ← 1,700+ lines of custom CSS
├── ⚡ script.js                  ← Core DOM logic & interactivity
├── 📝 blog-posts.js              ← Static blog database
│
├── 💻 cli-card/                  ← Node.js CLI business card (NPM)
│   └── bin/index.js
│
└── 🤖 portfolio-chatbot/
    ├── frontend/                 ← Chatbot UI components
    └── backend/                  ← FastAPI + Groq LLM engine
        ├── main.py
        ├── requirements.txt
        └── .env
```

</details>

<br/>

<p align="center"><img src="images/divider.svg" width="100%" /></p>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- ✨ ANIMATED FEATURE CARDS                                          -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" width="25" /> &nbsp;Core Features

<p align="center">
  <img src="images/features.svg" alt="Core Features" width="100%" />
</p>

<br/>

<table>
  <tr>
    <td width="50%">

### 🖼️ Interactive 3D Parallax Card

- CSS 3D perspective context (`perspective: 1200px`)
- Real-time cursor tracking with dynamic rotation (max 12°)
- Parallax floating corners at `translateZ(35px)`
- Specular gloss overlay with `--sheen-x/y` CSS vars
- Gentle float animation, auto-disabled on hover

</td>
<td width="50%">

### 🛣️ Vanilla JS Hash Router

- Zero-dependency client-side routing
- `history.pushState` + `popstate` navigation
- Deep-linkable blog posts via `#blog/:id`
- Scroll position preservation across transitions
- No framework overhead — pure ES6+

</td>
  </tr>
  <tr>
    <td width="50%">

### 📊 Live GitHub Contribution Heatmap

- Async hydration from GitHub metrics API
- Dynamic grid with 5-level opacity states
- Viewport-aware tooltip integration
- Lazy-loaded on section visibility
- Real-time contribution data

</td>
<td width="50%">

### 🤖 Context-Aware AI Chatbot

- FastAPI backend with `BeautifulSoup4` scraper
- Groq SDK + Llama model for instant inference
- Auto-generates context vectors from live content
- CORS + sliding window rate limiting (20 req/hr/IP)
- Fully self-contained deployment

</td>
  </tr>
</table>

<br/>

<details>
<summary>💻 <b>Interactive CLI Business Card</b> — <code>npx jyotirmoy-laha</code></summary>
<br/>

```bash
# 🚀 Run it instantly — no install needed!
npx jyotirmoy-laha

# ✨ With the Matrix rain startup effect:
npx jyotirmoy-laha --matrix
```

| Feature | Details |
|---|---|
| **Zero Dependencies** | Pure Node.js `readline` + ANSI escape codes |
| **Interactive Navigation** | Arrow-key & numeric menu selection |
| **Cross-Platform** | Auto-detects OS for link launching |
| **Dripping Laser FX** | Custom animated terminal intro sequence |
| **Matrix Rain** | 3-second Matrix digital rain with `--matrix` flag |

</details>

<br/>

<p align="center"><img src="images/divider.svg" width="100%" /></p>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- 💻 ANIMATED TECH STACK                                             -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hammer%20and%20Wrench.png" width="25" /> &nbsp;Tech Stack

<p align="center">
  <img src="images/tech-stack.svg" alt="Tech Stack" width="100%" />
</p>

<br/>

<table>
  <tr>
    <th align="center">Layer</th>
    <th align="center">Technologies</th>
  </tr>
  <tr>
    <td align="center"><b>🎨 Frontend</b></td>
    <td>
      <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />
      <img src="https://img.shields.io/badge/Vanilla_CSS-1572B6?style=flat-square&logo=css3&logoColor=white" />
      <img src="https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
      <img src="https://img.shields.io/badge/Lenis-000000?style=flat-square" />
      <img src="https://img.shields.io/badge/AOS-68BC71?style=flat-square" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>⚙️ Backend</b></td>
    <td>
      <img src="https://img.shields.io/badge/Python_3-3776AB?style=flat-square&logo=python&logoColor=white" />
      <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
      <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square" />
      <img src="https://img.shields.io/badge/Groq_AI-000000?style=flat-square" />
      <img src="https://img.shields.io/badge/Alembic-6BA81E?style=flat-square" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>💻 CLI</b></td>
    <td>
      <img src="https://img.shields.io/badge/Node.js_18+-339933?style=flat-square&logo=node.js&logoColor=white" />
      <img src="https://img.shields.io/badge/NPM-CB3837?style=flat-square&logo=npm&logoColor=white" />
      <img src="https://img.shields.io/badge/ANSI_Escape-4A154B?style=flat-square" />
    </td>
  </tr>
</table>

<br/>

<p align="center"><img src="images/divider.svg" width="100%" /></p>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- ⚙️ GETTING STARTED                                                 -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" width="25" /> &nbsp;Getting Started

<details open>
<summary><b>1️⃣ Frontend — Static Server</b></summary>
<br/>

```bash
# Clone the repository
git clone https://github.com/JyotirmoyLaha/j.portfolio.github.git
cd j.portfolio.github

# Serve with Python
python -m http.server 5500
```

> 🌐 Open **`http://localhost:5500`** in your browser

</details>

<details>
<summary><b>2️⃣ Chatbot Backend — FastAPI</b></summary>
<br/>

```bash
cd portfolio-chatbot/backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a **`.env`** file inside `portfolio-chatbot/backend/`:

```env
GROQ_API_KEY=your_groq_api_key
PORTFOLIO_URL=http://localhost:5500
ALLOWED_ORIGIN=http://localhost:5500
```

> [!IMPORTANT]
> The chatbot backend relies on `GROQ_API_KEY` for AI completions. Get your free key at [console.groq.com](https://console.groq.com).

```bash
# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

</details>

<details>
<summary><b>3️⃣ CLI Business Card — Node.js</b></summary>
<br/>

```bash
cd cli-card

# Link for local testing
npm link
jyotirmoy-laha

# Or run directly
node bin/index.js

# With Matrix rain effect ✨
node bin/index.js --matrix
```

> [!TIP]
> Linking with `npm link` lets you test the `jyotirmoy-laha` command globally before publishing.

</details>

<br/>

<p align="center"><img src="images/divider.svg" width="100%" /></p>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- 🌐 DEPLOYMENT                                                      -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Americas.png" width="25" /> &nbsp;Deployment

<table>
  <tr>
    <th>Component</th>
    <th>Platform</th>
    <th>Configuration</th>
  </tr>
  <tr>
    <td>🌐 <b>Frontend</b></td>
    <td><img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white" /></td>
    <td>Ensure all paths are relative</td>
  </tr>
  <tr>
    <td>🤖 <b>Chatbot API</b></td>
    <td><img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" /></td>
    <td>Set <code>ALLOWED_ORIGIN</code> for production CORS</td>
  </tr>
  <tr>
    <td>💻 <b>CLI Package</b></td>
    <td><img src="https://img.shields.io/badge/NPM-CB3837?style=flat-square&logo=npm&logoColor=white" /></td>
    <td>Published as <code>jyotirmoy-laha</code></td>
  </tr>
</table>

<br/>

<p align="center"><img src="images/divider.svg" width="100%" /></p>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- 📊 GITHUB STATS                                                    -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bar%20Chart.png" width="25" /> &nbsp;GitHub Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=JyotirmoyLaha&show_icons=true&theme=midnight-purple&hide_border=true&bg_color=0d1117&title_color=22d3ee&icon_color=a855f7&text_color=94a3b8&ring_color=ec4899" height="180" alt="GitHub Stats" />
  &nbsp;&nbsp;
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=JyotirmoyLaha&layout=compact&theme=midnight-purple&hide_border=true&bg_color=0d1117&title_color=22d3ee&text_color=94a3b8" height="180" alt="Top Languages" />
</p>

<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=JyotirmoyLaha&theme=midnight-purple&hide_border=true&background=0d1117&ring=22d3ee&fire=ec4899&currStreakLabel=a855f7&sideLabels=94a3b8&currStreakNum=e2e8f0&sideNums=e2e8f0&dates=64748b" alt="GitHub Streak" width="600" />
</p>

<p align="center">
  <img src="https://github-profile-trophy.vercel.app/?username=JyotirmoyLaha&theme=discord&no-frame=true&no-bg=true&column=7&margin-w=10" alt="Trophies" width="100%" />
</p>




<p align="center"><img src="images/divider.svg" width="100%" /></p>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- ANIMATED FOOTER                                                    -->
<!-- ═══════════════════════════════════════════════════════════════════ -->

<p align="center">
  <img src="images/footer.svg" alt="Footer" width="100%" />
</p>

<p align="center">
  <a href="https://jyotirmoy-portfolio.onrender.com">
    <img src="https://img.shields.io/badge/Visit_Portfolio-▸-22d3ee?style=for-the-badge" alt="Visit Portfolio" />
  </a>
</p>

<p align="center">
  <sub>⭐ Star this repo if you found it interesting!</sub>
</p>
