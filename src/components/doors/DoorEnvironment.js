import * as THREE from 'three'

/**
 * DoorEnvironment.js — HARISH 2007: Atelier Imagination
 * Grand Ivory Marble Hall & Architectural Colonnade.
 * 
 * Features:
 * - Polished Italian Carrara ivory marble floor with organic veining & specular reflections
 * - Classical architectural salon wall with continuous dentil cornice & wainscoting
 * - Fluted classical pilasters flanking and framing all 5 doors
 * - Natural golden-white sunlight with soft PCF contact shadows
 * - Dedicated center-stage spotlight on Door 03 (Projects)
 * - Calibrated contrast for Light Mode (warm ivory #EDE5D8) and Dark Mode (deep forest charcoal #171C18)
 */

let marbleTextureCache = null

function getProceduralMarbleTexture(isDark = false) {
  const cacheKey = isDark ? 'dark_marble' : 'light_marble'
  if (marbleTextureCache && marbleTextureCache.has(cacheKey)) {
    return marbleTextureCache.get(cacheKey)
  }
  if (!marbleTextureCache) marbleTextureCache = new Map()

  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  // Base stone tone
  ctx.fillStyle = isDark ? '#161c17' : '#ede5d8'
  ctx.fillRect(0, 0, 1024, 1024)

  // Soft secondary stone tone
  ctx.fillStyle = isDark ? 'rgba(28, 36, 29, 0.6)' : 'rgba(245, 240, 231, 0.7)'
  for (let b = 0; b < 12; b++) {
    ctx.beginPath()
    ctx.arc(Math.random() * 1024, Math.random() * 1024, 150 + Math.random() * 250, 0, Math.PI * 2)
    ctx.fill()
  }

  // Organic Carrara marble veins (spline-like smooth wandering lines)
  const veinCount = isDark ? 28 : 36
  for (let i = 0; i < veinCount; i++) {
    let x = Math.random() * 1024
    let y = Math.random() * 1024
    ctx.beginPath()
    ctx.moveTo(x, y)

    const alpha = isDark ? (0.04 + Math.random() * 0.08) : (0.03 + Math.random() * 0.06)
    ctx.strokeStyle = isDark ? `rgba(200, 215, 195, ${alpha})` : `rgba(145, 135, 120, ${alpha})`
    ctx.lineWidth = 1 + Math.random() * 3

    for (let s = 0; s < 18; s++) {
      x += (Math.random() - 0.48) * 80
      y += (Math.random() - 0.48) * 80
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 2)
  marbleTextureCache.set(cacheKey, texture)
  return texture
}

export function setupDoorEnvironment(scene, isDark = false) {
  const envGroup = new THREE.Group()
  scene.add(envGroup)

  const marbleTexture = getProceduralMarbleTexture(isDark)

  // ========================================================
  // 1. GRAND ARCHITECTURAL LIGHTING
  // ========================================================
  // Natural Ambient Gallery Fill
  const ambientLight = new THREE.AmbientLight(
    isDark ? 0x2e382e : 0xfff9ef,
    isDark ? 1.5 : 1.8
  )
  envGroup.add(ambientLight)

  // Natural Sunlight Streaming In (Directional Key Light)
  const sunlight = new THREE.DirectionalLight(0xfff7ec, isDark ? 2.8 : 3.2)
  sunlight.position.set(2, 12, 10)
  sunlight.castShadow = true
  sunlight.shadow.mapSize.width = 1024
  sunlight.shadow.mapSize.height = 1024
  sunlight.shadow.camera.near = 0.5
  sunlight.shadow.camera.far = 30
  sunlight.shadow.camera.left = -9
  sunlight.shadow.camera.right = 9
  sunlight.shadow.camera.top = 6
  sunlight.shadow.camera.bottom = -4
  sunlight.shadow.bias = -0.0005
  envGroup.add(sunlight)

  // Dedicated Center Stage Spotlight (ensures Door 03 Projects is prominently illuminated)
  const centerSpot = new THREE.SpotLight(
    isDark ? 0xeffff5 : 0xfffaea,
    isDark ? 3.2 : 2.6,
    18,
    Math.PI / 4,
    0.35
  )
  centerSpot.position.set(0, 8, 7)
  centerSpot.target.position.set(0, 0.2, -1.2)
  envGroup.add(centerSpot)
  envGroup.add(centerSpot.target)

  // Warm Side Rim Lights (Dark mode edge separation)
  const leftRimLight = new THREE.DirectionalLight(0xffecd4, isDark ? 1.3 : 0.8)
  leftRimLight.position.set(-12, 6, 4)
  envGroup.add(leftRimLight)

  const rightRimLight = new THREE.DirectionalLight(0xffecd4, isDark ? 1.3 : 0.8)
  rightRimLight.position.set(12, 6, 4)
  envGroup.add(rightRimLight)

  // ========================================================
  // 2. GRAND POLISHED CARRARA MARBLE FLOOR
  // ========================================================
  const floorGeo = new THREE.PlaneGeometry(42, 22)
  floorGeo.rotateX(-Math.PI / 2)
  const floorMat = new THREE.MeshStandardMaterial({
    map: marbleTexture,
    color: isDark ? 0x161c17 : 0xede5d8,
    roughness: 0.28,
    metalness: 0.18,
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.position.y = -1.68
  floor.receiveShadow = true
  envGroup.add(floor)

  // ========================================================
  // 3. ARCHITECTURAL SALON WALL & FLUTED PILASTERS
  // (Frames the colonnade with open apertures for the 5 doors)
  // ========================================================
  const wallMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x171c18 : 0xf4eee4,
    roughness: 0.72,
  })

  const baseboardMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x121713 : 0xded5c5,
    roughness: 0.48,
    metalness: 0.15,
  })

  // 3A. Continuous Upper Wall (Above Doorway Lintels from y=1.9 to y=7.0)
  const upperWall = new THREE.Mesh(
    new THREE.BoxGeometry(42, 5.2, 0.22),
    wallMat
  )
  upperWall.position.set(0, 4.4, -1.35)
  upperWall.receiveShadow = true
  envGroup.add(upperWall)

  // Upper Classical Frieze Dentil Molding
  const upperFrieze = new THREE.Mesh(
    new THREE.BoxGeometry(42, 0.35, 0.28),
    baseboardMat
  )
  upperFrieze.position.set(0, 4.6, -1.25)
  envGroup.add(upperFrieze)

  // 3B. Wall Pillars Between Doors & Outer Flanks (Leaves Door Openings Open!)
  // Door centers at: -5.0, -2.5, 0.0, 2.5, 5.0 (Door openings are ~1.5 wide)
  const intermediateWallConfigs = [
    // Far Left Flank (x: -21 to -6.0)
    { x: -13.5, w: 15.0 },
    // Pillar Between Door 01 and Door 02 (behind pilaster at -3.75)
    { x: -3.75, w: 0.8 },
    // Pillar Between Door 02 and Door 03 (behind pilaster at -1.25)
    { x: -1.25, w: 0.8 },
    // Pillar Between Door 03 and Door 04 (behind pilaster at 1.25)
    { x: 1.25, w: 0.8 },
    // Pillar Between Door 04 and Door 05 (behind pilaster at 3.75)
    { x: 3.75, w: 0.8 },
    // Far Right Flank (x: 6.0 to 21)
    { x: 13.5, w: 15.0 },
  ]

  intermediateWallConfigs.forEach((cfg) => {
    // Wall Section
    const wallSec = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, 3.6, 0.22),
      wallMat
    )
    wallSec.position.set(cfg.x, 0.12, -1.35)
    wallSec.receiveShadow = true
    envGroup.add(wallSec)

    // Baseboard Section (Only on wall, never crossing doorway threshold!)
    const bbSec = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, 0.45, 0.25),
      baseboardMat
    )
    bbSec.position.set(cfg.x, -1.45, -1.28)
    bbSec.receiveShadow = true
    envGroup.add(bbSec)
  })

  // Classical Pilasters (Columns) Between & Flanking the 5 Doors
  // Doors are at -5.0, -2.5, 0.0, +2.5, +5.0
  const pilasterPositions = [-6.4, -3.75, -1.25, 1.25, 3.75, 6.4]
  const pilasterMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x222922 : 0xeae2d4,
    roughness: 0.52,
    metalness: 0.15,
  })

  pilasterPositions.forEach((xPos) => {
    // Column Shaft
    const pilaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 6.2, 0.16),
      pilasterMat
    )
    pilaster.position.set(xPos, 1.6, -1.18)
    pilaster.receiveShadow = true
    pilaster.castShadow = true
    envGroup.add(pilaster)

    // Capital (Top Molding)
    const capital = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.2, 0.22),
      pilasterMat
    )
    capital.position.set(xPos, 4.6, -1.15)
    envGroup.add(capital)

    // Base Plinth
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.35, 0.22),
      pilasterMat
    )
    plinth.position.set(xPos, -1.4, -1.15)
    envGroup.add(plinth)
  })

  // ========================================================
  // 4. AIRBORNE FLOATING STUDIO DUST MOTES
  // ========================================================
  const moteCount = 60
  const moteGeo = new THREE.BufferGeometry()
  const motePositions = new Float32Array(moteCount * 3)
  for (let i = 0; i < moteCount * 3; i += 3) {
    motePositions[i] = (Math.random() - 0.5) * 22
    motePositions[i + 1] = Math.random() * 6 - 1.4
    motePositions[i + 2] = (Math.random() - 0.5) * 8 + 3
  }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3))
  const moteMat = new THREE.PointsMaterial({
    color: 0xffebd2,
    size: 0.048,
    transparent: true,
    opacity: isDark ? 0.45 : 0.65,
    blending: THREE.AdditiveBlending,
  })
  const motes = new THREE.Points(moteGeo, moteMat)
  envGroup.add(motes)

  return {
    envGroup,
    ambientLight,
    sunlight,
    floor,
    upperWall,
    motes,
  }
}
