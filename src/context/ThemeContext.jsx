import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Theme state: light or dark
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('harish_atelier_theme')
      if (saved === 'light' || saved === 'dark') return saved
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch {
      // fallback
    }
    return 'light'
  })

  // Feature 1: Atelier Focus Mode (Zen Reading)
  const [focusMode, setFocusMode] = useState(() => {
    try {
      return localStorage.getItem('harish_focus_mode') === 'true'
    } catch {
      return false
    }
  })

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('harish_atelier_theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  // Sync focus mode class and attribute
  useEffect(() => {
    if (focusMode) {
      document.documentElement.setAttribute('data-focus-mode', 'true')
      document.body.classList.add('focus-mode-active')
    } else {
      document.documentElement.removeAttribute('data-focus-mode')
      document.body.classList.remove('focus-mode-active')
    }
    try {
      localStorage.setItem('harish_focus_mode', String(focusMode))
    } catch {
      // ignore
    }
  }, [focusMode])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const toggleFocusMode = () => {
    setFocusMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        focusMode,
        setFocusMode,
        toggleFocusMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
