import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { ShaderPlane } from './background-paper-shaders';

export function ShaderBackground() {
  const [isDark, setIsDark] = useState(() => 
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  // Mouse position normalized to -1..1
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Track mouse globally (since parent has pointer-events-none, we listen on window)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Theme-matched colors
  const color1 = isDark ? '#0284c7' : '#7dd3fc';
  const color2 = isDark ? '#0f172a' : '#f0f9ff';

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 2], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
        className="opacity-50 dark:opacity-65"
      >
        <ShaderPlane 
          position={[0, 0, 0]} 
          color1={color1} 
          color2={color2}
          mouseRef={mouseRef}
        />
      </Canvas>
    </div>
  );
}
