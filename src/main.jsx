import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.mjs): hydrate it.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)

window.__fovBooted = true
