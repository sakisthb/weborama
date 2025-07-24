import React from 'react';

const Debug: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Debug Page</h1>
      <p className="text-lg mb-4">If you can see this, React is working!</p>
      
      <div className="space-y-4">
        <div className="p-4 bg-green-100 border border-green-300 rounded">
          <h2 className="font-semibold text-green-800">✅ React is working</h2>
          <p className="text-green-700">The basic React app is functioning correctly.</p>
        </div>
        
        <div className="p-4 bg-blue-100 border border-blue-300 rounded">
          <h2 className="font-semibold text-blue-800">🔧 Environment Info</h2>
          <p className="text-blue-700">Node: {process.env.NODE_ENV}</p>
          <p className="text-blue-700">Vite: {import.meta.env.MODE}</p>
        </div>
        
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
          <h2 className="font-semibold text-yellow-800">⚠️ Next Steps</h2>
          <p className="text-yellow-700">If you see this page, the issue is likely with:</p>
          <ul className="list-disc list-inside text-yellow-700 mt-2">
            <li>Authentication system</li>
            <li>Route configuration</li>
            <li>Component imports</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Debug; 