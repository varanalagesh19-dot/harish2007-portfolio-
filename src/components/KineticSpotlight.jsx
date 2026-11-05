import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import './KineticSpotlight.css'

export default function KineticSpotlight() {
  const { focusMode } = useTheme()

  useEffect(() => {
    let rafId
    const updateCoords = (e) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
      })
    }

    window.addEventListener('pointermove', updateCoords, { passive: true })
    return () => {
      window.removeEventListener('pointermove', updateCoords)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (focusMode) return null

  return <div className="kinetic-spotlight-overlay" aria-hidden="true" />
}

