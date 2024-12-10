import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {AppKitProvider} from "./AppKit.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AppKitProvider>
          <App />
      </AppKitProvider>
  </StrictMode>,
)
