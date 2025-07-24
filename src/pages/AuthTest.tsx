import React, { useEffect, useState } from 'react';
import { useSaaS } from '@/lib/clerk-provider';
import { mockAuthService } from '@/lib/mock-auth';

const AuthTest: React.FC = () => {
  const { user, organization, isAuthenticated, isLoading } = useSaaS();
  const [mockUser, setMockUser] = useState<any>(null);
  const [mockOrg, setMockOrg] = useState<any>(null);

  useEffect(() => {
    // Get direct mock auth data
    const currentUser = mockAuthService.getCurrentUser();
    const currentOrg = mockAuthService.getCurrentOrganization();
    setMockUser(currentUser);
    setMockOrg(currentOrg);
  }, []);

  const handleAutoLogin = () => {
    // Force login with admin user
    mockAuthService.login('admin@adspro.com', 'admin123');
    window.location.reload();
  };

  const handleLogout = () => {
    mockAuthService.logout();
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SaaS Context Status */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">SaaS Context Status</h2>
          <div className="space-y-2">
            <p><strong>isLoading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? `${user.firstName} ${user.lastName}` : 'None'}</p>
            <p><strong>Organization:</strong> {organization ? organization.name : 'None'}</p>
          </div>
        </div>

        {/* Mock Auth Service Status */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Mock Auth Service Status</h2>
          <div className="space-y-2">
            <p><strong>Mock User:</strong> {mockUser ? `${mockUser.firstName} ${mockUser.lastName}` : 'None'}</p>
            <p><strong>Mock Organization:</strong> {mockOrg ? mockOrg.name : 'None'}</p>
            <p><strong>Is Authenticated:</strong> {mockAuthService.isAuthenticated() ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={handleAutoLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Force Auto Login
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Environment Info</h3>
        <div className="space-y-1 text-sm">
          <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
          <p><strong>VITE_ENABLE_MOCK_AUTH:</strong> {import.meta.env.VITE_ENABLE_MOCK_AUTH}</p>
          <p><strong>VITE_CLERK_PUBLISHABLE_KEY:</strong> {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}</p>
          <p><strong>DEV:</strong> {import.meta.env.DEV ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({
            user: user ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              subscriptionPlan: user.subscriptionPlan
            } : null,
            organization: organization ? {
              id: organization.id,
              name: organization.name,
              plan: organization.plan
            } : null,
            mockUser: mockUser ? {
              id: mockUser.id,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              role: mockUser.role
            } : null,
            mockOrg: mockOrg ? {
              id: mockOrg.id,
              name: mockOrg.name,
              plan: mockOrg.plan
            } : null
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AuthTest; 