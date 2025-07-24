import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Monitor,
  Globe,
  Zap,
  Target,
  TrendingDown
} from 'lucide-react';
import { performanceMonitor, PerformanceMetric, PerformanceAlert, BusinessMetrics } from '../lib/performance-monitoring';
import { errorHandler } from '../lib/error-handler';

interface DashboardData {
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  businessMetrics: BusinessMetrics;
  webVitals: {
    cls: number;
    fid: number;
    fcp: number;
    lcp: number;
    ttfb: number;
  };
  realtimeStats: {
    activeUsers: number;
    requestsPerMinute: number;
    errorRate: number;
    avgResponseTime: number;
  };
}

export function PerformanceDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const metrics = performanceMonitor.getMetrics(undefined, 1000);
      const alerts = performanceMonitor.getAlerts();
      const businessMetrics = performanceMonitor.getBusinessMetrics();

      const webVitalsMetrics = metrics.filter(m => m.name.startsWith('web_vitals_'));
      const webVitals = {
        cls: webVitalsMetrics.find(m => m.name === 'web_vitals_cls')?.value || 0,
        fid: webVitalsMetrics.find(m => m.name === 'web_vitals_fid')?.value || 0,
        fcp: webVitalsMetrics.find(m => m.name === 'web_vitals_fcp')?.value || 0,
        lcp: webVitalsMetrics.find(m => m.name === 'web_vitals_lcp')?.value || 0,
        ttfb: webVitalsMetrics.find(m => m.name === 'web_vitals_ttfb')?.value || 0
      };

      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const recentMetrics = metrics.filter(m => m.timestamp.getTime() > oneMinuteAgo);

      const realtimeStats = {
        activeUsers: performanceMonitor.getCurrentSession() ? 1 : 0,
        requestsPerMinute: recentMetrics.filter(m => m.name === 'resource_load_time').length,
        errorRate: businessMetrics.errorRate,
        avgResponseTime: recentMetrics
          .filter(m => m.name === 'resource_load_time')
          .reduce((sum, m) => sum + m.value, 0) / Math.max(1, recentMetrics.filter(m => m.name === 'resource_load_time').length)
      };

      setData({
        metrics,
        alerts,
        businessMetrics,
        webVitals,
        realtimeStats
      });

      setLoading(false);
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'PerformanceDashboard',
        action: 'load_data',
        timestamp: new Date()
      }, 'ui', 'medium');
      setLoading(false);
    }
  };

  const getWebVitalStatus = (metric: string, value: number) => {
    const thresholds: { [key: string]: { good: number; poor: number } } = {
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === 'score') return value.toFixed(3);
    if (unit === 'bytes') return `${(value / 1024 / 1024).toFixed(2)}MB`;
    if (unit === 'count') return value.toString();
    if (unit === 'errors_per_minute') return value.toFixed(2);
    return value.toString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading performance data...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load performance data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto Refresh
          </Button>
          <Button onClick={loadDashboardData} size="sm">
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{data.realtimeStats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Requests/min</p>
                <p className="text-2xl font-bold">{data.realtimeStats.requestsPerMinute}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold">{data.realtimeStats.errorRate.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{Math.round(data.realtimeStats.avgResponseTime)}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="business">Business Metrics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Performance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {Math.round(data.businessMetrics.userSatisfactionScore)}
                  </div>
                  <p className="text-gray-600">Overall satisfaction score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  Current Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceMonitor.getCurrentSession() ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Session ID</span>
                      <span className="text-sm font-mono">{performanceMonitor.getCurrentSession()?.sessionId.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Page Views</span>
                      <span className="text-sm">{performanceMonitor.getCurrentSession()?.pageViews}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No active session</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Web Vitals Tab */}
        <TabsContent value="web-vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.webVitals).map(([metric, value]) => {
              const status = getWebVitalStatus(metric, value);
              const displayName = {
                cls: 'Cumulative Layout Shift',
                fid: 'First Input Delay',
                fcp: 'First Contentful Paint',
                lcp: 'Largest Contentful Paint',
                ttfb: 'Time to First Byte'
              }[metric] || metric.toUpperCase();

              return (
                <Card key={metric}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{displayName}</h3>
                      <Badge className={getStatusColor(status)}>
                        {status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatValue(value, metric === 'cls' ? 'score' : 'ms')}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Business Metrics Tab */}
        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">{data.businessMetrics.conversionRate.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingDown className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                    <p className="text-2xl font-bold">{data.businessMetrics.bounceRate.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">API Latency</p>
                    <p className="text-2xl font-bold">{Math.round(data.businessMetrics.apiLatency)}ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {data.alerts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Active Alerts</h3>
                <p className="text-gray-600">System is performing within normal parameters</p>
              </CardContent>
            </Card>
          ) : (
            data.alerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{alert.description}</h3>
                      <p className="text-sm text-gray-600">{alert.triggered.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}