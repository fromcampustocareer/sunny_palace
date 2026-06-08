import React from 'react'

/**
 * App-wide error boundary. Catches render-time errors anywhere in the tree
 * and shows a minimal on-brand fallback instead of a blank white page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          background: '#F2E4CE',
          color: '#1a1a1a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, maxWidth: '30rem', lineHeight: 1.5 }}>
          Please refresh the page to keep going.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            cursor: 'pointer',
            padding: '0.65rem 1.5rem',
            border: 'none',
            borderRadius: '999px',
            background: '#1a1a1a',
            color: '#F2E4CE',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Reload
        </button>
      </div>
    )
  }
}
