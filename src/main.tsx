import React from 'react'
import ReactDOM from 'react-dom/client'
import { SplineSceneBasic } from './components/SplineSceneBasic'
import { ShaderBackground } from './components/ui/ShaderBackground'
import './index.css'

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
