import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import index from './page/index'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <index />
  </StrictMode>,
)
