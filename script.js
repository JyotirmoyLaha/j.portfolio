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
        el.removeEventListener('mousemove', onDockMove);
        el.classList.add('splash-exit');
        setTimeout(() => el.classList.add('splash-gone'), 920);
    };

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', initSplash)
        : initSplash();
})();

/* ========================================================= */

// --- BLOG DATA & LOGIC ---

let blogPosts = [];

// Load blog posts from external JSON file
fetch('posts.json')
    .then(res => res.json())
    .then(posts => {
        blogPosts = posts;
        renderList();

        // Handle initial URL routing after posts are loaded
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('post');
        const view = params.get('view');

        if (postId) {
            _skipPush = true;
            history.replaceState({ view: 'blog', postId: Number(postId) }, '', `?post=${postId}`);
            switchView('blog');
            setTimeout(() => { showDetail(Number(postId)); _skipPush = false; }, 300);
        } else if (view === 'blog') {
            _skipPush = true;
            history.replaceState({ view: 'blog' }, '', '?view=blog');
            switchView('blog');
            _skipPush = false;
        }
    })
    .catch(() => { console.warn('Could not load blog posts.'); });

// --- VIEW SWITCHING LOGIC ---

let _skipPush = false; // true when navigating via popstate (back/forward)

function switchView(viewName) {
    if (!_skipPush) {
        if (viewName === 'blog') {
            history.pushState({ view: 'blog' }, '', '?view=blog');
        } else {
            history.pushState({ view: 'portfolio' }, '', window.location.pathname);
        }
    }
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
            showList();

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

function showDetail(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    if (!_skipPush) history.pushState({ view: 'blog', postId: id }, '', `?post=${id}`);

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

function showList() {
    if (!_skipPush) history.pushState({ view: 'blog' }, '', '?view=blog');
    const blogList = document.getElementById('blog-list');
    const blogDetail = document.getElementById('blog-detail');

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
        try { localStorage.setItem('darkMode', 'false'); } catch (e) { /* storage unavailable */ }
    } else {
        html.classList.add('dark');
        try { localStorage.setItem('darkMode', 'true'); } catch (e) { /* storage unavailable */ }
    }

    // Remove transition class after animation completes
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 450);
}

// Load Dark Mode Preference on Page Load
function loadDarkModePreference() {
    let darkModePreference = null;
    try { darkModePreference = localStorage.getItem('darkMode'); } catch (e) { /* storage unavailable */ }
    const html = document.documentElement;

    // Check for saved preference or system preference
    if (darkModePreference === 'true') {
        html.classList.add('dark');
    } else if (darkModePreference === 'false') {
        html.classList.remove('dark');
    } else {
        // Check system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.classList.add('dark');
            try { localStorage.setItem('darkMode', 'true'); } catch (e) { /* storage unavailable */ }
        }
    }
}

// Initialize Dark Mode on Page Load
loadDarkModePreference();

// Initialize Render
renderList();

// ===================== URL ROUTING =====================
// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    _skipPush = true;
    const state = e.state;
    if (state && state.postId) {
        switchView('blog');
        setTimeout(() => showDetail(state.postId), 300);
    } else if (state && state.view === 'blog') {
        switchView('blog');
    } else {
        switchView('portfolio');
    }
    _skipPush = false;
});

// Set initial history state (URL-based routing handled in fetch callback above)
if (!new URLSearchParams(window.location.search).has('post') &&
    !new URLSearchParams(window.location.search).has('view')) {
    history.replaceState({ view: 'portfolio' }, '', window.location.pathname);
}

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