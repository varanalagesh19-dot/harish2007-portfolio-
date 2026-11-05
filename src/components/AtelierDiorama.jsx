import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'
import soundEngine from '../utils/soundEngine'
import './AtelierDiorama.css'

export default function AtelierDiorama() {
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { theme } = useTheme()

  const [hoveredObject, setHoveredObject] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [isNavigating, setIsNavigating] = useState(false)

  // Navigate with smooth camera push & sound
  const handleObjectClick = useCallback((route) => {
    if (isNavigating) return
    setIsNavigating(true)
    soundEngine.playPortalInteract()
    soundEngine.playPageTurn()
    setTimeout(() => {
      navigate(route)
    }, 450)
  }, [isNavigating, navigate])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // 1. Scene & Isometric Perspective Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    
    // Default Isometric Camera Angle
    const defaultCamPos = new THREE.Vector3(8.5, 7.2, 8.5)
    const targetCamLook = new THREE.Vector3(0, 1.3, 0)
    camera.position.copy(defaultCamPos)
    camera.lookAt(targetCamLook)

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 3. Lighting System
    const isDark = theme === 'dark'
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x222a24 : 0xfcf6ed,
      isDark ? 0.9 : 1.3
    )
    scene.add(ambientLight)

    // Warm Sunbeam Light coming through the window (-6, 7, -3)
    const sunLight = new THREE.DirectionalLight(
      isDark ? 0xa8ba92 : 0xffeed5,
      isDark ? 1.4 : 2.2
    )
    sunLight.position.set(-7, 8, -4)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    scene.add(sunLight)

    // Studio Interior Accent Point Light
    const lampLight = new THREE.PointLight(
      isDark ? 0xd98a66 : 0xe67e22,
      isDark ? 1.2 : 1.6,
      12
    )
    lampLight.position.set(1.5, 3.2, 1.5)
    scene.add(lampLight)

    // 4. Room Geometry: Isometric Cutaway Studio
    const roomGroup = new THREE.Group()
    scene.add(roomGroup)

    // Floor Base (Parquet / Terracotta Tile)
    const floorGeo = new THREE.BoxGeometry(8, 0.3, 8)
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1b231c : 0xd6cbb9,
      roughness: 0.6,
      metalness: 0.1,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.position.y = -0.15
    floor.receiveShadow = true
    roomGroup.add(floor)

    // Back Left Wall (with Window cutout)
    const wallMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x222b24 : 0xeae2d5,
      roughness: 0.8,
    })
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5, 8), wallMat)
    leftWall.position.set(-4.12, 2.35, 0)
    leftWall.receiveShadow = true
    roomGroup.add(leftWall)

    // Back Right Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.25), wallMat)
    backWall.position.set(0, 2.35, -4.12)
    backWall.receiveShadow = true
    roomGroup.add(backWall)

    // Baseboards
    const trimMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x141a15 : 0xa65f43 })
    const trim1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 8), trimMat)
    trim1.position.set(-3.95, 0.1, 0)
    const trim2 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 0.3), trimMat)
    trim2.position.set(0, 0.1, -3.95)
    roomGroup.add(trim1, trim2)

    // Studio Woven Rug
    const rugGeo = new THREE.PlaneGeometry(4.2, 3.2)
    rugGeo.rotateX(-Math.PI / 2)
    const rugMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x2b382d : 0xc7b9a5,
      roughness: 0.9,
    })
    const rug = new THREE.Mesh(rugGeo, rugMat)
    rug.position.set(0.2, 0.01, 0.4)
    rug.receiveShadow = true
    roomGroup.add(rug)

    // Clickable Interactive Objects Array
    const interactiveMeshes = []

    // ==========================================
    // OBJECT 1: 3D MINI EASEL -> /gallery
    // ==========================================
    const easelGroup = new THREE.Group()
    easelGroup.position.set(1.8, 0, 0.6)
    easelGroup.rotation.y = -Math.PI / 5
    roomGroup.add(easelGroup)

    const woodMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x5a3e2b : 0x825336,
      roughness: 0.6
    })

    // Easel Tripod Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.05, 3.2, 8)
    const legLeft = new THREE.Mesh(legGeo, woodMat)
    legLeft.position.set(-0.55, 1.5, -0.15)
    legLeft.rotation.z = -0.15
    const legRight = new THREE.Mesh(legGeo, woodMat)
    legRight.position.set(0.55, 1.5, -0.15)
    legRight.rotation.z = 0.15
    const legBack = new THREE.Mesh(legGeo, woodMat)
    legBack.position.set(0, 1.5, -0.65)
    legBack.rotation.x = -0.32

    // Mast & Shelf
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.4, 0.08), woodMat)
    mast.position.set(0, 1.6, -0.1)
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.22), woodMat)
    shelf.position.set(0, 1.25, 0.02)

    // Canvas Board with Realistic Painting Texture
    const canvasGeo = new THREE.BoxGeometry(1.6, 2.1, 0.06)
    const canvasMat = new THREE.MeshStandardMaterial({
      color: 0xf4eee4,
      roughness: 0.4,
    })
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat)
    canvasMesh.position.set(0, 2.15, 0.05)
    canvasMesh.rotation.x = -0.06
    canvasMesh.castShadow = true

    // Artwork Brushwork Swatches on Canvas
    const paintStrokeGeo = new THREE.PlaneGeometry(1.4, 1.8)
    const paintStrokeMat = new THREE.MeshStandardMaterial({
      color: 0x8c472b,
      roughness: 0.3,
      metalness: 0.2
    })
    const paintMesh = new THREE.Mesh(paintStrokeGeo, paintStrokeMat)
    paintMesh.position.set(0, 0, 0.035)
    canvasMesh.add(paintMesh)

    // Painter's Palette on Shelf
    const palGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 16)
    const palMat = new THREE.MeshStandardMaterial({ color: 0x7c4f34 })
    const palette = new THREE.Mesh(palGeo, palMat)
    palette.position.set(0.5, 1.3, 0.12)

    easelGroup.add(legLeft, legRight, legBack, mast, shelf, canvasMesh, palette)

    // Register Clickable
    canvasMesh.userData = {
      id: 'easel',
      name: 'Original Artworks Easel',
      action: 'Enter Art Gallery',
      route: '/gallery',
      icon: '🎨',
      group: easelGroup
    }
    interactiveMeshes.push(canvasMesh)

    // ==========================================
    // OBJECT 2: 3D MINI WORKSTATION & LAPTOP -> /projects
    // ==========================================
    const deskGroup = new THREE.Group()
    deskGroup.position.set(-1.8, 0, -2.1)
    roomGroup.add(deskGroup)

    const deskTableMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x222a23 : 0x4a3b32,
      roughness: 0.5
    })
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.4), deskTableMat)
    deskTop.position.set(0, 1.25, 0)
    deskTop.castShadow = true

    // Metal Desk Legs
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 })
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25), metalMat)
    leg1.position.set(-1.15, 0.625, 0.55)
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25), metalMat)
    leg2.position.set(1.15, 0.625, 0.55)
    const leg3 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25), metalMat)
    leg3.position.set(-1.15, 0.625, -0.55)
    const leg4 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25), metalMat)
    leg4.position.set(1.15, 0.625, -0.55)
    deskGroup.add(deskTop, leg1, leg2, leg3, leg4)

    // Laptop Base & Glowing Screen
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.03, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 })
    )
    laptopBase.position.set(0, 1.32, 0.1)

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.55, 0.02),
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x55cc77 : 0x38ef7d,
        emissive: isDark ? 0x228844 : 0x1a7035,
        emissiveIntensity: 0.8
      })
    )
    laptopScreen.position.set(0, 1.58, -0.15)
    laptopScreen.rotation.x = -0.18
    deskGroup.add(laptopBase, laptopScreen)

    // 3D Holographic Floating Projection over Laptop
    const holoCubeGeo = new THREE.OctahedronGeometry(0.2, 0)
    const holoCubeMat = new THREE.MeshBasicMaterial({
      color: 0x38ef7d,
      wireframe: true
    })
    const holoCube = new THREE.Mesh(holoCubeGeo, holoCubeMat)
    holoCube.position.set(0, 2.05, -0.1)
    deskGroup.add(holoCube)

    // Register Clickable
    laptopScreen.userData = {
      id: 'laptop',
      name: 'Interactive 3D Workstation',
      action: 'Launch 3D Projects',
      route: '/projects',
      icon: '💻',
      group: deskGroup
    }
    interactiveMeshes.push(laptopScreen)

    // ==========================================
    // OBJECT 3: 3D STUDIO HORIZON WINDOW -> /about
    // ==========================================
    const windowGroup = new THREE.Group()
    windowGroup.position.set(-4.0, 2.4, 0.4)
    roomGroup.add(windowGroup)

    // Window Outer Frame
    const winFrameMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x181e18 : 0x8c472b })
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.6, 2.2), winFrameMat)
    
    // Glowing Sky Glass Pane
    const winGlassMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x2b4238 : 0xfffaea,
      emissive: isDark ? 0x1b2d24 : 0xfff0c4,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    })
    const winGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 2.0), winGlassMat)
    winGlass.position.x = 0.05
    windowGroup.add(winFrame, winGlass)

    // Window Cross Dividers
    const divH = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 2.0), winFrameMat)
    divH.position.x = 0.08
    const divV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.06), winFrameMat)
    divV.position.x = 0.08
    windowGroup.add(divH, divV)

    // Register Clickable
    winGlass.userData = {
      id: 'window',
      name: 'Studio Horizon Window',
      action: 'Explore Harish\'s Bio & Pillars',
      route: '/about',
      icon: '🪟',
      group: windowGroup
    }
    interactiveMeshes.push(winGlass)

    // ==========================================
    // OBJECT 4: 3D DRAFTING TABLE -> /skills
    // ==========================================
    const draftGroup = new THREE.Group()
    draftGroup.position.set(-1.4, 0, 2.1)
    draftGroup.rotation.y = Math.PI / 4
    roomGroup.add(draftGroup)

    // Angled Drafting Board
    const draftBoardGeo = new THREE.BoxGeometry(2.1, 0.08, 1.4)
    const draftBoardMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x2c352d : 0xf2ebdc,
      roughness: 0.5
    })
    const draftBoard = new THREE.Mesh(draftBoardGeo, draftBoardMat)
    draftBoard.position.set(0, 1.45, 0)
    draftBoard.rotation.x = -0.32
    draftBoard.castShadow = true

    // Trestle Base
    const trestleMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x1c211d : 0x5a3e2b })
    const tr1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.35, 1.2), trestleMat)
    tr1.position.set(-0.85, 0.675, 0)
    const tr2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.35, 1.2), trestleMat)
    tr2.position.set(0.85, 0.675, 0)
    draftGroup.add(draftBoard, tr1, tr2)

    // Drafting Architectural Sheet & T-Square
    const sheetGeo = new THREE.PlaneGeometry(1.6, 1.0)
    sheetGeo.rotateX(-Math.PI / 2)
    const sheetMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    const sheet = new THREE.Mesh(sheetGeo, sheetMat)
    sheet.position.set(0, 1.5, 0)
    sheet.rotation.x = -0.32
    draftGroup.add(sheet)

    // Ink Pot
    const inkPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.09, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0x0a0b09, roughness: 0.2 })
    )
    inkPot.position.set(0.8, 1.5, -0.3)
    draftGroup.add(inkPot)

    // Register Clickable
    draftBoard.userData = {
      id: 'drafting',
      name: 'Classical & Digital Drafting Board',
      action: 'Master Studio Disciplines',
      route: '/skills',
      icon: '📐',
      group: draftGroup
    }
    interactiveMeshes.push(draftBoard)

    // ==========================================
    // FLOATING AMBIENT DUST MOTES
    // ==========================================
    const moteCount = 70
    const moteGeo = new THREE.BufferGeometry()
    const motePos = new Float32Array(moteCount * 3)
    for (let i = 0; i < moteCount * 3; i += 3) {
      motePos[i] = (Math.random() - 0.5) * 6
      motePos[i + 1] = Math.random() * 3.5 + 0.3
      motePos[i + 2] = (Math.random() - 0.5) * 6
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3))
    const moteMat = new THREE.PointsMaterial({
      color: isDark ? 0xa8ba92 : 0x8c472b,
      size: 0.05,
      transparent: true,
      opacity: 0.55
    })
    const motes = new THREE.Points(moteGeo, moteMat)
    roomGroup.add(motes)

    // ==========================================
    // MOUSE DRAG ORBIT & RAYCASTING
    // ==========================================
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }
    let targetRotationY = 0
    let targetRotationX = 0

    const handlePointerDown = (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('.diorama-hud')) return
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x
        const deltaY = e.clientY - prevMousePos.y
        targetRotationY += deltaX * 0.008
        targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX + deltaY * 0.005))
        prevMousePos = { x: e.clientX, y: e.clientY }
      }

      // Raycast to check hover
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(interactiveMeshes)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        container.style.cursor = 'pointer'
        setHoveredObject(hit.userData)
        setTooltipPos({ x: e.clientX, y: e.clientY })
      } else {
        container.style.cursor = isDragging ? 'grabbing' : 'default'
        setHoveredObject(null)
      }
    }

    const handlePointerUp = (e) => {
      if (!isDragging) return
      isDragging = false

      // Check if this was a click rather than a drag
      const rect = container.getBoundingClientRect()
      const clickDist = Math.hypot(e.clientX - prevMousePos.x, e.clientY - prevMousePos.y)
      if (clickDist < 5) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(interactiveMeshes)
        if (intersects.length > 0) {
          const hit = intersects[0].object
          handleObjectClick(hit.userData.route)
        }
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()
      const zoomFactor = e.deltaY * 0.005
      camera.fov = Math.max(24, Math.min(52, camera.fov + zoomFactor))
      camera.updateProjectionMatrix()
    }

    container.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('wheel', handleWheel, { passive: false })

    // 6. Animation Loop (60 FPS with Damped Physics)
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Damped room rotation
      roomGroup.rotation.y += (targetRotationY - roomGroup.rotation.y) * 0.06
      roomGroup.rotation.x += (targetRotationX - roomGroup.rotation.x) * 0.06

      // Float holographic cube
      holoCube.rotation.x = elapsed * 1.2
      holoCube.rotation.y = elapsed * 1.5
      holoCube.position.y = 2.05 + Math.sin(elapsed * 2.5) * 0.06

      // Gentle dust particle float
      const pos = motes.geometry.attributes.position.array
      for (let i = 1; i < moteCount * 3; i += 3) {
        pos[i] += Math.sin(elapsed + i) * 0.002
      }
      motes.geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    }
    window.addEventListener('resize', handleResize)

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('wheel', handleWheel)

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [theme, handleObjectClick])

  return (
    <div className="diorama-viewport-container" ref={containerRef}>
      {/* Diorama HUD Header & Overline */}
      <div className="diorama-hud diorama-hud--top">
        <div className="diorama-badge-row">
          <span className="diorama-live-pill">
            <span className="live-dot" />
            3D ISOMETRIC ATELIER DIORAMA
          </span>
          <span className="diorama-sub-badge">TAMIL NADU • 60 FPS WEBGL</span>
        </div>

        <h1 className="diorama-monument-title">HARISH S</h1>
        <p className="diorama-taglines">
          <span>Where <em>Imagination</em> Becomes Reality.</span>
          <span className="tagline-dot">•</span>
          <span>An Artist's Mind. A Creator's Universe.</span>
        </p>

        {/* Orbit hint instruction */}
        <div className="diorama-hint-pill">
          <span>✦ Drag to Orbit 360° • Scroll to Zoom • Click 3D Objects to Enter Rooms</span>
        </div>
      </div>

      {/* Floating 3D Hover Tooltip */}
      {hoveredObject && (
        <div
          className="diorama-hover-tooltip"
          style={{
            left: `${tooltipPos.x + 16}px`,
            top: `${tooltipPos.y - 20}px`,
          }}
        >
          <span className="tooltip-icon">{hoveredObject.icon}</span>
          <div>
            <span className="tooltip-title">{hoveredObject.name}</span>
            <span className="tooltip-cta">Click: {hoveredObject.action} →</span>
          </div>
        </div>
      )}

      {/* Diorama Teleport Dock */}
      <div className="diorama-hud diorama-hud--bottom">
        <div className="diorama-dock">
          <button
            type="button"
            className="diorama-dock-btn"
            onClick={() => handleObjectClick('/gallery')}
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <span className="dock-icon">🎨</span>
            <span className="dock-label">Mini Easel</span>
            <span className="dock-arrow">→ Art Gallery</span>
          </button>

          <button
            type="button"
            className="diorama-dock-btn"
            onClick={() => handleObjectClick('/projects')}
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <span className="dock-icon">💻</span>
            <span className="dock-label">Workstation</span>
            <span className="dock-arrow">→ 3D Projects</span>
          </button>

          <button
            type="button"
            className="diorama-dock-btn"
            onClick={() => handleObjectClick('/skills')}
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <span className="dock-icon">📐</span>
            <span className="dock-label">Drafting Desk</span>
            <span className="dock-arrow">→ Master Skills</span>
          </button>

          <button
            type="button"
            className="diorama-dock-btn"
            onClick={() => handleObjectClick('/about')}
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <span className="dock-icon">🪟</span>
            <span className="dock-label">Studio Window</span>
            <span className="dock-arrow">→ About Bio</span>
          </button>

          <button
            type="button"
            className="diorama-dock-btn diorama-dock-btn--cta"
            onClick={() => handleObjectClick('/contact')}
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <span className="dock-icon">✉️</span>
            <span className="dock-label">Studio Inquiries</span>
            <span className="dock-arrow">→ Contact</span>
          </button>
        </div>
      </div>
    </div>
  )
}

