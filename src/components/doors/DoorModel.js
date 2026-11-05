import * as THREE from 'three'

/**
 * DoorModel.js — HARISH 2007: Atelier Imagination
 * Photorealistic Architectural 3D Doors with Celestial Heavenly Reveal.
 * 
 * Five Monumental Architectural Doors:
 * 01 — ABOUT (/about)
 * 02 — ART GALLERY (/gallery)
 * 03 — PROJECTS (/projects) [CENTER DOOR — VIVID, PROMINENT & NEVER HIDDEN]
 * 04 — SKILLS (/skills)
 * 05 — CONTACT (/contact)
 */

export const DOORS_CONFIG = [
  {
    id: 'about',
    num: '01',
    title: 'ABOUT',
    subtitle: 'Biography & 4 Creative Pillars',
    route: '/about',
    xPos: -5.0,
    woodColor: 0x55664c, // Parisian Antique Celadon & Smoked Walnut
    frameColor: 0x1e261a, // Dark Forest Oak
    accentColor: 0xc5a059, // Warm Antique Gold
    sconceLightColor: 0xf5faee,
    portalLightColor: 0xfff6e6,
    icon: '👤',
  },
  {
    id: 'gallery',
    num: '02',
    title: 'ART GALLERY',
    subtitle: '7 Original Museum Artworks',
    route: '/gallery',
    xPos: -2.5,
    woodColor: 0x8d4a32, // Florentine Venetian Sienna & Ebonized Mahogany
    frameColor: 0x2e150c, // Rich Smoked Mahogany
    accentColor: 0xd4af37, // Florentine Gold Leaf
    sconceLightColor: 0xffeed4,
    portalLightColor: 0xffebd2,
    icon: '🎨',
  },
  {
    id: 'projects',
    num: '03',
    title: 'PROJECTS',
    subtitle: '3D WebGL Lab & 5 Interactive Rooms',
    route: '/projects',
    xPos: 0.0, // Center door - prominently visible & vivid
    woodColor: 0x426b5c, // Patinated Verdigris Bronze & Emerald
    frameColor: 0x162620, // Deep Bronze Verdigris
    accentColor: 0xd68352, // Warm Polished Copper
    sconceLightColor: 0xeffef5,
    portalLightColor: 0xe8fff2,
    icon: '⚡',
  },
  {
    id: 'skills',
    num: '04',
    title: 'SKILLS',
    subtitle: 'Six Master Disciplines & Particle Web',
    route: '/skills',
    xPos: 2.5,
    woodColor: 0x7e482b, // Aged Warm Chestnut & Burnt Umber
    frameColor: 0x24140b, // Aged Smoked Walnut
    accentColor: 0xc89958, // Sgraffito Warm Brass
    sconceLightColor: 0xfff0e4,
    portalLightColor: 0xfff3ea,
    icon: '✦',
  },
  {
    id: 'contact',
    num: '05',
    title: 'CONTACT',
    subtitle: 'Studio Inquiries & Direct Telephone',
    route: '/contact',
    xPos: 5.0,
    woodColor: 0x85745d, // Smoked Oak & Antique Parchment
    frameColor: 0x252018, // Smoked English Oak
    accentColor: 0xd8b268, // Polished Architectural Brass
    sconceLightColor: 0xfffaed,
    portalLightColor: 0xfffaec,
    icon: '✉️',
  },
]

// Texture caches
const woodTextureCache = new Map()
let cloudTextureCache = null

/**
 * Generates photorealistic wood grain color & micro-bump PBR maps via Canvas
 */
function getProceduralWoodPBR(hexColor) {
  if (woodTextureCache.has(hexColor)) {
    return woodTextureCache.get(hexColor)
  }

  const width = 512
  const height = 1024

  // 1. Color Map
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const r = (hexColor >> 16) & 255
  const g = (hexColor >> 8) & 255
  const b = hexColor & 255

  const grad = ctx.createLinearGradient(0, 0, width, 0)
  grad.addColorStop(0, `rgb(${Math.max(0, r - 16)}, ${Math.max(0, g - 16)}, ${Math.max(0, b - 16)})`)
  grad.addColorStop(0.5, `rgb(${r}, ${g}, ${b})`)
  grad.addColorStop(1, `rgb(${Math.max(0, r - 12)}, ${Math.max(0, g - 12)}, ${Math.max(0, b - 12)})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Natural continuous grain curves
  for (let i = 0; i < 480; i++) {
    const xBase = Math.random() * width
    const waveFreq = 0.008 + Math.random() * 0.015
    const waveAmp = 6 + Math.random() * 14
    const lineWidth = 0.8 + Math.random() * 2.2
    const alpha = 0.025 + Math.random() * 0.06
    const isDarker = Math.random() > 0.45

    ctx.beginPath()
    ctx.strokeStyle = isDarker
      ? `rgba(15, 12, 10, ${alpha})`
      : `rgba(255, 245, 230, ${alpha * 0.7})`
    ctx.lineWidth = lineWidth

    for (let y = 0; y <= height; y += 8) {
      const x = xBase + Math.sin(y * waveFreq) * waveAmp
      if (y === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Micro wood pores
  for (let j = 0; j < 120; j++) {
    const y = Math.random() * height
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
    ctx.fillRect(0, y, width, 1.2)
  }

  const colorTexture = new THREE.CanvasTexture(canvas)
  colorTexture.wrapS = THREE.RepeatWrapping
  colorTexture.wrapT = THREE.RepeatWrapping
  colorTexture.repeat.set(1, 1.5)

  // 2. Micro Bump Map
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = 256
  bumpCanvas.height = 512
  const bCtx = bumpCanvas.getContext('2d')
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, 256, 512)

  for (let k = 0; k < 200; k++) {
    const x = Math.random() * 256
    const w = 1 + Math.random() * 1.5
    const y = Math.random() * 512
    const h = 40 + Math.random() * 100
    bCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
    bCtx.fillRect(x, y, w, h)
  }

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas)
  bumpTexture.wrapS = THREE.RepeatWrapping
  bumpTexture.wrapT = THREE.RepeatWrapping
  bumpTexture.repeat.set(1, 2)

  const result = { colorTexture, bumpTexture }
  woodTextureCache.set(hexColor, result)
  return result
}

/**
 * Generates soft cumulus cloud texture for celestial portal
 */
function getProceduralCloudTexture() {
  if (cloudTextureCache) return cloudTextureCache

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 256)

  // Cloud puffs with highlights on top and soft warm shading below
  const puffs = [
    { x: 120, y: 160, r: 85 },
    { x: 200, y: 130, r: 105 },
    { x: 290, y: 120, r: 115 },
    { x: 380, y: 145, r: 95 },
    { x: 450, y: 175, r: 75 },
    { x: 60, y: 185, r: 65 },
    { x: 250, y: 170, r: 90 },
  ]

  puffs.forEach((p) => {
    const radial = ctx.createRadialGradient(p.x, p.y - p.r * 0.3, p.r * 0.1, p.x, p.y, p.r)
    radial.addColorStop(0, 'rgba(255, 252, 244, 0.95)')
    radial.addColorStop(0.45, 'rgba(253, 236, 210, 0.75)')
    radial.addColorStop(0.75, 'rgba(215, 195, 180, 0.45)')
    radial.addColorStop(1, 'rgba(200, 180, 170, 0)')
    ctx.fillStyle = radial
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  })

  cloudTextureCache = new THREE.CanvasTexture(canvas)
  return cloudTextureCache
}

let skyTextureCache = null
function getProceduralSkyTexture() {
  if (skyTextureCache) return skyTextureCache
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Vertical dawn sky gradient with warm sunrise glow at center-bottom
  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#2b4463') // Deep celestial twilight
  grad.addColorStop(0.35, '#4b6f96') // Morning blue
  grad.addColorStop(0.65, '#d98b58') // Warm dawn terracotta
  grad.addColorStop(0.85, '#f6c584') // Golden sunrise horizon
  grad.addColorStop(1, '#fff5db') // Radiant gold base
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  // Radial sun halo glow in the upper sky
  const radial = ctx.createRadialGradient(256, 170, 15, 256, 170, 260)
  radial.addColorStop(0, 'rgba(255, 255, 250, 0.95)')
  radial.addColorStop(0.35, 'rgba(255, 235, 180, 0.65)')
  radial.addColorStop(0.7, 'rgba(250, 190, 130, 0.25)')
  radial.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = radial
  ctx.fillRect(0, 0, 512, 512)

  skyTextureCache = new THREE.CanvasTexture(canvas)
  return skyTextureCache
}

/**
 * Inscribed museum plaque for frieze
 */
function createPlaqueTexture(doorNum, doorTitle) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#141815'
  ctx.fillRect(0, 0, 512, 128)

  ctx.strokeStyle = '#c5a059'
  ctx.lineWidth = 3
  ctx.strokeRect(8, 8, 496, 112)
  ctx.strokeStyle = '#8a6e38'
  ctx.lineWidth = 1.2
  ctx.strokeRect(14, 14, 484, 100)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 20px "Cinzel", "Playfair Display", serif'
  ctx.fillStyle = '#c5a059'
  ctx.fillText(`PORTAL ${doorNum}`, 256, 42)

  ctx.font = 'bold 36px "Cinzel", "Playfair Display", serif'
  ctx.fillStyle = '#fff4db'
  ctx.fillText(doorTitle, 256, 86)

  return new THREE.CanvasTexture(canvas)
}

export function createDoorModel(doorData, isDark = false) {
  const doorGroup = new THREE.Group()
  doorGroup.position.set(doorData.xPos, 0, -1.2)

  const { colorTexture, bumpTexture } = getProceduralWoodPBR(doorData.woodColor)
  const cloudTexture = getProceduralCloudTexture()

  const innerWidth = 1.62
  const innerHeight = 3.52
  const jambWidth = 0.20
  const architraveDepth = 0.42

  // ========================================================
  // 1. CLASSICAL ARCHITRAVE & ENTABLATURE (DOOR FRAME)
  // ========================================================
  const frameMat = new THREE.MeshStandardMaterial({
    color: doorData.frameColor,
    roughness: 0.52,
    metalness: 0.22,
  })

  // Left Jamb
  const leftJamb = new THREE.Mesh(
    new THREE.BoxGeometry(jambWidth, innerHeight + 0.36, architraveDepth),
    frameMat
  )
  leftJamb.position.set(-innerWidth / 2 - jambWidth / 2, 0.18, 0)
  leftJamb.castShadow = true
  leftJamb.receiveShadow = true
  doorGroup.add(leftJamb)

  // Left Stepped Casing
  const leftCasing = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, innerHeight + 0.36, architraveDepth + 0.05),
    frameMat
  )
  leftCasing.position.set(-innerWidth / 2 - jambWidth - 0.03, 0.18, 0.02)
  doorGroup.add(leftCasing)

  // Right Jamb
  const rightJamb = new THREE.Mesh(
    new THREE.BoxGeometry(jambWidth, innerHeight + 0.36, architraveDepth),
    frameMat
  )
  rightJamb.position.set(innerWidth / 2 + jambWidth / 2, 0.18, 0)
  rightJamb.castShadow = true
  rightJamb.receiveShadow = true
  doorGroup.add(rightJamb)

  // Right Stepped Casing
  const rightCasing = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, innerHeight + 0.36, architraveDepth + 0.05),
    frameMat
  )
  rightCasing.position.set(innerWidth / 2 + jambWidth + 0.03, 0.18, 0.02)
  doorGroup.add(rightCasing)

  // Classical Header Lintel (Frieze)
  const lintelWidth = innerWidth + jambWidth * 2 + 0.24
  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(lintelWidth, 0.32, architraveDepth + 0.08),
    frameMat
  )
  lintel.position.set(0, innerHeight / 2 + 0.34, 0.02)
  lintel.castShadow = true
  lintel.receiveShadow = true
  doorGroup.add(lintel)

  // Projecting Dentil Cornice Pediment
  const cornice = new THREE.Mesh(
    new THREE.BoxGeometry(lintelWidth + 0.18, 0.14, architraveDepth + 0.16),
    frameMat
  )
  cornice.position.set(0, innerHeight / 2 + 0.55, 0.06)
  cornice.castShadow = true
  doorGroup.add(cornice)

  // Granite/Marble Threshold Step
  const stepMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x222823 : 0xdfd7c8,
    roughness: 0.42,
    metalness: 0.25,
  })
  const step = new THREE.Mesh(
    new THREE.BoxGeometry(lintelWidth + 0.1, 0.16, architraveDepth + 0.36),
    stepMat
  )
  step.position.set(0, -innerHeight / 2 - 0.08, 0.12)
  step.receiveShadow = true
  doorGroup.add(step)

  // ========================================================
  // 2. DEDICATED TOP DOWNLIGHT SCONCE
  // ========================================================
  const sconceBrassMat = new THREE.MeshStandardMaterial({
    color: doorData.accentColor,
    roughness: 0.22,
    metalness: 0.88,
  })

  const sconceArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.22, 12),
    sconceBrassMat
  )
  sconceArm.rotateX(Math.PI / 2)
  sconceArm.position.set(0, innerHeight / 2 + 0.65, 0.22)
  doorGroup.add(sconceArm)

  const sconceShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.12, 16),
    sconceBrassMat
  )
  sconceShade.position.set(0, innerHeight / 2 + 0.63, 0.32)
  doorGroup.add(sconceShade)

  // Focused Downward Wash (no harsh hotspot)
  const sconceSpot = new THREE.SpotLight(
    doorData.sconceLightColor,
    isDark ? 3.6 : 2.6,
    6.0,
    Math.PI / 3.8,
    0.65
  )
  sconceSpot.position.set(0, innerHeight / 2 + 0.6, 0.35)
  sconceSpot.target.position.set(0, -0.4, 0.08)
  doorGroup.add(sconceSpot)
  doorGroup.add(sconceSpot.target)

  // ========================================================
  // 3. CELESTIAL HEAVENLY WORLD (BEHIND DOORWAY)
  // (Layered clouds, golden sunlight, volumetric rays, stardust)
  // ========================================================
  const portalChamber = new THREE.Group()
  portalChamber.position.set(0, 0.18, 0)
  doorGroup.add(portalChamber)

  // 3A. Warm Golden Architectural Corridor Tunnel (Inner Jamb Depth)
  const tunnelMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x222a24 : 0xf7ede0,
    roughness: 0.35,
    metalness: 0.18,
  })

  // Tunnel Left Wall
  const tunnelLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, innerHeight, 3.8),
    tunnelMat
  )
  tunnelLeft.position.set(-innerWidth / 2, 0, -1.9)
  portalChamber.add(tunnelLeft)

  // Tunnel Right Wall
  const tunnelRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, innerHeight, 3.8),
    tunnelMat
  )
  tunnelRight.position.set(innerWidth / 2, 0, -1.9)
  portalChamber.add(tunnelRight)

  // Tunnel Ceiling
  const tunnelCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(innerWidth, 0.04, 3.8),
    tunnelMat
  )
  tunnelCeiling.position.set(0, innerHeight / 2, -1.9)
  portalChamber.add(tunnelCeiling)

  // Tunnel Floor
  const tunnelFloorMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1b221d : 0xefe5d6,
    roughness: 0.3,
    metalness: 0.2,
  })
  const tunnelFloor = new THREE.Mesh(
    new THREE.BoxGeometry(innerWidth, 0.04, 3.8),
    tunnelFloorMat
  )
  tunnelFloor.position.set(0, -innerHeight / 2, -1.9)
  portalChamber.add(tunnelFloor)

  // 3B. Celestial Sky Backdrop (Dawn sunrise glow)
  const skyTexture = getProceduralSkyTexture()
  const skyMat = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.DoubleSide,
  })
  const skyPlane = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 2.4, innerHeight * 1.9), skyMat)
  skyPlane.position.set(0, 0.25, -3.7)
  portalChamber.add(skyPlane)

  // 3C. Golden Sun Core (Glowing celestial orb in upper half of doorway)
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xfffdf5,
  })
  const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(0.52, 32), sunMat)
  sunDisc.position.set(0, 0.72, -3.5)
  portalChamber.add(sunDisc)

  // Sun Corona Bloom Plane
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xffd896,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const sunCorona = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), coronaMat)
  sunCorona.position.set(0, 0.72, -3.4)
  portalChamber.add(sunCorona)

  // 3D. Layered Clouds (Distant Horizon + Floating Midground + Foreground Threshold)
  // Layer 1: Distant Horizon Clouds
  const cloudMat1 = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.NormalBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const cloudLayer1 = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 1.8, 1.6), cloudMat1)
  cloudLayer1.position.set(0, -0.32, -2.6)
  portalChamber.add(cloudLayer1)

  // Layer 2: Mid-ground Floating Cumulus
  const cloudMat2 = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.9,
    blending: THREE.NormalBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const cloudLayer2 = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 1.5, 1.4), cloudMat2)
  cloudLayer2.position.set(0.18, -0.65, -1.8)
  portalChamber.add(cloudLayer2)

  // Layer 3: Foreground Threshold Mist
  const cloudMat3 = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.NormalBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const cloudLayer3 = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 1.3, 1.1), cloudMat3)
  cloudLayer3.position.set(-0.15, -0.85, -1.1)
  portalChamber.add(cloudLayer3)

  // 3E. Volumetric Sunbeam Light Rays (Angled transparent additive planes)
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xffebd2,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const rayPlane1 = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 1.2, innerHeight * 1.1), rayMat)
  rayPlane1.rotation.z = 0.15
  rayPlane1.position.set(0, 0.45, -1.3)
  portalChamber.add(rayPlane1)

  const rayPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 1.1, innerHeight * 1.0), rayMat)
  rayPlane2.rotation.z = -0.18
  rayPlane2.position.set(0, 0.35, -1.6)
  portalChamber.add(rayPlane2)

  // 3F. Floating Golden Particles (Stardust) in the Heavenly Shaft
  const stardustCount = 64
  const stardustGeo = new THREE.BufferGeometry()
  const stardustPos = new Float32Array(stardustCount * 3)
  for (let s = 0; s < stardustCount * 3; s += 3) {
    stardustPos[s] = (Math.random() - 0.5) * innerWidth * 0.95
    stardustPos[s + 1] = (Math.random() - 0.5) * innerHeight * 0.85
    stardustPos[s + 2] = -0.2 - Math.random() * 3.2
  }
  stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPos, 3))
  const stardustMat = new THREE.PointsMaterial({
    color: 0xfff4d6,
    size: 0.055,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  })
  const stardust = new THREE.Points(stardustGeo, stardustMat)
  portalChamber.add(stardust)

  // Internal Portal Point Light
  const portalLight = new THREE.PointLight(doorData.portalLightColor, 1.8, 9.0)
  portalLight.position.set(0, 0.5, -1.4)
  portalChamber.add(portalLight)

  // Radiant Light Pool on Floor
  const poolMat = new THREE.MeshBasicMaterial({
    color: doorData.portalLightColor,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
  })
  const lightPool = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), poolMat)
  lightPool.rotateX(-Math.PI / 2)
  lightPool.position.set(0, -innerHeight / 2 - 0.07, 0.95)
  doorGroup.add(lightPool)

  // ========================================================
  // 4. ROTATING DOOR LEAF PIVOT (LEFT HINGED AT INNER JAMB)
  // ========================================================
  const pivotX = -innerWidth / 2 + 0.02
  const doorPivot = new THREE.Group()
  doorPivot.position.set(pivotX, 0.18, 0.08)
  doorGroup.add(doorPivot)

  const doorWidth = innerWidth - 0.04
  const doorHeight = innerHeight - 0.04
  const doorDepth = 0.12

  // Physical Door Leaf Base Slab
  const leafMat = new THREE.MeshStandardMaterial({
    color: doorData.woodColor,
    map: colorTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.015,
    roughness: 0.42,
    metalness: 0.15,
  })

  const doorLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth),
    leafMat
  )
  doorLeaf.position.set(doorWidth / 2, 0, 0)
  doorLeaf.castShadow = true
  doorLeaf.receiveShadow = true
  doorPivot.add(doorLeaf)

  // ========================================================
  // 5. FOUR DEEPLY BEVELED CLASSICAL ARCHITECTURAL PANELS
  // (Zero cartoon dots — pure architectural woodwork)
  // ========================================================
  const panelConfigs = [
    // Top Left
    { x: doorWidth * 0.29, y: 0.82, w: doorWidth * 0.38, h: 1.24 },
    // Top Right
    { x: doorWidth * 0.71, y: 0.82, w: doorWidth * 0.38, h: 1.24 },
    // Bottom Left
    { x: doorWidth * 0.29, y: -0.84, w: doorWidth * 0.38, h: 1.12 },
    // Bottom Right
    { x: doorWidth * 0.71, y: -0.84, w: doorWidth * 0.38, h: 1.12 },
  ]

  const bolectionMat = new THREE.MeshStandardMaterial({
    color: doorData.woodColor,
    map: colorTexture,
    roughness: 0.38,
    metalness: 0.18,
  })

  const recessMat = new THREE.MeshStandardMaterial({
    color: doorData.frameColor,
    roughness: 0.65,
    metalness: 0.12,
  })

  const fieldMat = new THREE.MeshStandardMaterial({
    color: doorData.woodColor,
    map: colorTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.012,
    roughness: 0.36,
    metalness: 0.2,
  })

  panelConfigs.forEach((p) => {
    // Bolection Rim
    const bolection = new THREE.Mesh(
      new THREE.BoxGeometry(p.w, p.h, 0.04),
      bolectionMat
    )
    bolection.position.set(p.x, p.y, doorDepth / 2 + 0.02)
    doorPivot.add(bolection)

    // Shadow Reveal
    const recess = new THREE.Mesh(
      new THREE.BoxGeometry(p.w - 0.09, p.h - 0.09, 0.016),
      recessMat
    )
    recess.position.set(p.x, p.y, doorDepth / 2 + 0.026)
    doorPivot.add(recess)

    // Center Field with Bevel
    const field = new THREE.Mesh(
      new THREE.BoxGeometry(p.w - 0.16, p.h - 0.16, 0.026),
      fieldMat
    )
    field.position.set(p.x, p.y, doorDepth / 2 + 0.036)
    doorPivot.add(field)
  })

  // ========================================================
  // 6. THREE FORGED MECHANICAL BRASS BUTT-HINGES (LEFT JAMB)
  // ========================================================
  const hingeMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    roughness: 0.22,
    metalness: 0.9,
  })

  const hingeX = -innerWidth / 2 + 0.015
  const hingeHeights = [1.25, 0.15, -1.15]

  hingeHeights.forEach((yHinge) => {
    // Barrel Knuckle
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.16, 16),
      hingeMat
    )
    barrel.position.set(hingeX, yHinge, 0.09)
    doorGroup.add(barrel)

    // Top Urn Finial
    const topFinial = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 12, 12),
      hingeMat
    )
    topFinial.position.set(hingeX, yHinge + 0.09, 0.09)
    doorGroup.add(topFinial)

    // Bottom Acorn Finial
    const botFinial = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 12, 12),
      hingeMat
    )
    botFinial.position.set(hingeX, yHinge - 0.09, 0.09)
    doorGroup.add(botFinial)

    // Mounting Plate
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.014, 0.12, 0.055),
      hingeMat
    )
    plate.position.set(hingeX - 0.01, yHinge, 0.08)
    doorGroup.add(plate)
  })

  // ========================================================
  // 7. ARCHITECTURAL DOOR HARDWARE (LEVER HANDLE & KEYHOLE)
  // ========================================================
  const handleGroup = new THREE.Group()
  handleGroup.position.set(doorWidth - 0.22, -0.06, doorDepth / 2 + 0.02)
  doorPivot.add(handleGroup)

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: doorData.accentColor,
    roughness: 0.2,
    metalness: 0.92,
  })

  // Escutcheon Backplate
  const backplate = new THREE.Mesh(
    new THREE.BoxGeometry(0.095, 0.44, 0.02),
    hardwareMat
  )
  handleGroup.add(backplate)

  // Spindle Rosette
  const rosette = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.026, 0.024, 16),
    hardwareMat
  )
  rosette.rotateX(Math.PI / 2)
  rosette.position.set(0, 0.08, 0.018)
  handleGroup.add(rosette)

  // Horizontal Lever Handle
  const leverShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.065, 12),
    hardwareMat
  )
  leverShaft.rotateX(Math.PI / 2)
  leverShaft.position.set(0, 0.08, 0.05)
  handleGroup.add(leverShaft)

  const leverArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.032, 0.034),
    hardwareMat
  )
  leverArm.position.set(-0.08, 0.08, 0.08)
  handleGroup.add(leverArm)

  // Antique Keyhole
  const keyholeBackMat = new THREE.MeshBasicMaterial({ color: 0x050505 })
  const keyholeTop = new THREE.Mesh(new THREE.CircleGeometry(0.016, 16), keyholeBackMat)
  keyholeTop.position.set(0, -0.09, 0.012)
  handleGroup.add(keyholeTop)

  const keyholeDrop = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 0.022), keyholeBackMat)
  keyholeDrop.position.set(0, -0.11, 0.012)
  handleGroup.add(keyholeDrop)

  // ========================================================
  // 8. OVERHEAD INSCRIBED BRONZE PLAQUE
  // ========================================================
  const plaqueTex = createPlaqueTexture(doorData.num, doorData.title)
  const plaqueMat = new THREE.MeshStandardMaterial({
    color: 0x141815,
    roughness: 0.38,
    metalness: 0.4,
  })
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(1.68, 0.32, 0.08),
    plaqueMat
  )
  plaque.position.set(0, innerHeight / 2 + 0.34, 0.22)
  plaque.castShadow = true
  doorGroup.add(plaque)

  const plaqueFaceMat = new THREE.MeshStandardMaterial({
    map: plaqueTex,
    roughness: 0.3,
    metalness: 0.65,
  })
  const plaqueFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.64, 0.30),
    plaqueFaceMat
  )
  plaqueFace.position.set(0, innerHeight / 2 + 0.34, 0.262)
  doorGroup.add(plaqueFace)

  const plaqueRimMat = new THREE.MeshStandardMaterial({
    color: doorData.accentColor,
    roughness: 0.24,
    metalness: 0.88,
  })
  const plaqueRim = new THREE.Mesh(
    new THREE.BoxGeometry(1.74, 0.38, 0.03),
    plaqueRimMat
  )
  plaqueRim.position.set(0, innerHeight / 2 + 0.34, 0.19)
  doorGroup.add(plaqueRim)

  // ========================================================
  // 9. LARGE INVISIBLE RAYCAST HIT BOX (100% RELIABLE CLICKS)
  // ========================================================
  const hitBoxMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(innerWidth + 0.4, innerHeight + 0.6, 1.2),
    hitBoxMat
  )
  hitBox.position.set(0, 0.18, 0.25)
  doorGroup.add(hitBox)

  // Attach metadata
  hitBox.userData = {
    isDoorHitBox: true,
    doorData,
    doorGroup,
    doorPivot,
    portalChamber,
    godRays: rayPlane1,
    cloudLayer1,
    cloudLayer2,
    sunCorona,
    stardust,
    portalLight,
    lightPool,
    sconceSpot,
    leafMat,
  }

  return {
    doorGroup,
    doorPivot,
    hitBox,
    portalChamber,
    godRays: rayPlane1,
    cloudLayer1,
    cloudLayer2,
    sunCorona,
    stardust,
    portalLight,
    lightPool,
    sconceSpot,
    doorData,
  }
}
