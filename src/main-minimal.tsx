import React from 'react'
import ReactDOM from 'react-dom/client'
import { MockLogin, ClerkLogin } from './Login'
import { Dashboard } from './Dashboard'

function App() {
  const path = window.location.pathname;
  
  // Simple routing
  if (path === '/mock-login') {
    return <MockLogin />
  }
  
  if (path === '/clerk-login') {
    return <ClerkLogin />
  }
  
  if (path === '/dashboard') {
    return <Dashboard />
  }
  
  // Home page
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>🚀 Ads Pro - Working!</h1>
      <p>Professional Marketing SaaS Platform</p>
      
      <div style={{ margin: '40px 0' }}>
        <h2>Choose Authentication:</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/mock-login" 
            style={{ 
              display: 'block',
              padding: '15px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            🔧 Mock Login (Demo)
          </a>
          
          <a 
            href="/clerk-login"
            style={{ 
              display: 'block',
              padding: '15px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            🔐 Clerk Login (Production)
          </a>
        </div>
      </div>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <p>✅ Server: Working</p>
        <p>✅ React: Working</p>
        <p>✅ Routing: Working</p>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)