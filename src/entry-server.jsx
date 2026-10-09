// Build-time prerender entry (scripts/prerender.mjs). The page ships as static
// HTML so the wordmark and all copy paint before any JavaScript runs; the
// client then hydrates it (src/main.jsx).
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
