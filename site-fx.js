/* =========================================================
   SITE FX — view transition and optional interface sound.
   ========================================================= */
(function initSiteFx() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ───────────── interface sound (off by default) ─────────────
    // Everything is synthesized with Web Audio, so there are no files to load.
    const sound = (function () {
        const KEY = 'jl-sound';
        let enabled = false;
        let ctx = null;
        let master = null;
        let noise = null;
        try { enabled = localStorage.getItem(KEY) === 'on'; } catch (e) { /* storage blocked */ }

        function ensure() {
            if (!enabled) return null;
            if (!ctx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return null;
                ctx = new AC();
                master = ctx.createGain();
                master.gain.value = 0.6;
                master.connect(ctx.destination);
            }
            if (ctx.state === 'suspended') ctx.resume();
            return ctx;
        }

        function tone(freq, start, length, peak, type) {
            const osc = ctx.createOscillator();
            const env = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, start);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.82, start + length);
            env.gain.setValueAtTime(0.0001, start);
            env.gain.exponentialRampToValueAtTime(peak, start + 0.004);
            env.gain.exponentialRampToValueAtTime(0.0001, start + length);
            osc.connect(env).connect(master);
            osc.start(start);
            osc.stop(start + length + 0.02);
        }

        function whoosh(start, length, peak) {
            if (!noise) {
                noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
                const data = noise.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            }
            const src = ctx.createBufferSource();
            src.buffer = noise;
            const band = ctx.createBiquadFilter();
            band.type = 'bandpass';
            band.Q.value = 1.4;
            band.frequency.setValueAtTime(320, start);
            band.frequency.exponentialRampToValueAtTime(2600, start + length * 0.55);
            band.frequency.exponentialRampToValueAtTime(700, start + length);
            const env = ctx.createGain();
            env.gain.setValueAtTime(0.0001, start);
            env.gain.exponentialRampToValueAtTime(peak, start + length * 0.45);
            env.gain.exponentialRampToValueAtTime(0.0001, start + length);
            src.connect(band).connect(env).connect(master);
            src.start(start);
            src.stop(start + length + 0.05);
        }

        function play(name) {
            if (!ensure()) return;
            const t = ctx.currentTime + 0.005;
            if (name === 'hover') tone(2100, t, 0.035, 0.025, 'sine');
            else if (name === 'click') { tone(880, t, 0.07, 0.07, 'triangle'); tone(1320, t + 0.03, 0.09, 0.04, 'sine'); }
            else if (name === 'whoosh') whoosh(t, 0.9, 0.09);
        }

        function setEnabled(on) {
            enabled = on;
            try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* storage blocked */ }
            if (!on && ctx) ctx.suspend();
        }

        return { play, setEnabled, get enabled() { return enabled; } };
    })();
    window.siteSound = sound;

    const toggle = document.getElementById('sound-toggle');
    if (toggle) {
        const sync = () => {
            toggle.setAttribute('aria-pressed', String(sound.enabled));
            toggle.classList.toggle('is-on', sound.enabled);
            toggle.setAttribute('aria-label', sound.enabled ? 'Turn interface sound off' : 'Turn interface sound on');
        };
        toggle.addEventListener('click', () => {
            sound.setEnabled(!sound.enabled);
            sync();
            sound.play('click');
        });
        sync();
    }

    const INTERACTIVE = 'a, button, [role="button"], [role="link"], [data-action], .pcard-media';
    let lastHovered = null;
    let lastHoverAt = 0;
    document.addEventListener('pointerover', e => {
        if (e.pointerType !== 'mouse' || !sound.enabled) return;
        const el = e.target.closest(INTERACTIVE);
        if (!el || el === lastHovered) return;
        lastHovered = el;
        const now = performance.now();
        if (now - lastHoverAt < 70) return;
        lastHoverAt = now;
        sound.play('hover');
    }, { passive: true });
    document.addEventListener('pointerout', e => {
        if (lastHovered && !lastHovered.contains(e.relatedTarget)) lastHovered = null;
    }, { passive: true });

    document.addEventListener('click', e => {
        if (!sound.enabled || e.target.closest('#sound-toggle')) return;
        if (e.target.closest('.pcard, [data-wd-close], [data-wd-next]')) sound.play('whoosh');
        else if (e.target.closest(INTERACTIVE)) sound.play('click');
    });

    // ───────────── view transition ─────────────
    const wipe = document.getElementById('page-wipe');
    const wipeTitle = document.getElementById('pw-title');
    const CLOSE_MS = 700;
    const OPEN_MS = 800;
    let wiping = false;

    window.pageWipe = function (label, swap) {
        if (!wipe || reduceMotion) { swap(); return; }
        if (wiping) return;
        wiping = true;
        wipeTitle.textContent = label;
        sound.play('whoosh');
        wipe.classList.remove('is-opening');
        wipe.classList.add('is-active');
        void wipe.offsetWidth;
        wipe.classList.add('is-closing');

        setTimeout(() => {
            swap();
            // Two frames so the new view has laid out before the curtains part
            requestAnimationFrame(() => requestAnimationFrame(() => {
                wipe.classList.remove('is-closing');
                wipe.classList.add('is-opening');
                setTimeout(() => {
                    wipe.classList.remove('is-active', 'is-opening');
                    wiping = false;
                }, OPEN_MS);
            }));
        }, CLOSE_MS + 250);
    };

    if (reduceMotion) return;

    // ───────────── headline reveals ─────────────
    // Titles and ledes are split into masked words that rise line by line when
    // script.js adds .in. Words inside <em> stay inside it, so styling is untouched.
    function splitWords(el) {
        const masks = [];
        (function walk(node) {
            [...node.childNodes].forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach(part => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                        const mask = document.createElement('span');
                        mask.className = 'rw';
                        const inner = document.createElement('span');
                        inner.className = 'rw-i';
                        inner.textContent = part;
                        mask.appendChild(inner);
                        frag.appendChild(mask);
                        masks.push(mask);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
                    walk(child);
                }
            });
        })(el);
        return masks;
    }

    // Stagger by the rendered line, so wrapping on small screens still reads top to bottom
    function staggerByLine(masks, lineStep, wordStep) {
        let line = -1, lastTop = null, inLine = 0;
        masks.forEach(mask => {
            const top = mask.offsetTop;
            if (lastTop === null || Math.abs(top - lastTop) > 4) { line++; inLine = 0; lastTop = top; }
            mask.firstChild.style.setProperty('--d', `${line * lineStep + inLine * wordStep}ms`);
            inLine++;
        });
    }

    const splitGroups = [];
    document.querySelectorAll('.section-title[data-reveal="mask"], .cta-title[data-reveal="mask"]').forEach(el => {
        el.classList.add('is-split', 'is-split-title');
        splitGroups.push({ masks: splitWords(el), line: 110, word: 45 });
    });
    document.querySelectorAll('.section-lede[data-reveal]').forEach(el => {
        el.classList.add('is-split', 'is-split-lede');
        splitGroups.push({ masks: splitWords(el), line: 80, word: 0 });
    });

    const restagger = () => splitGroups.forEach(g => staggerByLine(g.masks, g.line, g.word));
    restagger();
    let restaggerTimer;
    window.addEventListener('resize', () => { clearTimeout(restaggerTimer); restaggerTimer = setTimeout(restagger, 200); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(restagger);

    // ───────────── rolling link labels ─────────────
    // Each letter is a column of two copies; hovering rolls them up one after another
    function splitRoll(el) {
        const node = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (!node) return;
        const text = node.textContent.trim();
        const roll = document.createElement('span');
        roll.className = 'lroll';
        [...text].forEach((ch, i) => {
            const col = document.createElement('span');
            col.className = 'lroll-ch';
            col.style.setProperty('--i', i);
            const a = document.createElement('span');
            a.textContent = ch === ' ' ? ' ' : ch;
            const b = document.createElement('span');
            b.textContent = a.textContent;
            b.setAttribute('aria-hidden', 'true');
            col.append(a, b);
            roll.appendChild(col);
        });
        node.replaceWith(roll);
    }
    document.querySelectorAll('#desktop-portfolio-nav .nav-link, .footer-col a').forEach(splitRoll);

    // ───────────── marquees follow scroll speed ─────────────
    // Scrolling speeds the bands up, scrolling back reverses them, and fast scrolls lean the type
    const band = document.querySelector('.band');
    const bandTrack = document.querySelector('.band-track');
    const blogTrack = document.getElementById('blog-marquee-track');
    let lastY = window.scrollY;
    let lastT = performance.now();
    let speed = 0;

    function marqueeFrame(now) {
        requestAnimationFrame(marqueeFrame);
        const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
        lastT = now;
        const y = window.scrollY;
        const v = (y - lastY) / dt; // px per second, + while scrolling down
        lastY = y;
        speed += (v - speed) * (1 - Math.exp(-6 * dt));
        if (Math.abs(speed) < 1) speed = 0;

        const rate = 1 + Math.max(-6, Math.min(6, speed / 500));
        [bandTrack, blogTrack].forEach(track => {
            if (!track || !track.getAnimations) return;
            track.getAnimations().forEach(anim => { if (anim.playbackRate !== rate) anim.playbackRate = rate; });
        });
        if (band) band.style.setProperty('--band-skew', `${Math.max(-10, Math.min(10, -speed / 250)).toFixed(2)}deg`);
    }
    requestAnimationFrame(marqueeFrame);
})();
