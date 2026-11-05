import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AtlasCoreCanvas() {
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
    camera.position.set(0, 0, 8.0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xf5f0e7, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.5)
    dirLight.position.set(4, 6, 6)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xa65f43, 4, 15)
    pointLight.position.set(-4, -2, 3)
    scene.add(pointLight)

    const sageLight = new THREE.PointLight(0x68745b, 4, 15)
    sageLight.position.set(4, 3, -2)
    scene.add(sageLight)

    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // 1. Central AI Neural Core (Layered spheres)
    const coreGeo = new THREE.SphereGeometry(1.25, 32, 32)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x414b38,
      roughness: 0.2,
      metalness: 0.85,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    rootGroup.add(core)

    // Inner glowing aura
    const auraGeo = new THREE.SphereGeometry(1.35, 16, 16)
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xa65f43,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const aura = new THREE.Mesh(auraGeo, auraMat)
    rootGroup.add(aura)

    // 2. Orbital Memory Rings (Concentric rings with data nodes)
    const ringGroup = new THREE.Group()
    rootGroup.add(ringGroup)

    const ringData = [
      { radius: 2.1, color: 0x68745b, tiltX: 0.4, tiltZ: 0.2, speed: 0.35 },
      { radius: 2.7, color: 0xb77a51, tiltX: -0.5, tiltZ: 0.6, speed: -0.28 },
      { radius: 3.3, color: 0xa65f43, tiltX: 0.8, tiltZ: -0.4, speed: 0.2 },
    ]

    const orbitItems = []

    ringData.forEach((ring, idx) => {
      const ringSubGroup = new THREE.Group()
      ringSubGroup.rotation.x = ring.tiltX
      ringSubGroup.rotation.z = ring.tiltZ

      // Ring wire
      const rGeo = new THREE.TorusGeometry(ring.radius, 0.02, 16, 80)
      const rMat = new THREE.MeshBasicMaterial({
        color: ring.color,
        transparent: true,
        opacity: 0.5,
      })
      const rMesh = new THREE.Mesh(rGeo, rMat)
      ringSubGroup.add(rMesh)

      // Orbiting Memory Satellites
      const nodeCount = 3 + idx
      const nodes = []
      for (let n = 0; n < nodeCount; n++) {
        const angle = (n / nodeCount) * Math.PI * 2
        const nGeo = new THREE.SphereGeometry(0.12, 12, 12)
        const nMat = new THREE.MeshStandardMaterial({
          color: ring.color,
          metalness: 0.7,
          roughness: 0.3,
        })
        const nMesh = new THREE.Mesh(nGeo, nMat)
        nMesh.position.set(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0)
        ringSubGroup.add(nMesh)
        nodes.push({ mesh: nMesh, baseAngle: angle, radius: ring.radius })
      }

      ringGroup.add(ringSubGroup)
      orbitItems.push({ subGroup: ringSubGroup, speed: ring.speed, nodes })
    })

    // 3. Conversational Frequency Ribbon (Waveform representing speech / dialogue)
    const wavePointsCount = 60
    const waveCurve = new THREE.EllipseCurve(0, 0, 1.8, 1.8, 0, 2 * Math.PI, false, 0)
    const points2D = waveCurve.getPoints(wavePointsCount)
    const points3D = points2D.map((p) => new THREE.Vector3(p.x, p.y, 0))

    const waveGeo = new THREE.BufferGeometry().setFromPoints(points3D)
    const waveMat = new THREE.LineBasicMaterial({
      color: 0xf1ebdd,
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    })
    const waveLine = new THREE.Line(waveGeo, waveMat)
    waveLine.rotation.x = Math.PI / 2
    rootGroup.add(waveLine)

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
      rootGroup.rotation.x = Math.sin(t * 0.2) * 0.08 + curY

      // Core Breathing Pulse
      const coreScale = 1 + Math.sin(t * 1.8) * 0.04
      core.scale.set(coreScale, coreScale, coreScale)
      core.rotation.y = t * 0.3

      aura.rotation.y = -t * 0.4
      aura.rotation.x = t * 0.25

      // Orbits rotation
      orbitItems.forEach((item) => {
        item.subGroup.rotation.y += item.speed * 0.02
      })

      // Undulate audio frequency wave
      const wavePos = waveLine.geometry.attributes.position.array
      for (let i = 0; i < wavePointsCount + 1; i++) {
        const angle = (i / wavePointsCount) * Math.PI * 2
        const freq = Math.sin(angle * 6 + t * 4) * 0.18
        wavePos[i * 3 + 2] = freq
      }
      waveLine.geometry.attributes.position.needsUpdate = true

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

