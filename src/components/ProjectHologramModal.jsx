import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { usePortalTransition } from '../context/PortalTransitionContext'
import soundEngine from '../utils/soundEngine'
import './ProjectHologramModal.css'

export default function ProjectHologramModal({ project, onClose }) {
  const canvasRef = useRef(null)
  const [wireframeMode, setWireframeMode] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const { triggerPortalNavigation } = usePortalTransition()

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        soundEngine.playHoverTick()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Three.js Hologram Scene
  useEffect(() => {
    if (!project || !canvasRef.current) return

    const container = canvasRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50)
    camera.position.set(0, 1.2, 5.2)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2)
    dirLight.position.set(4, 6, 5)
    scene.add(dirLight)

    const accentLight = new THREE.PointLight(
      project.accent === 'terracotta' ? 0xd98a66 : 0xa8ba92,
      2,
      10
    )
    accentLight.position.set(-3, 2, 2)
    scene.add(accentLight)

    // 4. Hologram Model Group
    const holoGroup = new THREE.Group()
    scene.add(holoGroup)

    const primaryColor = project.accent === 'terracotta' ? 0x8c472b : 0x3d4734
    const glowColor = project.accent === 'terracotta' ? 0xd98a66 : 0xa8ba92

    let animCallback = () => {}

    // Distinct 3D Miniature Model per Project
    if (project.id === 'ner-access') {
      // 3D Topographic Terrain & Beacon
      const planeGeo = new THREE.PlaneGeometry(4.2, 4.2, 28, 28)
      planeGeo.rotateX(-Math.PI / 2.6)

      const pos = planeGeo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i)
        const v = pos.getY(i)
        const heightVal = Math.sin(u * 1.5) * Math.cos(v * 1.5) * 0.45 + Math.sin(u * 3) * 0.15
        pos.setZ(i, heightVal)
      }
      planeGeo.computeVertexNormals()

      const terrainMat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        wireframe: true,
        roughness: 0.3,
        metalness: 0.6,
      })
      const terrain = new THREE.Mesh(planeGeo, terrainMat)
      holoGroup.add(terrain)

      // Waypoint beacon
      const beaconGeo = new THREE.SphereGeometry(0.16, 16, 16)
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x55cc77 })
      const beacon = new THREE.Mesh(beaconGeo, beaconMat)
      beacon.position.set(0, 0.65, 0)
      holoGroup.add(beacon)

      // Beacon pulse ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.28, 24)
      ringGeo.rotateX(-Math.PI / 2)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x55cc77,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.set(0, 0.3, 0)
      holoGroup.add(ring)

      animCallback = (t) => {
        ring.scale.setScalar(1 + Math.sin(t * 4) * 0.4)
        ringMat.opacity = 0.5 + Math.sin(t * 4) * 0.4
      }

    } else if (project.id === 'linkedx') {
      // 3D Sentiment Core & Orbiting Nodes
      const coreGeo = new THREE.IcosahedronGeometry(1.3, 1)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xd98a66,
        wireframe: true,
        metalness: 0.8,
        roughness: 0.2,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      holoGroup.add(core)

      // Orbiting sentiment cards
      const orbitGroup = new THREE.Group()
      holoGroup.add(orbitGroup)
      const chipGeo = new THREE.BoxGeometry(0.45, 0.3, 0.05)
      const chipMat = new THREE.MeshStandardMaterial({ color: 0x8c472b, roughness: 0.4 })

      const chips = []
      for (let i = 0; i < 4; i++) {
        const chip = new THREE.Mesh(chipGeo, chipMat)
        const angle = (i / 4) * Math.PI * 2
        chip.position.set(Math.cos(angle) * 2.1, (i % 2 - 0.5) * 0.6, Math.sin(angle) * 2.1)
        orbitGroup.add(chip)
        chips.push(chip)
      }

      animCallback = (t) => {
        orbitGroup.rotation.y = t * 0.8
        core.rotation.x = t * 0.4
        core.rotation.z = t * 0.3
      }

    } else if (project.id === 'intellipdf') {
      // Stacked Translucent Hologram Documents & Laser Beam
      const pageGeo = new THREE.PlaneGeometry(1.8, 2.6)
      const pageMat = new THREE.MeshStandardMaterial({
        color: 0x486581,
        wireframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      })

      const pages = []
      for (let i = 0; i < 3; i++) {
        const page = new THREE.Mesh(pageGeo, pageMat)
        page.position.set((i - 1) * 0.35, 0, (i - 1) * 0.4)
        page.rotation.y = (i - 1) * 0.2
        holoGroup.add(page)
        pages.push(page)
      }

      // Laser scan beam
      const laserGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 16)
      laserGeo.rotateZ(Math.PI / 2)
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x38ef7d })
      const laser = new THREE.Mesh(laserGeo, laserMat)
      holoGroup.add(laser)

      animCallback = (t) => {
        laser.position.y = Math.sin(t * 3) * 1.1
      }

    } else if (project.id === 'solvex-ner') {
      // Polyhedral Logic Constellation
      const dodecaGeo = new THREE.DodecahedronGeometry(1.5, 0)
      const dodecaMat = new THREE.MeshStandardMaterial({
        color: 0x3d4734,
        wireframe: true,
        metalness: 0.7,
        roughness: 0.2,
      })
      const poly = new THREE.Mesh(dodecaGeo, dodecaMat)
      holoGroup.add(poly)

      // Inner wireframe icosahedron
      const innerGeo = new THREE.IcosahedronGeometry(0.9, 0)
      const innerMat = new THREE.MeshBasicMaterial({ color: 0x8c472b, wireframe: true })
      const inner = new THREE.Mesh(innerGeo, innerMat)
      holoGroup.add(inner)

      animCallback = (t) => {
        poly.rotation.x = t * 0.5
        poly.rotation.y = t * 0.7
        inner.rotation.x = -t * 0.6
        inner.rotation.y = -t * 0.4
      }

    } else {
      // AtlasCore: Neural Sphere & Orbital Memory Rings
      const sphereGeo = new THREE.SphereGeometry(1.3, 20, 20)
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x3d4734,
        wireframe: true,
        roughness: 0.3,
      })
      const sphere = new THREE.Mesh(sphereGeo, sphereMat)
      holoGroup.add(sphere)

      const ring1Geo = new THREE.RingGeometry(1.8, 1.86, 36)
      ring1Geo.rotateX(Math.PI / 3)
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xd98a66, side: THREE.DoubleSide })
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
      holoGroup.add(ring1)

      const ring2Geo = new THREE.RingGeometry(2.1, 2.15, 36)
      ring2Geo.rotateY(Math.PI / 4)
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x55cc77, side: THREE.DoubleSide })
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
      holoGroup.add(ring2)

      animCallback = (t) => {
        ring1.rotation.z = t * 0.8
        ring2.rotation.x = -t * 0.6
        sphere.rotation.y = t * 0.3
      }
    }

    // 5. Interactive Mouse Orbit Controls
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }

    const handlePointerDown = (e) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const handlePointerMove = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y
      holoGroup.rotation.y += deltaX * 0.015
      holoGroup.rotation.x += deltaY * 0.015
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    container.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    // 6. Animation Loop
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      if (autoRotate && !isDragging) {
        holoGroup.rotation.y += 0.008
      }

      animCallback(elapsedTime)
      renderer.render(scene, camera)
    }

    animate()

    // 7. Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [project, autoRotate])

  if (!project) return null

  return (
    <AnimatePresence>
      <div className="hologram-modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="hologram-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="hologram-header">
            <div>
              <span className="hologram-eyebrow">
                ✦ 3D Hologram Telemetry • {project.category}
              </span>
              <h2 className="hologram-title">{project.title}</h2>
              <p className="hologram-sub">{project.subtitle} • {project.year}</p>
            </div>

            <button
              type="button"
              className="hologram-close-btn"
              onClick={() => {
                soundEngine.playHoverTick()
                onClose()
              }}
              aria-label="Close 3D Hologram Preview"
            >
              ✕
            </button>
          </div>

          {/* Interactive 3D Hologram Viewport */}
          <div className="hologram-viewport-wrap">
            <div ref={canvasRef} className="hologram-canvas-container" />

            {/* Radar & HUD Overlay */}
            <div className="hologram-radar-grid" />
            
            <div className="hologram-hud-status">
              <span className="hud-pill">FPS: 60</span>
              <span className="hud-pill">DRAG TO ROTATE 360°</span>
              <span className="hud-pill hud-pill--active">HOLO_LINK: ACTIVE</span>
            </div>

            {/* Viewport Control Bar */}
            <div className="hologram-controls-bar">
              <button
                type="button"
                className={`holo-ctrl-btn ${autoRotate ? 'holo-ctrl-btn--active' : ''}`}
                onClick={() => {
                  soundEngine.playHoverTick()
                  setAutoRotate(!autoRotate)
                }}
              >
                <span>{autoRotate ? '⏸ Pause Spin' : '▶ Auto Orbit'}</span>
              </button>
              <span className="holo-hint">
                Interactive Three.js Wireframe Architecture
              </span>
            </div>
          </div>

          {/* Metadata & Actions */}
          <div className="hologram-body">
            <p className="hologram-desc">{project.description}</p>

            <div className="hologram-tags">
              {project.tags.map((t, i) => (
                <span key={i} className="holo-tag">{t}</span>
              ))}
            </div>

            <div className="hologram-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  soundEngine.playHoverTick()
                  onClose()
                }}
              >
                <span>Close Popup</span>
              </button>

              <button
                type="button"
                className="btn-sage hologram-launch-btn"
                onClick={() => {
                  soundEngine.playPortalInteract()
                  onClose()
                  triggerPortalNavigation(project.path)
                }}
              >
                <span>Launch Dedicated 3D Experience Room</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

