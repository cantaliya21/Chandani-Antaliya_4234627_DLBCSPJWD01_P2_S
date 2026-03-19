/**
 * Main Entry Point for React Application
 * 
 * This file renders the root App component into the DOM.
 * React 18 uses createRoot for better performance.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
