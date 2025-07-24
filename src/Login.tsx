import React from 'react'

export function MockLogin() {
  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>🔧 Mock Login (Demo)</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>Demo Users:</h3>
        <button 
          onClick={() => {
            localStorage.setItem('demo_user', 'admin');
            window.location.href = '/dashboard';
          }}
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '10px', 
            margin: '10px 0',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login as Admin (Αλέξανδρος)
        </button>
        
        <button 
          onClick={() => {
            localStorage.setItem('demo_user', 'client');
            window.location.href = '/dashboard';
          }}
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '10px', 
            margin: '10px 0',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login as Client
        </button>
      </div>
    </div>
  )
}

export function ClerkLogin() {
  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>🔐 Clerk Login (Production)</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <p>Real authentication with:</p>
        <ul>
          <li>📧 Email/Password</li>
          <li>🔗 Google Sign-in</li>
          <li>📱 Facebook Login</li>
          <li>📞 Phone verification</li>
        </ul>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Note: Requires valid Clerk publishable key
        </p>
      </div>
    </div>
  )
}