// Development User Switcher - Quick role switching for testing
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAuthService, MOCK_USERS, MOCK_ORGANIZATIONS } from '@/lib/mock-auth';
import { UserRole } from '@/lib/clerk-config';
import { User, Shield, Users, Eye, Briefcase, X } from 'lucide-react';

export function DevUserSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const currentUser = mockAuthService.getCurrentUser();

  // Don't show in production
  if (!import.meta.env.DEV) return null;

  const handleUserSwitch = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    const org = MOCK_ORGANIZATIONS.find(o => o.id === user?.organizationId);
    
    if (user && org) {
      mockAuthService.logout();
      mockAuthService.login(user.email, 'dev-password');
      window.location.reload(); // Refresh to apply new user context
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return <Shield className="h-4 w-4" />;
      case UserRole.ADMIN: return <Briefcase className="h-4 w-4" />;
      case UserRole.MODERATOR: return <Users className="h-4 w-4" />;
      case UserRole.CLIENT: return <User className="h-4 w-4" />;
      case UserRole.VIEWER: return <Eye className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-red-500';
      case UserRole.ADMIN: return 'bg-blue-500';
      case UserRole.MODERATOR: return 'bg-green-500';
      case UserRole.CLIENT: return 'bg-yellow-500';
      case UserRole.VIEWER: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        >
          🔧 Dev Mode
          {currentUser && (
            <Badge variant="outline" className="ml-2">
              {currentUser.firstName}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              🔧 Development Mode
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Switch between user roles for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Current User */}
          {currentUser && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.imageUrl} />
                  <AvatarFallback>{currentUser.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </div>
                </div>
                <Badge className={`${getRoleColor(currentUser.role)} text-white`}>
                  {getRoleIcon(currentUser.role)}
                  <span className="ml-1">{currentUser.role}</span>
                </Badge>
              </div>
            </div>
          )}

          {/* User Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Switch to user:</label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_USERS.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span>{user.firstName} {user.lastName}</span>
                      <Badge variant="outline" className="ml-auto">
                        {user.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedUser && (
              <Button 
                onClick={() => handleUserSwitch(selectedUser)}
                className="w-full"
                size="sm"
              >
                Switch User & Reload
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Switch:</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUserSwitch('admin-001')}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUserSwitch('client-001')}
                className="text-xs"
              >
                <User className="h-3 w-3 mr-1" />
                Client
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUserSwitch('moderator-001')}
                className="text-xs"
              >
                <Users className="h-3 w-3 mr-1" />
                Moderator
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUserSwitch('viewer-001')}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Viewer
              </Button>
            </div>
          </div>

          {/* Logout Option */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              mockAuthService.logout();
              window.location.href = '/';
            }}
            className="w-full"
          >
            Logout & Go to Landing
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}