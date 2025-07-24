import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  RefreshCw,
  Info,
  X,
  Copy,
  ExternalLink,
  Bug,
  Wifi,
  Server,
  Clock,
  Shield,
  HelpCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export interface ErrorInfo {
  id: string;
  type: 'connection' | 'authentication' | 'rate_limit' | 'validation' | 'server' | 'network' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  details?: string;
  timestamp: Date;
  platform?: string;
  retryable: boolean;
  suggestions?: string[];
  errorCode?: string;
  userAction?: string;
}

interface EnhancedErrorHandlingProps {
  error: ErrorInfo | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  onReport?: (error: ErrorInfo) => void;
  showDetails?: boolean;
  className?: string;
}

const ERROR_CONFIG = {
  connection: {
    icon: Wifi,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    title: 'Connection Error',
    description: 'Unable to connect to the service'
  },
  authentication: {
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
    title: 'Authentication Error',
    description: 'Invalid or expired credentials'
  },
  rate_limit: {
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    title: 'Rate Limit Exceeded',
    description: 'Too many requests, please wait'
  },
  validation: {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    title: 'Validation Error',
    description: 'Invalid input or configuration'
  },
  server: {
    icon: Server,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    title: 'Server Error',
    description: 'Internal server error occurred'
  },
  network: {
    icon: Wifi,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    borderColor: 'border-gray-200 dark:border-gray-800',
    title: 'Network Error',
    description: 'Network connectivity issue'
  },
  unknown: {
    icon: Bug,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    borderColor: 'border-gray-200 dark:border-gray-800',
    title: 'Unknown Error',
    description: 'An unexpected error occurred'
  }
};

const SEVERITY_CONFIG = {
  low: {
    color: 'bg-blue-100 text-blue-700',
    icon: Info
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-700',
    icon: AlertTriangle
  },
  high: {
    color: 'bg-orange-100 text-orange-700',
    icon: AlertCircle
  },
  critical: {
    color: 'bg-red-100 text-red-700',
    icon: AlertTriangle
  }
};

export function EnhancedErrorHandling({
  error,
  onRetry,
  onDismiss,
  onReport,
  showDetails = false,
  className = ''
}: EnhancedErrorHandlingProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isRetrying, setIsRetrying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!error) return null;

  const config = ERROR_CONFIG[error.type];
  const severityConfig = SEVERITY_CONFIG[error.severity];
  const Icon = config.icon;
  const SeverityIcon = severityConfig.icon;

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
      toast.success('Retry successful!');
    } catch (retryError) {
      toast.error('Retry failed. Please try again later.');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleCopyError = () => {
    const errorText = `Error: ${error.title}\nMessage: ${error.message}\nDetails: ${error.details || 'N/A'}\nTimestamp: ${error.timestamp.toISOString()}\nPlatform: ${error.platform || 'N/A'}\nError Code: ${error.errorCode || 'N/A'}`;
    
    navigator.clipboard.writeText(errorText).then(() => {
      setCopied(true);
      toast.success('Error details copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReportError = () => {
    if (onReport) {
      onReport(error);
      toast.success('Error reported successfully');
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Alert className={`${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTitle className="text-base font-semibold">
                {error.title}
              </AlertTitle>
              <Badge className={severityConfig.color}>
                <SeverityIcon className="w-3 h-3 mr-1" />
                {error.severity}
              </Badge>
              {error.platform && (
                <Badge variant="outline" className="text-xs">
                  {error.platform}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {getTimeAgo(error.timestamp)}
              </span>
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <AlertDescription className="text-sm">
            {error.message}
          </AlertDescription>

          {/* Error Details */}
          {isExpanded && (
            <div className="space-y-3 pt-2 border-t border-current/10">
              {error.details && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Technical Details:
                  </div>
                  <pre className="text-xs bg-black/5 dark:bg-white/5 p-2 rounded overflow-auto max-h-32">
                    {error.details}
                  </pre>
                </div>
              )}

              {error.errorCode && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Error Code:
                  </span>
                  <code className="text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
                    {error.errorCode}
                  </code>
                </div>
              )}

              {error.suggestions && error.suggestions.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Suggestions:
                  </div>
                  <ul className="text-xs space-y-1">
                    {error.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error.userAction && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    User Action:
                  </div>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                    {error.userAction}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {error.retryable && onRetry && (
              <Button
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyError}
              className={copied ? 'bg-green-50 text-green-700 border-green-200' : ''}
            >
              <Copy className="w-3 h-3 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>

            {onReport && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Bug className="w-3 h-3 mr-1" />
                    Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Error</DialogTitle>
                    <DialogDescription>
                      Help us improve by reporting this error. Your feedback is valuable.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                      <div className="text-sm font-medium mb-2">Error Summary:</div>
                      <div className="text-xs space-y-1">
                        <div><strong>Type:</strong> {error.type}</div>
                        <div><strong>Severity:</strong> {error.severity}</div>
                        <div><strong>Platform:</strong> {error.platform || 'N/A'}</div>
                        <div><strong>Message:</strong> {error.message}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleReportError} className="flex-1">
                        Report Error
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a 
                href="https://docs.adspro.com/troubleshooting" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Help
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; resetError: () => void }> }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; resetError: () => void }> }>) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
    
    // In production, you would send this to your error reporting service
    // reportErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full mx-auto p-6">
            <EnhancedErrorHandling
              error={{
                id: 'boundary-error',
                type: 'unknown',
                severity: 'high',
                title: 'Something went wrong',
                message: 'An unexpected error occurred. Please try refreshing the page.',
                details: this.state.error?.stack,
                timestamp: new Date(),
                retryable: true,
                suggestions: [
                  'Refresh the page',
                  'Clear your browser cache',
                  'Check your internet connection',
                  'Contact support if the problem persists'
                ]
              }}
              onRetry={this.resetError}
              showDetails={true}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Context for global error handling
interface ErrorContextType {
  addError: (error: Omit<ErrorInfo, 'id' | 'timestamp'>) => void;
  clearErrors: () => void;
  errors: ErrorInfo[];
}

const ErrorContext = React.createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = (errorData: Omit<ErrorInfo, 'id' | 'timestamp'>) => {
    const newError: ErrorInfo = {
      ...errorData,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    
    setErrors(prev => [newError, ...prev.slice(0, 9)]); // Keep last 10 errors
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ addError, clearErrors, errors }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrors() {
  const context = React.useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrors must be used within an ErrorProvider');
  }
  return context;
} 