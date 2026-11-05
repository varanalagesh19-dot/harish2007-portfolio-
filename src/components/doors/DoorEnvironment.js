import * as THREE from 'three'

/**
 * DoorEnvironment.js
 * Grand Colonnade Gallery Hall for HARISH 2007 (5 Architectural Portals).
 * 
 * Layout:
 * - 5 Doors at: x = -5.0 (About), -2.5 (Gallery), 0.0 (Projects - Center), +2.5 (Skills), +5.0 (Contact)
 * - Classical pilasters between all doors: x = -6.4, -3.75, -1.25, +1.25, +3.75, +6.4
 * - Dedicated center-stage lighting for Door 03 (Projects)
 * - Calibrated contrast for both Light Mode (warm ivory) and Dark Mode (deep charcoal with warm directional illumination)
 */

export function setupDoorEnvironment(scene, isDark = false) {
  const envGroup = new THREE.Group()
  scene.add(envGroup)

  // ========================================================
  // 1. ARCHITECTURAL GALLERY LIGHTING
  // ========================================================
  // Ambient fill light
  const ambientLight = new THREE.AmbientLight(
    isDark ? 0x2e382e : 0xfff9ef,
    isDark ? 1.5 : 1.8
  )
  envGroup.add(ambientLight)

  // Main Chandelier Directional Key Light (Center-focused)
  const mainSpot = new THREE.DirectionalLight(0xfff7ec, isDark ? 2.8 : 3.2)
  mainSpot.position.set(0, 10, 10)
  mainSpot.castShadow = true
  mainSpot.shadow.mapSize.width = 1024
  mainSpot.shadow.mapSize.height = 1024
  mainSpot.shadow.camera.near = 0.5
  mainSpot.shadow.camera.far = 30
  mainSpot.shadow.camera.left = -9
  mainSpot.shadow.camera.right = 9
  mainSpot.shadow.camera.top = 6
  mainSpot.shadow.camera.bottom = -4
  mainSpot.shadow.bias = -0.0005
  envGroup.add(mainSpot)

  // Dedicated Center Stage Spotlight (ensures Center Door 03 is brilliantly illuminated)
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

  // Warm Side Rim Lights (Creates edge separation for doors in Dark Mode)
  const leftRimLight = new THREE.DirectionalLight(0xffecd4, isDark ? 1.3 : 0.8)
  leftRimLight.position.set(-12, 6, 4)
  envGroup.add(leftRimLight)

  const rightRimLight = new THREE.DirectionalLight(0xffecd4, isDark ? 1.3 : 0.8)
  rightRimLight.position.set(12, 6, 4)
  envGroup.add(rightRimLight)

  // ========================================================
  // 2. POLISHED GALLERY FLOOR
  // ========================================================
  const floorGeo = new THREE.PlaneGeometry(42, 22)
  floorGeo.rotateX(-Math.PI / 2)
  const floorMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x161c17 : 0xe2d9cb,
    roughness: 0.38,
    metalness: 0.22,
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.position.y = -1.68
  floor.receiveShadow = true
  envGroup.add(floor)

  // ========================================================
  // 3. GRAND COLONNADE GALLERY WALL & PILASTERS
  // ========================================================
  const wallMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1a221b : 0xf2ebe1,
    roughness: 0.75,
  })

  // Back Main Wall
  const wallGeo = new THREE.PlaneGeometry(42, 14)
  const wall = new THREE.Mesh(wallGeo, wallMat)
  wall.position.set(0, 4.0, -2.1)
  wall.receiveShadow = true
  envGroup.add(wall)

  // Continuous Baseboard Plinth Molding
  const baseboardMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x121713 : 0xded5c5,
    roughness: 0.5,
  })
  const baseboard = new THREE.Mesh(
    new THREE.BoxGeometry(42, 0.45, 0.22),
    baseboardMat
  )
  baseboard.position.set(0, -1.45, -2.0)
  baseboard.receiveShadow = true
  envGroup.add(baseboard)

  // Upper Classical Frieze Architrave Molding
  const upperFrieze = new THREE.Mesh(
    new THREE.BoxGeometry(42, 0.35, 0.26),
    baseboardMat
  )
  upperFrieze.position.set(0, 4.6, -1.98)
  envGroup.add(upperFrieze)

  // Classical Pilasters (Columns) Between & Flanking the 5 Doors
  // Doors are at -5.0, -2.5, 0.0, +2.5, +5.0
  const pilasterPositions = [-6.4, -3.75, -1.25, 1.25, 3.75, 6.4]
  const pilasterMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x222c23 : 0xeae2d4,
    roughness: 0.55,
    metalness: 0.15,
  })

  pilasterPositions.forEach((xPos) => {
    // Column Shaft
    const pilaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 6.2, 0.16),
      pilasterMat
    )
    pilaster.position.set(xPos, 1.6, -2.02)
    pilaster.receiveShadow = true
    pilaster.castShadow = true
    envGroup.add(pilaster)

    // Capital (Top Molding)
    const capital = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.2, 0.22),
      pilasterMat
    )
    capital.position.set(xPos, 4.6, -1.98)
    envGroup.add(capital)

    // Base Plinth
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.35, 0.22),
      pilasterMat
    )
    plinth.position.set(xPos, -1.4, -1.98)
    envGroup.add(plinth)
  })

  // ========================================================
  // 4. AIRBORNE FLOATING STUDIO DUST MOTES
  // ========================================================
  const moteCount = 50
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
    size: 0.05,
    transparent: true,
    opacity: isDark ? 0.45 : 0.65,
    blending: THREE.AdditiveBlending,
  })
  const motes = new THREE.Points(moteGeo, moteMat)
  envGroup.add(motes)

  return {
    envGroup,
    ambientLight,
    mainSpot,
    floor,
    wall,
    motes,
  }
}
