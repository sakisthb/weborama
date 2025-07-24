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
  retryCount?: number;
  maxRetries?: number;
}

export interface ErrorConfig {
  autoRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  showNotifications: boolean;
  logToConsole: boolean;
  reportToAnalytics: boolean;
}

class ErrorManager {
  private errors: Map<string, ErrorInfo> = new Map();
  private retryQueue: Map<string, { fn: () => Promise<any>; retryCount: number; maxRetries: number }> = new Map();
  private config: ErrorConfig = {
    autoRetry: true,
    maxRetries: 3,
    retryDelay: 1000,
    showNotifications: true,
    logToConsole: true,
    reportToAnalytics: true
  };

  constructor() {
    this.setupErrorListeners();
  }

  private setupErrorListeners() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'unknown',
        severity: 'high',
        title: 'JavaScript Error',
        message: event.message,
        details: event.error?.stack,
        retryable: false,
        errorCode: 'JS_ERROR'
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unknown',
        severity: 'high',
        title: 'Unhandled Promise Rejection',
        message: event.reason?.message || 'Promise rejected',
        details: event.reason?.stack,
        retryable: false,
        errorCode: 'PROMISE_REJECTION'
      });
    });
  }

  public setConfig(config: Partial<ErrorConfig>) {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): ErrorConfig {
    return this.config;
  }

  public handleError(errorData: Omit<ErrorInfo, 'id' | 'timestamp'>): string {
    const error: ErrorInfo = {
      ...errorData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.config.maxRetries
    };

    this.errors.set(error.id, error);

    // Log to console if enabled
    if (this.config.logToConsole) {
      this.logError(error);
    }

    // Show notification if enabled
    if (this.config.showNotifications) {
      this.showNotification(error);
    }

    // Report to analytics if enabled
    if (this.config.reportToAnalytics) {
      this.reportToAnalytics(error);
    }

    return error.id;
  }

  public async executeWithRetry<T>(
    fn: () => Promise<T>,
    errorContext: Omit<ErrorInfo, 'id' | 'timestamp' | 'retryable' | 'retryCount' | 'maxRetries'>
  ): Promise<T> {
    const maxRetries = this.config.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          // Final attempt failed, handle error
          this.handleError({
            ...errorContext,
            message: lastError.message,
            details: lastError.stack,
            retryable: false,
            retryCount: attempt,
            maxRetries
          });
          throw lastError;
        }

        // Log retry attempt
        if (this.config.logToConsole) {
          console.warn(`Retry attempt ${attempt + 1}/${maxRetries} failed:`, lastError.message);
        }

        // Wait before retry
        if (this.config.retryDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * (attempt + 1)));
        }
      }
    }

    throw lastError;
  }

  public retryError(errorId: string, fn: () => Promise<any>): Promise<any> {
    const error = this.errors.get(errorId);
    if (!error) {
      throw new Error('Error not found');
    }

    if (!error.retryable) {
      throw new Error('Error is not retryable');
    }

    const retryCount = (error.retryCount || 0) + 1;
    const maxRetries = error.maxRetries || this.config.maxRetries;

    if (retryCount > maxRetries) {
      throw new Error('Max retries exceeded');
    }

    // Update error with retry count
    error.retryCount = retryCount;
    this.errors.set(errorId, error);

    return fn();
  }

  public getError(errorId: string): ErrorInfo | undefined {
    return this.errors.get(errorId);
  }

  public getAllErrors(): ErrorInfo[] {
    return Array.from(this.errors.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getErrorsByType(type: ErrorInfo['type']): ErrorInfo[] {
    return this.getAllErrors().filter(error => error.type === type);
  }

  public getErrorsBySeverity(severity: ErrorInfo['severity']): ErrorInfo[] {
    return this.getAllErrors().filter(error => error.severity === severity);
  }

  public getErrorsByPlatform(platform: string): ErrorInfo[] {
    return this.getAllErrors().filter(error => error.platform === platform);
  }

  public clearError(errorId: string): boolean {
    return this.errors.delete(errorId);
  }

  public clearAllErrors(): void {
    this.errors.clear();
  }

  public clearErrorsByType(type: ErrorInfo['type']): void {
    for (const [id, error] of this.errors.entries()) {
      if (error.type === type) {
        this.errors.delete(id);
      }
    }
  }

  public clearErrorsByPlatform(platform: string): void {
    for (const [id, error] of this.errors.entries()) {
      if (error.platform === platform) {
        this.errors.delete(id);
      }
    }
  }

  public getErrorStats() {
    const errors = this.getAllErrors();
    const stats = {
      total: errors.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      byPlatform: {} as Record<string, number>,
      retryable: errors.filter(e => e.retryable).length,
      critical: errors.filter(e => e.severity === 'critical').length
    };

    errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      if (error.platform) {
        stats.byPlatform[error.platform] = (stats.byPlatform[error.platform] || 0) + 1;
      }
    });

    return stats;
  }

  private logError(error: ErrorInfo) {
    const logLevel = this.getLogLevel(error.severity);
    const prefix = `[${error.platform || 'SYSTEM'}] ${error.type.toUpperCase()}`;
    
    console.group(`${prefix}: ${error.title}`);
    console[logLevel](error.message);
    if (error.details) {
      console[logLevel]('Details:', error.details);
    }
    if (error.errorCode) {
      console[logLevel]('Error Code:', error.errorCode);
    }
    if (error.suggestions && error.suggestions.length > 0) {
      console[logLevel]('Suggestions:', error.suggestions);
    }
    console.groupEnd();
  }

  private getLogLevel(severity: ErrorInfo['severity']): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      case 'low':
      default:
        return 'log';
    }
  }

  private showNotification(error: ErrorInfo) {
    const toastType = this.getToastType(error.severity);
    const icon = this.getErrorIcon(error.type);
    
    toast[toastType](error.message, {
      description: error.suggestions?.[0] || error.userAction,
      duration: this.getToastDuration(error.severity),
      action: error.retryable ? {
        label: 'Retry',
        onClick: () => this.handleRetryAction(error.id)
      } : undefined
    });
  }

  private getToastType(severity: ErrorInfo['severity']) {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'info';
    }
  }

  private getErrorIcon(type: ErrorInfo['type']) {
    const icons = {
      connection: '🔌',
      authentication: '🔐',
      rate_limit: '⏰',
      validation: '⚠️',
      server: '🖥️',
      network: '🌐',
      unknown: '❓'
    };
    return icons[type] || icons.unknown;
  }

  private getToastDuration(severity: ErrorInfo['severity']): number {
    switch (severity) {
      case 'critical':
        return 10000; // 10 seconds
      case 'high':
        return 8000;  // 8 seconds
      case 'medium':
        return 5000;  // 5 seconds
      case 'low':
      default:
        return 3000;  // 3 seconds
    }
  }

  private async handleRetryAction(errorId: string) {
    const retryFn = this.retryQueue.get(errorId);
    if (retryFn) {
      try {
        await retryFn.fn();
        toast.success('Retry successful!');
        this.clearError(errorId);
        this.retryQueue.delete(errorId);
      } catch (error) {
        toast.error('Retry failed');
      }
    }
  }

  private reportToAnalytics(error: ErrorInfo) {
    // In production, send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'error', {
        error_type: error.type,
        error_severity: error.severity,
        error_platform: error.platform,
        error_code: error.errorCode,
        error_message: error.message
      });
    }
  }

  // Platform-specific error handlers
  public handlePlatformError(platform: string, error: any, context?: string): string {
    const errorInfo = this.parsePlatformError(platform, error, context);
    return this.handleError(errorInfo);
  }

  private parsePlatformError(platform: string, error: any, context?: string): Omit<ErrorInfo, 'id' | 'timestamp'> {
    // Parse common platform errors
    if (error.status === 401 || error.status === 403) {
      return {
        type: 'authentication',
        severity: 'high',
        title: `${platform} Authentication Error`,
        message: 'Invalid or expired credentials. Please reconnect your account.',
        details: error.message,
        platform,
        retryable: false,
        suggestions: [
          'Check your API credentials',
          'Reconnect your account',
          'Verify your account permissions'
        ],
        errorCode: `AUTH_${error.status}`,
        userAction: 'Please reconnect your account in the integrations settings.'
      };
    }

    if (error.status === 429) {
      return {
        type: 'rate_limit',
        severity: 'medium',
        title: `${platform} Rate Limit Exceeded`,
        message: 'Too many requests. Please wait before trying again.',
        details: error.message,
        platform,
        retryable: true,
        suggestions: [
          'Wait a few minutes before retrying',
          'Reduce the frequency of requests',
          'Check your API quota limits'
        ],
        errorCode: 'RATE_LIMIT_429',
        userAction: 'Please wait a few minutes and try again.'
      };
    }

    if (error.status >= 500) {
      return {
        type: 'server',
        severity: 'high',
        title: `${platform} Server Error`,
        message: 'The service is temporarily unavailable.',
        details: error.message,
        platform,
        retryable: true,
        suggestions: [
          'Try again in a few minutes',
          'Check the service status page',
          'Contact support if the problem persists'
        ],
        errorCode: `SERVER_${error.status}`,
        userAction: 'Please try again in a few minutes.'
      };
    }

    if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
      return {
        type: 'network',
        severity: 'medium',
        title: `${platform} Network Error`,
        message: 'Unable to connect to the service. Please check your internet connection.',
        details: error.message,
        platform,
        retryable: true,
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'Verify your firewall settings'
        ],
        errorCode: 'NETWORK_ERROR',
        userAction: 'Please check your internet connection and try again.'
      };
    }

    // Default error
    return {
      type: 'unknown',
      severity: 'medium',
      title: `${platform} Error`,
      message: error.message || 'An unexpected error occurred',
      details: error.stack || error.message,
      platform,
      retryable: false,
      suggestions: [
        'Try refreshing the page',
        'Check your settings',
        'Contact support if the problem persists'
      ],
      errorCode: error.code || 'UNKNOWN_ERROR',
      userAction: 'Please try refreshing the page or contact support.'
    };
  }
}

// Singleton instance
export const errorManager = new ErrorManager();

// Convenience functions
export const handleError = (errorData: Omit<ErrorInfo, 'id' | 'timestamp'>) => 
  errorManager.handleError(errorData);

export const executeWithRetry = <T>(
  fn: () => Promise<T>,
  errorContext: Omit<ErrorInfo, 'id' | 'timestamp' | 'retryable' | 'retryCount' | 'maxRetries'>
) => errorManager.executeWithRetry(fn, errorContext);

export const handlePlatformError = (platform: string, error: any, context?: string) =>
  errorManager.handlePlatformError(platform, error, context);

export const getErrorStats = () => errorManager.getErrorStats(); 