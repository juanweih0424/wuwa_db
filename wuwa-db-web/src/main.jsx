import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import './assets/css/global.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import React from "react";

const basename = import.meta.env.MODE === "production" ? "/wuwa_db" : "/";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);