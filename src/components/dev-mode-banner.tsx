// Development Mode Banner - Shows when in development
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAuthService } from '@/lib/mock-auth';

export function DevModeBanner() {
  // Only show in development
  if (!import.meta.env.DEV) return null;

  const currentUser = mockAuthService.getCurrentUser();
  
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            🔧 Development Mode
          </Badge>
          {currentUser ? (
            <span className="text-sm text-yellow-800">
              Logged in as <strong>{currentUser.firstName} {currentUser.lastName}</strong> ({currentUser.role})
            </span>
          ) : (
            <span className="text-sm text-yellow-800">
              No user authenticated - Auto-login enabled
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-yellow-700">
            Mock Auth • Sample Data • Safe Testing
          </span>
        </div>
      </div>
    </div>
  );
}