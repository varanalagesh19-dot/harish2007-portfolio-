import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

// Subtle route targets for camera position (small calm range -0.3 to +0.3)
const ROUTE_TARGETS = {
  '/': { targetX: 0, targetY: 0, targetZ: 7.0 },
  '/about': { targetX: -0.28, targetY: 0.12, targetZ: 7.0 },
  '/gallery': { targetX: 0.28, targetY: -0.12, targetZ: 7.0 },
  '/projects': { targetX: -0.2, targetY: -0.18, targetZ: 7.0 },
  '/skills': { targetX: 0.2, targetY: 0.16, targetZ: 7.0 },
  '/contact': { targetX: 0, targetY: -0.2, targetZ: 7.0 },
}

export default function Ambient3DBackground() {
  const containerRef = useRef(null)
  const location = useLocation()
  const { theme, focusMode } = useTheme()

  const currentTargetRef = useRef(ROUTE_TARGETS[location.pathname] || { targetX: 0, targetY: 0, targetZ: 7.0 })
  const isDedicated3DPageRef = useRef(
    location.pathname.startsWith('/projects/') && location.pathname !== '/projects'
  )
  const isExplorePageRef = useRef(location.pathname === '/explore')
  const focusModeRef = useRef(focusMode)

  // Material and palette refs
  const pointsMatRef = useRef(null)
  const linesMatRef = useRef(null)

  // Mouse & Click Interaction state refs
  const mousePosRef = useRef({ x: 0, y: 0, active: false })
  const clickPulseRef = useRef({ active: false, x: 0, y: 0, startTime: 0 })

  // Route updates
  useEffect(() => {
    isDedicated3DPageRef.current =
      location.pathname.startsWith('/projects/') && location.pathname !== '/projects'
    isExplorePageRef.current = location.pathname === '/explore'
    currentTargetRef.current =
      ROUTE_TARGETS[location.pathname] || { targetX: 0, targetY: 0, targetZ: 7.0 }
  }, [location.pathname])

  // Focus Mode ref sync
  useEffect(() => {
    focusModeRef.current = focusMode
  }, [focusMode])

  // Reactive theme color switching without scene rebuild
  useEffect(() => {
    const isDark = theme === 'dark'
    if (pointsMatRef.current) {
      pointsMatRef.current.color.set(isDark ? '#91A17E' : '#68745B')
      pointsMatRef.current.opacity = isDark ? 0.35 : 0.24
    }
    if (linesMatRef.current) {
      linesMatRef.current.color.set(isDark ? '#C17A59' : '#A65F43')
      linesMatRef.current.opacity = isDark ? 0.18 : 0.12
    }
  }, [theme])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Scene & Camera Setup (Mounted once at top level)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    )
    camera.position.set(0, 0, 7.0)

    // 2. High-performance Capped WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const isDark = theme === 'dark'

    // 3. Constellation Particles Setup (~240 particles for 60fps performance)
    const particleCount = 240
    const areaWidth = 18
    const areaHeight = 12
    const areaDepth = 4.5

    const particlesData = []
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * areaWidth
      const y = (Math.random() - 0.5) * areaHeight
      const z = (Math.random() - 0.5) * areaDepth

      particlePositions[i * 3] = x
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = z

      particlesData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.003
        ),
        originalX: x,
        originalY: y,
        originalZ: z,
      })
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const pointsMat = new THREE.PointsMaterial({
      color: isDark ? '#91A17E' : '#68745B',
      size: 0.05,
      transparent: true,
      opacity: isDark ? 0.35 : 0.24,
      blending: THREE.NormalBlending,
    })
    pointsMatRef.current = pointsMat

    const particleSystem = new THREE.Points(particleGeo, pointsMat)
    scene.add(particleSystem)

    // 4. Fine Spider-Web Constellation Lines Setup
    const maxLines = 450
    const linePositions = new Float32Array(maxLines * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const linesMat = new THREE.LineBasicMaterial({
      color: isDark ? '#C17A59' : '#A65F43',
      transparent: true,
      opacity: isDark ? 0.18 : 0.12,
      blending: THREE.NormalBlending,
    })
    linesMatRef.current = linesMat

    const lineMesh = new THREE.LineSegments(lineGeo, linesMat)
    scene.add(lineMesh)

    // 5. Mouse & Click Event Listeners
    const handlePointerMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * areaWidth
      const mouseY = -(e.clientY / window.innerHeight - 0.5) * areaHeight
      mousePosRef.current = { x: mouseX, y: mouseY, active: true }
    }

    const handlePointerDown = (e) => {
      const clickX = (e.clientX / window.innerWidth - 0.5) * areaWidth
      const clickY = -(e.clientY / window.innerHeight - 0.5) * areaHeight
      clickPulseRef.current = {
        active: true,
        x: clickX,
        y: clickY,
        startTime: performance.now(),
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })

    // 6. 60fps Animation Loop with Silk-Smooth Damping
    let animationFrameId
    const connectionDist = 1.7
    const connectionDistSq = connectionDist * connectionDist

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Pause during Explore page (CinematicPortalDoors active), dedicated 3D project detail routes, or Focus Mode
      if (isExplorePageRef.current || isDedicated3DPageRef.current || focusModeRef.current || document.hidden) {
        return
      }

      // Smooth Exponential Lerp Camera Transition (0.025 damping, ~1.2s velvety glide)
      const target = currentTargetRef.current
      camera.position.x += (target.targetX - camera.position.x) * 0.025
      camera.position.y += (target.targetY - camera.position.y) * 0.025
      camera.position.z += (target.targetZ - camera.position.z) * 0.025

      const positions = particleGeo.attributes.position.array
      const linePos = lineGeo.attributes.position.array
      let lineIndex = 0

      // Mouse position vector
      const mouse = mousePosRef.current
      const pulse = clickPulseRef.current
      const now = performance.now()
      const pulseElapsed = now - pulse.startTime
      const isPulsing = pulse.active && pulseElapsed < 800
      const pulseProgress = isPulsing ? pulseElapsed / 800 : 1.0
      const pulseRadius = pulseProgress * 9.0

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const data = particlesData[i]

        // Natural gentle drift
        positions[i3] += data.velocity.x
        positions[i3 + 1] += data.velocity.y
        positions[i3 + 2] += data.velocity.z

        // Bounds wrapping
        if (positions[i3] < -areaWidth / 2) positions[i3] = areaWidth / 2
        if (positions[i3] > areaWidth / 2) positions[i3] = -areaWidth / 2
        if (positions[i3 + 1] < -areaHeight / 2) positions[i3 + 1] = areaHeight / 2
        if (positions[i3 + 1] > areaHeight / 2) positions[i3 + 1] = -areaHeight / 2

        // Mouse attraction with 0.03 smooth lerp damping
        if (mouse.active) {
          const dx = mouse.x - positions[i3]
          const dy = mouse.y - positions[i3 + 1]
          const distSq = dx * dx + dy * dy

          if (distSq < 16 && distSq > 0.01) {
            const force = (1 - Math.sqrt(distSq) / 4) * 0.018
            positions[i3] += dx * force
            positions[i3 + 1] += dy * force
          }
        }

        // Kinetic ripple pulse on click
        if (isPulsing) {
          const pdx = positions[i3] - pulse.x
          const pdy = positions[i3 + 1] - pulse.y
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy)
          const ringDist = Math.abs(pdist - pulseRadius)

          if (ringDist < 1.4 && pdist > 0.1) {
            const push = (1 - ringDist / 1.4) * (1 - pulseProgress) * 0.04
            positions[i3] += (pdx / pdist) * push
            positions[i3 + 1] += (pdy / pdist) * push
          }
        }
      }

      // Calculate constellation line connections
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3
          const dx = positions[i3] - positions[j3]
          const dy = positions[i3 + 1] - positions[j3 + 1]
          const dz = positions[i3 + 2] - positions[j3 + 2]
          const distSq = dx * dx + dy * dy + dz * dz

          if (distSq < connectionDistSq && lineIndex < maxLines * 6) {
            linePos[lineIndex++] = positions[i3]
            linePos[lineIndex++] = positions[i3 + 1]
            linePos[lineIndex++] = positions[i3 + 2]

            linePos[lineIndex++] = positions[j3]
            linePos[lineIndex++] = positions[j3 + 1]
            linePos[lineIndex++] = positions[j3 + 2]
          }
        }
      }

      // Clear remaining line coordinates
      for (let k = lineIndex; k < maxLines * 6; k++) {
        linePos[k] = 0
      }

      particleGeo.attributes.position.needsUpdate = true
      lineGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // 7. Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    }
    window.addEventListener('resize', handleResize)

    // 8. Clean Unmount Disposal
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      particleGeo.dispose()
      pointsMat.dispose()
      lineGeo.dispose()
      linesMat.dispose()
      renderer.dispose()
    }
  }, [])

  const isDedicated3DPage =
    location.pathname.startsWith('/projects/') && location.pathname !== '/projects'
  const isExplorePage = location.pathname === '/explore'

  return (
    <div
      ref={containerRef}
      className="ambient-3d-bg"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: (isDedicated3DPage || focusMode || isExplorePage) ? 0 : 1,
        display: (focusMode || isExplorePage) ? 'none' : 'block',
        transition: 'opacity 0.6s ease',
      }}
      aria-hidden="true"
    />
  )
}
