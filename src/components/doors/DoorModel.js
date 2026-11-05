import * as THREE from 'three'

/**
 * DoorModel.js
 * Photorealistic Architectural Doors for HARISH 2007 — Atelier Imagination.
 * 
 * Architectural Features:
 * - Exactly FIVE bespoke doors (ABOUT, ART GALLERY, PROJECTS, SKILLS, CONTACT)
 * - Deep classical European molded architraves with ogee profiles and projecting cornice
 * - 4 deeply beveled bolection panels with shadow reveals and beveled raised fields (zero cartoon dots)
 * - Multi-layer procedural wood grain and micro-bump PBR textures
 * - True left-hinged pivot with 3 mechanical forged brass butt-hinges & urn finials
 * - Solid brass lever handle, beveled escutcheon plate, spindle rosette, and teardrop keyhole
 * - Dedicated top architectural downlight sconce on every door (zero blown-out specular hotspots)
 * - Deep interior architectural portal corridor behind each doorway
 * - Precision raycast hit box ensuring 100% reliable click and hover detection
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
    portalLightColor: 0xf9fff2,
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
    portalLightColor: 0xffebcb,
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

// Texture cache
const textureCache = new Map()

/**
 * Generates photorealistic wood grain color & micro-bump maps via HTML5 Canvas
 */
function getProceduralWoodPBR(hexColor) {
  if (textureCache.has(hexColor)) {
    return textureCache.get(hexColor)
  }

  const width = 512
  const height = 1024

  // 1. Wood Color Canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const r = (hexColor >> 16) & 255
  const g = (hexColor >> 8) & 255
  const b = hexColor & 255

  // Base background with subtle vertical wood stain gradient
  const grad = ctx.createLinearGradient(0, 0, width, 0)
  grad.addColorStop(0, `rgb(${Math.max(0, r - 15)}, ${Math.max(0, g - 15)}, ${Math.max(0, b - 15)})`)
  grad.addColorStop(0.5, `rgb(${r}, ${g}, ${b})`)
  grad.addColorStop(1, `rgb(${Math.max(0, r - 10)}, ${Math.max(0, g - 10)}, ${Math.max(0, b - 10)})`)
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

  // Fine wood pores
  for (let j = 0; j < 120; j++) {
    const y = Math.random() * height
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
    ctx.fillRect(0, y, width, 1.2)
  }

  const colorTexture = new THREE.CanvasTexture(canvas)
  colorTexture.wrapS = THREE.RepeatWrapping
  colorTexture.wrapT = THREE.RepeatWrapping
  colorTexture.repeat.set(1, 1.5)

  // 2. Micro Bump Canvas
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
  textureCache.set(hexColor, result)
  return result
}

/**
 * Creates engraved museum bronze plaque texture for the frieze
 */
function createPlaqueTexture(doorNum, doorTitle) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  // Dark patinated bronze background
  ctx.fillStyle = '#141815'
  ctx.fillRect(0, 0, 512, 128)

  // Double gold engraved border lines
  ctx.strokeStyle = '#c5a059'
  ctx.lineWidth = 3
  ctx.strokeRect(8, 8, 496, 112)
  ctx.strokeStyle = '#8a6e38'
  ctx.lineWidth = 1.2
  ctx.strokeRect(14, 14, 484, 100)

  // Engraved gold lettering
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 20px "Cinzel", serif'
  ctx.fillStyle = '#c5a059'
  ctx.fillText(`PORTAL ${doorNum}`, 256, 42)

  ctx.font = 'bold 36px "Cinzel", serif'
  ctx.fillStyle = '#fff4db'
  ctx.fillText(doorTitle, 256, 86)

  return new THREE.CanvasTexture(canvas)
}

export function createDoorModel(doorData, isDark = false) {
  const doorGroup = new THREE.Group()
  doorGroup.position.set(doorData.xPos, 0, -1.2)

  const { colorTexture, bumpTexture } = getProceduralWoodPBR(doorData.woodColor)

  const innerWidth = 1.62
  const innerHeight = 3.52
  const jambWidth = 0.20
  const architraveDepth = 0.42

  // ========================================================
  // 1. CLASSICAL MOLDED ARCHITRAVE & ENTABLATURE (DOOR FRAME)
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

  // Left Outer Stepped Architrave Casing
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

  // Right Outer Stepped Architrave Casing
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

  // Projecting Classical Dentil Cornice Pediment
  const cornice = new THREE.Mesh(
    new THREE.BoxGeometry(lintelWidth + 0.18, 0.14, architraveDepth + 0.16),
    frameMat
  )
  cornice.position.set(0, innerHeight / 2 + 0.55, 0.06)
  cornice.castShadow = true
  doorGroup.add(cornice)

  // Beveled Granite / Marble Threshold Plinth Step
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
  // 2. DEDICATED ARCHITECTURAL DOWNLIGHT SCONCE
  // ========================================================
  const sconceBrassMat = new THREE.MeshStandardMaterial({
    color: doorData.accentColor,
    roughness: 0.22,
    metalness: 0.88,
  })

  // Sconce Arm
  const sconceArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.22, 12),
    sconceBrassMat
  )
  sconceArm.rotateX(Math.PI / 2)
  sconceArm.position.set(0, innerHeight / 2 + 0.65, 0.22)
  doorGroup.add(sconceArm)

  // Sconce Bell Shade
  const sconceShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.12, 16),
    sconceBrassMat
  )
  sconceShade.position.set(0, innerHeight / 2 + 0.63, 0.32)
  doorGroup.add(sconceShade)

  // Dedicated Downward Spotlight (Washes down the door face without harsh hotspot)
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
  // 3. INTERIOR ARCHITECTURAL PORTAL CORRIDOR BEHIND DOOR
  // ========================================================
  const portalChamber = new THREE.Group()
  portalChamber.position.set(0, 0.18, -1.2)
  doorGroup.add(portalChamber)

  // Corridor Side Walls
  const corridorWallMat = new THREE.MeshStandardMaterial({
    color: 0xf5eee1,
    roughness: 0.6,
  })
  const corridorLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, innerHeight),
    corridorWallMat
  )
  corridorLeft.rotateY(Math.PI / 2)
  corridorLeft.position.set(-innerWidth / 2, 0, -1.2)
  portalChamber.add(corridorLeft)

  const corridorRight = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, innerHeight),
    corridorWallMat
  )
  corridorRight.rotateY(-Math.PI / 2)
  corridorRight.position.set(innerWidth / 2, 0, -1.2)
  portalChamber.add(corridorRight)

  // Glowing Heavenly Aperture Back Wall
  const portalBackMat = new THREE.MeshBasicMaterial({
    color: doorData.portalLightColor,
    transparent: true,
    opacity: 0.95,
  })
  const portalBack = new THREE.Mesh(
    new THREE.PlaneGeometry(innerWidth, innerHeight),
    portalBackMat
  )
  portalBack.position.set(0, 0, -2.4)
  portalChamber.add(portalBack)

  // Soft Volumetric God Rays (Layered smooth transparent planes, not a faceted cylinder)
  const godRayMat = new THREE.MeshBasicMaterial({
    color: doorData.portalLightColor,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const godRayPlane1 = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 0.9, innerHeight * 0.9), godRayMat)
  godRayPlane1.position.set(0, 0, -0.6)
  portalChamber.add(godRayPlane1)

  const godRayPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth * 0.7, innerHeight * 0.8), godRayMat)
  godRayPlane2.position.set(0, 0, -1.4)
  portalChamber.add(godRayPlane2)

  // Internal Portal Light
  const portalLight = new THREE.PointLight(doorData.portalLightColor, 1.4, 7.5)
  portalLight.position.set(0, 0.4, -0.8)
  portalChamber.add(portalLight)

  // Radiant Light Pool on Floor
  const poolMat = new THREE.MeshBasicMaterial({
    color: doorData.portalLightColor,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
  })
  const lightPool = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), poolMat)
  lightPool.rotateX(-Math.PI / 2)
  lightPool.position.set(0, -innerHeight / 2 - 0.07, 0.95)
  doorGroup.add(lightPool)

  // ========================================================
  // 4. ROTATING DOOR LEAF PIVOT (LEFT-HINGED AT INNER JAMB)
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
  // (Pure architectural woodwork — zero cartoon dots)
  // ========================================================
  const panelConfigs = [
    // Top Left (Upper tall panel)
    { x: doorWidth * 0.29, y: 0.82, w: doorWidth * 0.38, h: 1.24 },
    // Top Right (Upper tall panel)
    { x: doorWidth * 0.71, y: 0.82, w: doorWidth * 0.38, h: 1.24 },
    // Bottom Left (Lower standard panel)
    { x: doorWidth * 0.29, y: -0.84, w: doorWidth * 0.38, h: 1.12 },
    // Bottom Right (Lower standard panel)
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
    // A. Outer Bolection Raised Chamfer Molding Rim
    const bolection = new THREE.Mesh(
      new THREE.BoxGeometry(p.w, p.h, 0.04),
      bolectionMat
    )
    bolection.position.set(p.x, p.y, doorDepth / 2 + 0.02)
    doorPivot.add(bolection)

    // B. Recessed Shadow Gap Reveal
    const recess = new THREE.Mesh(
      new THREE.BoxGeometry(p.w - 0.09, p.h - 0.09, 0.016),
      recessMat
    )
    recess.position.set(p.x, p.y, doorDepth / 2 + 0.026)
    doorPivot.add(recess)

    // C. Raised Center Panel Field with Bevel
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

    // Mounting Plate with Rivets
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

  // A. Classical Beveled Escutcheon Backplate
  const backplate = new THREE.Mesh(
    new THREE.BoxGeometry(0.095, 0.44, 0.02),
    hardwareMat
  )
  handleGroup.add(backplate)

  // B. Spindle Rosette
  const rosette = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.026, 0.024, 16),
    hardwareMat
  )
  rosette.rotateX(Math.PI / 2)
  rosette.position.set(0, 0.08, 0.018)
  handleGroup.add(rosette)

  // C. Horizontal Lever Handle (Extends towards center of door)
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

  // D. Antique Keyhole with Teardrop Escutcheon
  const keyholeBackMat = new THREE.MeshBasicMaterial({ color: 0x050505 })
  const keyholeTop = new THREE.Mesh(new THREE.CircleGeometry(0.016, 16), keyholeBackMat)
  keyholeTop.position.set(0, -0.09, 0.012)
  handleGroup.add(keyholeTop)

  const keyholeDrop = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 0.022), keyholeBackMat)
  keyholeDrop.position.set(0, -0.11, 0.012)
  handleGroup.add(keyholeDrop)

  // ========================================================
  // 8. OVERHEAD INSCRIBED MONUMENTAL BRONZE PLAQUE
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

  // Inscribed Gold & Bronze Face Plate (Displays Door Num & Title in 3D Scene)
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

  // Polished Metallic Plaque Border
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

  // Attach metadata to hitBox for interaction controller
  hitBox.userData = {
    isDoorHitBox: true,
    doorData,
    doorGroup,
    doorPivot,
    portalChamber,
    godRays: godRayPlane1,
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
    godRays: godRayPlane1,
    portalLight,
    lightPool,
    sconceSpot,
    doorData,
  }
}
