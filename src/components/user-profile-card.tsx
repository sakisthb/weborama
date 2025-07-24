// User Profile Card - Shows current authenticated user
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSaaS } from '@/lib/clerk-provider';
import { User, Mail, Building, Calendar, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserProfileCard() {
  const { user, organization, isAuthenticated, isDemoUser } = useSaaS();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Not authenticated</p>
          <Button 
            onClick={() => navigate('/welcome')}
            className="mt-4"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSignOut = async () => {
    // Handle sign out based on auth type
    if (import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true') {
      // Supabase sign out logic will be handled by the provider
      window.location.href = '/welcome';
    } else {
      // Mock auth sign out
      localStorage.removeItem('demo_user');
      window.location.href = '/';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-500';
      case 'ADMIN': return 'bg-blue-500';
      case 'MODERATOR': return 'bg-green-500';
      case 'CLIENT': return 'bg-yellow-500';
      case 'VIEWER': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            User Profile
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
        <CardDescription>
          Current user information and organization details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* User Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback>
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">
                {user.firstName} {user.lastName}
              </h3>
              <Badge className={`${getRoleColor(user.role)} text-white`}>
                {user.role}
              </Badge>
              {isDemoUser && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  Demo User
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              {organization && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {organization.name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Organization Info */}
        {organization && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-900">Organization</h4>
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                {organization.plan} Plan
              </Badge>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Name:</strong> {organization.name}</p>
              <p><strong>Members:</strong> {organization.membersCount}</p>
              <p><strong>Features:</strong> {Object.keys(organization.features || {}).length} enabled</p>
            </div>
          </div>
        )}

        {/* Permissions Summary */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {user.permissions.slice(0, 4).map((permission) => (
              <Badge 
                key={permission} 
                variant="outline" 
                className="text-green-700 border-green-300 text-xs"
              >
                {permission.replace(/_/g, ' ')}
              </Badge>
            ))}
            {user.permissions.length > 4 && (
              <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                +{user.permissions.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Auth Method Indicator */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t">
          {import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true' ? (
            <span className="text-green-600">🚀 Authenticated via Supabase (Production)</span>
          ) : (
            <span className="text-yellow-600">🔧 Authenticated via Mock Auth (Development)</span>
          )}
        </div>

      </CardContent>
    </Card>
  );
}