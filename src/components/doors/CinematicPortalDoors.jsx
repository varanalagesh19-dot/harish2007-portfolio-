import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'
import { usePortalTransition } from '../../context/PortalTransitionContext'
import soundEngine from '../../utils/soundEngine'
import { DOORS_CONFIG, createDoorModel } from './DoorModel'
import { setupDoorEnvironment } from './DoorEnvironment'
import { DoorInteractionController } from './DoorInteraction'
import './CinematicPortalDoors.css'

export default function CinematicPortalDoors() {
  const wrapperRef = useRef(null)
  const mountRef = useRef(null)
  const location = useLocation()
  const { theme } = useTheme()
  const {
    setTransitionState,
    setPortalLightOpacity,
    complete3DDoorTransition,
    triggerPortalNavigation,
    isNavigating,
    setIsNavigating,
  } = usePortalTransition()

  const [activeHoverDoor, setActiveHoverDoor] = useState(null)
  const controllerRef = useRef(null)

  // Direct Teleport Pill Click
  const handleDockSelect = useCallback(
    (door) => {
      if (isNavigating) return

      // Find the door in the 3D scene and trigger its cinematic opening
      const doorItem = controllerRef.current?.doors.find((d) => d.doorData.id === door.id)
      if (doorItem) {
        controllerRef.current.onDoorClick(doorItem)
      } else {
        triggerPortalNavigation(door.route)
      }
    },
    [isNavigating, triggerPortalNavigation]
  )

  useEffect(() => {
    const wrapper = wrapperRef.current
    const mountEl = mountRef.current
    if (!wrapper || !mountEl) return

    // Expose portal opacity setter to GSAP
    window.__setPortalOpacity = setPortalLightOpacity

    const width = mountEl.clientWidth || window.innerWidth
    const height = mountEl.clientHeight || window.innerHeight

    // 1. Scene & Camera Setup (Calibrated for 5-Door Grand Salon Colonnade)
    const scene = new THREE.Scene()
    const isMobile = width < 768
    const fov = isMobile ? 58 : 44
    const initZ = isMobile ? 12.0 : 9.8
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100)
    camera.position.set(0, 1.35, initZ)

    // 2. High-Performance Three.js WebGL Renderer
    const isDark = theme === 'dark'
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = isDark ? 1.25 : 1.1
    mountEl.appendChild(renderer.domElement)

    // 3. Cinematic Architectural Colonnade Environment & Lighting
    const env = setupDoorEnvironment(scene, isDark)
    const moteParticles = env.motes

    // 4. Build the 5 Realistic Architectural Doors
    const doorsList = []
    const hitBoxes = []

    DOORS_CONFIG.forEach((cfg) => {
      const doorItem = createDoorModel(cfg, isDark)
      scene.add(doorItem.doorGroup)
      doorsList.push(doorItem)
      hitBoxes.push(doorItem.hitBox)
    })

    // 5. Interaction Controller Setup
    const controller = new DoorInteractionController({
      camera,
      doors: doorsList,
      setTransitionState,
      setPortalLightOpacity,
      complete3DDoorTransition,
      setIsNavigating,
    })
    controllerRef.current = controller

    // 6. Raycasting & Mouse Parallax Tracking
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-999, -999)
    let hoveredHitBox = null
    let targetCameraPanX = 0

    const updateMouseCoords = (clientX, clientY) => {
      const rect = wrapper.getBoundingClientRect()
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1
    }

    const handlePointerMove = (e) => {
      if (controller.isLocked) return

      updateMouseCoords(e.clientX, e.clientY)

      // Subtle parallax camera pan across the colonnade
      targetCameraPanX = mouse.x * 1.4

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(hitBoxes)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        if (hoveredHitBox !== hit) {
          if (hoveredHitBox) {
            const prevDoor = doorsList.find((d) => d.hitBox === hoveredHitBox)
            if (prevDoor) controller.onDoorHover(prevDoor, false)
          }

          hoveredHitBox = hit
          const currentDoor = doorsList.find((d) => d.hitBox === hit)
          if (currentDoor) {
            controller.onDoorHover(currentDoor, true)
            setActiveHoverDoor(currentDoor.doorData)
          }
        }
        wrapper.style.cursor = 'pointer'
      } else {
        if (hoveredHitBox) {
          const prevDoor = doorsList.find((d) => d.hitBox === hoveredHitBox)
          if (prevDoor) controller.onDoorHover(prevDoor, false)
          hoveredHitBox = null
          setActiveHoverDoor(null)
        }
        wrapper.style.cursor = 'default'
      }
    }

    const handleClick = (e) => {
      if (controller.isLocked) return
      // If clicked inside the dock pills, let dock handler execute
      if (e.target.closest('.portal-dock-shelf')) return

      updateMouseCoords(e.clientX, e.clientY)
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(hitBoxes)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        const clickedDoor = doorsList.find((d) => d.hitBox === hit)
        if (clickedDoor) {
          controller.onDoorClick(clickedDoor)
        }
      }
    }

    wrapper.addEventListener('pointermove', handlePointerMove, { passive: true })
    wrapper.addEventListener('click', handleClick)

    // 7. Silk-Smooth 60 FPS Render Loop
    let animId
    const clock = new THREE.Clock()

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop)
      const elapsed = clock.getElapsedTime()

      // When camera approach is idle, apply smooth natural parallax
      if (!controller.isLocked) {
        camera.position.x += (targetCameraPanX - camera.position.x) * 0.035
        camera.lookAt(
          controller.cameraLookTarget.x + targetCameraPanX * 0.25,
          controller.cameraLookTarget.y,
          controller.cameraLookTarget.z
        )
      } else {
        // While fly-through is executing, GSAP controls position and lookAt target exclusively
        camera.lookAt(
          controller.cameraLookTarget.x,
          controller.cameraLookTarget.y,
          controller.cameraLookTarget.z
        )
      }

      // Gentle floating dust particles motion
      if (moteParticles?.geometry?.attributes?.position) {
        const positions = moteParticles.geometry.attributes.position.array
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += Math.sin(elapsed + i) * 0.0012
        }
        moteParticles.geometry.attributes.position.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    renderLoop()

    // 8. Dynamic Window Resize Handler
    const handleResize = () => {
      if (!mountEl) return
      const w = mountEl.clientWidth
      const h = mountEl.clientHeight
      const mobile = w < 768
      camera.aspect = w / h
      camera.fov = mobile ? 58 : 44
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    }
    window.addEventListener('resize', handleResize)

    // 9. Clean Unmount Disposal
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      wrapper.removeEventListener('pointermove', handlePointerMove)
      wrapper.removeEventListener('click', handleClick)
      window.__setPortalOpacity = null

      controller.dispose()

      if (mountEl && renderer.domElement) {
        mountEl.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [theme, setTransitionState, setPortalLightOpacity, complete3DDoorTransition])

  return (
    <div className={`portal-doors-wrapper ${isNavigating ? 'portal-doors-wrapper--navigating' : ''}`} ref={wrapperRef}>
      {/* Three.js Canvas Mount */}
      <div className="portal-canvas-mount" ref={mountRef} />

      {/* 2D UI Overlay (Top Plaque Header & Bottom Teleport Dock) */}
      <div className="portal-doors-ui">
        {/* Top Architectural Header */}
        <div className="portal-top-header">
          <div className="portal-overline-row">
            <span className="portal-live-badge">
              <span className="portal-pulse-dot" />
              CINEMATIC 3D PORTAL NAVIGATION
            </span>
            <span className="portal-instruction-cue">
              ✦ CLICK ANY 3D DOOR TO ENTER PORTAL
            </span>
          </div>

          <h1 className="portal-monument-title">THE FIVE ATELIER PORTALS</h1>
          <p className="portal-monument-sub">
            Physically modeled architectural doors connecting the classical draftsmanship, museum artworks, and interactive 3D digital labs of Harish S.
          </p>

          {/* Dynamic Door Status Indicator */}
          <div className="portal-hover-indicator">
            {activeHoverDoor ? (
              <span className="indicator-active">
                {activeHoverDoor.icon} Door {activeHoverDoor.num}:{' '}
                <strong>{activeHoverDoor.title}</strong> — {activeHoverDoor.subtitle}{' '}
                <em>(Click to Open)</em>
              </span>
            ) : (
              <span className="indicator-idle">
                Glide cursor over any 3D door to inspect destination
              </span>
            )}
          </div>
        </div>

        {/* Bottom Accessible Dock Shelf */}
        <div className="portal-bottom-dock">
          <div className="portal-dock-shelf">
            {DOORS_CONFIG.map((door) => {
              const isHovered = activeHoverDoor?.id === door.id
              const isCurrent = location.pathname === door.route

              return (
                <button
                  key={door.id}
                  type="button"
                  className={`portal-dock-pill ${isCurrent ? 'portal-dock-pill--current' : ''} ${isHovered ? 'portal-dock-pill--active' : ''}`}
                  onClick={() => handleDockSelect(door)}
                  onMouseEnter={() => {
                    soundEngine.playHoverTick()
                    setActiveHoverDoor(door)
                  }}
                  onMouseLeave={() => setActiveHoverDoor(null)}
                  title={`Enter Door ${door.num}: ${door.title}`}
                >
                  <span className="dock-pill-num">{door.num}</span>
                  <span className="dock-pill-icon">{door.icon}</span>
                  <div className="dock-pill-text">
                    <span className="dock-pill-title">{door.title}</span>
                    <span className="dock-pill-route">{door.route}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
