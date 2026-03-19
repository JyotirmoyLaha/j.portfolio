/* =========================================================
   INTRO SPLASH SCREEN — Arc of language cards + typewriter
   ========================================================= */

(function () {
    'use strict';

    /* ── Language card data — real devicon SVG logos ── */
    const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
    const LANGS = [
        { logo: `${CDN}/javascript/javascript-original.svg`, label: 'JavaScript', grad: ['#f7df1e22', '#f7df1e44'], glow: '#f7df1e' },
        { logo: `${CDN}/python/python-original.svg`, label: 'Python', grad: ['#3572a522', '#3572a544'], glow: '#3572a5' },
        { logo: `${CDN}/react/react-original.svg`, label: 'React', grad: ['#61dafb22', '#61dafb44'], glow: '#61dafb' },
        { logo: `${CDN}/html5/html5-original.svg`, label: 'HTML5', grad: ['#e34c2622', '#e34c2644'], glow: '#e34c26' },
        { logo: `${CDN}/css3/css3-original.svg`, label: 'CSS3', grad: ['#264de422', '#264de444'], glow: '#264de4' },
        { logo: `${CDN}/firebase/firebase-original.svg`, label: 'Firebase', grad: ['#ffca2822', '#ffca2844'], glow: '#ffca28' },
        { logo: `${CDN}/fastapi/fastapi-original.svg`, label: 'FastAPI', grad: ['#05998b22', '#05998b44'], glow: '#05998b' },
        { logo: `${CDN}/git/git-original.svg`, label: 'Git', grad: ['#f1502f22', '#f1502f44'], glow: '#f1502f' },
        { logo: `${CDN}/nodejs/nodejs-original.svg`, label: 'Node.js', grad: ['#6cc24a22', '#6cc24a44'], glow: '#6cc24a' },
        { logo: `${CDN}/mysql/mysql-original.svg`, label: 'SQL', grad: ['#33697722', '#336977aa'], glow: '#336977' },
        { logo: 'https://cdn.simpleicons.org/render/46E3B7', label: 'Render', grad: ['#46e3b722', '#46e3b744'], glow: '#46e3b7' },
        { logo: `${CDN}/tailwindcss/tailwindcss-original.svg`, label: 'Tailwind', grad: ['#06b6d422', '#06b6d444'], glow: '#06b6d4' },
    ];

    /* ── Geometry helpers ── */
    function getGeometry() {
        const W = window.innerWidth, H = window.innerHeight;
        /* Detect actual mobile devices even in "Request Desktop Site" mode */
        const isMobileDevice = (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)
            && Math.min(screen.width, screen.height) < 768;
        const mob = W < 640 || isMobileDevice;
        if (mob) {
            /* Adjust orbit radius for normal mobile vs desktop-mode-on-mobile */
            const r = W < 640
                ? Math.min(W * 0.38, 145)
                : Math.min(W * 0.18, H * 0.20, 200);
            return {
                W, H, mob,
                cx: W / 2,
                cy: H * 0.50,               /* orbit centre = exact screen centre */
                r,                           /* orbit radius — fits all 12 cards */
            };
        }
        return {
            W, H, mob,
            cx: W / 2,
            cy: H * 1.12,     /* arch pivot below viewport */
            rx: W * 0.50,
            ry: H * 0.90,
        };
    }
    function cardPos(i, total, geo) {
        /* Spread across -145° → -35° (upper arch only, avoids extreme sides) */
        const startAngle = -148;
        const endAngle = -32;
        const angleDeg = startAngle + (endAngle - startAngle) * (i / (total - 1));
        const rad = angleDeg * Math.PI / 180;
        return {
            x: geo.cx + geo.rx * Math.cos(rad),
            y: geo.cy + geo.ry * Math.sin(rad),
            tilt: angleDeg + 90,   /* tangent tilt — card faces along the arc */
        };
    }

    /* Live references for Dock hover calc */
    const cardEls = [];
    const cardTilts = [];

    /* ── Mobile orbit: all 12 icons circle the centre text ── */
    function buildMobileOrbit(arc, geo) {
        const total = LANGS.length;
        const r = geo.r;
        const mobileCards = [];

        LANGS.forEach((lang, i) => {
            /* Evenly space around full 360° starting from top (−90°) */
            const initAngle = (i / total) * 2 * Math.PI - Math.PI / 2;
            const initX = geo.cx + r * Math.cos(initAngle);
            const initY = geo.cy + r * Math.sin(initAngle);

            const card = document.createElement('div');
            card.className = 'splash-lang-card';
            card.style.cssText = `
                left:${initX}px; top:${initY}px;
                transform:translate(-50%,-50%) scale(0.08);
                opacity:0;
                background:linear-gradient(135deg,${lang.grad[0]},${lang.grad[1]});
                border-color:${lang.grad[1]};
                transition:none;
                will-change:transform,left,top;
            `;
            card.innerHTML = `<img class="card-icon" src="${lang.logo}" alt="${lang.label}" loading="lazy"><span>${lang.label}</span>`;
            arc.appendChild(card);
            mobileCards.push(card);

            /* Staggered spring-in reveal */
            const delay = 60 + i * 75;
            const dur = 480;
            setTimeout(() => {
                card.style.transition = [
                    `transform ${dur}ms cubic-bezier(0.34,1.56,0.64,1)`,
                    `opacity   ${Math.round(dur * 0.4)}ms ease-out`,
                ].join(',');
                card.style.transform = 'translate(-50%,-50%) scale(0.82)';
                card.style.opacity = '1';
            }, delay);
        });

        /* Start orbiting after all reveals settle */
        const startAfter = 60 + 11 * 75 + 560;
        let orbitAngle = 0;
        let lastTs = null;

        setTimeout(() => {
            /* Remove transition so rAF updates are instant */
            mobileCards.forEach(el => { el.style.transition = 'none'; });

            function orbitFrame(ts) {
                if (!lastTs) lastTs = ts;
                const dt = ts - lastTs;
                lastTs = ts;
                /* Full revolution every 22 s */
                orbitAngle += (dt / 22000) * 2 * Math.PI;

                mobileCards.forEach((el, i) => {
                    const theta = orbitAngle + (i / total) * 2 * Math.PI - Math.PI / 2;
                    el.style.left = (geo.cx + r * Math.cos(theta)) + 'px';
                    el.style.top  = (geo.cy + r * Math.sin(theta)) + 'px';
                    el.style.transform = 'translate(-50%,-50%) scale(0.82)';
                });

                if (!document.getElementById('intro-splash')?.classList.contains('splash-gone')) {
                    requestAnimationFrame(orbitFrame);
                }
            }
            requestAnimationFrame(orbitFrame);
        }, startAfter);
    }

    /* ── Build arc (desktop) / orbit (mobile) ── */
    function buildArc() {
        const arc = document.getElementById('splash-arc');
        if (!arc) return;
        const geo = getGeometry();

        /* ── Mobile: full circular orbit ── */
        if (geo.mob) {
            buildMobileOrbit(arc, geo);
            attachDockHover(); /* no-op on touch devices */
            return;
        }

        /* ── Desktop: semicircle arch ── */
        const total = LANGS.length;
        const startAngle = -148;
        const endAngle = -32;

        LANGS.forEach((lang, i) => {
            const angleDeg = startAngle + (endAngle - startAngle) * (i / (total - 1));
            const rad = angleDeg * Math.PI / 180;
            const pos = {
                x: geo.cx + geo.rx * Math.cos(rad),
                y: geo.cy + geo.ry * Math.sin(rad),
                tilt: angleDeg + 90,
            };
            cardTilts.push(pos.tilt);

            const card = document.createElement('div');
            card.className = 'splash-lang-card';

            /* Start at final (x,y), slightly below + tiny scale — macOS spring-in style */
            const dropPx = 22;
            card.style.cssText = `
                left:${pos.x}px; top:${pos.y}px;
                transform:translate(-50%, calc(-50% + ${dropPx}px)) rotate(${pos.tilt}deg) scale(0.08);
                opacity:0;
                background:linear-gradient(135deg,${lang.grad[0]},${lang.grad[1]});
                border-color:${lang.grad[1]};
                transition:none;
                will-change:transform,opacity;
            `;
            card.innerHTML = `<img class="card-icon" src="${lang.logo}" alt="${lang.label}" loading="lazy"><span>${lang.label}</span>`;
            arc.appendChild(card);
            cardEls.push(card);

            /* Staggered macOS-style spring reveal */
            const delay = 60 + i * 120;
            const dur = 520;
            setTimeout(() => {
                card.style.transition = [
                    `transform ${dur}ms cubic-bezier(0.34,1.56,0.64,1)`,
                    `opacity   ${Math.round(dur * 0.38)}ms ease-out`,
                    `box-shadow 0.3s ease`
                ].join(',');
                card.style.transform = `translate(-50%,-50%) rotate(${pos.tilt}deg) scale(1)`;
                card.style.opacity = '1';
                setTimeout(() => {
                    card.style.animation = `cardFloat ${2.4 + (i % 4) * 0.3}s ease-in-out infinite`;
                    card.style.animationDelay = `${-(i % 6) * 0.4}s`;
                }, dur + 40);
            }, delay);
        });

        attachDockHover();
    }


    /* ── macOS Dock hover: distance-based magnification ── */
    const DOCK_R = 165;
    const DOCK_MAX = 1.55;

    function attachDockHover() {
        const splash = document.getElementById('intro-splash');
        if (!splash) return;
        splash.addEventListener('mousemove', onDockMove);
        splash.addEventListener('mouseleave', onDockLeave);
    }

    function onDockMove(e) {
        cardEls.forEach((card, i) => {
            const r = card.getBoundingClientRect();
            const dist = Math.hypot(e.clientX - (r.left + r.width / 2),
                e.clientY - (r.top + r.height / 2));
            const t = Math.max(0, 1 - dist / DOCK_R);
            const sc = 1 + (DOCK_MAX - 1) * t * t;

            card.style.animationPlayState = t > 0.05 ? 'paused' : 'running';
            card.style.transform = `translate(-50%,-50%) rotate(${cardTilts[i]}deg) scale(${sc.toFixed(3)})`;
            card.style.zIndex = t > 0.05 ? '10' : '1';

            card.style.boxShadow = t > 0.55
                ? `0 18px 50px -8px ${LANGS[i].glow}99, 0 0 0 1px ${LANGS[i].glow}44`
                : '';
        });
    }

    function onDockLeave() {
        cardEls.forEach((card, i) => {
            card.style.transform = `translate(-50%,-50%) rotate(${cardTilts[i]}deg) scale(1)`;
            card.style.zIndex = '1';
            card.style.boxShadow = '';
            card.style.animationPlayState = 'running';
        });
    }


    /* ── Typewriter ── */
    function typeText(el, text, spd) {
        let i = 0;
        (function tick() { if (i < text.length) { el.textContent += text[i++]; setTimeout(tick, spd); } })();
    }

    /* ── Init ── */
    function initSplash() {
        buildArc();
        const t = document.getElementById('splash-typed-text');
        if (t) setTimeout(() => typeText(t, 'boot --portfolio', 65), 950);
        /* auto-dismiss after 6 s */
        setTimeout(dismissSplash, 6000);
    }

    window.dismissSplash = function () {
        const el = document.getElementById('intro-splash');
        if (!el || el.classList.contains('splash-exit')) return;
        const splash = document.getElementById('intro-splash');
        if (splash) splash.removeEventListener('mousemove', onDockMove);
        el.classList.add('splash-exit');
        setTimeout(() => el.classList.add('splash-gone'), 920);
    };

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', initSplash)
        : initSplash();
})();

/* ========================================================= */

// --- BLOG DATA & LOGIC ---


const blogPosts = [
    {
        id: 1,
        title: "Why I Focus More on Thinking Than Just Writing Code",
        date: "03 December 2025",
        category: "Philosophy",
        image: "jakub-zerdzicki-WD7S-Lz12Es-unsplash.jpg",
        content: `There's a common trap that new developers fall into - the rush to start typing code the moment an idea clicks. I used to do the same thing. Open a blank file, start writing HTML, throw in some JavaScript, and hope it all comes together. But over time, I realized the best code I ever wrote started without a keyboard. It started with thinking.

Before I write a single line, I ask myself: what is this supposed to do? Who is it for? What could go wrong? This habit changed everything. When I built my portfolio, I didn't jump into CSS right away. I first mapped out what sections I needed, what the user flow would look like, and how the navigation should feel. Only after that mental model was clear did I start coding.

One principle I follow now is keeping functions small and focused. Each function should do one thing well:

\`\`\`
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

This function does exactly one thing - it toggles the mobile menu. No side effects, no hidden logic. When something breaks, I know exactly where to look. Compare this to a 50-line function doing menu toggling, theme switching, and animation all at once - debugging that becomes a nightmare.

Breaking big problems into smaller parts is another thinking habit that pays off. When I needed to set up animations across my portfolio, I didn't hardcode each one. I configured a library once with clear, predictable settings:

\`\`\`
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});
\`\`\`

The \`once: true\` flag ensures animations play only on first scroll - a deliberate decision to keep the page feeling polished without unnecessary re-triggers. That single config line saved me from performance issues I would have spent hours debugging.

I also try to write logic that is self-explanatory. Future-me should be able to open the file six months later and immediately understand what's happening:

\`\`\`
if (items.length === 0) {
    showEmptyState();
} else {
    renderItems(items);
}
\`\`\`

No cryptic variable names, no clever one-liners that sacrifice readability for brevity. The intent is clear: if there's nothing to show, display an empty state. Otherwise, render the items.

Even small visual features taught me that thinking matters more than typing. When I added particle effects to my portfolio background, I had to think carefully about performance. Too many particles would lag on mobile devices. Too few would look empty. I settled on a balance:

\`\`\`
particlesJS("particles-js", {
    particles: {
        number: { value: 30 },
        size: { value: 2 },
        move: { speed: 1 }
    }
});
\`\`\`

Thirty particles, small size, slow speed. Subtle enough to add atmosphere without taxing the browser. That decision came from thinking, not from trial-and-error coding.

I build projects to sharpen my thinking, not just to fill a GitHub profile. Every project I've worked on - my portfolio, my weather app, my resume analyzer - taught me something new about how to approach problems. And every time, the lesson was the same: slow down, think first, then code.

I'm still learning. And that's not a weakness - it's the whole point.`
    },
    {
        id: 2,
        title: "How I Built My Portfolio Website",
        date: "05 December 2025",
        category: "Project Breakdown",
        image: "nick-morrison-FHnnjk1Yj7Y-unsplash.jpg",
        content: `Every developer needs a portfolio, but building one that actually represents you is harder than it sounds. I didn't want a generic template with placeholder text. I wanted something that reflected how I think - clean, intentional, and built from scratch.

Before writing any code, I defined the purpose: this site should communicate who I am as a developer, showcase my projects, and host my blog - all without overwhelming the visitor. Simplicity was the guiding principle from day one.

For the tech stack, I chose HTML, Tailwind CSS, JavaScript, and AOS (Animate On Scroll). No React, no frameworks. This was a deliberate decision - I wanted to strengthen my fundamentals and prove that you don't need a complex stack to build something professional.

The navigation was one of the first things I built. On mobile, I needed a toggle menu that felt responsive without being janky:

\`\`\`
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

Simple, fast, and predictable. Tailwind's \`hidden\` utility class made this seamless - no custom CSS animations fighting with JavaScript state.

Animations were something I spent a lot of time getting right. I wanted them to feel smooth and professional, not distracting. AOS gave me the control I needed:

\`\`\`
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});
\`\`\`

Setting \`once: true\` was an important decision. Without it, elements would re-animate every time the user scrolled up and down, which felt chaotic. With it, each section reveals once and stays visible - much more polished.

I also added a subtle particle effect to the hero background. The goal was atmosphere, not flashiness. I kept the particle count low and the movement slow so it wouldn't compete with the content:

\`\`\`
particlesJS("particles-js", {
    particles: {
        number: { value: 30 },
        color: { value: "#94a3b8" },
        size: { value: 2 },
        move: { speed: 1 }
    }
});
\`\`\`

Thirty particles with a muted slate color. They float gently in the background and add a sense of depth without pulling attention away from the text. That balance took a few iterations to get right.

One of the bigger challenges was building the blog system. Instead of using a CMS or external service, I hardcoded the blog posts as a JavaScript array and built a custom renderer. The blog view switches dynamically between a card grid and a full article view - all handled with vanilla JS and DOM manipulation. This approach keeps the site self-contained and fast, with zero external dependencies for content.

Dark mode was another detail I integrated carefully. Instead of a simple toggle that just swaps colors, I made sure the transitions felt smooth and that every component - from cards to code blocks to navigation - respected the theme consistently.

The design philosophy was always the same: every visual decision should serve the content. No decorative elements that don't have a purpose. No animations that slow things down. No colors that distract.

This project taught me three things. First, planning saves time - mapping out sections before coding prevented multiple redesigns. Second, simplicity is a feature, not a limitation. Third, building something yourself, even when templates exist, gives you a level of understanding and confidence that nothing else can.`
    },
    {
        id: 3,
        title: "Mistakes I Made While Building My Portfolio Website",
        date: "07 December 2025",
        category: "Reflection",
        image: "kevin-ku-w7ZyuGYNpRQ-unsplash.jpg",
        content: `If you looked at my portfolio today, you'd see a clean, minimal website that works smoothly. What you wouldn't see is the messy process behind it - the wrong decisions, the wasted hours, and the lessons that only came through failure. Here are the biggest mistakes I made and what I learned from each one.

My first and biggest mistake was designing before I had content. I spent days picking color palettes, adjusting font sizes, and tweaking layouts - all before I'd written the actual text for my sections. The result? When I finally added real content, half the design didn't work. Paragraphs were too long for the cards I'd designed. Section headings didn't fit the spacing I'd chosen. I ended up redesigning almost everything. The lesson was clear: content first, design second. Always.

I also tried to build the entire website in one marathon session. I thought I could go from zero to deployed in a single sitting. Instead, I ended up with tangled code, duplicated styles, and a CSS file that made no sense by hour six. Breaking the project into focused sessions - navigation one day, hero section the next, blog system after that - made the code cleaner and the process less exhausting.

At one point, I went overboard with visual effects. I added particle backgrounds, scroll animations on every element, hover transitions on every card, and subtle parallax effects. It looked impressive on my high-end laptop. On a mid-range phone, the site stuttered and lagged. I had to strip most of it back:

\`\`\`
particlesJS("particles-js", {
    particles: {
        number: { value: 30 },
        move: { speed: 1 }
    }
});
\`\`\`

Thirty slow particles instead of a hundred fast ones. That single change cut the performance impact dramatically. I learned that visual polish means nothing if the site feels sluggish.

Variable naming was another area where I stumbled early on. I used names like \`x\`, \`temp\`, \`el1\`, and \`btn2\` - names that made sense at 2 AM but were completely cryptic two weeks later. When I came back to fix a bug, I couldn't tell which element was which. I started being deliberate about naming:

\`\`\`
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

\`toggleMenu\`, \`mobile-menu\`, \`hidden\` - every name tells you exactly what it does. Debugging became significantly faster after this shift.

Perhaps my most costly mistake was underestimating mobile users. I built the entire site on a desktop monitor and only tested mobile responsiveness near the end. By that point, the hero section was overflowing, the navigation was unusable on small screens, and images were loading at full desktop resolution on phones. Fixing all of that required significant restructuring. Now I check mobile at every step, not just at the end.

I also spent too long chasing perfection. I delayed sharing the site for weeks because the blog section wasn't "polished enough" or the dark mode transition wasn't "smooth enough." The truth is, a portfolio is a living document. It evolves as you grow. Waiting for perfection is just a form of procrastination.

The biggest takeaway from all these mistakes: a portfolio doesn't need to be perfect. It needs to be honest, functional, and evolving. Ship it, learn from the feedback, and keep improving.`
    },
    {
        id: 4,
        title: "How I Built My Weather App (J.SkyCast)",
        date: "10 December 2025",
        category: "Project Breakdown",
        image: "dawn-patrol-surf-tracking-nV8Hc0VZA1w-unsplash.jpg",
        content: `J.SkyCast wasn't supposed to be just another weather app. I wanted to build something that felt premium - glassmorphism UI, dynamic sky backgrounds, live air quality data, and a sunrise arc visualization. All with zero frameworks. Just HTML, CSS, and vanilla JavaScript.

The idea was simple: type a city name or tap the location button, and get a beautiful, data-rich weather dashboard. But the execution required solving some genuinely interesting problems.

The foundation of the app is a single async function that fetches weather data from WeatherAPI. I used their forecast endpoint to get current conditions, a multi-day forecast, and air quality data in one API call:

\`\`\`
async function fetchWeather(query) {
    showLoading('Scanning satellite data…');
    try {
        const res = await fetch(
            \`https://api.weatherapi.com/v1/forecast.json?key=\${API_KEY}&q=\${encodeURIComponent(query)}&days=7&aqi=yes\`
        );
        if (!res.ok) throw new Error('Failed to fetch weather data.');
        const data = await res.json();
        updateUI(data);
        showContent();
    } catch (err) {
        showError(err.message);
    }
}
\`\`\`

A few things to notice here. The query is encoded with \`encodeURIComponent\` to handle city names with spaces or special characters. The loading state appears instantly so the user knows something is happening. And the entire flow is wrapped in try-catch because network requests can fail in a hundred different ways.

For API key management, I took security seriously. The key is stored in a separate \`config.js\` file that's git-ignored, with a \`config.example.js\` template for contributors. This way, the actual key never touches the repository.

The search system handles both text queries and geolocation. The form submission is straightforward:

\`\`\`
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
        searchInput.blur();
    }
});
\`\`\`

For live location, I used the Geolocation API with proper error handling for denied permissions, unavailable positions, and timeouts:

\`\`\`
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser.');
        return;
    }
    showLoading('Acquiring coordinates…');
    navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(\`\${pos.coords.latitude},\${pos.coords.longitude}\`),
        err => {
            const msgs = {
                [err.PERMISSION_DENIED]: 'Location permission denied.',
                [err.POSITION_UNAVAILABLE]: 'Location information unavailable.',
                [err.TIMEOUT]: 'Location request timed out.',
            };
            showError(msgs[err.code] || 'Location access denied.');
        }
    );
});
\`\`\`

This maps each specific geolocation error code to a human-readable message. No vague "something went wrong" - the user always knows exactly what happened.

One of the features I'm most proud of is the dynamic background system. The app fetches high-quality Unsplash images based on the current weather condition. I built a mapping system that matches condition text to the right atmosphere:

\`\`\`
function getWeatherImageUrl(conditionText, isDay) {
    const c = conditionText.toLowerCase();
    if (c.includes('thunder') || c.includes('storm'))
        return WEATHER_IMAGES.thunderstorm;
    if (c.includes('rain') || c.includes('drizzle'))
        return WEATHER_IMAGES.rain;
    if (c.includes('sunny') || c.includes('clear'))
        return isDay ? WEATHER_IMAGES.clear_day : WEATHER_IMAGES.clear_night;
    return WEATHER_IMAGES.default;
}
\`\`\`

The \`isDay\` parameter is key - a clear sky at noon shows a bright blue background, but at midnight it switches to a starry night. Small detail, but it makes the app feel alive.

The hero section also generates contextual headlines and descriptions. Instead of just showing "Sunny," the app displays "Bright & Clear Sky" with a description like "Sky conditions look perfect today with 28°C temperatures." Each weather condition has its own copy, making the dashboard feel more like a weather broadcast than a data table.

For the forecast, I built an SVG temperature graph that renders dynamically. It calculates x/y coordinates from the temperature data and draws smooth Bezier curves between the points:

\`\`\`
function renderForecastGraph(temps) {
    const svg = document.getElementById('forecastGraph');
    const W = svg.parentElement.offsetWidth || 600;
    const H = 44;
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = (max - min) || 1;

    const xs = temps.map((_, i) => {
        const colW = W / temps.length;
        return colW * i + colW / 2;
    });
    const ys = temps.map(t =>
        H - ((t - min) / range) * (H - 10) - 5
    );
    // Smooth Bezier curves between points
}
\`\`\`

The air quality section uses the EPA index standard with a color-coded system that goes from green ("Good") to red ("Hazardous"), showing pollutant levels for CO, NO2, and O3.

The entire layout uses a CSS Grid three-column structure - a narrow left sidebar for navigation, a central hero panel for the main display, and a right sidebar for detailed weather cards. On mobile, it collapses responsively using breakpoints at 900px and 640px.

The design system is built on glassmorphism - frosted-glass card effects using \`backdrop-filter: blur()\` with semi-transparent backgrounds. Every card, every stat, every button uses this consistent visual language.

This project taught me more than any tutorial could. I learned how to work with real APIs, manage application state across loading/content/error views, build responsive layouts with CSS Grid, and create data visualizations with SVG. Most importantly, I learned that building something that feels premium doesn't require a premium tech stack - it requires attention to detail.`
    },
    {
        id: 5,
        title: "Mistakes I Made While Building This Weather App",
        date: "12 December 2025",
        category: "Development",
        image: "image-3.jpeg",
        content: `When people use J.SkyCast, they see a polished glassmorphism dashboard with dynamic backgrounds and smooth transitions. What they don't see is the trail of bugs, bad assumptions, and frustrating debugging sessions that shaped the final product. Every mistake taught me something I couldn't have learned from a tutorial.

The first major mistake was trusting the API blindly. I assumed that if I sent a valid city name, I'd always get valid data back. In reality, APIs fail for dozens of reasons - network timeouts, rate limits, misspelled city names, expired keys. My initial code had no error handling at all, which meant the app would silently break and show a blank screen. The fix was straightforward but essential:

\`\`\`
if (!res.ok) {
    let msg = 'Failed to fetch weather data.';
    try {
        const err = await res.json();
        msg = err.error.message;
    } catch {
        msg = \`Error \${res.status}: \${res.statusText}\`;
    }
    throw new Error(msg);
}
\`\`\`

This code tries to extract a meaningful error message from the API response. If even that fails, it falls back to the HTTP status code. The user always gets a clear explanation of what went wrong - not a blank screen or a cryptic console error.

My second mistake was not showing a loading state from the very first moment. When a user searched for a city, the app would sit there doing nothing for one to three seconds while the API responded. No spinner, no text, no feedback. Users thought the app was broken. Adding a loading state with contextual messages fixed this completely:

\`\`\`
function showLoading(text) {
    if (text) loadingText.textContent = text;
    loader.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    errorDiv.classList.add('hidden');
}
\`\`\`

Now the app shows "Scanning satellite data..." during fetch and "Acquiring coordinates..." during geolocation. I learned that UX isn't just about what you show - it's about what happens in the gaps between actions.

The geolocation handling was another disaster early on. I called \`navigator.geolocation.getCurrentPosition\` with only a success callback and completely ignored the error case. When a user denied location permission, the app threw an unhandled error. The fix required mapping each possible failure to a specific message:

\`\`\`
navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(\`\${pos.coords.latitude},\${pos.coords.longitude}\`),
    err => {
        const msgs = {
            [err.PERMISSION_DENIED]: 'Location permission denied.',
            [err.POSITION_UNAVAILABLE]: 'Location information unavailable.',
            [err.TIMEOUT]: 'Location request timed out.',
        };
        showError(msgs[err.code] || 'Location access denied.');
    }
);
\`\`\`

Permission denied, position unavailable, and timeout each get their own message. This taught me a critical lesson: never assume users will grant permissions, and always plan for the "no" path.

I also went overboard with the background system initially. My first version had complex logic with multiple image sources, CSS transitions, gradient overlays, and animated weather effects all fighting for attention. The page loaded slowly and the transitions looked choppy. I simplified the approach to a clean condition-to-image mapping:

\`\`\`
function getWeatherImageUrl(conditionText, isDay) {
    const c = conditionText.toLowerCase();
    if (c.includes('thunder') || c.includes('storm'))
        return WEATHER_IMAGES.thunderstorm;
    if (c.includes('rain') || c.includes('drizzle'))
        return WEATHER_IMAGES.rain;
    if (c.includes('sunny') || c.includes('clear'))
        return isDay ? WEATHER_IMAGES.clear_day : WEATHER_IMAGES.clear_night;
    return WEATHER_IMAGES.default;
}
\`\`\`

A simple cascade of string checks. Readable, fast, and easy to extend. The previous version was three times longer and half as reliable.

Another mistake was the state management between loading, content, and error views. Early on, I was toggling CSS classes inconsistently - sometimes the error message would appear on top of the weather data, or the loader would stay visible after content loaded. I eventually created three clear state functions that each guarantee a clean transition:

\`\`\`
function showError(message) {
    loader.classList.add('hidden');
    weatherContent.classList.add('hidden');
    errorDiv.classList.remove('hidden');
    errorMessage.textContent = message;
}
\`\`\`

Each function hides everything else before revealing its own view. No overlap, no stale state, no visual bugs. Simple state management without any frameworks.

I also waited far too long to test on mobile. The three-column CSS Grid layout looked perfect on desktop but was completely broken on smaller screens. I had to add responsive breakpoints at 900px and 640px to collapse the layout gracefully. That restructuring would have been trivial if I'd planned for mobile from the start.

Finally, I spent weeks trying to make the app "perfect" before showing it to anyone. I kept adding features, polishing animations, tweaking colors. In hindsight, I should have deployed a basic version early and iterated based on real usage. The features I was most proud of weren't even the ones users noticed most - they cared about speed and accuracy, not fancy SVG graphs.

The biggest lesson from this project: ship early, handle errors gracefully, and always design for the user who says "no" to your permissions dialog.`
    },
    {
        id: 6,
        title: "How AI Helps Me Build Better Websites",
        date: "15 December 2025",
        category: "Workflow",
        image: "igor-omilaev-FHgWFzDDAOs-unsplash.jpg",
        content: `When people hear "AI in web development," they imagine a robot writing entire websites from a prompt. That's not how I use AI. For me, AI is a thinking partner - it helps me reason through problems, spot blind spots, and learn faster. I still design, code, and debug everything myself. AI just makes that process sharper.

The biggest way AI helps me is during the planning phase. When I'm starting a new feature, I often know what I want but not exactly how to approach it. Take my weather app's error handling system, for example. I knew I needed to handle API failures, but AI helped me think through all the edge cases I'd have missed: expired keys, rate limits, malformed responses, network timeouts. Instead of discovering these in production, I planned for them upfront.

AI also helps me write cleaner code. Not by writing it for me, but by showing me patterns I didn't know existed. When I was building conditional UI logic, I used to write verbose null checks everywhere. AI introduced me to optional chaining, which changed how I handle uncertain data:

\`\`\`
if (items?.length) {
    showItems();
}
\`\`\`

This single line safely checks if \`items\` exists and has entries. Before learning this pattern, I would have written three separate checks. The logic is identical, but the code is more concise and readable.

Debugging is another area where AI genuinely accelerates my workflow. When I hit an error, I don't just ask AI to fix it - I ask it to explain why the error happened. When my weather app's geolocation feature was silently failing, AI helped me understand that \`getCurrentPosition\` requires an explicit error callback, and that different browsers handle permission denial differently. That context turned a confusing bug into a clear fix and taught me something I'll remember for every future project.

Learning new concepts is where AI shines the most. When I was integrating my first weather API, I didn't fully understand async/await, CORS, or how to properly encode URL parameters. Instead of spending hours reading documentation that assumed I already knew the prerequisites, I could ask AI to explain these concepts in the context of what I was actually building. It explained that \`encodeURIComponent\` prevents city names with spaces from breaking the URL, why \`await\` only works inside \`async\` functions, and how try-catch blocks work with Promises. Each explanation was tied to my real code, which made the learning stick.

AI also improved my thinking about UI and UX. Before AI, I would build features that worked technically but felt incomplete. AI taught me to ask questions like: What happens while data is loading? What does the user see if the request fails? What if the user clicks the button twice? These questions led to real improvements - loading states with contextual messages, proper error displays, and input validation that prevents duplicate requests.

Beyond code, AI helps me write better content. These blog posts, project descriptions, and documentation all benefit from AI's ability to help me organize my thoughts and express ideas more clearly. But the ideas themselves are always mine - AI doesn't know what I built, what mistakes I made, or what lessons I learned. It just helps me communicate those experiences more effectively.

There's an important distinction I want to make. AI doesn't replace learning - it accelerates it. I still read documentation, study other people's code, and solve problems on my own first. AI is the tool I reach for when I'm stuck, when I want a second opinion, or when I'm trying to understand a concept that documentation explains poorly.

I've seen developers on both extremes: those who refuse to use AI because they think it's "cheating," and those who use AI for everything without understanding the output. Both approaches miss the point. AI is most powerful when you already understand the fundamentals and use it to push your boundaries further. It's a power tool, not a replacement for skill.

The way I see it: AI helps me build better websites faster. But it's my understanding, my design decisions, and my debugging skills that make those websites actually work.`
    },
    {
        id: 7,
        title: "How I Built My AI Resume Analyzer Tool",
        date: "3rd January 2026",
        category: "Project Breakdown",
        image: "chatgpt-resume-analyzer.png",
        content: `
Resumes play a very important role in today's job market. In most cases, they are the first thing a recruiter or an automated system looks at before deciding whether a candidate should move forward. However, many people struggle to understand whether their resume actually matches the job they are applying for. I built my AI Resume Analyzer to solve this exact problem by giving clear, role-based feedback instead of guesswork.

The main idea behind this project was to allow users to upload their resume, select a target job role, and instantly see how well their skills match that role. The system does not just show a score, but also highlights matched skills, missing skills, and practical recommendations. This makes resume improvement more structured and actionable instead of confusing or generic.

On the backend, the first challenge was extracting clean text from uploaded PDF resumes. Since resumes come in different formats, this step needed to be reliable. I used a dedicated resume parser to safely extract and clean text before analysis.

\`\`\`python
def extract_text_from_resume(file):
    extracted_text = []
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)

    text = "\\n".join(extracted_text)
    return text.lower().strip()
\`\`\`

This logic ensures that the system works even when resumes have multiple pages or inconsistent spacing.

\`\`\`python
def extract_skills(resume_text):
    found_skills = set()
    for skill, pattern in MASTER_SKILL_PATTERNS.items():
        if pattern.search(resume_text):
            found_skills.add(skill)
    return sorted(found_skills)
\`\`\`

Once the resume text is extracted, the next step is identifying technical skills accurately. Instead of relying on simple keyword checks, I built a structured skill extraction system using predefined patterns and role-based filters. This allows the analyzer to detect skills like Python, JavaScript, React, Docker, and many others with higher accuracy.

This approach makes the system flexible and easy to extend when new skills or roles are added.

The most important part of the project is the skill gap analysis. This is where the AI logic compares the candidate's skills with the required skills for a selected role. Instead of treating all skills equally, I introduced priority levels like critical, high, and medium to make the results more realistic.

\`\`\`python
matched_skills = candidate_skills & required_skills
missing_skills = required_skills - candidate_skills

match_percentage = round((earned_score / total_score) * 100, 2)
\`\`\`

This scoring system helps users understand not just what is missing, but how important those missing skills are for their target role.

To make the analysis more helpful, I also added a feedback generator that converts raw numbers into human-readable career advice. Instead of technical output, users see simple guidance that feels personal and encouraging.

\`\`\`python
if match >= 85:
    feedback = "You are strongly prepared for this role."
elif match >= 65:
    feedback = "You are moderately prepared, but need improvement."
else:
    feedback = "Focused upskilling is recommended."
\`\`\`

This step made the tool feel less like a machine and more like a mentor.

The backend API is built using Flask and is designed to be clean and minimal. It handles resume uploads, role selection, and returns structured JSON data that the frontend can easily consume.

\`\`\`python
@app.route("/analyze", methods=["POST"])
def analyze_resume():
    resume_text = extract_text_from_resume(resume_file)
    result = analyze_skill_gap(resume_text, role, include_resources=True)
    return jsonify(result)
\`\`\`

This separation between frontend and backend keeps the system scalable and easy to maintain.

On the frontend, my focus was clarity and simplicity. The interface allows users to select a role, upload a PDF resume, and view results without unnecessary distractions. I used a clean dashboard layout that highlights match score, skills, feedback, and next steps in a clear visual hierarchy.

\`\`\`javascript
const res = await fetch(\`\${API_BASE_URL}/analyze\`, {
  method: "POST",
  body: formData
});
const data = await res.json();
renderResults(data);
\`\`\`

The UI is designed to feel calm and supportive, because resume analysis is a sensitive process for many users.

Building this project taught me that AI is not just about complex models or buzzwords. The real value comes from solving a real problem in a way that users can understand and trust. Most of the effort went into thinking about what feedback actually helps people, not just how to calculate scores.

This AI Resume Analyzer represents my interest in combining backend logic, AI concepts, and frontend usability into a single meaningful product. It is not perfect, but it is practical, honest, and continuously improving. As I learn more, I plan to add better role comparisons, smarter recommendations, and deeper analysis.

— Jyotirmoy Laha
`
    },
    {
        id: 8,
        title: "Mistakes I Made While Building This AI Resume Analyzer",
        date: "6th January 2026",
        category: "Lessons Learned",
        image: "chatgpt-resume-mistakes.png",
        content: `
When I started building my AI Resume Analyzer, I was excited about the idea and features, but I underestimated how important clean structure, language separation, and proper API testing really are. Most of my mistakes were not about syntax errors, but about how I organized and tested my code. These mistakes slowed me down, but they taught me how real backend systems should be built.

One of the biggest mistakes I made in the beginning was poor separation of responsibilities between different Python files. Initially, my logic felt scattered. Skill extraction, role mapping, scoring, and feedback generation were tightly connected in my head, and I didn't clearly define where each responsibility should live. Over time, this made the code harder to debug and reason about.

Later, I fixed this by clearly separating concerns. For example, all skill detection logic now lives only inside skill_extractor.py, while role comparison and scoring logic stays inside skill_gap.py. This made the system much cleaner and easier to maintain.

\`\`\`python
# skill_extractor.py
def extract_skills(resume_text: str, role: Optional[str] = None) -> List[str]:
    if not resume_text:
        return []

    resume_text = resume_text.lower()
    found_skills = set()

    for skill, pattern in MASTER_SKILL_PATTERNS.items():
        if pattern.search(resume_text):
            found_skills.add(skill)

    if role and role in ROLE_SKILLS:
        found_skills &= ROLE_SKILLS[role]

    return sorted(found_skills)
\`\`\`

This separation helped me understand that each file should do one job well, not everything at once.

Another major mistake was treating API testing as an afterthought. At first, I tested my backend only by clicking buttons on the frontend. If the UI worked, I assumed the API was fine. This was a bad habit. When something broke, I had no clear idea whether the problem was coming from the frontend request, backend validation, or resume parsing.

Once I started reading my app.py carefully, I realized how important proper API validation really is. I improved my API by adding strict checks for file uploads and extracted text before running any analysis.

\`\`\`python
# app.py
if "resume" not in request.files:
    return jsonify({"error": "Resume file is required"}), 400

resume_file = request.files.get("resume")
if resume_file.filename == "":
    return jsonify({"error": "Resume file is empty"}), 400
\`\`\`

After this, testing the API independently (without the UI) became much easier, and errors were clearer and more predictable.

I also made mistakes while handling resume text extraction. In the beginning, I assumed that every PDF would return clean text. In reality, some resumes had missing text, broken formatting, or unexpected layouts. When extraction failed, the rest of the pipeline broke silently.

To fix this, I added proper checks and cleaning logic inside resume_parser.py.

\`\`\`python
# resume_parser.py
with pdfplumber.open(file) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            extracted_text.append(text)

if not extracted_text:
    return None
\`\`\`

This taught me that data coming from users is never guaranteed to be clean, and defensive programming is necessary in real-world applications.

Another mistake I made was not thinking deeply about scoring logic at first. Initially, all skills felt equal in my head. But that produced unrealistic results. Missing a core skill like Python should matter more than missing a secondary one. This pushed me to design a weighted scoring system using skill priorities.

\`\`\`python
# skill_gap.py
for skill in required_skills:
    weight = _priority_weight(SKILL_PRIORITY.get(skill, "low"))
    total_score += weight
    if skill in candidate_skills:
        earned_score += weight
\`\`\`

This change completely improved the realism of the analyzer and made the results feel closer to real hiring expectations.

Looking back, most of my mistakes came from trying to move fast instead of thinking clearly about structure and testing. I learned that good AI tools are not built only with smart logic, but with clean separation of concerns, strong validation, and proper API testing.

This project taught me how backend systems actually behave in real usage. Every mistake forced me to slow down, refactor, and understand my own code better. Those lessons are far more valuable than a perfect first version.

— Jyotirmoy Laha
`
    },
    {
        id: 9,
        title: "How I Built Mess Manager — A Real-Time Expense Tracker for Hostel Life",
        date: "10th February 2026",
        category: "Project Breakdown",
        image: "mess-manager.jpeg",
        content: `Living in a hostel means sharing everything, including food costs. Every month, our group collects a fund, buys groceries, and tracks who spent what. But doing all of this manually through messages and notebooks created confusion, arguments, and lost records. That is exactly why I built Mess Manager — a real-time expense tracking app designed specifically for shared living situations.

Before writing any code, I spent time understanding the actual problem. Our group of four needed a system where anyone could add an expense, everyone could see the live balance, and no one could tamper with someone else's entries. The solution had to be simple, mobile-friendly, and always in sync across all devices.

I chose a clean tech stack: HTML5 for structure, Tailwind CSS for styling, vanilla JavaScript (ES6+) for logic, and Firebase for authentication and database. I intentionally avoided frameworks to keep things lightweight and to strengthen my fundamentals.

The first major decision was using Firebase Firestore as a real-time NoSQL database. This meant every expense added by one member would instantly appear on everyone else's screen without refreshing. I set up two main data collections — one for expenses and one for the shared fund.

I designed two main data collections — one for expenses and one for the shared fund. The expense collection stores each entry with fields like item name, cost, date, and the user who added it. The fund document tracks the current balance, active month, and previous month spending. This structure keeps expense records separate from fund management, making queries and updates clean and predictable.

Authentication was handled through Google OAuth 2.0 via Firebase Auth. But I did not want just anyone with a Google account to access our mess data. So I implemented an email whitelist — an array of authorized emails that acts as the first security gate.

\`\`\`
const AUTHORIZED_EMAILS = [
    'member1@example.com',
    'member2@example.com',
    'member3@example.com',
    'member4@example.com',
];
\`\`\`

If someone tries to log in with an unauthorized email, they are immediately signed out and shown a clear error message. This prevents random users from accessing or corrupting the group's financial data.

The real-time synchronization is probably the most satisfying part of the project. Using Firestore's onSnapshot listener, the app reacts to database changes instantly. When someone adds an expense from their phone, the dashboard updates on everyone else's screen within milliseconds. No polling, no manual refresh buttons — just clean, real-time data flow.

One of the more complex features was automatic month-change detection. At the start of each new month, the app detects that the month has changed, saves the previous month's total spending, and resets the current month's counter. This happens automatically without any user intervention through a function that compares the stored month key with the current one and updates the database accordingly.

I also built an admin system where I, as the admin, have additional permissions like editing or deleting any expense. Regular members can only modify their own entries. This permission logic runs both on the frontend and through database-level security rules for defense in depth.

The expense form itself handles both creating and editing entries. When a user clicks edit on their own expense, the form switches to edit mode, pre-fills the values, and updates the existing Firestore document instead of creating a new one.

When a user clicks edit, the form switches to edit mode, pre-fills the existing values, and updates the database document instead of creating a new one. For new entries, it writes the item name, cost, added-by info, and timestamp to the collection.

The UI supports two view modes — daily and monthly. In daily mode, expenses are grouped by date with individual item details. In monthly mode, they are aggregated for a broader overview. Users can also download PDF reports for both views, which I built using the jsPDF library with custom headers, tables, and formatting.

For the visual design, I used a dark-themed glassmorphism style with Tailwind CSS. The dashboard shows the current fund balance, total spent, a spending progress bar, and previous month stats — all updating in real time. I used Lucide icons for a clean, modern icon set.

Security was a major focus throughout the project. Beyond the frontend email whitelist, I also wrote database-level security rules that enforce authorization independently. Even if someone bypasses the frontend, they cannot read or write data without being on the approved list. Users can only delete their own expenses, and fund updates are restricted to authorized members only. This multi-layer approach — frontend whitelist, backend rules, and data validation — makes the system genuinely secure, not just superficially protected.

Building Mess Manager taught me how real-world applications work beyond just displaying data. It taught me state management, real-time architecture, authentication flows, permission systems, and the importance of thinking about edge cases before they become bugs. This is not just a project — it is a system that my hostel group actually uses every single day.

— Jyotirmoy Laha
`
    },
    {
        id: 10,
        title: "What Building Mess Manager Actually Taught Me",
        date: "14th February 2026",
        category: "Lessons Learned",
        image: "mess manager.jpg",
        content: `Every project teaches something. But Mess Manager taught me more than I expected because it was not a tutorial project or a practice exercise — it was built to solve a real problem for real people. My hostel group uses it daily, and that level of real-world pressure forced me to think differently about code, design, and responsibility.

The biggest lesson was understanding the difference between code that works and code that is reliable. In the beginning, my expense form worked perfectly when I tested it alone. But when four people started using it simultaneously, small issues appeared — race conditions, duplicate entries, and UI states that did not reset properly. This taught me that real-time multi-user applications behave very differently from single-user prototypes.

\`\`\`
elements.expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = elements.itemName.value;
    const cost = elements.itemCost.value;
    if (!name || !cost) return;

    const btnText = document.getElementById('btn-text');
    btnText.innerText = "Saving...";
});
\`\`\`

Even something as simple as showing "Saving..." on the button was a lesson. Without it, users would click multiple times thinking nothing happened, which caused duplicate records. I learned that UX feedback is not decoration — it is functional communication.

The second major lesson was about security. When I first deployed the app, I only had frontend-level protection. The email whitelist worked great in the browser, but I soon realized that anyone with basic developer tools knowledge could bypass it. That is when I learned about defense in depth — the idea that security must exist at every layer, not just the surface.

I wrote database-level security rules that independently verify authorization. This means even if someone strips away my frontend code, they still cannot read or write data without being on the approved list. The rules enforce that only authenticated and whitelisted users can create, read, update, or delete records — and users can only modify their own entries.

This experience completely changed how I think about security. It is not something you add at the end — it is something you design from the start.

State management was another area where I grew significantly. Mess Manager has a global state object that tracks the user, expenses, fund balance, current month, view mode, edit state, and delete targets. Managing all of these without a framework like React taught me what frameworks actually solve under the hood. Every time the state changes, the UI needs to re-render the right parts. Getting this wrong meant stale data, broken buttons, or missing information. I learned how to think in terms of state transitions — what triggers a change, what depends on that change, and how to keep everything consistent.

Real-time data synchronization was both the most exciting and the most humbling part of the project. Firestore's onSnapshot listeners make it feel magical when one person adds an expense and it instantly appears on everyone else's screen. But handling edge cases — like what happens when the internet drops, or when two people edit at the same time — requires careful thought.

The listener watches the fund document and updates the local state with the current balance, active month, and previous month's spending. But I learned to always provide fallback values and to never assume the database document exists or contains the fields I expect. Defensive programming is not about being paranoid — it is about being realistic.

The month-change detection feature taught me about temporal logic in applications. I had to think about time zones, edge cases around midnight, and what happens when no one opens the app for several days. Building this feature made me appreciate how complex even simple-sounding requirements can become when they interact with real-world conditions.

Working with PDF generation using jsPDF was another eye-opener. I built custom PDF reports with headers, formatted tables, page breaks, and styled footers. This taught me that generating documents programmatically requires pixel-level thinking about layout, spacing, and content overflow.

\`\`\`
function downloadDailyExpensePdf(dayKey, group) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    buildPdfHeader(doc, 'Daily Expenses', dayKey);

    items.forEach((expense, index) => {
        if (y > pageHeight - 90) {
            doc.addPage();
            y = 96;
        }
    });
}
\`\`\`

Handling page breaks properly — checking if the current y position would overflow the page height before rendering each row — was a detail I would have never thought about without building it myself.

Perhaps the most valuable lesson was about building for real users. When my friends use the app, they find edge cases I never imagined. Someone tried to add an expense with a cost of zero. Someone else accidentally deleted an entry and wanted it back. Another person opened the app at exactly midnight when the month was changing. Each of these scenarios forced me to add validation, confirmation dialogs, and better error messages.

\`\`\`
function showError(msg, isLogin) {
    if (isLogin) {
        loginErrorText.innerText = msg;
        loginError.classList.remove('hidden');
    } else {
        dashErrorText.innerText = msg;
        dashError.classList.remove('hidden');
    }
}
\`\`\`

Error handling in Mess Manager is not generic — it is contextual. Login errors appear differently from dashboard errors. Success toasts look different from error toasts. This attention to detail makes the app feel polished and trustworthy.

Looking back, Mess Manager transformed me from someone who builds projects to practice coding into someone who builds products to solve problems. The difference is enormous. Practice projects end when the feature works. Real products require you to think about security, reliability, edge cases, performance, user feedback, and long-term maintenance.

Every line of code in this project exists because a real situation demanded it. That is not something any tutorial can teach — it comes from building something that people actually depend on.

— Jyotirmoy Laha
`
    }
];

// --- VIEW SWITCHING LOGIC ---

function switchView(viewName, pushHistory = true) {
    const portfolio = document.getElementById('portfolio-view');
    const blog = document.getElementById('blog-view');

    // Nav Elements
    const desktopPortfolioNav = document.getElementById('desktop-portfolio-nav');
    const desktopBlogNav = document.getElementById('desktop-blog-nav');
    const mobilePortfolioNav = document.getElementById('mobile-portfolio-nav');
    const mobileBlogNav = document.getElementById('mobile-blog-nav');

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        toggleMenu();
    }

    // Smooth scroll to top via Lenis
    lenis.scrollTo(0, { duration: 0.8 });

    if (viewName === 'blog') {
        // Push history state for browser back button
        if (pushHistory) {
            history.pushState({ view: 'blog' }, '', '#blog');
        }

        // Fade out current view, then swap
        portfolio.style.opacity = '0';
        portfolio.style.transform = 'translateY(12px)';
        setTimeout(() => {
            portfolio.classList.add('view-hidden');
            portfolio.style.opacity = '';
            portfolio.style.transform = '';
            blog.classList.remove('view-hidden');

            // Switch Navigation to Blog Mode
            desktopPortfolioNav.classList.add('hidden');
            desktopBlogNav.classList.remove('hidden');
            mobilePortfolioNav.classList.add('hidden');
            mobileBlogNav.classList.remove('hidden');

            // Re-trigger entrance animation
            blog.style.animation = 'none';
            blog.offsetHeight; // trigger reflow
            blog.style.animation = '';

            setTimeout(() => AOS.refresh(), 100);
        }, 250);
    } else {
        // Push history state for browser back button
        if (pushHistory) {
            history.pushState({ view: 'portfolio' }, '', '#');
        }

        // Fade out current view, then swap
        blog.style.opacity = '0';
        blog.style.transform = 'translateY(12px)';
        setTimeout(() => {
            blog.classList.add('view-hidden');
            blog.style.opacity = '';
            blog.style.transform = '';
            portfolio.classList.remove('view-hidden');

            // Switch Navigation to Portfolio Mode
            desktopBlogNav.classList.add('hidden');
            desktopPortfolioNav.classList.remove('hidden');
            mobileBlogNav.classList.add('hidden');
            mobilePortfolioNav.classList.remove('hidden');

            // Reset Blog to list view when leaving
            showList(true);

            // Re-trigger entrance animation
            portfolio.style.animation = 'none';
            portfolio.offsetHeight;
            portfolio.style.animation = '';

            setTimeout(() => AOS.refresh(), 100);
        }, 250);
    }
}

function navigateToSection(sectionId) {
    // First ensure we are in portfolio view
    const portfolio = document.getElementById('portfolio-view');

    if (portfolio.classList.contains('view-hidden')) {
        switchView('portfolio');
        // Wait for switch then scroll
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) lenis.scrollTo(element, { duration: 1, offset: -80 });
        }, 150);
    } else {
        // Already in portfolio view, just scroll
        const element = document.getElementById(sectionId);
        if (element) lenis.scrollTo(element, { duration: 1, offset: -80 });
    }
}

// --- BLOG FUNCTIONS ---

function renderList() {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;
    grid.innerHTML = blogPosts.map(post => `
        <article class="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer" onclick="showDetail(${post.id})">
            <div class="h-36 sm:h-48 bg-slate-100 relative overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" loading="lazy">
                <div class="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold text-slate-600 shadow-sm border border-slate-100">
                    ${post.category}
                </div>
            </div>
            <div class="p-4 sm:p-6 flex-1 flex flex-col">
                <div class="text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <i class="fa-regular fa-calendar"></i> ${post.date}
                </div>
                <h2 class="font-display text-base sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-accent-primary transition-colors leading-snug">
                    ${post.title}
                </h2>
                <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1 line-clamp-3">
                    ${post.content.replace(/```/g, '').substring(0, 100)}...
                </p>
                <div class="inline-flex items-center text-xs sm:text-sm font-semibold text-accent-primary hover:text-blue-700 transition-colors group/link">
                    Read Article <i class="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                </div>
            </div>
        </article>
    `).join('');
}

function showDetail(id, pushHistory = true) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    // Updated Parsing Logic: Split by triple backticks
    const parts = post.content.split('```');
    let formattedContent = '';

    parts.forEach((part, index) => {
        if (index % 2 === 1) {
            // This is a code block
            formattedContent += `<pre class="bg-slate-900 text-blue-200 p-4 sm:p-6 rounded-lg sm:rounded-xl my-4 sm:my-6 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner leading-relaxed border border-slate-700 whitespace-pre-wrap break-words sm:whitespace-pre sm:break-normal">${part.trim()}</pre>`;
        } else {
            // This is regular text
            const lines = part.split('\n');
            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('- ')) {
                    // List items
                    formattedContent += `<li class="ml-4 list-disc marker:text-accent-primary">${trimmed.substring(2)}</li>`;
                } else if (trimmed.length > 0) {
                    // Regular paragraphs
                    formattedContent += `<p>${line}</p>`;
                }
            });
        }
    });

    document.getElementById('detail-title').innerText = post.title;
    document.getElementById('detail-date').innerText = post.date;
    document.getElementById('detail-content').innerHTML = formattedContent;

    const blogList = document.getElementById('blog-list');
    const blogDetail = document.getElementById('blog-detail');

    // Push history state for browser back button
    if (pushHistory) {
        history.pushState({ view: 'blog-detail', postId: id }, '', `#blog/${id}`);
    }

    // Fade out list, then show detail
    blogList.style.opacity = '0';
    blogList.style.transform = 'translateY(10px)';
    setTimeout(() => {
        blogList.classList.add('hidden');
        blogList.style.opacity = '';
        blogList.style.transform = '';
        blogDetail.classList.remove('hidden');
        blogDetail.style.opacity = '0';
        blogDetail.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
            blogDetail.style.opacity = '1';
            blogDetail.style.transform = 'translateY(0)';
        });
    }, 250);
    lenis.scrollTo(0, { duration: 0.6 });
}

function showList(fromPopstate = false) {
    const blogList = document.getElementById('blog-list');
    const blogDetail = document.getElementById('blog-detail');

    // If called manually (not from popstate) and we're in detail view, use history.back()
    // This ensures browser back button works correctly after clicking "Back to Articles"
    if (!fromPopstate && !blogDetail.classList.contains('hidden')) {
        history.back();
        return; // Let popstate handler call showList again with fromPopstate=true
    }

    // Fade out detail, then show list
    blogDetail.style.opacity = '0';
    blogDetail.style.transform = 'translateY(10px)';
    setTimeout(() => {
        blogDetail.classList.add('hidden');
        blogDetail.style.opacity = '';
        blogDetail.style.transform = '';
        blogList.classList.remove('hidden');
        blogList.style.opacity = '0';
        blogList.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
            blogList.style.opacity = '1';
            blogList.style.transform = 'translateY(0)';
        });
    }, 250);
    lenis.scrollTo(0, { duration: 0.6 });
}

// --- INIT SCRIPTS ---

// ===================== LENIS SMOOTH SCROLL =====================
const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.7,
    touchMultiplier: 1.2,
    infinite: false,
    lerp: 0.1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===================== SMART NAV HIDE ON SCROLL =====================
(function () {
    const nav = document.querySelector('nav');
    if (!nav) return;
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (currentScroll <= 10) {
                    nav.style.transform = 'translateY(0) translateZ(0)';
                } else if (currentScroll > lastScroll && currentScroll > 80) {
                    nav.style.transform = 'translateY(-100%) translateZ(0)';
                } else {
                    nav.style.transform = 'translateY(0) translateZ(0)';
                }
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// Initialize AOS with smoother settings
AOS.init({
    once: true,
    offset: 40,
    duration: 700,
    easing: 'ease-out-quart',
    delay: 0,
});

// Mobile Menu Toggle (smooth)
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.style.maxHeight = '0';
        menu.style.opacity = '0';
        requestAnimationFrame(() => {
            menu.style.transition = 'max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';
            menu.style.maxHeight = menu.scrollHeight + 'px';
            menu.style.opacity = '1';
        });
    } else {
        menu.style.transition = 'max-height 0.3s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.2s ease';
        menu.style.maxHeight = '0';
        menu.style.opacity = '0';
        setTimeout(() => {
            menu.classList.add('hidden');
            menu.style.maxHeight = '';
            menu.style.opacity = '';
            menu.style.transition = '';
        }, 350);
    }
}



// ===================== DARK MODE TOGGLE =====================

// Toggle Dark Mode Function
function toggleDarkMode() {
    const html = document.documentElement;
    const body = document.body;
    const currentMode = html.classList.contains('dark');

    // Enable transition only during toggle
    body.classList.add('theme-transitioning');

    if (currentMode) {
        html.classList.remove('dark');
        updateDarkModeIcon(false);
        localStorage.setItem('darkMode', 'false');
    } else {
        html.classList.add('dark');
        updateDarkModeIcon(true);
        localStorage.setItem('darkMode', 'true');
    }

    // Remove transition class after animation completes
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 450);
}

// Update Dark Mode Icon (handled via CSS now — no JS icon swap needed)
function updateDarkModeIcon(isDark) {
    // The sliding toggle is fully CSS-driven via the .dark class on <html>.
    // No manual icon class changes required.
}

// Load Dark Mode Preference on Page Load
function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    const html = document.documentElement;

    // Check for saved preference or system preference
    if (darkModePreference === 'true') {
        html.classList.add('dark');
        updateDarkModeIcon(true);
    } else if (darkModePreference === 'false') {
        html.classList.remove('dark');
        updateDarkModeIcon(false);
    } else {
        // Check system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.classList.add('dark');
            updateDarkModeIcon(true);
            localStorage.setItem('darkMode', 'true');
        }
    }
}

// Initialize Dark Mode on Page Load
loadDarkModePreference();

// Initialize Render
renderList();

// ===================== BROWSER HISTORY HANDLING =====================
(function initHistoryHandling() {
    // Set initial state
    history.replaceState({ view: 'portfolio' }, '', window.location.pathname);

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const state = event.state;

        if (!state || state.view === 'portfolio') {
            // Go back to portfolio
            const portfolio = document.getElementById('portfolio-view');
            if (portfolio.classList.contains('view-hidden')) {
                switchView('portfolio', false);
            }
        } else if (state.view === 'blog') {
            // Go to blog list
            const blog = document.getElementById('blog-view');
            if (blog.classList.contains('view-hidden')) {
                switchView('blog', false);
            } else {
                // Already in blog view, just show list
                showList(true);
            }
        } else if (state.view === 'blog-detail' && state.postId) {
            // Go to specific blog post
            const blog = document.getElementById('blog-view');
            if (blog.classList.contains('view-hidden')) {
                switchView('blog', false);
                setTimeout(() => showDetail(state.postId, false), 300);
            } else {
                showDetail(state.postId, false);
            }
        }
    });

    // Handle initial URL hash on page load
    const hash = window.location.hash;
    if (hash.startsWith('#blog/')) {
        const postId = parseInt(hash.replace('#blog/', ''));
        if (!isNaN(postId)) {
            switchView('blog', false);
            setTimeout(() => {
                showDetail(postId, false);
                history.replaceState({ view: 'blog-detail', postId: postId }, '', hash);
            }, 300);
        }
    } else if (hash === '#blog') {
        switchView('blog', false);
        history.replaceState({ view: 'blog' }, '', '#blog');
    }
})();

// ===================== SCROLL REVEAL (Smooth, one-way like vineet) =====================

(function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Once visible, stay visible (like Framer Motion once:true)
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
})();

// ===================== NAVIGATION BUBBLE INDICATOR =====================
(function () {
    const bubble = document.querySelector('.nav-bubble-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoLink = document.getElementById('logoLink');

    if (!bubble || !logoLink) return;

    let isHoveringNav = false;

    // Function to position bubble on an element
    const positionBubble = (element) => {
        const rect = element.getBoundingClientRect();
        const navContainer = document.querySelector('nav .max-w-6xl');
        const containerRect = navContainer.getBoundingClientRect();

        bubble.style.width = `${rect.width + 16}px`; // Add padding
        bubble.style.left = `${rect.left - containerRect.left - 8}px`; // Center with padding
        bubble.classList.add('active');
    };

    // Set default position on logo
    const setDefaultPosition = () => {
        if (!isHoveringNav) {
            positionBubble(logoLink);
        }
    };

    // Initialize on logo
    setTimeout(() => {
        positionBubble(logoLink);
    }, 100);

    // Move bubble on nav link hover
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            isHoveringNav = true;
            positionBubble(this);
        });

        link.addEventListener('mouseleave', function () {
            isHoveringNav = false;
            // Return to logo immediately
            setTimeout(() => {
                if (!isHoveringNav) {
                    positionBubble(logoLink);
                }
            }, 50);
        });
    });

    // Reposition on window resize
    window.addEventListener('resize', setDefaultPosition);
})();

// ===================== PROFILE IMAGE 3D TILT EFFECT =====================
(function () {
    const profileImage = document.getElementById('profileImage');

    if (!profileImage) return;

    profileImage.addEventListener('mouseenter', function () {
        this.style.animation = 'none';
        this.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
    });

    profileImage.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        this.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.05, 1.05, 1.05)
        `;

        this.style.boxShadow = `
            ${-rotateY * 2}px ${rotateX * 2}px 40px rgba(34, 211, 238, 0.3),
            0 0 0 1px rgba(34, 211, 238, 0.1)
        `;
    });

    profileImage.addEventListener('mouseleave', function () {
        this.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        this.style.transform = '';
        this.style.boxShadow = '';
        setTimeout(() => {
            this.style.transition = '';
            this.style.animation = '';
        }, 500);
    });
})();