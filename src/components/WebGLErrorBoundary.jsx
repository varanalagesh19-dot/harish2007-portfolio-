import { Component } from 'react'

export default class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    if (typeof window !== 'undefined') {
      window.__lastWebGLError = error ? (error.stack || error.message || String(error)) : 'unknown'
    }
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (typeof window !== 'undefined') {
      window.__lastWebGLError = error ? (error.stack || error.message || String(error)) : 'unknown'
    }
    console.warn('WebGL scene error caught by WebGLErrorBoundary, falling back cleanly:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

