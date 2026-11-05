import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function LinkedXCanvas() {
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
    camera.position.set(0, 0, 8.5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xf5f0e7, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.5)
    dirLight.position.set(5, 6, 6)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xa65f43, 3.5, 15)
    pointLight.position.set(-4, -2, 3)
    scene.add(pointLight)

    const greenLight = new THREE.PointLight(0x68745b, 3.5, 15)
    greenLight.position.set(4, 3, -2)
    scene.add(greenLight)

    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // 1. Central Pulse Sphere (Sentiment Core)
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 3)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xa65f43,
      roughness: 0.25,
      metalness: 0.8,
      wireframe: false,
    })
    const sentimentCore = new THREE.Mesh(sphereGeo, sphereMat)
    rootGroup.add(sentimentCore)

    // Wireframe Cage around Core
    const cageGeo = new THREE.IcosahedronGeometry(1.4, 1)
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x68745b,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
    const cage = new THREE.Mesh(cageGeo, cageMat)
    rootGroup.add(cage)

    // 2. Concentric Analytics Rings
    const ringGeo1 = new THREE.RingGeometry(2.2, 2.25, 64)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x68745b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    })
    const analyticsRing1 = new THREE.Mesh(ringGeo1, ringMat1)
    analyticsRing1.rotation.x = Math.PI / 2.5
    rootGroup.add(analyticsRing1)

    const ringGeo2 = new THREE.RingGeometry(2.9, 2.94, 64)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xb77a51,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    })
    const analyticsRing2 = new THREE.Mesh(ringGeo2, ringMat2)
    analyticsRing2.rotation.y = Math.PI / 3
    rootGroup.add(analyticsRing2)

    // 3. Floating Social Post Cards (Glass panels in 3D orbit)
    const cardGroup = new THREE.Group()
    rootGroup.add(cardGroup)

    const cardCoords = [
      { x: -2.8, y: 1.2, z: 0.5, rx: 0.2, ry: 0.4 },
      { x: 2.7, y: 1.4, z: -0.8, rx: -0.2, ry: -0.5 },
      { x: -1.9, y: -2.0, z: -0.6, rx: 0.3, ry: 0.2 },
      { x: 2.1, y: -1.7, z: 0.7, rx: -0.3, ry: -0.3 },
      { x: 0.0, y: 2.8, z: -1.0, rx: 0.4, ry: 0.0 },
    ]

    const cardMeshes = []
    cardCoords.forEach((coord, i) => {
      const cardSubGroup = new THREE.Group()
      cardSubGroup.position.set(coord.x, coord.y, coord.z)
      cardSubGroup.rotation.set(coord.rx, coord.ry, 0)

      // Card Base (Muted Glass / Canvas)
      const baseGeo = new THREE.BoxGeometry(1.6, 1.0, 0.04)
      const baseMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x414b38 : 0xb77a51,
        roughness: 0.4,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85,
      })
      const card = new THREE.Mesh(baseGeo, baseMat)
      cardSubGroup.add(card)

      // Card Border Accent Line
      const edgeGeo = new THREE.EdgesGeometry(baseGeo)
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xf1ebdd,
        linewidth: 1.5,
      })
      const edge = new THREE.LineSegments(edgeGeo, edgeMat)
      cardSubGroup.add(edge)

      cardGroup.add(cardSubGroup)
      cardMeshes.push({ group: cardSubGroup, initialY: coord.y, speed: 0.6 + i * 0.2 })
    })

    // 4. Connecting Network Stream Lines (Curves from core to cards)
    const lineGroup = new THREE.Group()
    rootGroup.add(lineGroup)

    cardCoords.forEach((coord) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(coord.x * 0.5, coord.y * 0.5 + 0.4, coord.z * 0.5),
        new THREE.Vector3(coord.x, coord.y, coord.z)
      )
      const points = curve.getPoints(24)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x68745b,
        transparent: true,
        opacity: 0.45,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      lineGroup.add(line)
    })

    // Mouse Interaction
    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1)
      targetX = x * 0.45
      targetY = y * 0.45
    }

    container.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationFrameId
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      curX += (targetX - curX) * 0.05
      curY += (targetY - curY) * 0.05

      rootGroup.rotation.y = t * 0.15 + curX
      rootGroup.rotation.x = Math.sin(t * 0.2) * 0.1 + curY

      // Pulse Sentiment Core
      const pulse = 1 + Math.sin(t * 2) * 0.06
      sentimentCore.scale.set(pulse, pulse, pulse)
      sentimentCore.rotation.y = t * 0.4
      sentimentCore.rotation.x = t * 0.25

      cage.rotation.y = -t * 0.3
      cage.rotation.z = t * 0.2

      analyticsRing1.rotation.z = t * 0.25
      analyticsRing2.rotation.z = -t * 0.2

      // Hover cards
      cardMeshes.forEach((item, idx) => {
        item.group.position.y = item.initialY + Math.sin(t * item.speed + idx) * 0.12
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
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

