// API Error Handler - Option B Component  
// Production-grade error handling with fallbacks and recovery

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Clock, 
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

export interface APIError {
  platform: string;
  endpoint: string;
  error: string;
  timestamp: Date;
  statusCode?: number;
  retryCount: number;
  recoverable: boolean;
}

export interface ErrorHandlerConfig {
  maxRetries: number;
  retryDelay: number;
  enableFallback: boolean;
  enableNotifications: boolean;
}

interface APIErrorHandlerProps {
  errors: APIError[];
  onRetry: (platform: string) => Promise<void>;
  onClearErrors: () => void;
  config?: Partial<ErrorHandlerConfig>;
}

export function APIErrorHandler({ 
  errors, 
  onRetry, 
  onClearErrors, 
  config = {} 
}: APIErrorHandlerProps) {
  const [retryingPlatforms, setRetryingPlatforms] = useState<Set<string>>(new Set());
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  
  const defaultConfig: ErrorHandlerConfig = {
    maxRetries: 3,
    retryDelay: 5000,
    enableFallback: true,
    enableNotifications: true,
    ...config
  };

  // Auto-retry logic for recoverable errors
  useEffect(() => {
    if (!autoRetryEnabled) return;

    const retryableErrors = errors.filter(error => 
      error.recoverable && 
      error.retryCount < defaultConfig.maxRetries &&
      !retryingPlatforms.has(error.platform)
    );

    if (retryableErrors.length === 0) return;

    const timeouts = retryableErrors.map(error => {
      const delay = defaultConfig.retryDelay * Math.pow(2, error.retryCount); // Exponential backoff
      
      return setTimeout(async () => {
        console.log(`🔄 [Error Handler] Auto-retry for ${error.platform} (attempt ${error.retryCount + 1})`);
        await handleRetry(error.platform);
      }, delay);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [errors, autoRetryEnabled, retryingPlatforms]);

  const handleRetry = async (platform: string) => {
    setRetryingPlatforms(prev => new Set([...prev, platform]));
    
    try {
      await onRetry(platform);
      console.log(`✅ [Error Handler] Retry successful for ${platform}`);
    } catch (error) {
      console.error(`🚫 [Error Handler] Retry failed for ${platform}:`, error);
    } finally {
      setRetryingPlatforms(prev => {
        const newSet = new Set(prev);
        newSet.delete(platform);
        return newSet;
      });
    }
  };

  const getErrorSeverity = (error: APIError): 'low' | 'medium' | 'high' | 'critical' => {
    if (error.statusCode === 401 || error.statusCode === 403) return 'critical';
    if (error.statusCode === 429) return 'high';
    if (error.statusCode && error.statusCode >= 500) return 'medium';
    if (error.retryCount >= defaultConfig.maxRetries) return 'high';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'low': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const groupedErrors = errors.reduce((acc, error) => {
    const platform = error.platform;
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(error);
    return acc;
  }, {} as Record<string, APIError[]>);

  const criticalErrors = errors.filter(e => getErrorSeverity(e) === 'critical');
  const hasRecoverableErrors = errors.some(e => e.recoverable);

  // Only show in development or when there are errors
  if (!import.meta.env.DEV && errors.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            API Error Handler
            <Badge variant={errors.length > 0 ? "destructive" : "default"}>
              {errors.length > 0 ? `${errors.length} Errors` : 'All Good'}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoRetryEnabled(!autoRetryEnabled)}
              className={autoRetryEnabled ? 'text-green-600' : 'text-gray-500'}
            >
              {autoRetryEnabled ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              Auto-Retry
            </Button>
            {errors.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearErrors}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Real-time API error monitoring with automatic recovery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Critical Errors Alert */}
        {criticalErrors.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Critical API Errors Detected</AlertTitle>
            <AlertDescription className="text-red-700">
              {criticalErrors.length} critical error{criticalErrors.length !== 1 ? 's' : ''} require immediate attention. 
              Authentication or authorization issues detected.
            </AlertDescription>
          </Alert>
        )}

        {/* Configuration Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Max Retries</span>
            </div>
            <div className="text-lg font-bold text-blue-600">{defaultConfig.maxRetries}</div>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Retry Delay</span>
            </div>
            <div className="text-lg font-bold text-green-600">{defaultConfig.retryDelay}ms</div>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Fallback</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {defaultConfig.enableFallback ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Auto-Retry</span>
            </div>
            <div className="text-lg font-bold text-orange-600">
              {autoRetryEnabled ? 'On' : 'Off'}
            </div>
          </div>
        </div>

        {/* Error List */}
        {errors.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              All APIs Operating Normally
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No errors detected. All platform integrations are healthy.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              Platform Errors ({Object.keys(groupedErrors).length} platforms affected)
            </h4>
            
            {Object.entries(groupedErrors).map(([platform, platformErrors]) => (
              <div key={platform} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {platform.toUpperCase()}
                    </h5>
                    <Badge variant="secondary">
                      {platformErrors.length} error{platformErrors.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasRecoverableErrors && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(platform)}
                        disabled={retryingPlatforms.has(platform)}
                      >
                        {retryingPlatforms.has(platform) ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Retry
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {platformErrors.map((error, index) => {
                    const severity = getErrorSeverity(error);
                    const colorClass = getSeverityColor(severity);
                    
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border ${colorClass}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(severity)}
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {error.endpoint}
                              </div>
                              <div className="text-sm opacity-90 mt-1">
                                {error.error}
                              </div>
                              <div className="text-xs opacity-75 mt-2 flex items-center gap-4">
                                <span>
                                  {error.timestamp.toLocaleTimeString()}
                                </span>
                                <span>
                                  Retry {error.retryCount}/{defaultConfig.maxRetries}
                                </span>
                                {error.statusCode && (
                                  <span>
                                    Status: {error.statusCode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant={error.recoverable ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {error.recoverable ? 'Recoverable' : 'Manual Fix Required'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recovery Suggestions */}
        {errors.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🛠️ Recovery Suggestions
            </h5>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {criticalErrors.length > 0 && (
                <li>• Check API credentials and permissions for critical errors</li>
              )}
              {errors.some(e => e.statusCode === 429) && (
                <li>• Rate limits detected - automatic backoff is active</li>
              )}
              {errors.some(e => e.statusCode && e.statusCode >= 500) && (
                <li>• Server errors detected - platform may be experiencing issues</li>
              )}
              {!autoRetryEnabled && hasRecoverableErrors && (
                <li>• Enable auto-retry for automatic error recovery</li>
              )}
              <li>• Monitor the API monitoring dashboard for detailed insights</li>
            </ul>
          </div>
        )}

      </CardContent>
    </Card>
  );
}