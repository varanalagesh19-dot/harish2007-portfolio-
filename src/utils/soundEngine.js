// ===================================================
// ATELIER IMAGINATION — PROCEDURAL STUDIO AUDIO SYNTHESIZER
// Zero-external asset procedural audio engine via Web Audio API
// ===================================================

class AtelierSoundEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.noiseBuffer = null
    this.isMuted = true
    this.initialized = false

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('atelier_audio_enabled')
      this.isMuted = stored === 'true' ? false : true

      // Unlock AudioContext on first user interaction anywhere
      const unlock = () => {
        this.initContext()
        window.removeEventListener('pointerdown', unlock)
        window.removeEventListener('keydown', unlock)
      }
      window.addEventListener('pointerdown', unlock, { passive: true })
      window.addEventListener('keydown', unlock, { passive: true })
    }
  }

  initContext() {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      return
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      this.createNoiseBuffer()
      this.initialized = true
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 1 // 1 second of noise
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = this.noiseBuffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    // Pink noise generation for warm paper/brush friction texture
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09
      b6 = white * 0.115926
    }
  }

  setMuted(muted) {
    this.isMuted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('atelier_audio_enabled', muted ? 'false' : 'true')
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.7, now + 0.05)
    }
  }

  toggleMute() {
    this.initContext()
    this.setMuted(!this.isMuted)
    return this.isMuted
  }

  getIsMuted() {
    return this.isMuted
  }

  // 1. STUDIO PAGE TURN + SOFT HARMONIC CHIME (0.18s whoosh + 528Hz/660Hz warm chime)
  playPageTurn() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || this.ctx.state === 'suspended') return

    const now = this.ctx.currentTime

    // Layer A: Short filtered paper whoosh (0.18s)
    if (this.noiseBuffer) {
      try {
        const noise = this.ctx.createBufferSource()
        noise.buffer = this.noiseBuffer

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.Q.setValueAtTime(2.5, now)
        filter.frequency.setValueAtTime(320, now)
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.08)
        filter.frequency.exponentialRampToValueAtTime(450, now + 0.18)

        const noiseGain = this.ctx.createGain()
        noiseGain.gain.setValueAtTime(0.001, now)
        noiseGain.gain.linearRampToValueAtTime(0.14, now + 0.05)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

        noise.connect(filter)
        filter.connect(noiseGain)
        noiseGain.connect(this.masterGain)

        noise.start(now)
        noise.stop(now + 0.19)
      } catch {
        // Safe fallback
      }
    }

    // Layer B: Soft harmonic chime (528Hz & 660Hz)
    const chimeFreqs = [528, 660]
    chimeFreqs.forEach((freq, idx) => {
      try {
        const osc = this.ctx.createOscillator()
        const oscGain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)

        const noteDelay = idx * 0.04
        const noteStart = now + noteDelay

        oscGain.gain.setValueAtTime(0.0001, noteStart)
        oscGain.gain.linearRampToValueAtTime(0.07 / (idx + 1), noteStart + 0.03)
        oscGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.45)

        osc.connect(oscGain)
        oscGain.connect(this.masterGain)

        osc.start(noteStart)
        osc.stop(noteStart + 0.48)
      } catch {
        // Safe fallback
      }
    })
  }

  // Backward compatibility alias for page transitions
  playPageTransition() {
    this.playPageTurn()
  }

  // 2. SUBTLE CARD HOVER TICK (0.015s mechanical click)
  playHoverTick() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || this.ctx.state === 'suspended') return

    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.015)

      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.018)
    } catch {
      // Safe fallback
    }
  }

  playHoverSound() {
    this.playHoverTick()
  }

  // 3. THEME TOGGLE SOUND (Ascending warm interval vs Deep twilight fifth)
  playThemeSwitch(isDark) {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || this.ctx.state === 'suspended') return

    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      if (isDark) {
        // Deep twilight resonant fifth: 330Hz -> 220Hz
        osc.frequency.setValueAtTime(330, now)
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.22)
      } else {
        // Ascending warm canvas interval: 440Hz -> 660Hz
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.22)
      }

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.06, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.26)
    } catch {
      // Safe fallback
    }
  }

  // 4. 3D PORTAL INTERACTION HUM (Low-frequency ambient pulse)
  playPortalInteract() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || this.ctx.state === 'suspended') return

    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(110, now)
      osc.frequency.linearRampToValueAtTime(135, now + 0.1)
      osc.frequency.linearRampToValueAtTime(110, now + 0.25)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.05, now + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.3)
    } catch {
      // Safe fallback
    }
  }
}

export const soundEngine = new AtelierSoundEngine()
export default soundEngine
