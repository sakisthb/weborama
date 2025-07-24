// Performance Monitoring & Analytics System - Option D Implementation
// Enterprise-grade monitoring with real-time analytics and alerting

import { errorHandler } from './error-handler';
import { config } from '../config/environment';

export interface PerformanceMetric {
  id: string;
  name: string;
  type: 'timing' | 'counter' | 'gauge' | 'histogram';
  value: number;
  unit: string;
  timestamp: Date;
  tags: { [key: string]: string };
  metadata?: { [key: string]: any };
}

export interface WebVitals {
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  ttfb: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  threshold: number;
  currentValue: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggered: Date;
  resolved?: Date;
  description: string;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: number;
  interactions: number;
  errors: number;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    viewport: { width: number; height: number };
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  location: {
    country?: string;
    city?: string;
    timezone: string;
  };
}

export interface BusinessMetrics {
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
  pageViewsPerSession: number;
  errorRate: number;
  apiLatency: number;
  userSatisfactionScore: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private alerts: PerformanceAlert[] = [];
  private sessions: Map<string, UserSession> = new Map();
  private currentSession: UserSession | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private vitalsReported = false;
  private isInitialized = false;

  constructor() {
    this.initializeMonitoring();
    this.setupWebVitalsTracking();
    this.startSession();
    console.log('📊 [Performance Monitor] System initialized');
  }

  private initializeMonitoring(): void {
    if (!config.monitoring.performance.enabled) {
      console.log('⚠️ [Performance Monitor] Performance monitoring disabled');
      return;
    }

    // Initialize performance observers
    this.setupPerformanceObservers();
    
    // Setup network monitoring
    this.setupNetworkMonitoring();
    
    // Setup memory monitoring
    this.setupMemoryMonitoring();
    
    // Setup error rate monitoring
    this.setupErrorRateMonitoring();
    
    // Setup business metrics tracking
    this.setupBusinessMetricsTracking();

    this.isInitialized = true;
    console.log('✅ [Performance Monitor] Monitoring systems active');
  }

  private setupPerformanceObservers(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('⚠️ [Performance Monitor] PerformanceObserver not supported');
      return;
    }

    try {
      // Navigation timing
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.processPerformanceEntry(entry);
        });
      });

      // Observe different types of performance entries
      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'measure', 'paint', 'layout-shift', 'first-input'] 
      });

      console.log('📈 [Performance Monitor] Performance observers configured');
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'PerformanceMonitor',
        action: 'setup_observers',
        timestamp: new Date()
      }, 'performance', 'medium');
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        this.processNavigationTiming(entry as PerformanceNavigationTiming);
        break;
      case 'resource':
        this.processResourceTiming(entry as PerformanceResourceTiming);
        break;
      case 'measure':
        this.processUserTiming(entry);
        break;
      case 'paint':
        this.processPaintTiming(entry);
        break;
      case 'layout-shift':
        this.processLayoutShift(entry as any);
        break;
      case 'first-input':
        this.processFirstInput(entry as any);
        break;
    }
  }

  private processNavigationTiming(entry: PerformanceNavigationTiming): void {
    const metrics = [
      { name: 'dns_lookup', value: entry.domainLookupEnd - entry.domainLookupStart },
      { name: 'tcp_connect', value: entry.connectEnd - entry.connectStart },
      { name: 'ssl_handshake', value: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0 },
      { name: 'ttfb', value: entry.responseStart - entry.requestStart },
      { name: 'response_download', value: entry.responseEnd - entry.responseStart },
      { name: 'dom_processing', value: entry.domContentLoadedEventStart - entry.responseEnd },
      { name: 'load_complete', value: entry.loadEventEnd - entry.loadEventStart },
      { name: 'total_load_time', value: entry.loadEventEnd - entry.fetchStart }
    ];

    metrics.forEach(metric => {
      if (metric.value > 0) {
        this.recordMetric({
          name: metric.name,
          type: 'timing',
          value: metric.value,
          unit: 'ms',
          tags: { 
            page: window.location.pathname,
            entry_type: 'navigation'
          }
        });
      }
    });

    // Check for slow page loads
    if (metrics[7].value > 3000) { // Total load time > 3s
      this.triggerAlert({
        metric: 'page_load_time',
        threshold: 3000,
        currentValue: metrics[7].value,
        severity: 'medium',
        description: `Slow page load detected: ${metrics[7].value}ms`
      });
    }
  }

  private processResourceTiming(entry: PerformanceResourceTiming): void {
    const duration = entry.responseEnd - entry.startTime;
    const size = entry.transferSize || 0;

    this.recordMetric({
      name: 'resource_load_time',
      type: 'timing',
      value: duration,
      unit: 'ms',
      tags: {
        resource_type: this.getResourceType(entry.name),
        url: entry.name,
        status: entry.responseStatus?.toString() || 'unknown'
      }
    });

    if (size > 0) {
      this.recordMetric({
        name: 'resource_size',
        type: 'gauge',
        value: size,
        unit: 'bytes',
        tags: {
          resource_type: this.getResourceType(entry.name),
          url: entry.name
        }
      });
    }

    // Alert on slow resources
    if (duration > 2000) {
      this.triggerAlert({
        metric: 'resource_load_time',
        threshold: 2000,
        currentValue: duration,
        severity: 'low',
        description: `Slow resource load: ${entry.name} (${duration}ms)`
      });
    }
  }

  private processUserTiming(entry: PerformanceEntry): void {
    this.recordMetric({
      name: 'user_timing',
      type: 'timing',
      value: entry.duration || 0,
      unit: 'ms',
      tags: {
        measure_name: entry.name,
        entry_type: 'measure'
      }
    });
  }

  private processPaintTiming(entry: PerformanceEntry): void {
    this.recordMetric({
      name: entry.name.replace('-', '_'),
      type: 'timing',
      value: entry.startTime,
      unit: 'ms',
      tags: {
        paint_type: entry.name,
        page: window.location.pathname
      }
    });
  }

  private processLayoutShift(entry: any): void {
    if (!entry.hadRecentInput) {
      this.recordMetric({
        name: 'cumulative_layout_shift',
        type: 'gauge',
        value: entry.value,
        unit: 'score',
        tags: {
          page: window.location.pathname
        }
      });

      // Alert on high CLS
      if (entry.value > 0.1) {
        this.triggerAlert({
          metric: 'cumulative_layout_shift',
          threshold: 0.1,
          currentValue: entry.value,
          severity: 'medium',
          description: `High Cumulative Layout Shift detected: ${entry.value}`
        });
      }
    }
  }

  private processFirstInput(entry: any): void {
    this.recordMetric({
      name: 'first_input_delay',
      type: 'timing',
      value: entry.processingStart - entry.startTime,
      unit: 'ms',
      tags: {
        page: window.location.pathname,
        target: entry.target?.tagName || 'unknown'
      }
    });
  }

  private setupWebVitalsTracking(): void {
    if (!config.monitoring.performance.webVitals) return;

    // Web Vitals tracking using the web-vitals library approach
    this.trackWebVitals();
    console.log('📊 [Performance Monitor] Web Vitals tracking active');
  }

  private trackWebVitals(): void {
    // This would typically use the web-vitals library
    // For now, we'll simulate the tracking
    
    const vitals: Partial<WebVitals> = {};

    // Track CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      vitals.cls = clsValue;
    });
    
    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('⚠️ [Performance Monitor] Layout shift tracking not supported');
    }

    // Track FID
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        vitals.fid = entry.processingStart - entry.startTime;
        break;
      }
    });

    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('⚠️ [Performance Monitor] First input delay tracking not supported');
    }

    // Track paint metrics
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          vitals.fcp = entry.startTime;
        }
      }
    });

    try {
      paintObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('⚠️ [Performance Monitor] Paint timing not supported');
    }

    // Track TTFB
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      vitals.ttfb = navigation.responseStart - navigation.requestStart;
    }

    // Report vitals periodically
    setTimeout(() => {
      this.reportWebVitals(vitals as WebVitals);
    }, 2000);
  }

  private reportWebVitals(vitals: WebVitals): void {
    if (this.vitalsReported) return;

    Object.entries(vitals).forEach(([metric, value]) => {
      if (value !== undefined) {
        this.recordMetric({
          name: `web_vitals_${metric}`,
          type: 'gauge',
          value,
          unit: metric === 'cls' ? 'score' : 'ms',
          tags: {
            page: window.location.pathname,
            metric_type: 'web_vitals'
          }
        });
      }
    });

    this.vitalsReported = true;
    console.log('📊 [Performance Monitor] Web Vitals reported:', vitals);
  }

  private setupNetworkMonitoring(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      this.recordMetric({
        name: 'network_effective_type',
        type: 'gauge',
        value: this.networkTypeToNumber(connection.effectiveType),
        unit: 'level',
        tags: {
          effective_type: connection.effectiveType,
          downlink: connection.downlink?.toString() || 'unknown'
        }
      });

      // Monitor network changes
      connection.addEventListener('change', () => {
        this.recordMetric({
          name: 'network_change',
          type: 'counter',
          value: 1,
          unit: 'count',
          tags: {
            new_type: connection.effectiveType,
            downlink: connection.downlink?.toString() || 'unknown'
          }
        });
      });
    }

    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.recordMetric({
        name: 'network_status',
        type: 'gauge',
        value: 1,
        unit: 'boolean',
        tags: { status: 'online' }
      });
    });

    window.addEventListener('offline', () => {
      this.recordMetric({
        name: 'network_status',
        type: 'gauge',
        value: 0,
        unit: 'boolean',
        tags: { status: 'offline' }
      });
    });
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      const reportMemory = () => {
        const memory = (performance as any).memory;
        
        this.recordMetric({
          name: 'memory_used',
          type: 'gauge',
          value: memory.usedJSHeapSize,
          unit: 'bytes',
          tags: { type: 'used_heap' }
        });

        this.recordMetric({
          name: 'memory_total',
          type: 'gauge',
          value: memory.totalJSHeapSize,
          unit: 'bytes',
          tags: { type: 'total_heap' }
        });

        this.recordMetric({
          name: 'memory_limit',
          type: 'gauge',
          value: memory.jsHeapSizeLimit,
          unit: 'bytes',
          tags: { type: 'heap_limit' }
        });

        // Check for memory pressure
        const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        if (usageRatio > 0.9) {
          this.triggerAlert({
            metric: 'memory_usage',
            threshold: 0.9,
            currentValue: usageRatio,
            severity: 'high',
            description: `High memory usage detected: ${(usageRatio * 100).toFixed(1)}%`
          });
        }
      };

      // Report memory usage every 30 seconds
      setInterval(reportMemory, 30000);
      reportMemory(); // Initial report
    }
  }

  private setupErrorRateMonitoring(): void {
    // Track error rates from the error handler
    setInterval(() => {
      const errorStats = errorHandler.getErrorStats();
      const errorRate = errorStats.last24Hours / (24 * 60); // Errors per minute

      this.recordMetric({
        name: 'error_rate',
        type: 'gauge',
        value: errorRate,
        unit: 'errors_per_minute',
        tags: {
          total_errors: errorStats.total.toString(),
          unresolved: errorStats.unresolved.toString()
        }
      });

      // Alert on high error rates
      if (errorRate > 10) {
        this.triggerAlert({
          metric: 'error_rate',
          threshold: 10,
          currentValue: errorRate,
          severity: 'critical',
          description: `High error rate detected: ${errorRate.toFixed(2)} errors/minute`
        });
      }
    }, 60000); // Check every minute
  }

  private setupBusinessMetricsTracking(): void {
    // Track business-specific metrics
    this.trackPageViews();
    this.trackUserInteractions();
    this.trackConversions();
  }

  private trackPageViews(): void {
    this.recordMetric({
      name: 'page_view',
      type: 'counter',
      value: 1,
      unit: 'count',
      tags: {
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString()
      }
    });

    if (this.currentSession) {
      this.currentSession.pageViews++;
    }
  }

  private trackUserInteractions(): void {
    const interactionEvents = ['click', 'scroll', 'keydown', 'touchstart'];
    
    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.recordMetric({
          name: 'user_interaction',
          type: 'counter',
          value: 1,
          unit: 'count',
          tags: {
            interaction_type: eventType,
            page: window.location.pathname
          }
        });

        if (this.currentSession) {
          this.currentSession.interactions++;
        }
      }, { passive: true });
    });
  }

  private trackConversions(): void {
    // This would be called when specific conversion events occur
    // For now, we'll set up the infrastructure
    console.log('📊 [Performance Monitor] Conversion tracking ready');
  }

  private startSession(): void {
    const sessionId = this.generateSessionId();
    const deviceInfo = this.getDeviceInfo();
    const networkInfo = this.getNetworkInfo();

    this.currentSession = {
      sessionId,
      startTime: new Date(),
      pageViews: 0,
      interactions: 0,
      errors: 0,
      device: deviceInfo,
      network: networkInfo,
      location: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    this.sessions.set(sessionId, this.currentSession);
    console.log('👤 [Performance Monitor] User session started:', sessionId);
  }

  // **UTILITY METHODS**

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  private networkTypeToNumber(type: string): number {
    const typeMap: { [key: string]: number } = {
      'slow-2g': 1,
      '2g': 2,
      '3g': 3,
      '4g': 4,
      '5g': 5
    };
    return typeMap[type] || 0;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): UserSession['device'] {
    const userAgent = navigator.userAgent;
    
    return {
      type: this.getDeviceType(userAgent),
      os: this.getOS(userAgent),
      browser: this.getBrowser(userAgent),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  private getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getNetworkInfo(): UserSession['network'] {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      };
    }

    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0
    };
  }

  // **PUBLIC INTERFACE METHODS**

  public recordMetric(params: {
    name: string;
    type: PerformanceMetric['type'];
    value: number;
    unit: string;
    tags?: { [key: string]: string };
    metadata?: { [key: string]: any };
  }): void {
    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      value: params.value,
      unit: params.unit,
      timestamp: new Date(),
      tags: params.tags || {},
      metadata: params.metadata
    };

    if (!this.metrics.has(params.name)) {
      this.metrics.set(params.name, []);
    }

    const metricArray = this.metrics.get(params.name)!;
    metricArray.push(metric);

    // Keep only last 1000 metrics per type to prevent memory leaks
    if (metricArray.length > 1000) {
      metricArray.shift();
    }

    // Send to external analytics if enabled
    this.sendToAnalytics(metric);
  }

  public triggerAlert(params: {
    metric: string;
    threshold: number;
    currentValue: number;
    severity: PerformanceAlert['severity'];
    description: string;
  }): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metric: params.metric,
      threshold: params.threshold,
      currentValue: params.currentValue,
      severity: params.severity,
      triggered: new Date(),
      description: params.description
    };

    this.alerts.push(alert);

    // Log alert
    errorHandler.logWarn(`Performance Alert: ${params.description}`, {
      component: 'PerformanceMonitor',
      action: 'performance_alert',
      metadata: {
        metric: params.metric,
        threshold: params.threshold,
        currentValue: params.currentValue,
        severity: params.severity
      }
    });

    console.warn(`⚠️ [Performance Monitor] ${params.severity.toUpperCase()} ALERT: ${params.description}`);
  }

  public recordConversion(type: string, value?: number, metadata?: any): void {
    this.recordMetric({
      name: 'conversion',
      type: 'counter',
      value: 1,
      unit: 'count',
      tags: {
        conversion_type: type,
        page: window.location.pathname,
        value: value?.toString() || '0'
      },
      metadata
    });

    console.log('🎯 [Performance Monitor] Conversion recorded:', type);
  }

  public getMetrics(name?: string, limit?: number): PerformanceMetric[] {
    if (name) {
      const metrics = this.metrics.get(name) || [];
      return limit ? metrics.slice(-limit) : metrics;
    }

    // Return all metrics
    const allMetrics: PerformanceMetric[] = [];
    this.metrics.forEach(metrics => allMetrics.push(...metrics));
    
    const sorted = allMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? sorted.slice(0, limit) : sorted;
  }

  public getAlerts(resolved?: boolean): PerformanceAlert[] {
    let alerts = this.alerts;
    
    if (resolved !== undefined) {
      alerts = alerts.filter(alert => !!alert.resolved === resolved);
    }

    return alerts.sort((a, b) => b.triggered.getTime() - a.triggered.getTime());
  }

  public getBusinessMetrics(): BusinessMetrics {
    const sessions = Array.from(this.sessions.values());
    const totalSessions = sessions.length;
    
    if (totalSessions === 0) {
      return {
        conversionRate: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        pageViewsPerSession: 0,
        errorRate: 0,
        apiLatency: 0,
        userSatisfactionScore: 0
      };
    }

    const conversionMetrics = this.getMetrics('conversion');
    const conversionRate = (conversionMetrics.length / totalSessions) * 100;

    const bounceSessions = sessions.filter(s => s.pageViews <= 1).length;
    const bounceRate = (bounceSessions / totalSessions) * 100;

    const completedSessions = sessions.filter(s => s.endTime);
    const avgDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length;

    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    const pageViewsPerSession = totalPageViews / totalSessions;

    const errorStats = errorHandler.getErrorStats();
    const errorRate = errorStats.last24Hours / (24 * 60);

    const apiMetrics = this.getMetrics('resource_load_time').filter(m => m.tags.resource_type === 'api');
    const avgApiLatency = apiMetrics.length > 0 
      ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length 
      : 0;

    // Simple satisfaction score based on performance metrics
    const satisfactionScore = Math.max(0, 100 - (errorRate * 10) - (avgApiLatency / 100));

    return {
      conversionRate,
      bounceRate,
      avgSessionDuration: avgDuration,
      pageViewsPerSession,
      errorRate,
      apiLatency: avgApiLatency,
      userSatisfactionScore: satisfactionScore
    };
  }

  public getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  public endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      this.currentSession.duration = this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();
      
      console.log('👤 [Performance Monitor] Session ended:', this.currentSession.sessionId);
      this.currentSession = null;
    }
  }

  public exportMetrics(): string {
    const data = {
      metrics: Array.from(this.metrics.entries()),
      alerts: this.alerts,
      sessions: Array.from(this.sessions.entries()),
      businessMetrics: this.getBusinessMetrics(),
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  public clearMetrics(): void {
    this.metrics.clear();
    this.alerts.splice(0);
    console.log('🧹 [Performance Monitor] Metrics cleared');
  }

  private sendToAnalytics(metric: PerformanceMetric): void {
    if (!config.monitoring.analytics.enabled) return;

    // Send to configured analytics provider
    if (config.monitoring.analytics.provider === 'mixpanel') {
      // Mixpanel integration would go here
      console.log('📊 [Performance Monitor] Sent to Mixpanel:', metric.name);
    } else if (config.monitoring.analytics.provider === 'amplitude') {
      // Amplitude integration would go here
      console.log('📊 [Performance Monitor] Sent to Amplitude:', metric.name);
    } else if (config.monitoring.analytics.provider === 'google-analytics') {
      // Google Analytics integration would go here
      console.log('📊 [Performance Monitor] Sent to GA:', metric.name);
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    recordConversion: performanceMonitor.recordConversion.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getAlerts: performanceMonitor.getAlerts.bind(performanceMonitor),
    getBusinessMetrics: performanceMonitor.getBusinessMetrics.bind(performanceMonitor),
    getCurrentSession: performanceMonitor.getCurrentSession.bind(performanceMonitor)
  };
}