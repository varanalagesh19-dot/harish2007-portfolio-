import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function IntelliPDFCanvas() {
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
    camera.position.set(0, 1.2, 7.5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xf5f0e7, 1.3)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.8)
    dirLight.position.set(4, 7, 5)
    scene.add(dirLight)

    const scanLight = new THREE.PointLight(0xa65f43, 4, 10)
    scanLight.position.set(0, 0, 2)
    scene.add(scanLight)

    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // 1. Layered Floating Document Sheets
    const pageGroup = new THREE.Group()
    rootGroup.add(pageGroup)

    const sheets = []
    const sheetCount = 4

    for (let i = 0; i < sheetCount; i++) {
      const sheetSubGroup = new THREE.Group()

      // Paper Body
      const paperGeo = new THREE.PlaneGeometry(2.4, 3.4, 16, 16)
      const paperMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0xfaf6f0 : 0xede5d8,
        roughness: 0.65,
        metalness: 0.1,
        side: THREE.DoubleSide,
      })
      const paper = new THREE.Mesh(paperGeo, paperMat)
      sheetSubGroup.add(paper)

      // Paper Frame / Border
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(paperGeo),
        new THREE.LineBasicMaterial({ color: 0x68745b, opacity: 0.6, transparent: true })
      )
      sheetSubGroup.add(edges)

      // Text Lines (simulated typography bars on paper)
      const lineCount = 7
      for (let l = 0; l < lineCount; l++) {
        const lineWidth = l === 0 ? 1.0 : l === lineCount - 1 ? 0.9 : 1.8
        const lineGeo = new THREE.PlaneGeometry(lineWidth, 0.05)
        const lineMat = new THREE.MeshBasicMaterial({
          color: l === 0 ? 0xa65f43 : 0x777267,
          side: THREE.DoubleSide,
        })
        const textLine = new THREE.Mesh(lineGeo, lineMat)
        textLine.position.set(l === 0 ? -0.4 : 0, 1.2 - l * 0.38, 0.01)
        sheetSubGroup.add(textLine)
      }

      // Initial stacking offset
      sheetSubGroup.position.set(i * 0.45 - 0.7, -i * 0.15, -i * 0.7)
      sheetSubGroup.rotation.set(-0.15, -0.25 + i * 0.08, i * 0.04)

      pageGroup.add(sheetSubGroup)
      sheets.push(sheetSubGroup)
    }

    // 2. Optical Laser Scan Bar (Scanning horizontally across top document)
    const scanBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.7, 16)
    scanBarGeo.rotateZ(Math.PI / 2)
    const scanBarMat = new THREE.MeshBasicMaterial({
      color: 0xa65f43,
    })
    const scanBar = new THREE.Mesh(scanBarGeo, scanBarMat)
    scanBar.position.set(-0.7, 1.4, 0.1)
    pageGroup.add(scanBar)

    // Laser Glow Plane (beam of light)
    const laserPlaneGeo = new THREE.PlaneGeometry(2.7, 0.15)
    const laserPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xb77a51,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    })
    const laserBeam = new THREE.Mesh(laserPlaneGeo, laserPlaneMat)
    laserBeam.position.set(-0.7, 1.4, 0.08)
    pageGroup.add(laserBeam)

    // 3. Extracted Semantic Token Particles (Floating up from document)
    const tokenCount = 36
    const tokenGeo = new THREE.BufferGeometry()
    const tokenPos = new Float32Array(tokenCount * 3)

    for (let i = 0; i < tokenCount; i++) {
      tokenPos[i * 3] = (Math.random() - 0.5) * 2.5
      tokenPos[i * 3 + 1] = (Math.random() - 0.5) * 3.5
      tokenPos[i * 3 + 2] = Math.random() * 1.5 + 0.2
    }

    tokenGeo.setAttribute('position', new THREE.BufferAttribute(tokenPos, 3))
    const tokenMat = new THREE.PointsMaterial({
      color: 0x68745b,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    })
    const tokens = new THREE.Points(tokenGeo, tokenMat)
    pageGroup.add(tokens)

    // Mouse Interaction
    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1)
      targetX = x * 0.4
      targetY = y * 0.3
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

      rootGroup.rotation.y = curX + Math.sin(t * 0.4) * 0.08
      rootGroup.rotation.x = curY + Math.cos(t * 0.3) * 0.05

      // Scanning bar cycle
      const scanY = Math.sin(t * 1.8) * 1.4
      scanBar.position.y = scanY
      laserBeam.position.y = scanY
      scanLight.position.y = scanY
      scanLight.position.x = -0.7

      // Floating sheets wave
      sheets.forEach((sheet, idx) => {
        sheet.position.y = -idx * 0.15 + Math.sin(t * 1.2 + idx * 0.6) * 0.06
        sheet.rotation.z = idx * 0.04 + Math.sin(t * 0.8 + idx) * 0.02
      })

      // Drift tokens upward
      const positions = tokens.geometry.attributes.position.array
      for (let i = 0; i < tokenCount; i++) {
        positions[i * 3 + 1] += 0.008
        if (positions[i * 3 + 1] > 2.0) {
          positions[i * 3 + 1] = -1.8
        }
      }
      tokens.geometry.attributes.position.needsUpdate = true

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

