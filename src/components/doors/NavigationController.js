import { usePortalTransition, PORTAL_STATES } from '../../context/PortalTransitionContext'

/**
 * NavigationController.js
 * Single unified controller interface to prevent conflicting animations
 * and coordinate seamless 3D door & cross-page navigation.
 */

export function useNavigationController() {
  const portalContext = usePortalTransition()

  return {
    ...portalContext,
    isIdle: portalContext.transitionState === PORTAL_STATES.IDLE,
    isApproaching: portalContext.transitionState === PORTAL_STATES.CAMERA_APPROACH,
    isOpening: portalContext.transitionState === PORTAL_STATES.DOOR_OPENING,
    isZooming: portalContext.transitionState === PORTAL_STATES.PORTAL_ZOOM,
    isRevealing: portalContext.transitionState === PORTAL_STATES.LIGHT_REVEAL,
  }
}

