import { usePortalTransition } from '../context/PortalTransitionContext'
import './PortalLight.css'

export default function PortalLight() {
  const { portalLightOpacity } = usePortalTransition()

  // Strictly do not render anything if portal light is idle or not active
  if (!portalLightOpacity || portalLightOpacity <= 0.02) {
    return null
  }

  return (
    <div
      className="portal-light-overlay"
      style={{
        opacity: portalLightOpacity,
        pointerEvents: portalLightOpacity > 0.3 ? 'auto' : 'none',
      }}
      aria-hidden="true"
    >
      {/* Volumetric Radial Light Core */}
      <div className="portal-light-core" />

      {/* Gentle Anamorphic Golden Light Bloom */}
      <div className="portal-light-bloom" />

      {/* Soft Luminous Dust Specks */}
      <div className="portal-motes-field">
        <span className="mote mote-1" />
        <span className="mote mote-2" />
        <span className="mote mote-3" />
        <span className="mote mote-4" />
        <span className="mote mote-5" />
        <span className="mote mote-6" />
        <span className="mote mote-7" />
        <span className="mote mote-8" />
      </div>

      {/* Center Heavenly Vignette */}
      <div className="portal-light-aperture" />
    </div>
  )
}

