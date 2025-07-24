// Data Mode Indicator - Shows if using demo or production data
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductionData } from '@/hooks/use-production-data';
import { Database, TestTube, Plus, RefreshCw } from 'lucide-react';

export function DataModeIndicator() {
  const { isUsingDemoData, isLoading, error, refresh, createSampleData } = useProductionData();

  // Only show in development or when using demo data
  if (!import.meta.env.DEV && !isUsingDemoData) return null;

  return (
    <Alert className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isUsingDemoData ? (
            <TestTube className="h-5 w-5 text-orange-500" />
          ) : (
            <Database className="h-5 w-5 text-green-500" />
          )}
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {isUsingDemoData ? 'Demo Data Mode' : 'Production Data Mode'}
              </span>
              <Badge variant={isUsingDemoData ? "secondary" : "default"}>
                {isUsingDemoData ? '📊 Demo' : '🚀 Live'}
              </Badge>
            </div>
            
            <AlertDescription>
              {isUsingDemoData ? (
                <>
                  You're viewing sample data for demonstration purposes. 
                  {import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true' && (
                    <> Create real campaigns to see your actual data.</>
                  )}
                </>
              ) : (
                "You're viewing your live campaign data from the database."
              )}
            </AlertDescription>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          
          {isUsingDemoData && import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true' && (
            <Button
              size="sm"
              onClick={createSampleData}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Sample Data
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
    </Alert>
  );
}