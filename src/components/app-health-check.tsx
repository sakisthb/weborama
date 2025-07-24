// Application Health Check - Development utility
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Monitor } from 'lucide-react';

interface HealthStatus {
  server: boolean;
  landingPage: boolean;
  authentication: boolean;
  dashboard: boolean;
  supabase: boolean;
  lastChecked: Date;
}

export function AppHealthCheck() {
  const [status, setStatus] = useState<HealthStatus>({
    server: false,
    landingPage: false,
    authentication: false,
    dashboard: false,
    supabase: false,
    lastChecked: new Date()
  });
  const [loading, setLoading] = useState(false);

  const runHealthCheck = async () => {
    setLoading(true);
    const newStatus: HealthStatus = {
      server: false,
      landingPage: false,
      authentication: false,
      dashboard: false,
      supabase: false,
      lastChecked: new Date()
    };

    try {
      // Test 1: Server Response
      const serverResponse = await fetch('/', { method: 'HEAD' });
      newStatus.server = serverResponse.ok;

      // Test 2: Landing Page
      const landingResponse = await fetch('/');
      const landingText = await landingResponse.text();
      newStatus.landingPage = landingText.includes('Ads Pro') && landingText.length > 1000;

      // Test 3: Authentication Pages
      const authResponse = await fetch('/welcome');
      newStatus.authentication = authResponse.ok;

      // Test 4: Dashboard (will redirect if not authenticated, but should respond)
      const dashboardResponse = await fetch('/dashboard');
      newStatus.dashboard = dashboardResponse.ok;

      // Test 5: Environment Variables (Supabase)
      newStatus.supabase = !!(
        import.meta.env.VITE_SUPABASE_URL && 
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

    } catch (error) {
      console.error('Health check error:', error);
    }

    setStatus(newStatus);
    setLoading(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (isHealthy: boolean) => {
    return isHealthy ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (isHealthy: boolean) => {
    return (
      <Badge variant={isHealthy ? "default" : "destructive"}>
        {isHealthy ? "✅ OK" : "❌ Error"}
      </Badge>
    );
  };

  const overallHealth = Object.values(status).filter((val, idx) => 
    idx < 5 && val === true
  ).length;

  // Only show in development
  if (!import.meta.env.DEV) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5 text-blue-600" />
            Application Health Check
            <Badge variant={overallHealth >= 4 ? "default" : "secondary"}>
              {overallHealth}/5 Systems OK
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={runHealthCheck}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Check
          </Button>
        </div>
        <CardDescription>
          System status and component health monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* Server Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.server)}
            <div>
              <div className="font-medium">Development Server</div>
              <div className="text-sm text-gray-600">Vite dev server on localhost:5501</div>
            </div>
          </div>
          {getStatusBadge(status.server)}
        </div>

        {/* Landing Page */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.landingPage)}
            <div>
              <div className="font-medium">Landing Page</div>
              <div className="text-sm text-gray-600">Marketing page loads with content</div>
            </div>
          </div>
          {getStatusBadge(status.landingPage)}
        </div>

        {/* Authentication */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.authentication)}
            <div>
              <div className="font-medium">Authentication System</div>
              <div className="text-sm text-gray-600">Login/signup pages accessible</div>
            </div>
          </div>
          {getStatusBadge(status.authentication)}
        </div>

        {/* Dashboard */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.dashboard)}
            <div>
              <div className="font-medium">Dashboard Application</div>
              <div className="text-sm text-gray-600">Main application routes</div>
            </div>
          </div>
          {getStatusBadge(status.dashboard)}
        </div>

        {/* Supabase Configuration */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.supabase)}
            <div>
              <div className="font-medium">Supabase Configuration</div>
              <div className="text-sm text-gray-600">Environment variables set</div>
            </div>
          </div>
          {getStatusBadge(status.supabase)}
        </div>

        {/* Overall Status */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Overall System Health: 
              <span className={`ml-2 ${overallHealth >= 4 ? 'text-green-600' : overallHealth >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                {overallHealth >= 4 ? '🟢 Excellent' : overallHealth >= 3 ? '🟡 Good' : '🔴 Issues Detected'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last checked: {status.lastChecked.toLocaleTimeString()}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}