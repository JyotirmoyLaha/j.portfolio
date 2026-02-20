# Jyotirmoy Laha — Portfolio & Projects

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

BCA student building real-world web applications. This repository contains my personal portfolio website — a responsive, single-page site showcasing five production-deployed projects.

| Project | Live Link | Repo |
|---------|-----------|------|
| Portfolio | [jyotirmoy-portfolio.onrender.com](https://jyotirmoy-portfolio.onrender.com) | You're here |
| J.SkyCast Weather | [j-weather.onrender.com](https://j-weather.onrender.com/) | [Repo](https://github.com/JyotirmoyLaha/j.weather) |
| AI Resume Analyzer | [ai-resume-analyzer-hhhb.onrender.com](https://ai-resume-analyzer-hhhb.onrender.com/) | [Frontend](https://github.com/JyotirmoyLaha/ai_resume_analyzer_frontend) · [Backend](https://github.com/JyotirmoyLaha/ai-resume-analyzer-backend) |
| Mess Manager | [mess-maneger.onrender.com](https://mess-maneger.onrender.com/) | [Repo](https://github.com/JyotirmoyLaha/mess-maneger) |
| StudyVerse | [studyverse.onrender.com](https://studyverse.onrender.com) | [Repo](https://github.com/JyotirmoyLaha/studyverse) |

---

## About This Portfolio

A clean, modern portfolio site built from scratch — no frameworks, no bundlers.

- **HTML5** semantic structure with **Tailwind CSS** (CDN) for styling
- **Vanilla JavaScript** powering all interactivity, view switching, and blog rendering
- **AOS** library for scroll-triggered animations and **Particles.js** for ambient backgrounds
- Client-side blog engine with syntax-highlighted code snippets
- Dark/light mode toggle with `localStorage` persistence
- Fully responsive across mobile, tablet, and desktop
- Custom cursor effects, glassmorphism cards, floating particles

---

## Projects

### 1. J.SkyCast — Real-Time Weather Dashboard 🌤️

A responsive weather dashboard with real-time data, air quality monitoring, and dynamic UI that adapts to weather conditions and time of day.

**What it does:**
- Real-time weather data for any location worldwide via WeatherAPI
- One-click geolocation for local weather
- Air quality monitoring — EPA standard AQI with pollutant breakdown (CO, NO₂, O₃)
- Comprehensive metrics: temperature, humidity, wind, UV index, visibility, pressure
- Dynamic background gradients that shift with weather conditions (rainy → blue/gray, sunny → warm tones)
- Glassmorphism design with ambient floating particle animations

**Tech:** HTML5 · Tailwind CSS · ES6+ JavaScript · WeatherAPI.com · Geolocation API · Font Awesome

**Live:** [j-weather.onrender.com](https://j-weather.onrender.com/) · **Repo:** [JyotirmoyLaha/j.weather](https://github.com/JyotirmoyLaha/j.weather)

---

### 2. AI Resume Analyzer & Skill Gap Finder 📄

A full-stack AI-powered resume analysis tool. Upload a PDF resume, select a target role, and get a weighted skill match score, gap analysis, priority-based recommendations, and a structured learning roadmap.

**What it does:**
- Extracts text from PDF resumes using `pdfplumber`
- Identifies skills via regex-based NLP pattern matching
- Compares against role-specific requirements (Frontend, Backend, Full Stack, Data Science, DevOps)
- Weighted scoring: Critical (3x) → High (2x) → Medium (1x)
- Generates actionable recommendations with learning resources
- Multi-role comparison to find best-fit career path

**Frontend:** HTML5 · Tailwind CSS · Vanilla JS · Glassmorphism UI · Animated gradient mesh with floating orbs · Dark/light mode  
**Backend:** Python · FastAPI · pdfplumber · Regex-based NLP · Modular skill analysis engine

**Live:** [ai-resume-analyzer-hhhb.onrender.com](https://ai-resume-analyzer-hhhb.onrender.com/) · **Repos:** [Frontend](https://github.com/JyotirmoyLaha/ai_resume_analyzer_frontend) · [Backend](https://github.com/JyotirmoyLaha/ai-resume-analyzer-backend)

---

### 3. Mess Manager — Real-Time Expense Tracker 🍽️

A production-grade collaborative expense tracking app built for hostel/mess management. Real-time multi-device sync with Firebase and secure Google OAuth authentication.

**What it does:**
- Add, edit, delete expenses with instant Firestore synchronization
- Smart fund management — tracks collected funds vs. spending per month
- Automatic month-change detection with historical data preservation
- User attribution with Google profile photos
- Daily/monthly toggle views with PDF export
- Multi-layer security: frontend email whitelist + backend Firestore rules + data integrity validation

**Tech:** HTML5 · Tailwind CSS v3 · ES6+ JavaScript (Modules) · Firebase (Firestore + Auth) · Google OAuth 2.0 · Lucide Icons

**Live:** [mess-maneger.onrender.com](https://mess-maneger.onrender.com/) · **Repo:** [JyotirmoyLaha/mess-maneger](https://github.com/JyotirmoyLaha/mess-maneger)

---

### 4. StudyVerse — Immersive Study Tracker 📚

A premium study tracker and daily journal with a futuristic **Ambient Spatial Glass** design system. Features floating 3D glass interfaces, neon accents, and deep atmospheric backgrounds.

**What it does:**
- Log subjects, progress levels, and study notes
- Daily life journal with mood tracking and image gallery
- Visual stats — streaks, total entries, progress via floating glass cards
- Google Sign-In with personalized greeting for returning users

**Tech:** HTML5 · CSS3 (3D Transforms, Custom Properties) · Vanilla JS · Firebase (Firestore, Auth, Storage)

**Repo:** [JyotirmoyLaha/studyverse](https://github.com/JyotirmoyLaha/studyverse)

---

## Tech Stack Overview

| Area | Technologies |
|------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Tailwind CSS |
| **Backend** | Python, FastAPI |
| **Database & Auth** | Firebase (Firestore, Auth, Storage), Google OAuth 2.0 |
| **APIs** | WeatherAPI, Geolocation API, OpenWeatherMap |
| **Libraries** | AOS, Particles.js, Lucide Icons, Font Awesome, pdfplumber |
| **Design** | Glassmorphism, 3D Transforms, CSS Animations, Responsive/Mobile-First |
| **Tools** | Git, GitHub, VS Code, Render (deployment) |

---

## Run Locally

```bash
git clone https://github.com/JyotirmoyLaha/j.portfolio.git
cd j.portfolio
# Open index.html in your browser — no build step required
```

---

## About Me

I'm Jyotirmoy Laha, a BCA student focused on building production-ready web applications. I started with basic HTML/CSS and have since built full-stack projects involving real-time databases, authentication systems, API integrations, and AI-powered analysis tools.

**Currently exploring:** React, Data Structures & Algorithms, Machine Learning fundamentals

**Contact:**
- Email: [jyotirmoy713128@gmail.com](mailto:jyotirmoy713128@gmail.com)
- GitHub: [JyotirmoyLaha](https://github.com/JyotirmoyLaha)
- LinkedIn: [Jyotirmoy Laha](https://www.linkedin.com/in/jyotirmoy-laha-416818319)
- Portfolio: [jyotirmoy-portfolio.onrender.com](https://jyotirmoy-portfolio.onrender.com)

