/* ── Force scroll to top on every page load/refresh ── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

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
// Blog posts data is in blog-posts.js (loaded before this script)


// --- VIEW SWITCHING LOGIC ---

function switchView(viewName, pushHistory = true) {
    const portfolio = document.getElementById('portfolio-view');
    const blog = document.getElementById('blog-view');

    const desktopPortfolioNav = document.getElementById('desktop-portfolio-nav');
    const desktopBlogNav = document.getElementById('desktop-blog-nav');
    const mobilePortfolioNav = document.getElementById('mobile-portfolio-nav');
    const mobileBlogNav = document.getElementById('mobile-blog-nav');

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        toggleMenu();
    }

    // ── Kill Lenis completely so it can't animate anything ──
    lenis.destroy();

    // ── Force scroll to absolute top ──
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (viewName === 'blog') {
        if (pushHistory) history.pushState({ view: 'blog' }, '', '#blog');

        portfolio.classList.add('view-hidden');
        blog.classList.remove('view-hidden');

        desktopPortfolioNav.classList.add('hidden');
        desktopBlogNav.classList.remove('hidden');
        mobilePortfolioNav.classList.add('hidden');
        mobileBlogNav.classList.remove('hidden');
    } else {
        if (pushHistory) history.pushState({ view: 'portfolio' }, '', '#');

        blog.classList.add('view-hidden');
        portfolio.classList.remove('view-hidden');

        desktopBlogNav.classList.add('hidden');
        desktopPortfolioNav.classList.remove('hidden');
        mobileBlogNav.classList.add('hidden');
        mobilePortfolioNav.classList.remove('hidden');

        showList(true);
    }

    // ── Force scroll to 0 again after DOM swap ──
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // ── Recreate Lenis fresh (starts at scroll 0) ──
    reinitLenis();
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
let blogListScrollPos = 0; // Remember scroll position when opening a post

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

    // Save current scroll position before switching to detail
    blogListScrollPos = window.pageYOffset || document.documentElement.scrollTop;

    // Push history state for browser back button
    if (pushHistory) {
        history.pushState({ view: 'blog-detail', postId: id }, '', `#blog/${id}`);
    }

    // Instant swap — no animation
    blogList.classList.add('hidden');
    blogDetail.classList.remove('hidden');
    lenis.scrollTo(0, { immediate: true, duration: 0 });
    window.scrollTo(0, 0);
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

    // Instant swap — no animation
    blogDetail.classList.add('hidden');
    blogDetail.style.opacity = '';
    blogDetail.style.transform = '';
    blogList.classList.remove('hidden');
    blogList.style.opacity = '';
    blogList.style.transform = '';

    // Restore saved scroll position so user lands back at the same blog card
    window.scrollTo({ top: blogListScrollPos, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = blogListScrollPos;
}

// --- INIT SCRIPTS ---

// ===================== LENIS SMOOTH SCROLL =====================
let lenis;
let lenisRafId;

function reinitLenis() {
    if (lenis) {
        try { lenis.destroy(); } catch(e) {}
    }
    if (lenisRafId) cancelAnimationFrame(lenisRafId);

    lenis = new Lenis({
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
        lenisRafId = requestAnimationFrame(raf);
    }
    lenisRafId = requestAnimationFrame(raf);
}
reinitLenis();

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

// ===================== BLOG POSTS MARQUEE (Portfolio view) =====================
function renderBlogMarquee() {
    const track = document.getElementById('blog-marquee-track');
    if (!track || typeof blogPosts === 'undefined') return;

    // Generate a single card HTML
    function cardHTML(post) {
        const snippet = post.content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/\\`\\`\\`[\s\S]*?\\`\\`\\`/g, '')
            .replace(/`/g, '')
            .trim()
            .substring(0, 110)
            .trim() + '…';

        return `
            <div class="blog-marquee-card" onclick="switchView('blog'); showDetail(${post.id})">
                <div class="blog-marquee-card-img">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <span class="blog-marquee-card-badge">${post.category}</span>
                    <div class="blog-marquee-card-overlay">
                        <span class="blog-marquee-card-overlay-title">${post.title}</span>
                        <span class="blog-marquee-card-overlay-cta">Read More <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>
                <div class="blog-marquee-card-body">
                    <span class="blog-marquee-card-date">
                        <i class="fa-regular fa-calendar"></i> ${post.date}
                    </span>
                    <h3 class="blog-marquee-card-title">${post.title}</h3>
                    <p class="blog-marquee-card-desc">${snippet}</p>
                    <div class="blog-marquee-card-footer">
                        <span class="blog-marquee-card-tag">${post.category}</span>
                    </div>
                </div>
            </div>`;
    }

    // Build all cards then duplicate for seamless infinite loop
    const allCardsHTML = blogPosts.map(cardHTML).join('');
    track.innerHTML = allCardsHTML + allCardsHTML; // duplicate for infinite scroll

    // Set animation duration based on content width (slower = smoother)
    requestAnimationFrame(() => {
        const totalWidth = track.scrollWidth / 2; // half since we duplicated
        const speed = 40; // px per second — tune for desired pace
        const duration = totalWidth / speed;
        track.style.setProperty('--marquee-duration', `${duration}s`);
    });
}
renderBlogMarquee();

// ===================== GITHUB CONTRIBUTION GRAPH =====================
(function initContribGraph() {
    const body = document.getElementById('contrib-graph-body');
    const countText = document.getElementById('contrib-count-text');
    const yearSelector = document.getElementById('contrib-year-selector');
    if (!body || !countText || !yearSelector) return;

    const USERNAME = 'JyotirmoyLaha';
    const CURRENT_YEAR = new Date().getFullYear();
    const START_YEAR = 2025;
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Generate year pills
    for (let y = CURRENT_YEAR; y >= START_YEAR; y--) {
        const pill = document.createElement('button');
        pill.className = 'contrib-year-pill' + (y === CURRENT_YEAR ? ' active' : '');
        pill.textContent = y;
        pill.onclick = () => loadYear(y);
        yearSelector.appendChild(pill);
    }

    function loadYear(year) {
        // Update active pill
        yearSelector.querySelectorAll('.contrib-year-pill').forEach(p => {
            p.classList.toggle('active', parseInt(p.textContent) === year);
        });

        body.innerHTML = '<div class="contrib-loading">Loading...</div>';
        countText.textContent = 'Loading contributions...';

        fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${year}&_=${Date.now()}`)
            .then(r => r.json())
            .then(data => renderGraph(data, year))
            .catch(() => {
                body.innerHTML = '<div class="contrib-loading">Unable to load contributions</div>';
                countText.textContent = 'Contributions unavailable';
            });
    }

    function getLevel(count) {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 6) return 2;
        if (count <= 9) return 3;
        return 4;
    }

    function renderGraph(data, year) {
        const contributions = data.contributions || [];
        const totalCount = data.total && data.total[year] ? data.total[year] : contributions.reduce((s, d) => s + d.count, 0);

        countText.textContent = `${totalCount} contributions in ${year}`;

        // Build weeks array (each week = array of 7 days, Sun=0..Sat=6)
        const weeks = [];
        let currentWeek = [];

        // Pad the first week if it doesn't start on Sunday
        if (contributions.length > 0) {
            const firstDay = new Date(contributions[0].date).getDay();
            for (let i = 0; i < firstDay; i++) {
                currentWeek.push(null); // empty padding
            }
        }

        contributions.forEach(day => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        // Build month labels
        const monthsRow = document.createElement('div');
        monthsRow.className = 'contrib-months';

        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            const realDay = week.find(d => d !== null);
            if (realDay) {
                const m = new Date(realDay.date).getMonth();
                if (m !== lastMonth) {
                    const label = document.createElement('span');
                    label.className = 'contrib-month-label';
                    label.textContent = MONTHS[m];
                    label.style.position = 'absolute';
                    label.style.left = (wi * 14) + 'px';
                    monthsRow.appendChild(label);
                    lastMonth = m;
                }
            }
        });
        monthsRow.style.position = 'relative';
        monthsRow.style.height = '16px';
        monthsRow.style.minWidth = (weeks.length * 14) + 'px';

        // Build heatmap
        const heatmap = document.createElement('div');
        heatmap.className = 'contrib-heatmap';

        weeks.forEach(week => {
            const weekEl = document.createElement('div');
            weekEl.className = 'contrib-week';
            for (let d = 0; d < 7; d++) {
                const day = week[d] !== undefined ? week[d] : null;
                const cell = document.createElement('div');
                cell.className = 'contrib-day';
                if (day) {
                    const level = getLevel(day.count);
                    cell.setAttribute('data-level', level);
                    cell.setAttribute('data-date', day.date);
                    cell.setAttribute('data-count', day.count);

                    // Hover tooltip
                    cell.addEventListener('mouseenter', function(e) {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'contrib-tooltip';
                        const dateStr = new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        tooltip.textContent = day.count === 0
                            ? `No contributions on ${dateStr}`
                            : `${day.count} contribution${day.count > 1 ? 's' : ''} on ${dateStr}`;
                        document.body.appendChild(tooltip);
                        const rect = this.getBoundingClientRect();
                        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                        tooltip.style.top = (rect.top - 30) + 'px';
                        this._tooltip = tooltip;
                    });
                    cell.addEventListener('mouseleave', function() {
                        if (this._tooltip) {
                            this._tooltip.remove();
                            this._tooltip = null;
                        }
                    });
                } else {
                    cell.style.visibility = 'hidden';
                }
                weekEl.appendChild(cell);
            }
            heatmap.appendChild(weekEl);
        });

        body.innerHTML = '';
        body.appendChild(monthsRow);
        body.appendChild(heatmap);
    }

    // Load current year on init
    loadYear(CURRENT_YEAR);
})();

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