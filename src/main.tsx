import React from 'react'
import ReactDOM from 'react-dom/client'
import { SplineSceneBasic } from './components/SplineSceneBasic'
import { ShaderBackground } from './components/ui/ShaderBackground'
import './index.css'

const mountReactApps = () => {
  const heroMountNode = document.getElementById('react-hero-root');
  if (heroMountNode && !heroMountNode.hasAttribute('data-mounted')) {
    heroMountNode.setAttribute('data-mounted', 'true');
    ReactDOM.createRoot(heroMountNode).render(
      <React.StrictMode>
        <SplineSceneBasic />
      </React.StrictMode>,
    )
  }

  const shaderBgMountNode = document.getElementById('react-shader-bg-root');
  if (shaderBgMountNode && !shaderBgMountNode.hasAttribute('data-mounted')) {
    shaderBgMountNode.setAttribute('data-mounted', 'true');
    ReactDOM.createRoot(shaderBgMountNode).render(
      <React.StrictMode>
        <ShaderBackground />
      </React.StrictMode>,
    )
  }
};

const init = () => {
  const splash = document.getElementById('intro-splash');
  const isSplashGone = !splash || 
                       splash.classList.contains('splash-gone') || 
                       splash.classList.contains('splash-exit') || 
                       splash.style.display === 'none';

  if (isSplashGone) {
    mountReactApps();
  } else {
    window.addEventListener('portfolio-entered', mountReactApps, { once: true });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
