/* ── Force scroll to top on every page load/refresh ── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* =========================================================
   PRELOADER — counter, progress hairline, curtain exit
   ========================================================= */
(function initPreloader() {
    const splash = document.getElementById('intro-splash');
    const countEl = document.getElementById('pl-count');
    const barEl = document.getElementById('pl-bar-fill');
    const statusEl = document.getElementById('pl-status');

    const DURATION = REDUCED_MOTION ? 300 : 2600;
    const STATUSES = [[0, 'Initializing'], [28, 'Loading assets'], [62, 'Compiling'], [90, 'Ready']];
    let start = null;
    let finished = false;

    const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function tick(ts) {
        if (finished) return;
        if (start === null) start = ts;
        const t = Math.min(1, (ts - start) / DURATION);
        const value = Math.round(easeInOutCubic(t) * 100);

        if (countEl) countEl.textContent = String(value).padStart(3, '0');
        if (barEl) barEl.style.transform = `scaleX(${value / 100})`;
        if (statusEl) {
            for (let i = STATUSES.length - 1; i >= 0; i--) {
                if (value >= STATUSES[i][0]) {
                    if (statusEl.textContent !== STATUSES[i][1]) statusEl.textContent = STATUSES[i][1];
                    break;
                }
            }
        }

        if (t < 1) requestAnimationFrame(tick);
        else setTimeout(window.dismissSplash, 380);
    }

    window.dismissSplash = function () {
        if (!splash || splash.classList.contains('splash-exit')) return;
        finished = true;

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.scrollTo(0, { immediate: true, force: true });
            lenis.start();
        }

        splash.classList.add('splash-exit');
        document.body.classList.remove('is-loading');

        setTimeout(() => {
            document.body.classList.add('entered');
            window.dispatchEvent(new CustomEvent('portfolio-entered'));
        }, 420);
        setTimeout(() => splash.classList.add('splash-gone'), 1500);
    };

    if (!splash) {
        document.body.classList.remove('is-loading');
        document.body.classList.add('entered');
        return;
    }
    requestAnimationFrame(tick);
})();

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
            if (element) lenis.scrollTo(element, { duration: 1.4, offset: -40, force: true });
        }, 150);
    } else {
        // Already in portfolio view, just scroll
        const element = document.getElementById(sectionId);
        if (element) lenis.scrollTo(element, { duration: 1.4, offset: -40, force: true });
    }
}

// --- BLOG FUNCTIONS ---
let blogListScrollPos = 0; // Remember scroll position when opening a post

function postSnippet(post, length) {
    return post.content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`/g, '')
        .trim()
        .substring(0, length)
        .trim() + '…';
}

function renderList() {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;
    grid.innerHTML = blogPosts.map(post => `
        <article class="post-card" role="link" tabindex="0" onclick="showDetail(${post.id})"
            onkeydown="if(event.key==='Enter'){showDetail(${post.id})}">
            <div class="post-card-img">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="post-card-cat">${post.category}</span>
            </div>
            <div class="post-card-body">
                <span class="post-card-date">${post.date}</span>
                <h2 class="post-card-title">${post.title}</h2>
                <p class="post-card-desc">${postSnippet(post, 140)}</p>
                <span class="post-card-more">Read entry <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
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

// Hold scrolling while the preloader is on screen
if (document.body.classList.contains('is-loading')) lenis.stop();

function scrollToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 1.6, force: true });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================== NAV STATE + SCROLL PROGRESS =====================
(function initNavScroll() {
    const nav = document.querySelector('.site-nav');
    const progress = document.querySelector('.scroll-progress span');
    const menu = document.getElementById('mobile-menu');
    if (!nav) return;
    let lastScroll = 0;
    let ticking = false;

    function update() {
        const y = window.pageYOffset;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;

        nav.classList.toggle('scrolled', y > 40);
        const menuOpen = menu && !menu.classList.contains('hidden');
        if (!menuOpen && y > lastScroll && y > 240) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = '';
        }
        lastScroll = y;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
})();

// ===================== MOBILE MENU =====================
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('menuToggleBtn');
    if (!menu) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        requestAnimationFrame(() => menu.classList.add('open'));
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
    } else {
        menu.classList.remove('open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        setTimeout(() => {
            if (!menu.classList.contains('open')) menu.classList.add('hidden');
        }, 350);
    }
}

// Initialize Render
renderList();

// ===================== JOURNAL MARQUEE (Portfolio view) =====================
function renderBlogMarquee() {
    const track = document.getElementById('blog-marquee-track');
    if (!track || typeof blogPosts === 'undefined') return;

    function cardHTML(post) {
        return `
            <div class="blog-marquee-card" onclick="switchView('blog'); showDetail(${post.id})">
                <div class="blog-marquee-card-img">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <span class="blog-marquee-card-badge">${post.category}</span>
                </div>
                <div class="blog-marquee-card-body">
                    <span class="blog-marquee-card-date">${post.date}</span>
                    <h3 class="blog-marquee-card-title">${post.title}</h3>
                    <p class="blog-marquee-card-desc">${postSnippet(post, 110)}</p>
                </div>
            </div>`;
    }

    // Duplicate the set for a seamless infinite loop
    const allCardsHTML = blogPosts.map(cardHTML).join('');
    track.innerHTML = allCardsHTML + allCardsHTML;

    requestAnimationFrame(() => {
        const totalWidth = track.scrollWidth / 2;
        const speed = 45; // px per second
        track.style.setProperty('--marquee-duration', `${totalWidth / speed}s`);
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

    function loadStreakStats() {
        const totalLabel = document.getElementById('streak-total-contribs');
        const currentLabel = document.getElementById('streak-current');
        const longestLabel = document.getElementById('streak-longest');
        if (!totalLabel || !currentLabel || !longestLabel) return;

        fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}`)
            .then(r => r.json())
            .then(data => {
                const contributions = data.contributions || [];
                if (contributions.length === 0) return;

                // Sort ascending by date for longest streak calculation
                contributions.sort((a, b) => new Date(a.date) - new Date(b.date));

                // 1. Total contributions
                const totalContributions = contributions.reduce((sum, d) => sum + d.count, 0);
                totalLabel.textContent = totalContributions;

                // 2. Longest streak
                let longestStreak = 0;
                let currentStreakTemp = 0;
                contributions.forEach(day => {
                    if (day.count > 0) {
                        currentStreakTemp++;
                        if (currentStreakTemp > longestStreak) {
                            longestStreak = currentStreakTemp;
                        }
                    } else {
                        currentStreakTemp = 0;
                    }
                });
                longestLabel.textContent = `${longestStreak} day${longestStreak !== 1 ? 's' : ''}`;

                // 3. Current streak
                // Sort descending to traverse backwards from most recent
                const sortedDesc = [...contributions].sort((a, b) => new Date(b.date) - new Date(a.date));
                const todayStr = new Date().toISOString().split('T')[0];
                const pastOrPresentDays = sortedDesc.filter(d => d.date <= todayStr);

                let currentStreak = 0;

                if (pastOrPresentDays.length > 0) {
                    const firstDay = pastOrPresentDays[0];
                    const secondDay = pastOrPresentDays[1];

                    const isToday = firstDay.date === todayStr;
                    // Check if the first day is yesterday (within 24 hours)
                    const isYesterday = (new Date(todayStr) - new Date(firstDay.date)) <= 86400000;

                    const hasContributedRecently = (firstDay.count > 0) || (isToday && secondDay && secondDay.count > 0);

                    if (hasContributedRecently) {
                        let checkIndex = 0;
                        if (isToday && firstDay.count === 0) {
                            checkIndex = 1;
                        }

                        for (let i = checkIndex; i < pastOrPresentDays.length; i++) {
                            if (pastOrPresentDays[i].count > 0) {
                                currentStreak++;
                            } else {
                                break;
                            }
                        }
                    }
                }
                currentLabel.textContent = `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`;
            })
            .catch(err => {
                console.error('Error loading streak stats:', err);
                totalLabel.textContent = 'Err';
                currentLabel.textContent = 'Err';
                longestLabel.textContent = 'Err';
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
    loadStreakStats();
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


// ===================== HERO TERMINAL INTERACTIVE COPY =====================
(function initHeroTerminalCopy() {
    const card = document.getElementById('hero-terminal-card');
    if (!card) return;

    const tooltip = card.querySelector('.terminal-tooltip');
    const commandText = card.getAttribute('data-command') || 'npx jyotirmoy-laha';
    let isResetting = null;

    function copyFallback(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textArea);
        return success;
    }

    async function handleCopy() {
        let success = false;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(commandText);
                success = true;
            } else {
                success = copyFallback(commandText);
            }
        } catch (err) {
            success = copyFallback(commandText);
        }

        if (success) {
            // Add visual effects
            card.classList.remove('pulse-active');
            // Trigger reflow to restart animation
            void card.offsetWidth;
            card.classList.add('pulse-active');

            if (tooltip) {
                tooltip.innerHTML = 'Copied! ✓ <span style="display: block; font-size: 10px; opacity: 0.85; margin-top: 3px; text-align: center;">Paste & run in terminal</span>';
                tooltip.classList.add('tooltip-success');

                // Cancel any pending reset timeout
                if (isResetting) {
                    clearTimeout(isResetting);
                }

                // Reset tooltip text after 3 seconds
                isResetting = setTimeout(() => {
                    tooltip.textContent = `Copy: ${commandText}`;
                    tooltip.classList.remove('tooltip-success');
                    isResetting = null;
                }, 3000);
            }
        } else {
            console.error('Failed to copy command');
            if (tooltip) {
                tooltip.textContent = 'Failed to copy';
                setTimeout(() => {
                    tooltip.textContent = `Copy: ${commandText}`;
                }, 2000);
            }
        }
    }

    // Click handler
    card.addEventListener('click', handleCopy);

    // Keyboard accessibility handler
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopy();
        }
    });
})();



/* =========================================================
   VISUAL LAYER — hero field, type, cursor, reveals
   ========================================================= */

// ===================== SPLIT HERO LETTERS =====================
(function initSplitLetters() {
    let index = 0;
    document.querySelectorAll('.hero-title .split').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        [...text].forEach(ch => {
            const outer = document.createElement('span');
            outer.className = 'char';
            outer.style.setProperty('--i', index++);
            const inner = document.createElement('span');
            inner.className = 'char-inner';
            inner.textContent = ch;
            outer.appendChild(inner);
            el.appendChild(outer);
        });
    });
})();

// ===================== HERO DOT FIELD (canvas) =====================
(function initHeroField() {
    const canvas = document.getElementById('hero-field');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0, points = [];
    let visible = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const t0 = performance.now();
    const RADIUS = 170;
    const GLOW = 280;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = hero.clientWidth;
        h = hero.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const gap = w < 700 ? 24 : 30;
        points = [];
        for (let y = gap / 2; y < h; y += gap) {
            for (let x = gap / 2; x < w; x += gap) {
                points.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
            }
        }
        if (REDUCED_MOTION) draw(t0);
    }

    function draw(now) {
        const t = (now - t0) / 1000;
        mouse.x += (mouse.tx - mouse.x) * 0.14;
        mouse.y += (mouse.ty - mouse.y) * 0.14;

        ctx.clearRect(0, 0, w, h);
        const hot = [];

        ctx.fillStyle = '#ecebe7';
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;

            if (d < RADIUS) {
                const f = 1 - d / RADIUS;
                p.vx += (dx / d) * f * 2.6;
                p.vy += (dy / d) * f * 2.6;
            }
            p.vx += (p.ox - p.x) * 0.05;
            p.vy += (p.oy - p.y) * 0.05;
            p.vx *= 0.84;
            p.vy *= 0.84;
            p.x += p.vx;
            p.y += p.vy;

            // Slow interference wave across the grid
            const wave = (Math.sin(p.ox * 0.007 + t * 0.7) * Math.cos(p.oy * 0.009 - t * 0.5) + 1) / 2;
            const prox = d < GLOW ? Math.pow(1 - d / GLOW, 1.6) : 0;

            if (prox > 0.04) {
                hot.push(p.x, p.y, prox);
                continue;
            }
            const size = 0.9 + wave * 0.8;
            ctx.globalAlpha = 0.06 + wave * 0.16;
            ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        }

        ctx.fillStyle = '#ff2d2d';
        for (let i = 0; i < hot.length; i += 3) {
            const prox = hot[i + 2];
            const size = 1.2 + prox * 2.6;
            ctx.globalAlpha = 0.2 + prox * 0.8;
            ctx.fillRect(hot[i] - size / 2, hot[i + 1] - size / 2, size, size);
        }
        ctx.globalAlpha = 1;
    }

    function loop(now) {
        if (visible && !document.hidden) draw(now);
        requestAnimationFrame(loop);
    }

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mouse.tx = e.clientX - r.left;
        mouse.ty = e.clientY - r.top;
        if (mouse.x < -1000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
        hero.style.setProperty('--mx', `${mouse.tx}px`);
        hero.style.setProperty('--my', `${mouse.ty}px`);
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
        mouse.tx = -9999;
        mouse.ty = -9999;
    });

    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
    }).observe(hero);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    resize();
    if (!REDUCED_MOTION) requestAnimationFrame(loop);
})();

// ===================== HERO LETTERS REPEL FROM CURSOR =====================
(function initLetterRepel() {
    if (!FINE_POINTER || REDUCED_MOTION) return;
    const title = document.querySelector('.hero-title');
    const hero = document.querySelector('.hero');
    if (!title || !hero) return;
    const chars = [...title.querySelectorAll('.char-inner')];
    let mx = -9999, my = -9999, pending = false;

    function update() {
        pending = false;
        chars.forEach(ch => {
            const r = ch.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = cx - mx;
            const dy = cy - my;
            const d = Math.sqrt(dx * dx + dy * dy);
            const R = r.height * 1.4;
            if (d < R) {
                const f = Math.pow(1 - d / R, 2);
                ch.style.transform = `translate(${(dx / d) * f * 18}px, ${(dy / d) * f * 22}px)`;
                ch.style.color = f > 0.35 ? 'var(--accent)' : '';
            } else if (ch.style.transform) {
                ch.style.transform = '';
                ch.style.color = '';
            }
        });
    }

    hero.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        if (!pending) { pending = true; requestAnimationFrame(update); }
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
        mx = my = -9999;
        requestAnimationFrame(update);
    });
})();

// ===================== OCCASIONAL GLITCH ON THE NAME =====================
(function initGlitch() {
    if (REDUCED_MOTION) return;
    const title = document.querySelector('.hero-title');
    if (!title) return;
    function fire() {
        title.classList.add('glitch');
        setTimeout(() => title.classList.remove('glitch'), 480);
        setTimeout(fire, 5000 + Math.random() * 6000);
    }
    window.addEventListener('portfolio-entered', () => setTimeout(fire, 2600), { once: true });
})();

// ===================== TEXT SCRAMBLE (role line) =====================
(function initScramble() {
    const el = document.getElementById('role-scramble');
    if (!el) return;
    const WORDS = ['code', 'products', 'AI tools', 'systems', 'experiences'];
    const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
    let wordIndex = 0;

    function scrambleTo(next) {
        const from = el.textContent;
        const length = Math.max(from.length, next.length);
        const queue = [];
        for (let i = 0; i < length; i++) {
            const start = Math.floor(Math.random() * 14);
            queue.push({ from: from[i] || '', to: next[i] || '', start, end: start + 8 + Math.floor(Math.random() * 14) });
        }
        let frame = 0;
        (function step() {
            let out = '';
            let done = 0;
            queue.forEach(q => {
                if (frame >= q.end) { done++; out += q.to; }
                else if (frame >= q.start) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                else out += q.from;
            });
            el.textContent = out;
            frame++;
            if (done < queue.length) requestAnimationFrame(step);
        })();
    }

    window.addEventListener('portfolio-entered', () => {
        if (REDUCED_MOTION) return;
        setInterval(() => {
            wordIndex = (wordIndex + 1) % WORDS.length;
            scrambleTo(WORDS[wordIndex]);
        }, 3000);
    }, { once: true });
})();

// ===================== CLOCKS + YEARS =====================
(function initClocks() {
    const hud = document.getElementById('hud-clock');
    const foot = document.getElementById('footer-clock');
    const year = String(new Date().getFullYear());
    document.querySelectorAll('#hud-year, #footer-year').forEach(el => { el.textContent = year; });

    function tick() {
        const now = new Date();
        const opts = { timeZone: 'Asia/Kolkata', hour12: false };
        if (hud) hud.textContent = now.toLocaleTimeString('en-GB', { ...opts, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (foot) foot.textContent = now.toLocaleTimeString('en-GB', { ...opts, hour: '2-digit', minute: '2-digit' }) + ' IST';
    }
    tick();
    setInterval(tick, 1000);
})();

// ===================== SCROLL REVEAL =====================
(function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || REDUCED_MOTION) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    function start() { items.forEach(el => observer.observe(el)); }
    if (document.body.classList.contains('entered')) start();
    else window.addEventListener('portfolio-entered', start, { once: true });
})();

// ===================== COUNT-UP NUMBERS =====================
(function initCountUp() {
    const els = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const start = performance.now();
            const dur = REDUCED_MOTION ? 1 : 1600;
            (function step(now) {
                const t = Math.min(1, (now - start) / dur);
                el.textContent = Math.round((1 - Math.pow(1 - t, 4)) * target);
                if (t < 1) requestAnimationFrame(step);
            })(start);
        });
    }, { threshold: 0.6 });
    els.forEach(el => observer.observe(el));
})();

// ===================== CUSTOM CURSOR (desktop only) =====================
(function initCursor() {
    if (!FINE_POINTER) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    const label = document.createElement('span');
    label.className = 'cursor-label';
    ring.appendChild(label);
    document.body.append(dot, ring);
    document.body.classList.add('has-cursor');

    let mx = -100, my = -100, rx = -100, ry = -100;
    const HOVER = 'a, button, [role="button"], [role="link"], [onclick], .blog-marquee-card';

    (function animate() {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        requestAnimationFrame(animate);
    })();

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.classList.add('visible');
        ring.classList.add('visible');
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        dot.classList.remove('visible');
        ring.classList.remove('visible');
    });

    document.addEventListener('mouseover', e => {
        const labeled = e.target.closest('[data-cursor]');
        if (labeled) {
            label.textContent = labeled.dataset.cursor;
            ring.classList.add('labeled');
            dot.classList.add('labeled');
            ring.classList.remove('hovering');
            return;
        }
        ring.classList.remove('labeled');
        dot.classList.remove('labeled');
        ring.classList.toggle('hovering', !!e.target.closest(HOVER));
    }, { passive: true });

    document.addEventListener('mousedown', () => { ring.style.scale = '0.85'; });
    document.addEventListener('mouseup', () => { ring.style.scale = ''; });
})();

// ===================== MAGNETIC BUTTONS =====================
(function initMagnetic() {
    if (!FINE_POINTER || REDUCED_MOTION) return;
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            el.style.transition = 'transform 0.2s ease-out';
            el.style.transform = `translate(${x * 0.28}px, ${y * 0.38}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
            el.style.transform = '';
        });
    });
})();

// ===================== PORTRAIT TILT =====================
(function initPortraitTilt() {
    if (!FINE_POINTER || REDUCED_MOTION) return;
    const portrait = document.getElementById('profileImage');
    if (!portrait) return;
    const img = portrait.querySelector('img');
    portrait.addEventListener('mousemove', e => {
        const r = portrait.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        img.style.transition = 'filter 0.8s, transform 0.3s ease-out';
        img.style.transform = `scale(1.12) translate(${x * -14}px, ${y * -10}px)`;
    });
    portrait.addEventListener('mouseleave', () => {
        img.style.transition = 'filter 0.8s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
        img.style.transform = '';
    });
})();
