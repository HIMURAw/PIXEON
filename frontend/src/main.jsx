import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './page/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Index />
  </StrictMode>
)
