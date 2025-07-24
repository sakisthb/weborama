import React from 'react';
import { ProtectedLayout } from '@/components/protected-layout';

const LayoutTest: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Layout Test</h1>
      <p className="text-lg mb-4">If you can see this, the ProtectedLayout is working!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">✅ Success</h2>
          <p>The layout components are rendering correctly.</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔧 Next Steps</h2>
          <p>Check if the issue is with specific page components.</p>
        </div>
      </div>
    </div>
  );
};

// Wrap with ProtectedLayout for testing
const LayoutTestWithLayout = () => (
  <ProtectedLayout>
    <LayoutTest />
  </ProtectedLayout>
);

export default LayoutTestWithLayout; 