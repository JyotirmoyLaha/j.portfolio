"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Vertex shader with mouse-driven displacement
const vertexShader = `
  uniform float time;
  uniform float intensity;
  uniform vec2 mouse;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    // Organic wave motion
    pos.y += sin(pos.x * 6.0 + time * 0.8) * 0.08 * intensity;
    pos.x += cos(pos.y * 5.0 + time * 0.6) * 0.04 * intensity;
    
    // Subtle mouse-driven bulge
    float dist = length(pos.xy - mouse * 2.0);
    pos.z += exp(-dist * 1.5) * 0.15;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Fragment shader with mouse-influenced glow center
const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec2 mouse;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 uv = vUv;
    
    // Animated noise pattern
    float noise = sin(uv.x * 15.0 + time * 0.7) * cos(uv.y * 12.0 + time * 0.5);
    noise += sin(uv.x * 25.0 - time * 1.2) * cos(uv.y * 18.0 + time * 0.9) * 0.5;
    noise += sin(length(uv - 0.5) * 8.0 - time) * 0.3;
    
    // Mix colors
    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, color1 * 1.4, pow(abs(noise), 3.0) * intensity * 0.4);
    
    // Mouse-following glow center (mouse is -1 to 1, map to 0-1 uv)
    vec2 glowCenter = mouse * 0.3 + 0.5;
    float glow = 1.0 - length(uv - glowCenter) * 1.2;
    glow = clamp(glow, 0.0, 1.0);
    glow = pow(glow, 1.5);
    
    // Edge fade for seamless blending
    float edgeFade = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x)
                   * smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
    
    float alpha = glow * edgeFade * 0.7;
    gl_FragColor = vec4(color * (0.6 + glow * 0.4), alpha);
  }
`

export function ShaderPlane({
  position,
  color1 = "#0284c7",
  color2 = "#0f172a",
  mouseRef,
}: {
  position: [number, number, number]
  color1?: string
  color2?: string
  mouseRef?: React.RefObject<{ x: number; y: number }>
}) {
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      intensity: { value: 1.0 },
      mouse: { value: new THREE.Vector2(0, 0) },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
    }),
    [color1, color2],
  )

  useFrame((state) => {
    if (mesh.current) {
      uniforms.time.value = state.clock.elapsedTime
      uniforms.intensity.value = 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      
      // Smoothly interpolate mouse position
      if (mouseRef?.current) {
        uniforms.mouse.value.lerp(
          new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
          0.05
        )
      }
    }
  })

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[5, 4, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
