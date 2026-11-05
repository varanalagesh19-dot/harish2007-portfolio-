import { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (isTouch) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100, my = -100
    let rx = -100, ry = -100
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px,${my}px)`
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      rx = lerp(rx, mx, 0.09)
      ry = lerp(ry, my, 0.09)
      ring.style.transform = `translate(${rx}px,${ry}px)`
      raf = requestAnimationFrame(tick)
    }

    const onEnter = () => { dot.classList.add('dot--hover'); ring.classList.add('ring--hover') }
    const onLeave = () => { dot.classList.remove('dot--hover'); ring.classList.remove('ring--hover') }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[role=button],[tabindex]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
