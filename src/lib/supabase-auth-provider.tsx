// Supabase Authentication Provider - Production Ready
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, auth, db, Database } from './supabase';
import { UserRole, SubscriptionPlan } from './clerk-config';

// Enhanced user context with Supabase integration
interface SupabaseUser {
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

interface SupabaseContextType {
  user: SupabaseUser | null;
  organization: OrganizationData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasFeature: (feature: string) => boolean;
  isOnPlan: (plan: SubscriptionPlan) => boolean;
  switchOrganization: (orgId: string) => Promise<void>;
  createOrganization: (name: string, type: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signOut: () => Promise<void>;
  isDemoUser?: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

// Custom hook to use Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

// Main Supabase Provider
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Map Supabase user roles to our UserRole enum
  const mapUserRole = (role: string): UserRole => {
    switch (role) {
      case 'super_admin': return UserRole.SUPER_ADMIN;
      case 'admin': return UserRole.ADMIN;
      case 'moderator': return UserRole.MODERATOR;
      case 'client': return UserRole.CLIENT;
      case 'viewer': return UserRole.VIEWER;
      default: return UserRole.CLIENT;
    }
  };

  // Map organization plan to our SubscriptionPlan enum
  const mapSubscriptionPlan = (plan: string): SubscriptionPlan => {
    switch (plan) {
      case 'free': return SubscriptionPlan.FREE;
      case 'pro': return SubscriptionPlan.PROFESSIONAL;
      case 'enterprise': return SubscriptionPlan.ENTERPRISE;
      default: return SubscriptionPlan.FREE;
    }
  };

  // Get user permissions based on role
  const getUserPermissions = (role: UserRole): string[] => {
    const rolePermissions = {
      [UserRole.SUPER_ADMIN]: [
        'access_admin_panel',
        'manage_organization',
        'manage_campaigns',
        'manage_users',
        'view_analytics',
        'manage_billing',
        'manage_integrations',
        'access_ai_features',
        'access_attribution_features',
        'manage_clients'
      ],
      [UserRole.ADMIN]: [
        'manage_organization',
        'manage_campaigns',
        'manage_users',
        'view_analytics',
        'manage_billing',
        'manage_integrations',
        'access_ai_features',
        'access_attribution_features',
        'manage_clients'
      ],
      [UserRole.MODERATOR]: [
        'manage_campaigns',
        'manage_integrations',
        'view_analytics',
        'manage_clients',
        'access_ai_features',
        'access_attribution_features'
      ],
      [UserRole.CLIENT]: [
        'campaigns:read',
        'analytics:read',
        'view_analytics',
        'view_campaigns',
        'realtime:read',
        'view_own_campaigns',
        'view_own_analytics',
        'limited_ai_features'
      ],
      [UserRole.VIEWER]: [
        'campaigns:read',
        'analytics:read',
        'view_analytics',
        'view_campaigns',
        'realtime:read'
      ]
    };
    return rolePermissions[role] || [];
  };

  // Load user profile and organization data
  const loadUserData = async (supabaseUser: any) => {
    try {
      console.log('🔄 Loading user data for:', supabaseUser.email);

      // Get user profile from app.users table
      const { data: userProfile, error: userError } = await db.getUserProfile(supabaseUser.id);
      
      if (userError) {
        console.error('❌ Error loading user profile:', userError);
        // Create user profile if it doesn't exist
        const newUserProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          first_name: supabaseUser.user_metadata?.first_name || '',
          last_name: supabaseUser.user_metadata?.last_name || '',
          role: 'user' as const,
          organization_id: null
        };
        
        const { error: createError } = await db.upsertUserProfile(newUserProfile);
        if (createError) {
          console.error('❌ Error creating user profile:', createError);
          return;
        }
      }

      const profile = userProfile || {
        id: supabaseUser.id,
        email: supabaseUser.email,
        first_name: supabaseUser.user_metadata?.first_name || '',
        last_name: supabaseUser.user_metadata?.last_name || '',
        role: 'user',
        organization_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Load organization data if user has one
      let orgData: OrganizationData | null = null;
      if (profile.organization_id) {
        const { data: org, error: orgError } = await db.getUserOrganization(profile.organization_id);
        if (!orgError && org) {
          orgData = {
            id: org.id,
            name: org.name,
            slug: org.slug,
            imageUrl: '', // TODO: Add org image support
            membersCount: 1, // TODO: Calculate from members
            plan: mapSubscriptionPlan(org.plan),
            features: org.settings?.features || {},
            settings: org.settings || {},
            isLoading: false
          };
        }
      }

      // Create enhanced user object
      const role = mapUserRole(profile.role);
      const enhancedUser: SupabaseUser = {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        imageUrl: supabaseUser.user_metadata?.avatar_url || '',
        role,
        organizationId: profile.organization_id || undefined,
        organizationName: orgData?.name,
        organizationRole: profile.role,
        subscriptionPlan: orgData?.plan || SubscriptionPlan.FREE,
        permissions: getUserPermissions(role),
        isLoading: false
      };

      setUser(enhancedUser);
      setOrganization(orgData);
      
      console.log('✅ User data loaded:', {
        email: enhancedUser.email,
        role: enhancedUser.role,
        organization: orgData?.name
      });

    } catch (error) {
      console.error('❌ Error in loadUserData:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 Initializing Supabase auth...');

    // Get initial session
    auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session:', session ? 'Found' : 'None');
      setSession(session);
      if (session?.user) {
        loadUserData(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      setSession(session);
      if (session?.user) {
        setIsLoading(true);
        await loadUserData(session.user);
      } else {
        setUser(null);
        setOrganization(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    console.log('🔐 Signing in user:', email);
    const result = await auth.signIn(email, password);
    if (result.error) {
      console.error('❌ Sign in error:', result.error);
    } else {
      console.log('✅ Sign in successful');
    }
    return result;
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('📝 Signing up user:', email);
    const result = await auth.signUp(email, password, {
      data: userData
    });
    if (result.error) {
      console.error('❌ Sign up error:', result.error);
    } else {
      console.log('✅ Sign up successful');
    }
    return result;
  };

  const signOut = async () => {
    console.log('👋 Signing out user');
    const result = await auth.signOut();
    if (result.error) {
      console.error('❌ Sign out error:', result.error);
    } else {
      console.log('✅ Sign out successful');
      setUser(null);
      setOrganization(null);
      setSession(null);
    }
  };

  const contextValue: SupabaseContextType = {
    user,
    organization,
    isAuthenticated: !!session,
    isLoading,
    hasPermission: (permission: string) => user?.permissions.includes(permission) || false,
    hasFeature: (feature: string) => {
      // TODO: Implement feature checking based on organization plan
      return true;
    },
    isOnPlan: (plan: SubscriptionPlan) => organization?.plan === plan || false,
    switchOrganization: async (orgId: string) => {
      console.log('🔄 Switching organization:', orgId);
      // TODO: Implement organization switching
    },
    createOrganization: async (name: string, type: string) => {
      console.log('🏢 Creating organization:', name, type);
      // TODO: Implement organization creation
    },
    signIn,
    signUp,
    signOut,
    isDemoUser: false // Supabase users are real users
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={contextValue}>
      {session && (
        <div className="bg-green-50 border-b border-green-200 p-2 text-center text-sm text-green-800">
          🚀 Production Mode - Authenticated with Supabase as {user?.firstName} {user?.lastName} ({user?.role})
        </div>
      )}
      {children}
    </SupabaseContext.Provider>
  );
}

export default SupabaseProvider;