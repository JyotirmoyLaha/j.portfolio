import React from 'react'
import ReactDOM from 'react-dom/client'
import IntroAnimation from './components/ui/scroll-morph-hero'
import { SplineSceneBasic } from './components/SplineSceneBasic'
import { ShaderBackground } from './components/ui/ShaderBackground'
import './index.css'

const handleEnter = () => {
  if (typeof window !== 'undefined') {
    const globalWin = window as any;
    if (typeof globalWin.dismissSplash === 'function') {
      globalWin.dismissSplash();
    } else {
      // Fallback to directly apply the dismiss styles if the global function is not yet loaded
      const el = document.getElementById('intro-splash');
      if (el) {
        el.classList.add('splash-exit');
        setTimeout(() => el.classList.add('splash-gone'), 420);
      }
    }
    // Notify components (like SplineSceneBasic) that the user has entered the site
    window.dispatchEvent(new CustomEvent('portfolio-entered'));
  }
};

const mountNode = document.getElementById('react-splash-root');
if (mountNode) {
  ReactDOM.createRoot(mountNode).render(
    <React.StrictMode>
      <IntroAnimation onEnter={handleEnter} />
    </React.StrictMode>,
  )
}

const heroMountNode = document.getElementById('react-hero-root');
if (heroMountNode) {
  ReactDOM.createRoot(heroMountNode).render(
    <React.StrictMode>
      <SplineSceneBasic />
    </React.StrictMode>,
  )
}

const shaderBgMountNode = document.getElementById('react-shader-bg-root');
if (shaderBgMountNode) {
  ReactDOM.createRoot(shaderBgMountNode).render(
    <React.StrictMode>
      <ShaderBackground />
    </React.StrictMode>,
  )
}
