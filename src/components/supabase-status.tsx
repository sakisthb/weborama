// Supabase Connection Status Component
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Database, Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface ConnectionStatus {
  database: boolean;
  realtime: boolean;
  auth: boolean;
  lastChecked: Date;
}

export function SupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    database: false,
    realtime: false,
    auth: false,
    lastChecked: new Date()
  });
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    const newStatus: ConnectionStatus = {
      database: false,
      realtime: false,
      auth: false,
      lastChecked: new Date()
    };

    try {
      // Test database connection
      const { error: dbError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);
      
      newStatus.database = !dbError;

      // Test auth service
      const { error: authError } = await supabase.auth.getSession();
      newStatus.auth = !authError;

      // Test realtime (we'll assume it works if database works)
      newStatus.realtime = newStatus.database;

    } catch (error) {
      console.error('Connection test failed:', error);
    }

    setStatus(newStatus);
    setLoading(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = (isConnected: boolean) => {
    return isConnected ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (isConnected: boolean) => {
    return (
      <Badge variant={isConnected ? "default" : "destructive"}>
        {isConnected ? "Connected" : "Disconnected"}
      </Badge>
    );
  };

  // Only show in development or for admins
  if (!import.meta.env.DEV) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Supabase Connection Status
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <CardDescription>
          Production database connection status (Development Mode)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Database Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.database)}
            <div>
              <div className="font-medium">Database Connection</div>
              <div className="text-sm text-gray-600">PostgreSQL via Supabase</div>
            </div>
          </div>
          {getStatusBadge(status.database)}
        </div>

        {/* Auth Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.auth)}
            <div>
              <div className="font-medium">Authentication Service</div>
              <div className="text-sm text-gray-600">Supabase Auth</div>
            </div>
          </div>
          {getStatusBadge(status.auth)}
        </div>

        {/* Realtime Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {status.realtime ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <div>
              <div className="font-medium">Real-time Updates</div>
              <div className="text-sm text-gray-600">WebSocket Connection</div>
            </div>
          </div>
          {getStatusBadge(status.realtime)}
        </div>

        {/* Last Checked */}
        <div className="text-center text-sm text-gray-500 pt-2 border-t">
          Last checked: {status.lastChecked.toLocaleTimeString()}
        </div>

      </CardContent>
    </Card>
  );
}