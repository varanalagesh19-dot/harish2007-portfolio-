import { useTheme } from '../context/ThemeContext'
import soundEngine from '../utils/soundEngine'

export default function FocusToggle() {
  const { focusMode, toggleFocusMode } = useTheme()

  const handleToggle = () => {
    soundEngine.playHoverTick()
    toggleFocusMode()
  }

  return (
    <button
      type="button"
      className={`focus-toggle-btn ${focusMode ? 'focus-toggle-btn--active' : ''}`}
      onClick={handleToggle}
      onMouseEnter={() => soundEngine.playHoverTick()}
      title={focusMode ? 'Exit Focus Mode (Restore 3D Ambient)' : 'Enter Focus Mode (Distraction-Free Zen Reading)'}
      aria-label="Toggle Atelier Focus Mode"
      aria-pressed={focusMode}
    >
      <span className="focus-toggle-icon">{focusMode ? '👁️' : '👁️‍🗨️'}</span>
      <span className="focus-toggle-label">{focusMode ? 'Focus: On' : 'Focus Mode'}</span>
    </button>
  )
}

