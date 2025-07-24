import React from 'react'

export function Dashboard() {
  const user = localStorage.getItem('demo_user') || 'guest';
  
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📊 Ads Pro Dashboard</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('demo_user');
            window.location.href = '/';
          }}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Welcome, {user === 'admin' ? 'Αλέξανδρος (Admin)' : 'User'}!</h3>
        <p>🎉 Authentication is working!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h4>📈 Campaigns</h4>
          <p>Manage your campaigns</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h4>📊 Analytics</h4>
          <p>View performance data</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h4>⚙️ Settings</h4>
          <p>Configure your account</p>
        </div>
      </div>
    </div>
  )
}