// Enhanced Authentication Provider - Supabase + Mock
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  UserRole, 
  SubscriptionPlan,
  canAccessFeature
} from './clerk-config';

import { mockAuthService, MockUser, MockOrganization } from './mock-auth';
import { SupabaseProvider, useSupabase } from './supabase-auth-provider';

const useSupabaseAuth = import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true';
const useMockAuth = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

console.log('🔧 Auth Configuration:', { 
  supabase: useSupabaseAuth, 
  mock: useMockAuth 
});

// Enhanced user context with role and organization info
interface EnhancedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  organizationRole?: string;
  subscriptionPlan: SubscriptionPlan;
  permissions: string[];
  isLoading: boolean;
}

interface OrganizationData {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  membersCount: number;
  plan: SubscriptionPlan;
  features: any;
  settings: any;
  isLoading: boolean;
}

interface SaaSContextType {
  user: EnhancedUser | null;
  organization: OrganizationData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasFeature: (feature: string) => boolean;
  isOnPlan: (plan: SubscriptionPlan) => boolean;
  switchOrganization: (orgId: string) => Promise<void>;
  createOrganization: (name: string, type: string) => Promise<void>;
  isDemoUser?: boolean;
}

const SaaSContext = createContext<SaaSContextType | null>(null);

// Custom hook to use SaaS context
export const useSaaS = () => {
  const context = useContext(SaaSContext);
  if (!context) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
};

// Hook for role-based access control
export const useRoleAccess = (requiredPermission: string, requiredFeature?: string) => {
  const { user, organization } = useSaaS();
  
  const access = {
    allowed: false,
    reason: 'Access denied'
  };

  if (!user) {
    access.reason = 'User not authenticated';
    return { ...access, loading: false };
  }

  // Check permission
  if (!user.permissions.includes(requiredPermission)) {
    access.reason = 'Insufficient permissions';
    return { ...access, loading: false };
  }

  // Check feature access if required
  if (requiredFeature && organization) {
    const hasFeature = canAccessFeature(organization.plan, requiredFeature as any);
    if (!hasFeature) {
      access.reason = 'Feature not available in current plan';
      return { ...access, loading: false };
    }
  }

  return { allowed: true, reason: '', loading: false };
};

// Development Provider με Mock Authentication System
function DevelopmentProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to mock auth changes
    const unsubscribe = mockAuthService.subscribe(() => {
      const mockUser = mockAuthService.getCurrentUser();
      const mockOrg = mockAuthService.getCurrentOrganization();

      console.log('🔍 Mock auth state changed:', { mockUser: mockUser?.firstName, mockOrg: mockOrg?.name });

      if (mockUser && mockOrg) {
        const enhancedUser: EnhancedUser = {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          imageUrl: mockUser.imageUrl,
          role: mockUser.role,
          organizationId: mockUser.organizationId,
          organizationName: mockUser.organizationName,
          organizationRole: mockUser.organizationRole,
          subscriptionPlan: mockUser.subscriptionPlan,
          permissions: mockUser.permissions,
          isLoading: false
        };

        const enhancedOrg: OrganizationData = {
          id: mockOrg.id,
          name: mockOrg.name,
          slug: mockOrg.slug,
          imageUrl: mockOrg.imageUrl,
          membersCount: mockOrg.membersCount,
          plan: mockOrg.plan,
          features: mockOrg.features,
          settings: mockOrg.settings,
          isLoading: false
        };

        setUser(enhancedUser);
        setOrganization(enhancedOrg);
      } else {
        setUser(null);
        setOrganization(null);
      }
      
      setIsLoading(false);
    });

    // Initial check - trigger the subscription manually to get current state
    setTimeout(() => {
      const currentUser = mockAuthService.getCurrentUser();
      const currentOrg = mockAuthService.getCurrentOrganization();
      
      console.log('🚀 Initial auth check:', { currentUser: currentUser?.firstName, currentOrg: currentOrg?.name });
      
      if (currentUser && currentOrg) {
        // User is already logged in - trigger the subscriber manually
        mockAuthService.notifyListeners();
      } else {
        console.log('⚠️ No authenticated user found');
        setIsLoading(false);
      }
    }, 100); // Small delay to allow auto-login to complete

    return unsubscribe;
  }, []);

  const mockContextValue: SaaSContextType = {
    user,
    organization,
    isAuthenticated: mockAuthService.isAuthenticated(),
    isLoading,
    hasPermission: (permission: string) => mockAuthService.hasPermission(permission),
    hasFeature: (feature: string) => organization ? canAccessFeature(organization.plan, feature as any) : false,
    isOnPlan: (plan: SubscriptionPlan) => organization?.plan === plan || false,
    switchOrganization: async (orgId: string) => {
      console.log('Dev mode: switching organization to', orgId);
    },
    createOrganization: async (name: string, type: string) => {
      console.log('Dev mode: creating organization', name, type);
    },
    isDemoUser: false, // Mock auth does not have a demo user concept
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <SaaSContext.Provider value={mockContextValue}>
      {mockAuthService.isAuthenticated() && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-2 text-center text-sm text-yellow-800">
          🚧 Development Mode - Logged in as {user?.firstName} {user?.lastName} ({user?.role})
        </div>
      )}
      {children}
    </SaaSContext.Provider>
  );
}

// Main SaaS Provider that wraps the entire application - Enhanced with Supabase
export function SaaSProvider({ children }: { children: ReactNode }) {
  if (useSupabaseAuth) {
    console.log('🚀 Using Supabase authentication (production mode)');
    return <SupabaseProvider>{children}</SupabaseProvider>;
  }
  
  if (useMockAuth) {
    console.log('🔧 Using mock authentication (development mode)');
    return <DevelopmentProvider>{children}</DevelopmentProvider>;
  }
  
  console.log('⚠️ No authentication method enabled, defaulting to mock');
  return <DevelopmentProvider>{children}</DevelopmentProvider>;
}

// Clerk functionality completely removed

// Component wrapper for protected routes
export const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredFeature,
  fallback 
}: {
  children: ReactNode;
  requiredPermission: string;
  requiredFeature?: string;
  fallback?: ReactNode;
}) => {
  const { allowed, loading } = useRoleAccess(requiredPermission, requiredFeature);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (!allowed) {
    return fallback || (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-red-600">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to access this feature.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default SaaSProvider;