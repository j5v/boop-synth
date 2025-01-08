import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { names } from './lib/appInfo.js'

document.title = names.appName;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
