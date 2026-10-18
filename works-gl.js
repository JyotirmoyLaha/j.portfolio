/* =========================================================
   SELECTED WORK — WebGL thumbnails + project detail view

   Each .pcard keeps a real <img>, but when WebGL is available the
   thumbnails are drawn on one fixed canvas that follows the cards'
   positions every frame. That lets them do things CSS can't:
   depth parallax, focus blur, a scroll-speed bend, and a zoom that
   carries the card into the #work-detail overlay.

   Without WebGL, or with reduced motion, the <img> tags stay visible
   and the overlay simply fades in.
   ========================================================= */
(function initWorks() {
    const grid = document.getElementById('pgrid');
    const overlay = document.getElementById('work-detail');
    if (!grid || !overlay) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const REVEAL_SECONDS = 1.4;
    const OPEN_SECONDS = 1.15;
    const CLOSE_SECONDS = 1.0;
    const CONTENT_OUT_MS = 420;
    const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

    // ───────────── small helpers ─────────────
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const mix = (a, b, t) => a + (b - a) * t;
    const smoothstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const easeOutExpo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const easeInOutQuart = t => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

    function hexToRgb(hex) {
        const h = hex.replace('#', '');
        const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
        const n = parseInt(full, 16);
        return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
    }

    // Damped spring; fixed sub-steps keep it stable when a frame runs long
    class Spring {
        constructor(value, stiffness, damping) {
            this.value = value;
            this.target = value;
            this.velocity = 0;
            this.k = stiffness;
            this.c = damping;
        }
        update(dt) {
            const steps = Math.max(1, Math.ceil(dt * 240));
            const h = dt / steps;
            for (let i = 0; i < steps; i++) {
                this.velocity += (this.k * (this.target - this.value) - this.c * this.velocity) * h;
                this.value += this.velocity * h;
            }
            return this.value;
        }
    }

    function getLenis() {
        return typeof lenis !== 'undefined' && lenis ? lenis : null;
    }

    // ───────────── cards ─────────────
    const items = [...grid.querySelectorAll('.pcard')].map((el, index) => ({
        el,
        index,
        slug: el.dataset.slug,
        tone: el.dataset.tone || '#0b0b0d',
        toneRgb: hexToRgb(el.dataset.tone || '#0b0b0d'),
        media: el.querySelector('.pcard-media'),
        img: el.querySelector('img'),
        cat: el.querySelector('.pcard-cat'),
        title: el.querySelector('.pcard-title-text').textContent.trim(),
        // Layout, measured on resize: x/w/h in viewport px, y in document px
        x: 0, y: 0, w: 0, h: 0,
        tex: null, depthTex: null, imageW: 1, imageH: 1,
        revealing: false,
        revealT: 0,
        hovered: false,
        hover: new Spring(0, 90, 17),
        lookX: new Spring(0, 55, 11),
        lookY: new Spring(0, 55, 11),
        dof: new Spring(0, 40, 12),
        focusX: 0.5,
        focusY: 0.5,
        mouseU: 0.5,
        mouseV: 0.5,
    }));
    const bySlug = Object.fromEntries(items.map(it => [it.slug, it]));

    // Split each title into masked letters; the anchor's aria-label carries the name
    items.forEach(item => {
        const host = item.el.querySelector('.pcard-title-text');
        host.textContent = '';
        [...item.title].forEach((ch, i) => {
            if (ch === ' ') {
                const sp = document.createElement('span');
                sp.className = 'pc-sp';
                host.appendChild(sp);
                return;
            }
            const mask = document.createElement('span');
            mask.className = 'pc-ch';
            const roll = document.createElement('span');
            roll.className = 'pc-roll';
            roll.style.setProperty('--i', i);
            const a = document.createElement('span');
            a.textContent = ch;
            const b = document.createElement('span');
            b.textContent = ch;
            roll.append(a, b);
            mask.appendChild(roll);
            host.appendChild(mask);
        });
        item.catText = item.cat.textContent;
    });

    function scrambleIn(el, text) {
        if (reduceMotion) { el.textContent = text; return; }
        const start = performance.now();
        const perChar = 32; // ms between letters settling
        (function step(now) {
            const settled = Math.floor((now - start) / perChar);
            let out = '';
            for (let i = 0; i < text.length; i++) {
                if (i < settled || text[i] === ' ') out += text[i];
                else if (i < settled + 6) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            el.textContent = out;
            if (settled < text.length) requestAnimationFrame(step);
            else el.textContent = text;
        })(start);
    }

    // ───────────── reveal on scroll ─────────────
    function reveal(item) {
        if (item.el.classList.contains('is-revealed')) return;
        item.el.classList.add('is-revealed');
        item.revealing = true;
        item.revealT = 0;
        scrambleIn(item.cat, item.catText);
    }

    function unreveal(item) {
        item.el.classList.remove('is-revealed');
        item.revealing = false;
        item.revealT = 0;
        item.cat.textContent = '';
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach(it => { it.el.classList.add('is-revealed'); it.revealT = REVEAL_SECONDS; });
    } else {
        items.forEach(it => { it.cat.textContent = ''; });
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const item = items.find(it => it.el === entry.target);
                if (entry.isIntersecting) reveal(item);
                // Replay only when the card drops back below the fold
                else if (entry.boundingClientRect.top > 0 && !current) unreveal(item);
            });
        }, { threshold: 0.15 });
        const start = () => items.forEach(it => io.observe(it.el));
        if (document.body.classList.contains('entered')) start();
        else window.addEventListener('portfolio-entered', start, { once: true });
    }

    // ───────────── detail overlay ─────────────
    const ui = {
        countNow: document.getElementById('wd-count-now'),
        countTotal: document.getElementById('wd-count-total'),
        num: document.getElementById('wd-num'),
        cat: document.getElementById('wd-cat'),
        title: document.getElementById('wd-title'),
        img: document.getElementById('wd-img'),
        content: document.getElementById('wd-content'),
        nextTitle: document.getElementById('wd-next-title'),
        nextLabel: document.getElementById('wd-next-label'),
        nextArrow: document.getElementById('wd-next-arrow'),
        close: overlay.querySelector('[data-wd-close]'),
        next: overlay.querySelector('[data-wd-next]'),
    };
    const pageView = document.getElementById('portfolio-view');
    const siteNav = document.querySelector('.site-nav');

    let current = null;     // item shown in the overlay
    let busy = false;       // an open/close sequence is running
    let pendingClose = false;
    let closeTarget = null; // section to land on instead of zooming back into the card

    // After the last project, "Continue" leads to the section that follows Work
    const projectsSection = document.getElementById('projects');
    let afterSection = projectsSection ? projectsSection.nextElementSibling : null;
    while (afterSection && afterSection.tagName !== 'SECTION') afterSection = afterSection.nextElementSibling;
    const afterIndex = afterSection && afterSection.querySelector('.section-index');
    const afterName = afterIndex ? afterIndex.textContent.replace(/\(\d+\)/, '').trim() : '';

    function pad(n) { return String(n).padStart(2, '0'); }

    function fillOverlay(item) {
        const n = pad(item.index + 1);
        ui.countNow.textContent = n;
        ui.countTotal.textContent = pad(items.length);
        ui.num.textContent = `(${n})`;
        ui.cat.textContent = item.catText;
        ui.img.src = item.img.getAttribute('src');
        ui.img.alt = item.img.alt;

        ui.title.textContent = '';
        let i = 0;
        item.title.split(' ').forEach((word, w) => {
            if (w > 0) ui.title.appendChild(document.createTextNode(' '));
            const wordEl = document.createElement('span');
            wordEl.style.whiteSpace = 'nowrap';
            [...word].forEach(ch => {
                const mask = document.createElement('span');
                mask.className = 'wd-ch';
                const inner = document.createElement('span');
                inner.textContent = ch;
                inner.style.setProperty('--i', i++);
                mask.appendChild(inner);
                wordEl.appendChild(mask);
            });
            ui.title.appendChild(wordEl);
        });

        const tpl = document.getElementById(`work-tpl-${item.slug}`);
        ui.content.replaceChildren(tpl ? tpl.content.cloneNode(true) : document.createTextNode(''));

        const isLast = item.index === items.length - 1 && afterSection;
        ui.nextLabel.textContent = isLast ? 'Continue' : 'Next project';
        ui.nextTitle.textContent = isLast ? afterName : items[(item.index + 1) % items.length].title;
        ui.nextArrow.textContent = isLast ? '↓' : '→';
        overlay.style.setProperty('--wd-tone', item.tone);
        overlay.scrollTop = 0;
    }

    function lockPage(locked) {
        const l = getLenis();
        if (l) { locked ? l.stop() : l.start(); }
        if (pageView) pageView.inert = locked;
        if (siteNav) siteNav.inert = locked;
    }

    function showOverlay(instant) {
        overlay.hidden = false;
        overlay.classList.toggle('is-instant', instant);
        void overlay.offsetWidth;
        overlay.classList.add('is-visible');
        requestAnimationFrame(() => overlay.classList.add('is-in'));
        ui.close.focus({ preventScroll: true });
    }

    function openDetail(slug, push) {
        const item = bySlug[slug];
        if (!item || busy || current) return;
        busy = true;
        current = item;
        pendingClose = false;
        fillOverlay(item);
        lockPage(true);
        if (push) history.pushState({ view: 'work', slug }, '', `#work/${slug}`);

        const done = () => {
            busy = false;
            if (pendingClose) closeDetail();
        };

        if (gl && item.tex) {
            // Start the zoom from the finished card, not a half-revealed one
            reveal(item);
            item.revealT = REVEAL_SECONDS;
            item.hovered = false;
            canvas.classList.add('is-front');
            runStage(item, 1, OPEN_SECONDS, () => {
                showOverlay(true);
                canvas.classList.remove('is-front');
                done();
            });
        } else {
            showOverlay(false);
            setTimeout(done, 500);
        }
    }

    // Scroll (instantly, behind the overlay) so the card is on screen to zoom back into
    function bringIntoView(item) {
        const vh = window.innerHeight;
        const top = item.y - window.scrollY;
        if (top >= 0 && top + item.h <= vh) return;
        const target = clamp(item.y + item.h / 2 - vh / 2, 0, document.documentElement.scrollHeight - vh);
        const l = getLenis();
        if (l) l.scrollTo(target, { immediate: true, force: true });
        window.scrollTo(0, target);
    }

    function closeDetail() {
        if (!current) return;
        if (busy) { pendingClose = true; return; }
        busy = true;
        const item = current;
        const target = closeTarget;
        closeTarget = null;
        overlay.classList.remove('is-in');

        const finish = () => {
            overlay.hidden = true;
            overlay.classList.remove('is-visible', 'is-instant');
            lockPage(false);
            current = null;
            busy = false;
            if (target) {
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            } else {
                item.el.focus({ preventScroll: true });
            }
        };

        setTimeout(() => {
            if (target) {
                // Jump behind the overlay to the next section, then fade the overlay away
                const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 40);
                const l = getLenis();
                if (l) l.scrollTo(y, { immediate: true, force: true });
                window.scrollTo(0, y);
                stage.item = null;
                stage.progress = 0;
                stage.running = false;
                overlay.classList.remove('is-instant', 'is-visible');
                setTimeout(finish, 500);
            } else if (gl && item.tex) {
                bringIntoView(item);
                // "Next project" may have landed on a card that was never revealed
                reveal(item);
                item.revealT = REVEAL_SECONDS;
                item.hovered = false;
                stage.item = item;
                stage.progress = 1;
                canvas.classList.add('is-front');
                // Let one frame paint the full-screen card before the overlay goes
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    overlay.classList.add('is-instant');
                    overlay.classList.remove('is-visible');
                    runStage(item, 0, CLOSE_SECONDS, () => {
                        canvas.classList.remove('is-front');
                        stage.item = null;
                        finish();
                    });
                }));
            } else {
                overlay.classList.remove('is-instant', 'is-visible');
                setTimeout(finish, 500);
            }
        }, CONTENT_OUT_MS);
    }

    function requestClose() {
        if (history.state && history.state.view === 'work') history.back();
        else closeDetail();
    }

    function showNext() {
        if (!current || busy) return;
        if (current.index === items.length - 1 && afterSection) {
            closeTarget = afterSection;
            requestClose();
            return;
        }
        busy = true;
        const next = items[(current.index + 1) % items.length];
        overlay.classList.remove('is-in');
        setTimeout(() => {
            current = next;
            fillOverlay(next);
            history.replaceState({ view: 'work', slug: next.slug }, '', `#work/${next.slug}`);
            requestAnimationFrame(() => overlay.classList.add('is-in'));
            busy = false;
            if (pendingClose) closeDetail();
        }, CONTENT_OUT_MS);
    }

    grid.addEventListener('click', e => {
        const card = e.target.closest('.pcard');
        if (!card || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        openDetail(card.dataset.slug, true);
    });

    ui.close.addEventListener('click', requestClose);
    ui.next.addEventListener('click', showNext);

    overlay.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); requestClose(); return; }
        if (e.key !== 'Tab') return;
        // Keep focus inside the dialog
        const focusables = [...overlay.querySelectorAll('a[href], button:not([disabled])')];
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    window.addEventListener('popstate', e => {
        const state = e.state;
        if (state && state.view === 'work') {
            if (!current) openDetail(state.slug, false);
        } else if (current) {
            closeDetail();
        }
    });

    // ───────────── WebGL ─────────────
    let gl = null;
    let canvas = null;
    const stage = { item: null, progress: 0, from: 0, to: 0, start: 0, duration: 1, onDone: null, running: false };

    function runStage(item, to, seconds, onDone) {
        stage.item = item;
        stage.from = stage.progress;
        stage.to = to;
        stage.start = performance.now();
        stage.duration = seconds * 1000;
        stage.onDone = onDone;
        stage.running = true;
    }

    if (reduceMotion) return;

    canvas = document.createElement('canvas');
    canvas.className = 'works-gl';
    canvas.setAttribute('aria-hidden', 'true');
    gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) { gl = null; return; }

    const VERT = `
attribute vec2 a_pos;
uniform vec2 u_view;      // viewport, css px
uniform vec4 u_rect;      // card x, y, w, h on screen, css px
uniform vec3 u_stage;     // pan x, pan y, scale: the zoom towards full screen
uniform float u_stageYaw;
uniform vec2 u_tilt;      // card yaw / pitch, radians
uniform vec3 u_enter;     // reveal offset x, y (px) and roll (rad)
uniform float u_bend;     // scroll-speed bend, px
varying vec2 v_local;     // css px inside the card

const float PAD = 2.0;

void main() {
    vec2 size = u_rect.zw;
    vec2 local = a_pos * (size + 2.0 * PAD) - PAD;
    v_local = local;

    vec2 c = local - 0.5 * size;
    // The middle of the card trails its edges while the page moves fast
    float nx = c.x / (0.5 * size.x);
    c.y += u_bend * (1.0 - nx * nx);

    float cr = cos(u_enter.z), sr = sin(u_enter.z);
    c = vec2(c.x * cr - c.y * sr, c.x * sr + c.y * cr);

    vec3 p = vec3(c, 0.0);
    float cy = cos(u_tilt.x), sy = sin(u_tilt.x);
    p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
    float cp = cos(u_tilt.y), sp = sin(u_tilt.y);
    p = vec3(p.x, p.y * cp - p.z * sp, p.y * sp + p.z * cp);

    vec2 centre = 0.5 * u_view;
    p.xy += u_rect.xy + 0.5 * size + u_enter.xy;
    p.xy = centre + (p.xy - centre + u_stage.xy) * u_stage.z;
    p.z *= u_stage.z;

    float cs = cos(u_stageYaw), ss = sin(u_stageYaw);
    float dx = p.x - centre.x;
    p.x = centre.x + dx * cs + p.z * ss;
    p.z = -dx * ss + p.z * cs;

    // Perspective in which the z = 0 plane lines up 1:1 with css pixels
    float dist = u_view.y * 1.5;
    gl_Position = vec4((p.x - centre.x) / centre.x * dist, (centre.y - p.y) / centre.y * dist, 0.0, dist - p.z);
}`;

    const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_image;
uniform sampler2D u_depth;  // 1 = near, 0 = far
uniform vec2 u_size;
uniform vec2 u_imageSize;
uniform float u_radius;
uniform float u_reveal;     // 0..1 wipe up from the bottom
uniform float u_hover;      // 0..1 colour, zoom
uniform vec2 u_look;        // -1..1 parallax eye offset
uniform vec2 u_focus;       // card uv kept sharp
uniform float u_dof;        // 0..1 blur for layers away from the focus
uniform float u_split;      // chromatic split from scroll speed
uniform float u_dive;       // 0..1 zoom into the detail view
uniform vec3 u_tone;
uniform vec3 u_accent;
uniform float u_alpha;
uniform float u_frame;
varying vec2 v_local;

// Interleaved gradient noise, shifted every frame so stepping reads as grain
float grain(vec2 p) {
    p += u_frame * 5.588238;
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

float roundedBox(vec2 p, vec2 halfSize, float r) {
    vec2 q = abs(p) - halfSize + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// object-fit: cover, anchored to the top like the CSS fallback
vec2 cover(vec2 uv) {
    float s = max(u_size.x / u_imageSize.x, u_size.y / u_imageSize.y);
    vec2 visible = u_size / (u_imageSize * s);
    return vec2(0.5 * (1.0 - visible.x), 0.0) + uv * visible;
}

void main() {
    float top = u_size.y * (1.0 - u_reveal);
    vec2 halfSize = 0.5 * vec2(u_size.x, u_size.y - top);
    float d = roundedBox(v_local - vec2(0.5 * u_size.x, 0.5 * (top + u_size.y)), halfSize, min(u_radius, halfSize.y));
    float alpha = clamp(0.5 - d, 0.0, 1.0) * u_alpha;
    if (alpha <= 0.0) discard;

    vec2 uv = v_local / u_size;
    float zoom = mix(1.25, 1.0, u_reveal) * mix(1.0, 1.045, u_hover) * mix(1.0, 1.5, u_dive);
    vec2 st = (uv - 0.5) / zoom + 0.5;

    // Parallax: march from the near layer into the depth map along the eye offset
    float n = grain(gl_FragCoord.xy);
    vec2 shift = -u_look * (mix(0.016, 0.032, u_hover) + u_dive * 0.14);
    const int STEPS = 10;
    float layer = 1.0 / float(STEPS);
    float ray = layer * n;
    vec2 p = st + shift * ray;
    for (int i = 0; i < STEPS; i++) {
        if (ray >= 1.0 - texture2D(u_depth, cover(p)).r) break;
        ray += layer;
        p = st + shift * ray;
    }

    float depth = texture2D(u_depth, cover(p)).r;
    float focusDepth = texture2D(u_depth, cover(u_focus)).r;
    float blur = u_dof * 0.005 * smoothstep(0.08, 0.45, abs(depth - focusDepth));
    float streak = u_dive * 0.06;
    bool many = blur + streak + abs(u_split) > 0.0001;

    // Vogel disc for the blur, plus a radial streak while diving in
    vec3 col = vec3(0.0);
    float count = 0.0;
    float angle = n * 6.2831853;
    vec2 aspect = vec2(u_size.y / u_size.x, 1.0);
    vec2 toCentre = p - 0.5;
    for (int i = 0; i < 8; i++) {
        if (!many && i > 0) break;
        float t = (float(i) + 0.5) / 8.0;
        angle += 2.39996323;
        vec2 o = sqrt(t) * blur * vec2(cos(angle), sin(angle)) * aspect - toCentre * streak * t;
        vec2 q = cover(p + o);
        col.r += texture2D(u_image, q + vec2(u_split, 0.0)).r;
        col.g += texture2D(u_image, q).g;
        col.b += texture2D(u_image, q - vec2(u_split, 0.0)).b;
        count += 1.0;
    }
    col /= count;

    // Same idle treatment as the CSS fallback: mostly grey and dimmed until hovered
    float lit = max(u_hover, u_dive);
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, mix(0.1, 1.0, lit)) * mix(0.72, 1.0, lit);

    // Signal-red edge riding the wipe
    float edge = exp(-abs(v_local.y - top) * 0.7) * smoothstep(1.0, 0.7, u_reveal);
    col = mix(col, u_accent, clamp(edge, 0.0, 1.0));

    // Diving in: far layers dissolve into the project tone first, near ones last
    float fog = smoothstep(0.0, 1.0, (u_dive - 0.3) * 2.6 - depth * 0.6);
    col = mix(col, u_tone, fog);

    gl_FragColor = vec4(col * alpha, alpha);
}`;

    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('works-gl shader:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (vs && fs) {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
    }
    if (!vs || !fs || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl = null;
        return;
    }
    gl.useProgram(program);

    const U = {};
    ['u_view', 'u_rect', 'u_stage', 'u_stageYaw', 'u_tilt', 'u_enter', 'u_bend', 'u_image', 'u_depth', 'u_size',
        'u_imageSize', 'u_radius', 'u_reveal', 'u_hover', 'u_look', 'u_focus', 'u_dof', 'u_split', 'u_dive',
        'u_tone', 'u_accent', 'u_alpha', 'u_frame'].forEach(name => { U[name] = gl.getUniformLocation(program, name); });

    // A subdivided quad so the bend and tilt stay smooth
    const SEG = 20;
    const verts = [];
    for (let y = 0; y <= SEG; y++) for (let x = 0; x <= SEG; x++) verts.push(x / SEG, y / SEG);
    const indices = [];
    for (let y = 0; y < SEG; y++) {
        for (let x = 0; x < SEG; x++) {
            const i = y * (SEG + 1) + x;
            indices.push(i, i + 1, i + SEG + 1, i + 1, i + SEG + 2, i + SEG + 1);
        }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(U.u_image, 0);
    gl.uniform1i(U.u_depth, 1);

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff2d2d';
    gl.uniform3fv(U.u_accent, hexToRgb(accent));

    function makeTexture(source) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        return tex;
    }

    // There are no depth maps for these screenshots, so fake one from brightness:
    // bright UI (text, cards, buttons) floats in front of the dark page behind it.
    function makeDepthMap(image) {
        const w = 128;
        const h = Math.max(8, Math.round(w * image.naturalHeight / image.naturalWidth));
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(image, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        let lum = new Float32Array(w * h);
        for (let i = 0; i < w * h; i++) {
            const o = i * 4;
            lum[i] = (0.299 * data.data[o] + 0.587 * data.data[o + 1] + 0.114 * data.data[o + 2]) / 255;
        }
        // A few box-blur passes turn sharp glyphs into soft raised plates
        const tmp = new Float32Array(w * h);
        for (let pass = 0; pass < 3; pass++) {
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let s = 0, n = 0;
                    for (let k = -3; k <= 3; k++) { const xx = x + k; if (xx >= 0 && xx < w) { s += lum[y * w + xx]; n++; } }
                    tmp[y * w + x] = s / n;
                }
            }
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let s = 0, n = 0;
                    for (let k = -3; k <= 3; k++) { const yy = y + k; if (yy >= 0 && yy < h) { s += tmp[yy * w + x]; n++; } }
                    lum[y * w + x] = s / n;
                }
            }
        }
        let lo = 1, hi = 0;
        for (let i = 0; i < lum.length; i++) { lo = Math.min(lo, lum[i]); hi = Math.max(hi, lum[i]); }
        const range = Math.max(hi - lo, 1e-3);
        for (let i = 0; i < lum.length; i++) {
            const v = Math.round(Math.pow((lum[i] - lo) / range, 0.7) * 255);
            const o = i * 4;
            data.data[o] = data.data[o + 1] = data.data[o + 2] = v;
            data.data[o + 3] = 255;
        }
        lum = null;
        ctx.putImageData(data, 0, 0);
        return c;
    }

    function loadItem(item) {
        const image = new Image();
        image.decoding = 'async';
        image.src = item.img.getAttribute('src');
        image.decode().then(() => {
            if (!gl) return;
            item.imageW = image.naturalWidth;
            item.imageH = image.naturalHeight;
            item.tex = makeTexture(image);
            item.depthTex = makeTexture(makeDepthMap(image));
            item.el.classList.add('is-gl-ready');
        }).catch(() => { /* keep the <img> fallback for this card */ });
    }

    grid.classList.add('is-gl');
    document.body.appendChild(canvas);
    items.forEach(loadItem);

    canvas.addEventListener('webglcontextlost', e => {
        e.preventDefault();
        gl = null;
        canvas.remove();
        grid.classList.remove('is-gl');
        items.forEach(it => { it.tex = null; it.el.classList.remove('is-gl-ready'); });
        if (current) { overlay.classList.remove('is-instant'); overlay.classList.add('is-visible'); }
    });

    // ───────────── layout ─────────────
    let vw = 1, vh = 1, dpr = 1, radius = 10;
    let needsMeasure = true;

    function measure() {
        needsMeasure = false;
        vw = window.innerWidth;
        vh = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = Math.round(vw * dpr);
        const ch = Math.round(vh * dpr);
        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw;
            canvas.height = ch;
        }
        radius = parseFloat(getComputedStyle(grid).getPropertyValue('--pcard-radius')) || 10;
        const sy = window.scrollY;
        items.forEach(it => {
            const r = it.media.getBoundingClientRect();
            it.x = r.left;
            it.y = r.top + sy;
            it.w = r.width;
            it.h = r.height;
        });
    }

    window.addEventListener('resize', () => { needsMeasure = true; });
    if ('ResizeObserver' in window) new ResizeObserver(() => { needsMeasure = true; }).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { needsMeasure = true; });

    // ───────────── pointer ─────────────
    items.forEach(item => {
        item.media.addEventListener('pointerenter', e => {
            if (e.pointerType !== 'mouse' || busy || current) return;
            item.hovered = true;
        });
        item.media.addEventListener('pointerleave', () => { item.hovered = false; });
        item.media.addEventListener('pointermove', e => {
            if (e.pointerType !== 'mouse') return;
            const r = item.media.getBoundingClientRect();
            item.mouseU = clamp((e.clientX - r.left) / r.width, 0, 1);
            item.mouseV = clamp((e.clientY - r.top) / r.height, 0, 1);
        }, { passive: true });
    });

    // Only draw while the section is near the viewport (or a zoom is running)
    let sectionNear = false;
    // A batch can hold several records for the same target; the last one is current
    new IntersectionObserver(entries => { sectionNear = entries[entries.length - 1].isIntersecting; }, { rootMargin: '25% 0px' })
        .observe(document.getElementById('projects') || grid);

    // ───────────── frame loop ─────────────
    const bend = new Spring(0, 120, 14);
    let lastTime = performance.now();
    let lastScroll = window.scrollY;
    let frame = 0;
    let cleared = true;

    function tick(time) {
        requestAnimationFrame(tick);
        if (!gl) return;
        const dt = clamp((time - lastTime) / 1000, 1 / 240, 1 / 20);
        lastTime = time;

        // Advance Lenis first so this frame's scroll matches the DOM it moves.
        // Its own loop then sees zero elapsed time and does nothing extra.
        const l = getLenis();
        if (l) { try { l.raf(time); } catch (err) { /* destroyed mid-switch */ } }

        const portfolioVisible = grid.offsetParent !== null;
        const active = portfolioVisible && !document.hidden && (sectionNear || stage.running || stage.item);
        if (!active) {
            if (!cleared) { gl.clear(gl.COLOR_BUFFER_BIT); cleared = true; }
            lastScroll = window.scrollY;
            return;
        }
        // Behind an open, settled overlay there is nothing to show
        if (current && !busy) return;

        if (needsMeasure) measure();

        // Zoom stage
        if (stage.running) {
            const t = clamp((time - stage.start) / stage.duration, 0, 1);
            stage.progress = mix(stage.from, stage.to, easeInOutQuart(t));
            if (t >= 1) {
                stage.running = false;
                const cb = stage.onDone;
                stage.onDone = null;
                if (cb) cb();
            }
        }

        // Ignore the instant jump bringIntoView makes behind the overlay
        const scrollY = window.scrollY;
        const velocity = current || stage.item ? 0 : (scrollY - lastScroll) / dt; // px per second
        lastScroll = scrollY;
        bend.target = clamp(velocity * 0.012, -40, 40);
        bend.update(dt);

        frame = (frame + 1) % 1000;
        cleared = false;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(U.u_view, vw, vh);
        gl.uniform1f(U.u_radius, radius);
        gl.uniform1f(U.u_frame, frame);
        gl.uniform1f(U.u_split, clamp(bend.value * 0.00015, -0.006, 0.006));

        // Stage transform for the selected card: cover the screen, centred,
        // with a swing that peaks halfway through and settles flat
        const e = stage.item ? stage.progress : 0;
        let panX = 0, panY = 0, scale = 1, yaw = 0;
        if (stage.item) {
            const s = stage.item;
            const cx = s.x + s.w / 2 - vw / 2;
            const cy = s.y - scrollY + s.h / 2 - vh / 2;
            const cover = Math.max(vw / s.w, vh / s.h) * 1.12;
            scale = mix(1, cover, e);
            panX = cx * (1 - e) / scale - cx;
            panY = cy * (1 - e) / scale - cy;
            yaw = -Math.sin(Math.PI * e) * 0.2 * clamp(cx / (vw / 2), -1, 1);
        }
        gl.uniform3f(U.u_stage, panX, panY, scale);
        gl.uniform1f(U.u_stageYaw, yaw);
        gl.uniform1f(U.u_bend, bend.value * (1 - e));

        // Selected card last so it sits on top
        const order = stage.item ? items.filter(it => it !== stage.item).concat(stage.item) : items;
        order.forEach(item => {
            if (!item.tex) return;
            const selected = item === stage.item;
            const top = item.y - scrollY;

            if (item.revealing) item.revealT = Math.min(REVEAL_SECONDS, item.revealT + dt);
            const r = easeOutExpo(item.revealT / REVEAL_SECONDS);

            // Pointer → springs. Without a mouse, the scroll position drives the eye instead.
            const scrollLook = clamp((top + item.h / 2 - vh / 2) / (vh / 2), -1, 1);
            const hovering = item.hovered && !busy;
            item.hover.target = finePointer ? (hovering ? 1 : 0) : 1;
            item.dof.target = hovering ? 1 : 0;
            item.lookX.target = hovering ? (item.mouseU - 0.5) * 2 : 0;
            item.lookY.target = hovering ? (item.mouseV - 0.5) * 2 : scrollLook * 0.5;
            const follow = 1 - Math.exp(-8 * dt);
            item.focusX += ((hovering ? item.mouseU : 0.5) - item.focusX) * follow;
            item.focusY += ((hovering ? item.mouseV : 0.5) - item.focusY) * follow;
            item.hover.update(dt);
            item.dof.update(dt);
            item.lookX.update(dt);
            item.lookY.update(dt);

            const alpha = selected ? 1 : 1 - smoothstep(0, 0.45, e);
            if (alpha <= 0 || r <= 0) return;
            // Skip cards well off screen (the stage can pull them in, so only when idle)
            if (!stage.item && (top > vh + 120 || top + item.h < -120)) return;

            const hover = clamp(item.hover.value, 0, 1.2);
            const tiltAmount = finePointer ? 0.085 * hover : 0.05;
            const settle = selected ? 1 - e : 1;
            const side = item.index % 2 ? 1 : -1;

            gl.uniform4f(U.u_rect, item.x, top, item.w, item.h);
            gl.uniform2f(U.u_size, item.w, item.h);
            gl.uniform2f(U.u_imageSize, item.imageW, item.imageH);
            gl.uniform2f(U.u_tilt, item.lookX.value * tiltAmount * settle, -item.lookY.value * tiltAmount * settle);
            gl.uniform3f(U.u_enter, 0, (1 - r) * 90, (1 - r) * 0.045 * side);
            gl.uniform1f(U.u_reveal, r);
            gl.uniform1f(U.u_hover, Math.min(hover, 1));
            gl.uniform2f(U.u_look, item.lookX.value, item.lookY.value);
            gl.uniform2f(U.u_focus, item.focusX, item.focusY);
            gl.uniform1f(U.u_dof, clamp(item.dof.value, 0, 1) * (selected ? 1 - e : 1));
            gl.uniform1f(U.u_dive, selected ? e : 0);
            gl.uniform3fv(U.u_tone, item.toneRgb);
            gl.uniform1f(U.u_alpha, alpha);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, item.tex);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, item.depthTex);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        });
    }
    requestAnimationFrame(tick);
})();
