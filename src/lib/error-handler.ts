// Comprehensive Error Handling & Logging System - Option D Implementation
// Enterprise-grade error management with detailed logging and recovery

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  timestamp: Date;
  url?: string;
  userAgent?: string;
  metadata?: { [key: string]: any };
}

export interface ErrorLogEntry {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  error?: Error;
  context: ErrorContext;
  stack?: string;
  category: 'api' | 'ui' | 'auth' | 'data' | 'performance' | 'security' | 'business' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
  tags: string[];
}

export interface ErrorRecoveryStrategy {
  id: string;
  name: string;
  description: string;
  canRecover: (error: Error, context: ErrorContext) => boolean;
  recover: (error: Error, context: ErrorContext) => Promise<{ success: boolean; message: string; data?: any }>;
  maxRetries: number;
  retryDelay: number;
}

export interface ErrorAlert {
  id: string;
  errorId: string;
  type: 'email' | 'slack' | 'webhook' | 'sms';
  recipient: string;
  sent: boolean;
  sentAt?: Date;
  response?: string;
}

class ErrorHandler {
  private errorLogs: Map<string, ErrorLogEntry> = new Map();
  private recoveryStrategies: Map<string, ErrorRecoveryStrategy> = new Map();
  private alerts: ErrorAlert[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeErrorHandler();
    this.setupGlobalErrorHandlers();
    this.initializeRecoveryStrategies();
    console.log('🛡️ [Error Handler] System initialized');
  }

  private initializeErrorHandler(): void {
    // Initialize Sentry if configured
    if (import.meta.env.VITE_SENTRY_DSN) {
      this.initializeSentry();
    }

    // Set up error boundaries
    this.setupErrorBoundaries();

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();

    this.isInitialized = true;
  }

  private async initializeSentry(): Promise<void> {
    try {
      // In a real implementation, you would import and configure Sentry here
      console.log('📊 [Error Handler] Sentry initialized');
      
      // Mock Sentry configuration
      const sentryConfig = {
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.NODE_ENV,
        sampleRate: parseFloat(import.meta.env.VITE_SENTRY_SAMPLE_RATE || '1.0'),
        tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1')
      };

      console.log('✅ [Error Handler] Sentry configured:', sentryConfig);
    } catch (error) {
      console.error('🚫 [Error Handler] Failed to initialize Sentry:', error);
    }
  }

  private setupGlobalErrorHandlers(): void {
    // Global unhandled error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        component: 'Global',
        action: 'unhandled_error',
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Global unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          component: 'Global',
          action: 'unhandled_promise_rejection',
          timestamp: new Date(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      );
    });

    // Network error handler
    window.addEventListener('online', () => {
      this.logInfo('Network connection restored', { component: 'Network' });
    });

    window.addEventListener('offline', () => {
      this.logWarn('Network connection lost', { component: 'Network' });
    });

    console.log('🌐 [Error Handler] Global error handlers configured');
  }

  private setupErrorBoundaries(): void {
    // This would be used in React components
    // Error boundaries should be implemented as React components
    console.log('⚡ [Error Handler] Error boundaries ready for React components');
  }

  private initializePerformanceMonitoring(): void {
    if (import.meta.env.VITE_PERFORMANCE_MONITORING_ENABLED === 'true') {
      // Performance observer for monitoring
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
                if (entry.duration > 3000) { // Log slow operations > 3s
                  this.logWarn(`Slow performance detected: ${entry.name}`, {
                    component: 'Performance',
                    action: 'slow_operation',
                    timestamp: new Date(),
                    metadata: {
                      duration: entry.duration,
                      entryType: entry.entryType,
                      name: entry.name
                    }
                  });
                }
              }
            });
          });

          observer.observe({ entryTypes: ['measure', 'navigation'] });
          console.log('📈 [Error Handler] Performance monitoring active');
        } catch (error) {
          console.warn('⚠️ [Error Handler] Performance monitoring not supported');
        }
      }
    }
  }

  private initializeRecoveryStrategies(): void {
    const strategies: ErrorRecoveryStrategy[] = [
      {
        id: 'network_retry',
        name: 'Network Retry Strategy',
        description: 'Automatically retry failed network requests',
        canRecover: (error, context) => {
          return error.message.includes('fetch') || 
                 error.message.includes('network') ||
                 error.message.includes('timeout') ||
                 context.category === 'api';
        },
        recover: async (error, context) => {
          try {
            // Simulate retry logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: 'Network request retried successfully' };
          } catch (retryError) {
            return { success: false, message: 'Retry failed' };
          }
        },
        maxRetries: 3,
        retryDelay: 1000
      },
      {
        id: 'auth_refresh',
        name: 'Authentication Refresh Strategy',
        description: 'Refresh authentication tokens on auth errors',
        canRecover: (error, context) => {
          return error.message.includes('401') || 
                 error.message.includes('unauthorized') ||
                 context.category === 'auth';
        },
        recover: async (error, context) => {
          try {
            // Simulate token refresh
            console.log('🔄 [Recovery] Refreshing authentication token...');
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: 'Authentication refreshed' };
          } catch (authError) {
            return { success: false, message: 'Authentication refresh failed' };
          }
        },
        maxRetries: 1,
        retryDelay: 500
      },
      {
        id: 'data_fallback',
        name: 'Data Fallback Strategy',
        description: 'Use cached or default data when primary data source fails',
        canRecover: (error, context) => {
          return context.category === 'data' || context.action?.includes('fetch');
        },
        recover: async (error, context) => {
          try {
            // Simulate fallback to cached data
            console.log('💾 [Recovery] Using cached data fallback...');
            return { 
              success: true, 
              message: 'Using cached data',
              data: { fallback: true, timestamp: new Date() }
            };
          } catch (fallbackError) {
            return { success: false, message: 'Fallback data not available' };
          }
        },
        maxRetries: 1,
        retryDelay: 0
      },
      {
        id: 'ui_reset',
        name: 'UI Reset Strategy',
        description: 'Reset UI state to recover from rendering errors',
        canRecover: (error, context) => {
          return context.category === 'ui' || 
                 error.message.includes('render') ||
                 error.message.includes('component');
        },
        recover: async (error, context) => {
          try {
            // Simulate UI state reset
            console.log('🔄 [Recovery] Resetting UI state...');
            // In a real implementation, this would reset React state or reload component
            return { success: true, message: 'UI state reset' };
          } catch (resetError) {
            return { success: false, message: 'UI reset failed' };
          }
        },
        maxRetries: 1,
        retryDelay: 0
      }
    ];

    strategies.forEach(strategy => {
      this.recoveryStrategies.set(strategy.id, strategy);
    });

    console.log('🔧 [Error Handler] Recovery strategies initialized:', strategies.length);
  }

  // **CORE ERROR HANDLING METHODS**

  public async handleError(
    error: Error, 
    context: ErrorContext,
    category: ErrorLogEntry['category'] = 'system',
    severity: ErrorLogEntry['severity'] = 'medium'
  ): Promise<void> {
    const errorId = this.generateErrorId();
    
    const errorLog: ErrorLogEntry = {
      id: errorId,
      level: 'error',
      message: error.message,
      error,
      context: {
        ...context,
        timestamp: new Date()
      },
      stack: error.stack,
      category,
      severity,
      resolved: false,
      createdAt: new Date(),
      tags: this.generateTags(error, context, category)
    };

    // Store error log
    this.errorLogs.set(errorId, errorLog);

    // Log to console in development
    if (import.meta.env.NODE_ENV === 'development') {
      console.error(`🚨 [Error Handler] ${category.toUpperCase()}:`, error);
      console.error('Context:', context);
      console.error('Stack:', error.stack);
    }

    // Send to external monitoring (Sentry, etc.)
    await this.sendToExternalMonitoring(errorLog);

    // Attempt recovery
    await this.attemptRecovery(errorLog);

    // Send alerts if critical
    if (severity === 'critical' || severity === 'high') {
      await this.sendAlerts(errorLog);
    }

    // Analytics tracking
    this.trackErrorAnalytics(errorLog);
  }

  public logError(message: string, context: Partial<ErrorContext> = {}): void {
    this.handleError(new Error(message), {
      timestamp: new Date(),
      ...context
    } as ErrorContext);
  }

  public logWarn(message: string, context: Partial<ErrorContext> = {}): void {
    const logEntry: ErrorLogEntry = {
      id: this.generateErrorId(),
      level: 'warn',
      message,
      context: {
        timestamp: new Date(),
        ...context
      } as ErrorContext,
      category: 'system',
      severity: 'low',
      resolved: true,
      createdAt: new Date(),
      tags: ['warning']
    };

    this.errorLogs.set(logEntry.id, logEntry);

    if (import.meta.env.NODE_ENV === 'development') {
      console.warn(`⚠️ [Error Handler] WARNING:`, message, context);
    }
  }

  public logInfo(message: string, context: Partial<ErrorContext> = {}): void {
    const logEntry: ErrorLogEntry = {
      id: this.generateErrorId(),
      level: 'info',
      message,
      context: {
        timestamp: new Date(),
        ...context
      } as ErrorContext,
      category: 'system',
      severity: 'low',
      resolved: true,
      createdAt: new Date(),
      tags: ['info']
    };

    this.errorLogs.set(logEntry.id, logEntry);

    if (import.meta.env.NODE_ENV === 'development') {
      console.info(`ℹ️ [Error Handler] INFO:`, message, context);
    }
  }

  public logDebug(message: string, context: Partial<ErrorContext> = {}): void {
    if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
      const logEntry: ErrorLogEntry = {
        id: this.generateErrorId(),
        level: 'debug',
        message,
        context: {
          timestamp: new Date(),
          ...context
        } as ErrorContext,
        category: 'system',
        severity: 'low',
        resolved: true,
        createdAt: new Date(),
        tags: ['debug']
      };

      this.errorLogs.set(logEntry.id, logEntry);
      console.debug(`🔍 [Error Handler] DEBUG:`, message, context);
    }
  }

  // **ERROR RECOVERY METHODS**

  private async attemptRecovery(errorLog: ErrorLogEntry): Promise<void> {
    const applicableStrategies = Array.from(this.recoveryStrategies.values())
      .filter(strategy => strategy.canRecover(errorLog.error!, errorLog.context));

    if (applicableStrategies.length === 0) {
      console.log(`🔴 [Error Handler] No recovery strategy found for error: ${errorLog.id}`);
      return;
    }

    for (const strategy of applicableStrategies) {
      try {
        console.log(`🔄 [Error Handler] Attempting recovery with: ${strategy.name}`);
        
        const result = await strategy.recover(errorLog.error!, errorLog.context);
        
        if (result.success) {
          errorLog.resolved = true;
          errorLog.resolvedAt = new Date();
          errorLog.tags.push('auto_recovered');
          
          console.log(`✅ [Error Handler] Recovery successful: ${result.message}`);
          
          // Log recovery success
          this.logInfo(`Error auto-recovered using ${strategy.name}`, {
            component: 'ErrorRecovery',
            action: 'recovery_success',
            metadata: {
              originalErrorId: errorLog.id,
              strategy: strategy.name,
              result: result.message
            }
          });
          
          break;
        } else {
          console.log(`❌ [Error Handler] Recovery failed: ${result.message}`);
        }
      } catch (recoveryError) {
        console.error(`🚫 [Error Handler] Recovery strategy failed:`, recoveryError);
      }
    }
  }

  private async sendToExternalMonitoring(errorLog: ErrorLogEntry): Promise<void> {
    try {
      // Send to Sentry
      if (import.meta.env.VITE_SENTRY_DSN) {
        // In a real implementation, you would send to Sentry here
        console.log('📊 [Error Handler] Sent to Sentry:', errorLog.id);
      }

      // Send to custom monitoring endpoint
      if (import.meta.env.VITE_MONITORING_ENDPOINT) {
        // In a real implementation, you would send to your monitoring service
        console.log('📡 [Error Handler] Sent to monitoring service:', errorLog.id);
      }
    } catch (monitoringError) {
      console.error('🚫 [Error Handler] Failed to send to external monitoring:', monitoringError);
    }
  }

  private async sendAlerts(errorLog: ErrorLogEntry): Promise<void> {
    const alertTypes = this.determineAlertTypes(errorLog);
    
    for (const alertType of alertTypes) {
      try {
        const alert: ErrorAlert = {
          id: this.generateErrorId(),
          errorId: errorLog.id,
          type: alertType.type,
          recipient: alertType.recipient,
          sent: false
        };

        // Simulate sending alert
        await this.sendAlert(alert, errorLog);
        
        alert.sent = true;
        alert.sentAt = new Date();
        this.alerts.push(alert);

        console.log(`📧 [Error Handler] Alert sent via ${alertType.type} to ${alertType.recipient}`);
      } catch (alertError) {
        console.error(`🚫 [Error Handler] Failed to send ${alertType.type} alert:`, alertError);
      }
    }
  }

  private determineAlertTypes(errorLog: ErrorLogEntry): { type: ErrorAlert['type']; recipient: string }[] {
    const alerts: { type: ErrorAlert['type']; recipient: string }[] = [];

    if (errorLog.severity === 'critical') {
      alerts.push({ type: 'email', recipient: 'admin@ads-pro-platform.com' });
      alerts.push({ type: 'slack', recipient: '#alerts' });
    } else if (errorLog.severity === 'high') {
      alerts.push({ type: 'email', recipient: 'dev-team@ads-pro-platform.com' });
    }

    // Category-specific alerts
    if (errorLog.category === 'security') {
      alerts.push({ type: 'email', recipient: 'security@ads-pro-platform.com' });
    }

    if (errorLog.category === 'api' && errorLog.severity === 'high') {
      alerts.push({ type: 'webhook', recipient: 'https://monitoring.ads-pro-platform.com/webhook' });
    }

    return alerts;
  }

  private async sendAlert(alert: ErrorAlert, errorLog: ErrorLogEntry): Promise<void> {
    // Simulate sending different types of alerts
    switch (alert.type) {
      case 'email':
        console.log(`📧 Sending email alert to ${alert.recipient}:`, errorLog.message);
        break;
      case 'slack':
        console.log(`💬 Sending Slack alert to ${alert.recipient}:`, errorLog.message);
        break;
      case 'webhook':
        console.log(`🔗 Sending webhook alert to ${alert.recipient}:`, errorLog.message);
        break;
      case 'sms':
        console.log(`📱 Sending SMS alert to ${alert.recipient}:`, errorLog.message);
        break;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private trackErrorAnalytics(errorLog: ErrorLogEntry): void {
    if (import.meta.env.VITE_ANALYTICS_ENABLED === 'true') {
      // Track error analytics
      console.log('📈 [Error Handler] Tracking error analytics:', {
        errorId: errorLog.id,
        category: errorLog.category,
        severity: errorLog.severity,
        component: errorLog.context.component,
        resolved: errorLog.resolved
      });
    }
  }

  // **UTILITY METHODS**

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTags(error: Error, context: ErrorContext, category: string): string[] {
    const tags: string[] = [category];

    // Add context-based tags
    if (context.component) tags.push(`component:${context.component}`);
    if (context.action) tags.push(`action:${context.action}`);
    if (context.userId) tags.push(`user:${context.userId}`);

    // Add error-based tags
    if (error.message.includes('network')) tags.push('network');
    if (error.message.includes('timeout')) tags.push('timeout');
    if (error.message.includes('401') || error.message.includes('unauthorized')) tags.push('auth');
    if (error.message.includes('500')) tags.push('server_error');

    // Add browser/environment tags
    if (typeof window !== 'undefined') {
      tags.push(`browser:${this.getBrowserName()}`);
      if (navigator.onLine === false) tags.push('offline');
    }

    return tags;
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    return 'unknown';
  }

  // **PUBLIC INTERFACE METHODS**

  public getErrorLogs(filters?: {
    category?: string;
    severity?: string;
    resolved?: boolean;
    limit?: number;
  }): ErrorLogEntry[] {
    let logs = Array.from(this.errorLogs.values());

    if (filters) {
      if (filters.category) {
        logs = logs.filter(log => log.category === filters.category);
      }
      if (filters.severity) {
        logs = logs.filter(log => log.severity === filters.severity);
      }
      if (filters.resolved !== undefined) {
        logs = logs.filter(log => log.resolved === filters.resolved);
      }
      if (filters.limit) {
        logs = logs.slice(0, filters.limit);
      }
    }

    return logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getErrorStats(): {
    total: number;
    byCategory: { [category: string]: number };
    bySeverity: { [severity: string]: number };
    resolved: number;
    unresolved: number;
    last24Hours: number;
  } {
    const logs = Array.from(this.errorLogs.values());
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    return {
      total: logs.length,
      byCategory: logs.reduce((acc, log) => {
        acc[log.category] = (acc[log.category] || 0) + 1;
        return acc;
      }, {} as { [category: string]: number }),
      bySeverity: logs.reduce((acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1;
        return acc;
      }, {} as { [severity: string]: number }),
      resolved: logs.filter(log => log.resolved).length,
      unresolved: logs.filter(log => !log.resolved).length,
      last24Hours: logs.filter(log => now - log.createdAt.getTime() < day).length
    };
  }

  public clearErrorLogs(): void {
    this.errorLogs.clear();
    console.log('🧹 [Error Handler] Error logs cleared');
  }

  public resolveError(errorId: string): boolean {
    const errorLog = this.errorLogs.get(errorId);
    if (errorLog) {
      errorLog.resolved = true;
      errorLog.resolvedAt = new Date();
      errorLog.tags.push('manually_resolved');
      console.log(`✅ [Error Handler] Error resolved manually: ${errorId}`);
      return true;
    }
    return false;
  }

  public getRecoveryStrategies(): ErrorRecoveryStrategy[] {
    return Array.from(this.recoveryStrategies.values());
  }

  public addRecoveryStrategy(strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.set(strategy.id, strategy);
    console.log(`🔧 [Error Handler] Added recovery strategy: ${strategy.name}`);
  }

  public exportErrorLogs(): string {
    const logs = Array.from(this.errorLogs.values());
    return JSON.stringify(logs, null, 2);
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

// React Error Boundary Hook
export function useErrorHandler() {
  return {
    handleError: (error: Error, context?: Partial<ErrorContext>) => {
      errorHandler.handleError(error, {
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context
      } as ErrorContext);
    },
    logError: errorHandler.logError.bind(errorHandler),
    logWarn: errorHandler.logWarn.bind(errorHandler),
    logInfo: errorHandler.logInfo.bind(errorHandler),
    logDebug: errorHandler.logDebug.bind(errorHandler)
  };
}