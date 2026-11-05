import { useState, useEffect } from 'react'
import soundEngine from '../utils/soundEngine'
import './AudioToggle.css'

export default function AudioToggle() {
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    setMuted(soundEngine.getIsMuted())
  }, [])

  const handleToggle = () => {
    const isNowMuted = soundEngine.toggleMute()
    setMuted(isNowMuted)
    if (!isNowMuted) {
      soundEngine.playPageTransition(window.location.pathname)
    }
  }

  return (
    <button
      type="button"
      className={`audio-toggle ${muted ? 'audio-toggle--muted' : 'audio-toggle--active'}`}
      onClick={handleToggle}
      aria-label={muted ? 'Enable studio soundscapes' : 'Mute studio soundscapes'}
      title={muted ? 'Studio Audio: Muted (Click to enable synthesized soundscapes)' : 'Studio Audio: Active (Click to mute)'}
    >
      <div className="audio-toggle__eq">
        <span className="eq-bar eq-bar-1" />
        <span className="eq-bar eq-bar-2" />
        <span className="eq-bar eq-bar-3" />
        <span className="eq-bar eq-bar-4" />
      </div>
      <span className="audio-toggle__label">
        {muted ? 'Sound Off' : 'Sound On'}
      </span>
    </button>
  )
}

