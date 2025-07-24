// Protected Layout για authenticated routes
import { useSaaS } from '@/lib/clerk-provider';
import { Navbar } from '@/components/navbar';
import { AppSidebar } from '@/components/appSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { mockAuthService } from '@/lib/mock-auth';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isLoading, isAuthenticated, user, organization } = useSaaS();
  const [showWizard, setShowWizard] = useState(false);
  const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

  // Debug panel actions
  const handleForceReload = () => {
    localStorage.removeItem('mock_auth_session');
    // Auto-login is handled internally by mock service
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('mock_auth_session');
    window.location.href = '/login';
  };

  const debugPanel = (
    <div className="mb-2 p-2 bg-yellow-50 border-b border-yellow-200 text-xs text-yellow-900 rounded-b shadow flex items-center gap-4">
      <div>
        <strong>DEBUG USER:</strong> {user?.id} | {user?.email} | <b>role:</b> {user?.role} | <b>source:</b> {isMock ? 'MOCK' : 'CLERK'}<br />
        <b>Permissions:</b> {user?.permissions?.join(', ') || 'none'}
      </div>
      <button
        onClick={handleForceReload}
        className="px-2 py-1 bg-blue-200 text-blue-900 rounded border border-blue-300 hover:bg-blue-300 transition"
      >
        Force Reload User
      </button>
      <button
        onClick={handleLogout}
        className="px-2 py-1 bg-red-200 text-red-900 rounded border border-red-300 hover:bg-red-300 transition"
      >
        Logout
      </button>
      <button
        onClick={() => setShowWizard(w => !w)}
        className="px-2 py-1 bg-green-200 text-green-900 rounded border border-green-300 hover:bg-green-300 transition"
      >
        Switch to Production
      </button>
      {showWizard && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-300 rounded shadow-lg p-4 w-[400px] text-sm text-gray-900">
          <h3 className="font-bold mb-2">Switch to Production (Clerk) Login</h3>
          <ol className="list-decimal ml-5 mb-2">
            <li>Άνοιξε το αρχείο <b>.env.local</b> στο <b>ui/</b> directory.</li>
            <li>Άλλαξε <code>VITE_ENABLE_MOCK_AUTH=true</code> σε <code>VITE_ENABLE_MOCK_AUTH=false</code></li>
            <li>Κάνε <b>restart</b> το Vite dev server (π.χ. <code>Ctrl+C</code> και <code>pnpm run dev</code>).</li>
            <li>Κάνε refresh τη σελίδα και κάνε login με Clerk.</li>
          </ol>
          <p className="mb-2">Αν είσαι σε production, το Clerk login θα εμφανιστεί αυτόματα.</p>
          <button
            onClick={() => setShowWizard(false)}
            className="mt-2 px-2 py-1 bg-gray-200 text-gray-900 rounded border border-gray-300 hover:bg-gray-300 transition"
          >
            Κλείσιμο
          </button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col w-full min-h-screen bg-background">
        {debugPanel}
        <Navbar />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}