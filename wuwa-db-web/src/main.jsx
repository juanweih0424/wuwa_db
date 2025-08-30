import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import './assets/css/global.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    
  </StrictMode>,
)
