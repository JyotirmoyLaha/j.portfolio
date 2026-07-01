import { useState, useEffect } from 'react'
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export function SplineSceneBasic() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const splash = document.getElementById('intro-splash');
    if (!splash) return true;
    return splash.classList.contains('splash-gone') || splash.style.display === 'none';
  });

  useEffect(() => {
    if (visible) return;

    const handleEntered = () => setVisible(true);

    window.addEventListener('portfolio-entered', handleEntered);
    return () => window.removeEventListener('portfolio-entered', handleEntered);
  }, [visible]);

  return (
    <div className="absolute inset-0 w-full h-full bg-transparent overflow-visible pointer-events-auto flex items-center justify-end pr-[1%] lg:pr-[2%] z-0">
      {/* Glow Spotlight behind the Robot */}
      <Spotlight
        className="top-5 right-2 lg:right-4 md:top-10 opacity-75 pointer-events-none scale-75"
        fill="rgba(34, 211, 238, 0.4)"
      />
      
      {/* Interactive 3D Robot Scene — always mounted for preloading, revealed on enter */}
      <div
        className={`w-[min(550px,44vw)] h-[min(550px,44vw)] relative z-10 pointer-events-auto translate-y-24 transition-all duration-700 ease-out ${
          visible
            ? 'opacity-100 translate-y-24'
            : 'opacity-0 translate-y-48 pointer-events-none'
        }`}
      >
        {/* Hue-shifted Spline canvas */}
        <div className="w-full h-full" style={{ filter: 'hue-rotate(160deg) saturate(1.4) brightness(1.1)' }}>
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        {/* Subtle cyan tint overlay */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{ 
            background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.08) 0%, transparent 70%)',
            mixBlendMode: 'color',
          }}
        />
      </div>
    </div>
  )
}

