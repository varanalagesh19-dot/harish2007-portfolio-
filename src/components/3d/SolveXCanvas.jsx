import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function SolveXCanvas() {
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
    dirLight.position.set(5, 7, 5)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xa65f43, 3.5, 14)
    pointLight.position.set(-3, -2, 3)
    scene.add(pointLight)

    const greenLight = new THREE.PointLight(0x68745b, 3.5, 14)
    greenLight.position.set(3, 3, -2)
    scene.add(greenLight)

    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // Node Positions in 3D constellation
    const nodeCoords = [
      { x: 0, y: 0, z: 0, size: 0.55, type: 'core', label: 'Problem Axiom' },
      { x: -2.2, y: 1.5, z: 0.8, size: 0.38, type: 'sub', label: 'Lemma Alpha' },
      { x: 2.1, y: 1.6, z: -0.6, size: 0.42, type: 'sub', label: 'Decomposition' },
      { x: -1.8, y: -1.7, z: -0.9, size: 0.36, type: 'sub', label: 'Heuristic Search' },
      { x: 1.9, y: -1.8, z: 0.9, size: 0.4, type: 'sub', label: 'Constraint Prop' },
      { x: -3.2, y: -0.2, z: 0.2, size: 0.32, type: 'leaf', label: 'Edge Case' },
      { x: 3.2, y: 0.3, z: 0.3, size: 0.35, type: 'leaf', label: 'Q.E.D. Result' },
    ]

    const nodeMeshes = []
    nodeCoords.forEach((node, i) => {
      let geo
      if (node.type === 'core') {
        geo = new THREE.DodecahedronGeometry(node.size)
      } else if (i % 2 === 0) {
        geo = new THREE.OctahedronGeometry(node.size)
      } else {
        geo = new THREE.IcosahedronGeometry(node.size)
      }

      const mat = new THREE.MeshStandardMaterial({
        color: node.type === 'core' ? 0xa65f43 : i % 2 === 0 ? 0x68745b : 0xb77a51,
        roughness: 0.3,
        metalness: 0.75,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(node.x, node.y, node.z)
      rootGroup.add(mesh)

      // Wireframe overlay for mathematical feel
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0xf1ebdd, transparent: true, opacity: 0.4 })
      )
      mesh.add(wire)

      nodeMeshes.push({ mesh, basePos: { ...node } })
    })

    // Edges / Connections between nodes
    const edgeConnections = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 5], [3, 5], [2, 6], [4, 6],
      [1, 2], [3, 4]
    ]

    const edgeLines = []
    edgeConnections.forEach(([fromIdx, toIdx]) => {
      const p1 = nodeCoords[fromIdx]
      const p2 = nodeCoords[toIdx]

      const points = [
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y, p2.z)
      ]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x68745b,
        transparent: true,
        opacity: 0.5,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      rootGroup.add(line)
      edgeLines.push(line)
    })

    // Traveling Energy Pulse on Edges
    const pulseGeo = new THREE.SphereGeometry(0.08, 12, 12)
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xa65f43 })
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat)
    rootGroup.add(pulseMesh)

    // Mouse Interaction
    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1)
      targetX = x * 0.5
      targetY = y * 0.5
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

      rootGroup.rotation.y = t * 0.18 + curX
      rootGroup.rotation.x = Math.sin(t * 0.15) * 0.1 + curY

      // Rotate nodes individually
      nodeMeshes.forEach((item, idx) => {
        item.mesh.rotation.x = t * (0.3 + idx * 0.1)
        item.mesh.rotation.y = t * (0.4 + idx * 0.1)
        item.mesh.position.y = item.basePos.y + Math.sin(t * 1.5 + idx) * 0.08
      })

      // Move energy pulse along edges
      const edgeIndex = Math.floor(t * 0.8) % edgeConnections.length
      const [from, to] = edgeConnections[edgeIndex]
      const alpha = (t * 0.8) % 1
      const p1 = nodeCoords[from]
      const p2 = nodeCoords[to]
      pulseMesh.position.set(
        THREE.MathUtils.lerp(p1.x, p2.x, alpha),
        THREE.MathUtils.lerp(p1.y, p2.y, alpha),
        THREE.MathUtils.lerp(p1.z, p2.z, alpha)
      )

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

