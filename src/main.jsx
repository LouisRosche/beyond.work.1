import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Performance monitoring (development only)
if (process.env.NODE_ENV === 'development') {
  // Log web vitals
  const logWebVitals = (metric) => {
    console.log(metric.name, metric.value)
  }

  // Measure performance
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`)
        }
      })
    })
    observer.observe({ entryTypes: ['paint'] })
  }
}

// Error boundary for React 18
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html has <div id="root"></div>')
}

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.log('SW registration failed:', error)
    })
  })
}
