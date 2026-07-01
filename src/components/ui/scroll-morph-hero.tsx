"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { DottedSurface } from "./dotted-surface";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    logo: string;
    name: string;
    category: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 70;  // Adjusted for square developer/technology logos
const IMG_HEIGHT = 70;

function FlipCard({
    logo,
    name,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            // Smoothly animate to the coordinates defined by the parent
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 70,
                damping: 18,
                mass: 0.8,
            }}

            // Initial style
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                willChange: "transform, opacity",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full overflow-hidden rounded-2xl shadow-md bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-sm flex items-center justify-center p-3.5 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.55)]"
                whileHover={{ 
                    scale: 1.25,
                    y: -10,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <img
                    src={logo}
                    alt={name}
                    className={`h-full w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${name.toLowerCase() === 'github' ? 'dark:invert' : ''}`}
                    loading="lazy"
                />
                {/* Glow Overlay layer */}
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000; // Virtual scroll range

// Developer's actual portfolio tech stack
const TECH_STACK = [
    { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", category: "Language" },
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", category: "Language" },
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", category: "Frontend" },
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", category: "Backend" },
    { name: "Expo", logo: "https://cdn.simpleicons.org/expo/4630EB", category: "Mobile" },
    { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", category: "Frontend" },
    { name: "Vite", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg", category: "Tool" },
    { name: "FastAPI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg", category: "Backend" },
    { name: "Flask", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg", category: "Backend" },
    { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg", category: "Backend" },
    { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg", category: "Database" },
    { name: "SQLAlchemy", logo: "https://cdn.simpleicons.org/sqlalchemy/D7191C", category: "Database" },
    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg", category: "Database" },
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", category: "Tool" },
    { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", category: "Tool" },
    { name: "Postman", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg", category: "Tool" },
    { name: "Render", logo: "https://cdn.simpleicons.org/render/46E3B7", category: "DevOps" },
    { name: "Netlify", logo: "https://cdn.simpleicons.org/netlify/00C7B7", category: "DevOps" },
    { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", category: "Frontend" },
    { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", category: "Frontend" },
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

interface IntroAnimationProps {
    onEnter?: () => void;
}

export default function IntroAnimation({ onEnter }: IntroAnimationProps) {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial set
        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Virtual Scroll Logic ---
    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0); // Keep track of scroll value without re-renders

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // Prevent default to stop browser overscroll/bounce
            e.preventDefault();

            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Touch support
        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;

            const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Attach listeners to container instead of window for portability
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
    // Happens between scroll 0 and 600
    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 60, damping: 22, mass: 0.8 });

    // 2. Scroll Rotation (Shuffling): Starts after morph (e.g., > 600)
    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 55, damping: 20, mass: 0.8 });

    // --- Mouse Parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 22, mass: 0.7 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;

            // Normalize -1 to 1
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            // Move +/- 100px
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 600);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2200);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return TECH_STACK.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    // --- Render Loop (Ref-based for zero re-renders) ---
    const morphValueRef = useRef(0);
    const rotateValueRef = useRef(0);
    const parallaxValueRef = useRef(0);
    const [, forceUpdate] = useState(0);
    const rafIdRef = useRef<number>(0);

    // Keep refs in sync with spring values (no setState)
    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", (v) => { morphValueRef.current = v; });
        const unsubscribeRotate = smoothScrollRotate.on("change", (v) => { rotateValueRef.current = v; });
        const unsubscribeParallax = smoothMouseX.on("change", (v) => { parallaxValueRef.current = v; });
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    // Throttled render loop — batch updates at ~60fps instead of per-spring-tick
    useEffect(() => {
        let lastMorph = -1, lastRotate = -1, lastParallax = -1;
        function tick() {
            const m = morphValueRef.current;
            const r = rotateValueRef.current;
            const p = parallaxValueRef.current;
            // Only trigger re-render when values meaningfully change
            if (Math.abs(m - lastMorph) > 0.002 || Math.abs(r - lastRotate) > 0.1 || Math.abs(p - lastParallax) > 0.5) {
                lastMorph = m;
                lastRotate = r;
                lastParallax = p;
                forceUpdate(n => n + 1);
            }
            rafIdRef.current = requestAnimationFrame(tick);
        }
        rafIdRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafIdRef.current);
    }, []);

    // Automatically trigger onEnter when reaching the end of the scroll
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        const unsubscribe = virtualScroll.on("change", (latest: number) => {
            if (latest >= MAX_SCROLL - 10 && onEnter) {
                if (!timer) {
                    timer = setTimeout(() => {
                        onEnter();
                    }, 500);
                }
            } else {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            }
        });
        return () => {
            unsubscribe();
            if (timer) clearTimeout(timer);
        };
    }, [virtualScroll, onEnter]);

    // --- Content Opacity ---
    // Fade in content when arc is formed (morphValue > 0.8)
    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[#F5F5F5] dark:bg-[#0f172a] overflow-hidden transition-colors duration-300" style={{ willChange: "transform" }}>
            {/* 3D Dotted Surface Canvas Background */}
            <DottedSurface className="absolute inset-0 z-0 opacity-80" />

            {/* Ambient Background Glow for Dark Mode */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-70 z-0">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000 relative z-10">

                {/* Intro Text (Fades out) */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 w-full max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && morphValueRef.current < 0.5 ? { opacity: 1 - morphValueRef.current * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl font-display relative w-full"
                    >
                        JYOTIRMOY<span className="text-cyan-500">.DEV</span>
                        
                        {/* Tagline positioned using full width centering, immune to Framer Motion overrides */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={introPhase === "circle" && morphValueRef.current < 0.5 ? { opacity: 0.8 - morphValueRef.current } : { opacity: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute top-full mt-4 left-0 right-0 w-full flex justify-center text-[10px] sm:text-xs font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono block"
                        >
                            <span className="whitespace-nowrap">BCA Student &middot; Code Craftsman</span>
                        </motion.span>
                        
                        {/* Scroll indicator positioned using full width centering */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={introPhase === "circle" && morphValueRef.current < 0.5 ? { opacity: 0.5 - morphValueRef.current } : { opacity: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="absolute top-full mt-14 left-0 right-0 w-full flex justify-center block"
                        >
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md whitespace-nowrap">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-slate-800 dark:text-slate-200 uppercase">Scroll to Explore</span>
                            </span>
                        </motion.span>
                    </motion.h1>
                </div>

                {/* Arc Active Content (Fades in) */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 font-display">
                        Explore My Portfolio
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                        I convert <span className="text-emerald-500 dark:text-emerald-400 font-semibold font-mono">ideas</span> into <span className="text-cyan-500 dark:text-cyan-400 font-semibold font-mono">code</span>. <br className="hidden md:block" />
                        Scroll to cycle through my tools or click below to enter.
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {TECH_STACK.slice(0, TOTAL_IMAGES).map((tech, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 80; // Adjusted for tech logos
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase & Morph Logic
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            // A. Calculate Circle Position
                            const circleRadius = isMobile
                                ? Math.min(minDimension * 0.36, 140)
                                : Math.min(minDimension * 0.44, 380);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            // B. Calculate Bottom Arc Position
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                            // Position:
                            const arcApexY = containerSize.height * (isMobile ? 0.38 : 0.28);
                            const arcCenterY = arcApexY + arcRadius;

                            // Spread angle:
                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            // Interpret rotateValue (0 to 360) as a progress 0 to 1
                            const scrollProgress = Math.min(Math.max(rotateValueRef.current / 360, 0), 1);

                            // Calculate bounded rotation
                            const maxRotation = spreadAngle * 0.8;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValueRef.current,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.2 : 1.5,
                            };

                            // C. Interpolate (Morph)
                            const mv = morphValueRef.current;
                            target = {
                                x: lerp(circlePos.x, arcPos.x, mv),
                                y: lerp(circlePos.y, arcPos.y, mv),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, mv),
                                scale: lerp(0.85, arcPos.scale, mv),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                logo={tech.logo}
                                name={tech.name}
                                category={tech.category}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                            />
                        );
                    })}
                </div>

                {/* Enter Portfolio Button (Fades in when arc is formed) */}
                <motion.button
                    style={{ opacity: contentOpacity, y: contentY, pointerEvents: morphValueRef.current > 0.8 ? "auto" : "none" }}
                    onClick={onEnter}
                    className="absolute bottom-[15%] z-20 px-6 py-3 rounded-full font-semibold border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
                >
                    <span>Enter Portfolio</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
}
