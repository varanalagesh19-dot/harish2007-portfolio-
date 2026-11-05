import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function NerAccessCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 4.5, 7.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xf5f0e7, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.5)
    dirLight.position.set(4, 8, 4)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xa65f43, 3.5, 12)
    pointLight.position.set(-2, 3, 2)
    scene.add(pointLight)

    const greenLight = new THREE.PointLight(0x68745b, 4, 12)
    greenLight.position.set(3, 2, -1)
    scene.add(greenLight)

    // Group for entire map
    const mapGroup = new THREE.Group()
    scene.add(mapGroup)

    // 1. Grid Terrain Base
    const gridHelper = new THREE.GridHelper(8, 24, 0x68745b, 0xb77a51)
    gridHelper.position.y = -0.5
    mapGroup.add(gridHelper)

    // Terrain Contour Wireframe (Subtle topography)
    const planeGeo = new THREE.PlaneGeometry(8, 8, 20, 20)
    planeGeo.rotateX(-Math.PI / 2)
    const pos = planeGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.35 - 0.5
      pos.setY(i, y)
    }
    planeGeo.computeVertexNormals()

    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x414b38,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const terrain = new THREE.Mesh(planeGeo, planeMat)
    mapGroup.add(terrain)

    // 2. Waypoint Pins (Locations)
    const pinCoords = [
      { x: -2.2, z: -1.8, y: -0.3, label: 'North Entrance' },
      { x: -0.8, z: 0.2, y: -0.2, label: 'Central Library' },
      { x: 1.6, z: -0.9, y: -0.35, label: 'Engineering Block' },
      { x: 2.3, z: 1.8, y: -0.15, label: 'Innovation Hub' },
      { x: -1.2, z: 2.1, y: -0.25, label: 'Student Arena' },
    ]

    const pins = []
    const pinGroup = new THREE.Group()
    mapGroup.add(pinGroup)

    pinCoords.forEach((coord, idx) => {
      // Pin Pole
      const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 12)
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xb77a51, metalness: 0.8 })
      const pole = new THREE.Mesh(poleGeo, poleMat)
      pole.position.set(coord.x, coord.y + 0.4, coord.z)
      pinGroup.add(pole)

      // Pin Head (Beacon)
      const headGeo = new THREE.SphereGeometry(0.14, 16, 16)
      const headMat = new THREE.MeshStandardMaterial({
        color: idx === 3 ? 0xa65f43 : 0x68745b,
        emissive: idx === 3 ? 0xa65f43 : 0x414b38,
        emissiveIntensity: 0.8,
        metalness: 0.5,
      })
      const head = new THREE.Mesh(headGeo, headMat)
      head.position.set(coord.x, coord.y + 0.85, coord.z)
      pinGroup.add(head)

      // Pulsing Base Ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.22, 24)
      ringGeo.rotateX(-Math.PI / 2)
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 3 ? 0xa65f43 : 0x68745b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.set(coord.x, coord.y + 0.02, coord.z)
      pinGroup.add(ring)

      pins.push({ head, ring, baseY: coord.y + 0.85, ringInitial: 0.22 })
    })

    // 3. Animated Route Spline
    const routeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0.5, -1.8),
      new THREE.Vector3(-1.5, 0.7, -0.6),
      new THREE.Vector3(-0.8, 0.6, 0.2),
      new THREE.Vector3(0.4, 0.8, -0.3),
      new THREE.Vector3(1.6, 0.5, -0.9),
      new THREE.Vector3(2.0, 0.7, 0.6),
      new THREE.Vector3(2.3, 0.65, 1.8),
    ])

    const tubeGeo = new THREE.TubeGeometry(routeCurve, 64, 0.04, 8, false)
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xa65f43,
      emissive: 0xa65f43,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7,
    })
    const routeTube = new THREE.Mesh(tubeGeo, tubeMat)
    mapGroup.add(routeTube)

    // Moving Vehicle/Beacon on Spline
    const travelerGeo = new THREE.ConeGeometry(0.12, 0.3, 8)
    travelerGeo.rotateX(Math.PI / 2)
    const travelerMat = new THREE.MeshStandardMaterial({
      color: 0xf1ebdd,
      emissive: 0xf1ebdd,
      emissiveIntensity: 0.9,
    })
    const traveler = new THREE.Mesh(travelerGeo, travelerMat)
    mapGroup.add(traveler)

    // Mouse Interaction
    let isDragging = false
    let prevMouseX = 0
    let rotY = 0
    let rotX = 0.2

    const onMouseDown = (e) => {
      isDragging = true
      prevMouseX = e.clientX
    }
    const onMouseMove = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      rotY += deltaX * 0.008
      prevMouseX = e.clientX
    }
    const onMouseUp = () => { isDragging = false }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Touch support
    let prevTouchX = 0
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevTouchX = e.touches[0].clientX
      }
    }
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return
      const deltaX = e.touches[0].clientX - prevTouchX
      rotY += deltaX * 0.008
      prevTouchX = e.touches[0].clientX
    }
    const onTouchEnd = () => { isDragging = false }

    container.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animate
    let animationFrameId
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Map slow auto-rotation if not dragging
      if (!isDragging) {
        rotY += 0.0025
      }
      mapGroup.rotation.y = rotY
      mapGroup.rotation.x = rotX + Math.sin(t * 0.5) * 0.03

      // Move traveler along route
      const progress = (t * 0.18) % 1
      const point = routeCurve.getPointAt(progress)
      const tangent = routeCurve.getTangentAt(progress)
      traveler.position.copy(point)
      traveler.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent)

      // Pulse pin heads and rings
      pins.forEach((pin, i) => {
        pin.head.position.y = pin.baseY + Math.sin(t * 3 + i) * 0.06
        const ringScale = 1 + Math.sin(t * 2.5 + i) * 0.35
        pin.ring.scale.set(ringScale, ringScale, 1)
        pin.ring.material.opacity = 0.9 - Math.sin(t * 2.5 + i) * 0.4
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab',
      }}
    />
  )
}

