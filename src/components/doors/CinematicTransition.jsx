import { usePortalTransition, PORTAL_STATES } from '../../context/PortalTransitionContext'
import PortalLight from '../PortalLight'

/**
 * CinematicTransition.jsx
 * Reusable component wrapping portal light, transition state observer, and animation triggers
 */

export { PORTAL_STATES }

export default function CinematicTransition({ children }) {
  const { transitionState, isNavigating } = usePortalTransition()

  return (
    <>
      <PortalLight />
      {children}
    </>
  )
}

