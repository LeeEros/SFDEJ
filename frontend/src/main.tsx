import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/style.css'
import { BrowserRouter } from 'react-router'

import AppRouter from './routes/AppRoutes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
)
