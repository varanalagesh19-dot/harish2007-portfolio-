import gsap from 'gsap'
import soundEngine from '../../utils/soundEngine'
import { PORTAL_STATES } from '../../context/portalStates'

/**
 * DoorInteraction.js
 * Coordinated GSAP Sequences for Physical Door Opening & Cinematic Camera Fly-Through on /explore.
 * 
 * Flow:
 * STAGE 1 — SELECTION: Highlight selected door, lock clicks
 * STAGE 2 — CAMERA APPROACH: Smooth glide directly facing the selected door
 * STAGE 3 — PHYSICAL OPENING: Door leaf physically swings on stationary left hinge (~95°)
 * STAGE 4 — PORTAL REVEAL: Behind the door, warm golden light & volumetric rays illuminate
 * STAGE 5 — FORWARD JOURNEY: Camera travels forward through the doorway
 * STAGE 6 — PAGE REVEAL: Complete transition to destination route with soft atmospheric dissolve
 */

export class DoorInteractionController {
  constructor({
    camera,
    doors,
    setTransitionState,
    setPortalLightOpacity,
    complete3DDoorTransition,
    setIsNavigating,
  }) {
    this.camera = camera
    this.doors = doors
    this.setTransitionState = setTransitionState
    this.setPortalLightOpacity = setPortalLightOpacity
    this.complete3DDoorTransition = complete3DDoorTransition
    this.setIsNavigating = setIsNavigating

    this.activeTimeline = null
    this.hoveredDoor = null
    this.isLocked = false
    this.cameraLookTarget = { x: 0, y: 0.35, z: -1.2 }
  }

  /**
   * Handle Hover Animation (Gentle door ajar nudge & light bloom)
   */
  onDoorHover(doorItem, isHovering) {
    if (this.isLocked) return

    if (isHovering) {
      this.hoveredDoor = doorItem
      soundEngine.playHoverTick()
      this.setTransitionState(PORTAL_STATES.HOVERED)

      // Nudge door leaf slightly ajar (~9 degrees / -0.15 rad)
      gsap.to(doorItem.doorPivot.rotation, {
        y: -0.15,
        duration: 0.4,
        ease: 'power2.out',
      })

      // Increase floor light pool & ray opacity
      gsap.to(doorItem.lightPool.material, {
        opacity: 0.45,
        duration: 0.35,
      })
      gsap.to(doorItem.godRays.material, {
        opacity: 0.35,
        duration: 0.35,
      })
      gsap.to(doorItem.portalLight, {
        intensity: 1.8,
        duration: 0.35,
      })
    } else {
      if (this.hoveredDoor === doorItem) {
        this.hoveredDoor = null
        this.setTransitionState(PORTAL_STATES.IDLE)
      }

      // Close door leaf back to zero
      gsap.to(doorItem.doorPivot.rotation, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      })

      // Return light to idle ambient
      gsap.to(doorItem.lightPool.material, {
        opacity: 0.24,
        duration: 0.45,
      })
      gsap.to(doorItem.godRays.material, {
        opacity: 0.2,
        duration: 0.45,
      })
      gsap.to(doorItem.portalLight, {
        intensity: 1.2,
        duration: 0.45,
      })
    }
  }

  /**
   * Cinematic Portal Approach & Fly-Through Sequence
   */
  onDoorClick(doorItem) {
    if (this.isLocked) return
    this.isLocked = true

    this.setIsNavigating?.(true)
    this.setTransitionState(PORTAL_STATES.SELECTED)
    soundEngine.playPortalInteract()
    soundEngine.playPageTurn()

    // Kill any existing animations
    if (this.activeTimeline) {
      this.activeTimeline.kill()
    }

    const {
      doorData,
      doorPivot,
      godRays,
      portalLight,
      lightPool,
      sunCorona,
      cloudLayer1,
      cloudLayer2,
    } = doorItem
    const tl = gsap.timeline()
    this.activeTimeline = tl

    const targetDoorX = doorData.xPos
    const approachZ = 2.4
    const flyThroughZ = -1.4

    // ========================================================
    // STAGE 1: SELECTION & APPROACH
    // ========================================================
    tl.to(
      {},
      {
        duration: 0.05,
        onStart: () => {
          this.setTransitionState(PORTAL_STATES.CAMERA_APPROACH)
        },
      }
    )

    // Smoothly glide camera directly in front of the selected door
    tl.to(
      this.camera.position,
      {
        x: targetDoorX,
        y: 0.35,
        z: approachZ,
        duration: 1.15,
        ease: 'power2.inOut',
      },
      0
    )

    // Align lookAt target smoothly with the doorway center
    tl.to(
      this.cameraLookTarget,
      {
        x: targetDoorX,
        y: 0.32,
        z: -1.2,
        duration: 1.15,
        ease: 'power2.inOut',
      },
      0
    )

    // ========================================================
    // STAGE 2: PHYSICAL DOOR OPENING & PORTAL REVEAL
    // ========================================================
    // Door panel swings wide open on left hinge (~95 degrees)
    tl.to(
      doorPivot.rotation,
      {
        y: -1.66,
        duration: 1.25,
        ease: 'power2.inOut',
        onStart: () => {
          this.setTransitionState(PORTAL_STATES.DOOR_OPENING)
        },
      },
      0.12
    )

    // Behind door: Volumetric god rays & portal chamber light bloom
    tl.to(
      godRays.material,
      {
        opacity: 0.65,
        duration: 1.0,
        ease: 'power2.out',
      },
      0.25
    )

    if (sunCorona?.material) {
      tl.to(
        sunCorona.material,
        {
          opacity: 0.95,
          duration: 1.0,
          ease: 'power2.out',
        },
        0.25
      )
    }

    if (cloudLayer1) {
      tl.to(
        cloudLayer1.position,
        {
          y: -0.35,
          duration: 1.2,
          ease: 'power1.out',
        },
        0.2
      )
    }

    if (cloudLayer2) {
      tl.to(
        cloudLayer2.position,
        {
          x: 0.25,
          duration: 1.2,
          ease: 'power1.out',
        },
        0.2
      )
    }

    tl.to(
      portalLight,
      {
        intensity: 4.2,
        duration: 1.0,
        ease: 'power2.out',
      },
      0.25
    )

    tl.to(
      lightPool.material,
      {
        opacity: 0.75,
        duration: 0.9,
      },
      0.25
    )

    // ========================================================
    // STAGE 3: FORWARD JOURNEY (FLY-THROUGH)
    // ========================================================
    // Camera glides straight forward through the open doorway
    tl.to(
      this.camera.position,
      {
        z: flyThroughZ,
        duration: 0.8,
        ease: 'power3.in',
        onStart: () => {
          this.setTransitionState(PORTAL_STATES.PORTAL_ZOOM)
        },
      },
      '>-0.3'
    )

    // Soft golden atmospheric lens bloom (max 0.28 opacity — zero opaque white wash!)
    const portalVal = { opacity: 0 }
    tl.to(
      portalVal,
      {
        opacity: 0.28,
        duration: 0.7,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.setPortalLightOpacity(portalVal.opacity)
          if (window.__setPortalOpacity) {
            window.__setPortalOpacity(portalVal.opacity)
          }
        },
        onStart: () => {
          this.setTransitionState(PORTAL_STATES.LIGHT_REVEAL)
        },
      },
      '>-0.6'
    )

    // ========================================================
    // STAGE 4: DESTINATION ARRIVAL (PAGE REVEAL)
    // ========================================================
    tl.add(() => {
      this.setTransitionState(PORTAL_STATES.PAGE_ENTERED)
      this.complete3DDoorTransition(doorData.route)
    })
  }

  dispose() {
    if (this.activeTimeline) {
      this.activeTimeline.kill()
    }
  }
}
