import React from 'react';
import { useSaaS } from '@/lib/clerk-provider';

const DashboardTest: React.FC = () => {
  const { user, organization, isAuthenticated } = useSaaS();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">✅ Basic Dashboard</h2>
          <p>If you can see this, the basic Dashboard component works.</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">👤 User Info</h2>
          <p><strong>User:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Organization:</strong> {organization?.name}</p>
        </div>
      </div>

      <div className="mt-6 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔧 Next Steps</h2>
        <p>If this works, the issue is with specific Dashboard imports or components.</p>
      </div>
    </div>
  );
};

export default DashboardTest; 