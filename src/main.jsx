import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // HashRouter only needed for GitHub Pages
import App from './App.jsx'
import './index.css'

// optional: surface runtime errors quickly
window.addEventListener('error', e => console.error('Runtime error:', e.error || e.message))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)