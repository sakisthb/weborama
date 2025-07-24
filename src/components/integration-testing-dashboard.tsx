import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity,
  Download,
  Eye,
  Clock,
  BarChart3,
  Shield,
  Zap,
  Database,
  Wifi,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  integrationTesting, 
  runAllTests, 
  runHealthChecks, 
  getTestStats, 
  getHealthStats,
  type TestResult,
  type HealthCheckResult,
  type TestSuite
} from '../lib/integration-testing';
import { integrationManager, type PlatformType } from '../lib/api-integrations/integration-manager';

interface TestRunState {
  isRunning: boolean;
  progress: number;
  currentTest?: string;
  results: TestResult[];
  healthChecks: HealthCheckResult[];
}

export const IntegrationTestingDashboard: React.FC = () => {
  const [testState, setTestState] = useState<TestRunState>({
    isRunning: false,
    progress: 0,
    results: [],
    healthChecks: []
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    // Load initial data
    loadTestResults();
    loadHealthChecks();

    // Auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadTestResults();
        loadHealthChecks();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadTestResults = () => {
    const results = integrationTesting.getTestResults();
    setTestState(prev => ({ ...prev, results }));
  };

  const loadHealthChecks = () => {
    const healthChecks = integrationTesting.getHealthChecks();
    setTestState(prev => ({ ...prev, healthChecks }));
  };

  const handleRunAllTests = async () => {
    if (testState.isRunning) return;

    setTestState(prev => ({ 
      ...prev, 
      isRunning: true, 
      progress: 0,
      currentTest: 'Starting tests...'
    }));

    try {
      const results = await runAllTests();
      setTestState(prev => ({ 
        ...prev, 
        results,
        isRunning: false,
        progress: 100,
        currentTest: undefined
      }));
    } catch (error) {
      console.error('Test run failed:', error);
      setTestState(prev => ({ 
        ...prev, 
        isRunning: false,
        currentTest: undefined
      }));
    }
  };

  const handleRunHealthChecks = async () => {
    const healthChecks = await runHealthChecks();
    setTestState(prev => ({ ...prev, healthChecks }));
  };

  const handleStopTests = () => {
    setTestState(prev => ({ 
      ...prev, 
      isRunning: false,
      currentTest: undefined
    }));
  };

  const exportResults = () => {
    const stats = getTestStats();
    const healthStats = getHealthStats();
    
    const data = {
      timestamp: new Date().toISOString(),
      testStats: stats,
      healthStats: healthStats,
      results: testState.results,
      healthChecks: testState.healthChecks
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const testStats = getTestStats();
  const healthStats = getHealthStats();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Testing Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor and test platform integrations, health checks, and performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-blue-50 border-blue-200' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportResults}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Test Controls
          </CardTitle>
          <CardDescription>
            Run comprehensive tests and health checks for all platform integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleRunAllTests}
              disabled={testState.isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Run All Tests
            </Button>
            <Button
              onClick={handleRunHealthChecks}
              disabled={testState.isRunning}
              variant="outline"
            >
              <Activity className="w-4 h-4 mr-2" />
              Health Checks
            </Button>
            {testState.isRunning && (
              <Button onClick={handleStopTests} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop Tests
              </Button>
            )}
          </div>

          {testState.isRunning && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{testState.currentTest}</span>
                <span>{testState.progress}%</span>
              </div>
              <Progress value={testState.progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Test Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {testStats.successRate.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {testStats.passed}/{testStats.total} tests passed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthStats.averageScore.toFixed(0)}/100
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {healthStats.healthy}/{healthStats.total} platforms healthy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthStats.averageResponseTime.toFixed(0)}ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Across all platforms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Platforms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrationManager.getConnectedPlatforms().length}
                </p>
              </div>
              <Wifi className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Active integrations
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Test Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Recent Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testState.results.slice(0, 5).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium text-sm">{result.testName}</p>
                          <p className="text-xs text-gray-500">
                            {result.platform} • {result.duration}ms
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                  {testState.results.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No test results available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Health Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Platform Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testState.healthChecks.map((health) => (
                    <div key={health.platform} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(health.status)}
                        <div>
                          <p className="font-medium text-sm capitalize">
                            {health.platform.replace('-', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            Score: {health.score}/100 • {health.responseTime}ms
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(health.status)}>
                          {health.status}
                        </Badge>
                        {health.issues.length > 0 && (
                          <p className="text-xs text-red-500 mt-1">
                            {health.issues.length} issue{health.issues.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {testState.healthChecks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No health checks available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Detailed results from all test runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testState.results.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h3 className="font-medium">{result.testName}</h3>
                          <p className="text-sm text-gray-500">
                            Platform: {result.platform} • Duration: {result.duration}ms
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    
                    {result.error && (
                      <Alert className="mb-3">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>{result.error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {result.details && (
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
                
                {testState.results.length === 0 && (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No test results available</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Run tests to see results here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Checks</CardTitle>
              <CardDescription>
                Platform health status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testState.healthChecks.map((health) => (
                  <motion.div
                    key={health.platform}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(health.status)}
                        <div>
                          <h3 className="font-medium capitalize">
                            {health.platform.replace('-', ' ')}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Last check: {new Date(health.lastCheck).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(health.status)}>
                          {health.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          Score: {health.score}/100
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Response Time</p>
                        <p className="font-medium">{health.responseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Issues</p>
                        <p className="font-medium">{health.issues.length}</p>
                      </div>
                    </div>
                    
                    {health.issues.length > 0 && (
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-sm font-medium text-red-800 mb-2">Issues Found:</p>
                        <ul className="text-sm text-red-700 space-y-1">
                          {health.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {health.details && Object.keys(health.details).length > 0 && (
                      <details className="mt-3">
                        <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                          View Details
                        </summary>
                        <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(health.details, null, 2)}
                          </pre>
                        </div>
                      </details>
                    )}
                  </motion.div>
                ))}
                
                {testState.healthChecks.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No health checks available</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Run health checks to see results here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Suites */}
            <Card>
              <CardHeader>
                <CardTitle>Test Suites</CardTitle>
                <CardDescription>
                  Available test suites and their configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrationTesting.getTestSuites().map((suite) => (
                    <div key={suite.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{suite.name}</h3>
                        <Badge variant={suite.required ? 'default' : 'secondary'}>
                          {suite.required ? 'Required' : 'Optional'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{suite.description}</p>
                      <p className="text-xs text-gray-500">
                        {suite.tests.length} test{suite.tests.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>
                  Test and health check statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Test Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Tests:</span>
                        <span className="font-medium">{testStats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passed:</span>
                        <span className="font-medium text-green-600">{testStats.passed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed:</span>
                        <span className="font-medium text-red-600">{testStats.failed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <span className="font-medium">{testStats.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Duration:</span>
                        <span className="font-medium">{testStats.averageDuration.toFixed(0)}ms</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Health Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Platforms:</span>
                        <span className="font-medium">{healthStats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Healthy:</span>
                        <span className="font-medium text-green-600">{healthStats.healthy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Degraded:</span>
                        <span className="font-medium text-yellow-600">{healthStats.degraded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unhealthy:</span>
                        <span className="font-medium text-red-600">{healthStats.unhealthy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Score:</span>
                        <span className="font-medium">{healthStats.averageScore.toFixed(0)}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 