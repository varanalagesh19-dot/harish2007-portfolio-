import { createContext, useContext, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PORTAL_STATES } from './portalStates'

export { PORTAL_STATES }

const PortalTransitionContext = createContext(null)

export function PortalTransitionProvider({ children }) {
  const navigate = useNavigate()

  // Transition status
  const [transitionState, setTransitionState] = useState(PORTAL_STATES.IDLE)
  const [isNavigating, setIsNavigating] = useState(false)
  const [targetDestination, setTargetDestination] = useState(null)
  const [portalLightOpacity, setPortalLightOpacity] = useState(0)

  // Safety timer to prevent permanent locks
  const safetyTimerRef = useRef(null)

  const clearSafetyTimer = () => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = null
    }
  }

  /**
   * Complete 3D Door Transition (called ONLY by 3D canvas on /explore when camera flies through)
   */
  const complete3DDoorTransition = useCallback(
    (targetRoute) => {
      clearSafetyTimer()
      setTransitionState(PORTAL_STATES.PAGE_ENTERED)
      navigate(targetRoute)
      window.scrollTo({ top: 0, behavior: 'instant' })

      // Dissolve the gentle golden optical bloom to reveal destination page
      setTimeout(() => {
        setPortalLightOpacity(0)
        setTimeout(() => {
          setTransitionState(PORTAL_STATES.IDLE)
          setIsNavigating(false)
          setTargetDestination(null)
        }, 350)
      }, 150)
    },
    [navigate]
  )

  /**
   * Optional manual trigger for 3D door sequence (used by 3D explore teleport dock)
   */
  const triggerPortalNavigation = useCallback(
    (targetRoute) => {
      if (isNavigating) return
      setIsNavigating(true)
      setTargetDestination(targetRoute)
      clearSafetyTimer()

      // Safety timeout
      safetyTimerRef.current = setTimeout(() => {
        setIsNavigating(false)
        setTransitionState(PORTAL_STATES.IDLE)
        setPortalLightOpacity(0)
        navigate(targetRoute)
      }, 3500)
    },
    [isNavigating, navigate]
  )

  return (
    <PortalTransitionContext.Provider
      value={{
        transitionState,
        setTransitionState,
        isNavigating,
        setIsNavigating,
        targetDestination,
        setTargetDestination,
        portalLightOpacity,
        setPortalLightOpacity,
        triggerPortalNavigation,
        complete3DDoorTransition,
      }}
    >
      {children}
    </PortalTransitionContext.Provider>
  )
}

export function usePortalTransition() {
  const ctx = useContext(PortalTransitionContext)
  if (!ctx) {
    throw new Error('usePortalTransition must be used within PortalTransitionProvider')
  }
  return ctx
}
