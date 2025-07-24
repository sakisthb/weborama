// Test Dashboard Component - Option D Implementation
// Real-time testing interface with test runner controls and reporting

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TestTube,
  BarChart3,
  FileText,
  AlertTriangle,
  Shield,
  Zap,
  Database,
  Activity,
  Download
} from 'lucide-react';
import { testRunner, TestSuite, TestReport, TestSummary, useTestRunner } from '../lib/test-runner';
import { errorHandler } from '../lib/error-handler';

interface TestDashboardData {
  summary: TestSummary | null;
  reports: TestReport[];
  suites: TestSuite[];
  isRunning: boolean;
  currentTest: { suite?: string; test?: string } | null;
}

export function TestDashboard() {
  const {
    runTestSuite,
    runAllTests,
    getTestSummary,
    getTestReports,
    getTestSuites,
    clearReports,
    isTestRunning,
    getCurrentTest
  } = useTestRunner();

  const [data, setData] = useState<TestDashboardData>({
    summary: null,
    reports: [],
    suites: [],
    isRunning: false,
    currentTest: null
  });
  
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadDashboardData = () => {
    try {
      const summary = getTestSummary();
      const reports = getTestReports({ limit: 100 });
      const suites = getTestSuites();
      const isRunning = isTestRunning();
      const currentTest = getCurrentTest();

      setData({
        summary,
        reports,
        suites,
        isRunning,
        currentTest
      });
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'TestDashboard',
        action: 'load_data',
        timestamp: new Date()
      }, 'ui', 'medium');
    }
  };

  const handleRunAllTests = async () => {
    try {
      await runAllTests();
      loadDashboardData();
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'TestDashboard',
        action: 'run_all_tests',
        timestamp: new Date()
      }, 'ui', 'high');
    }
  };

  const handleRunTestSuite = async (suiteId: string) => {
    try {
      await runTestSuite(suiteId);
      loadDashboardData();
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'TestDashboard',
        action: 'run_test_suite',
        timestamp: new Date(),
        metadata: { suiteId }
      }, 'ui', 'high');
    }
  };

  const handleClearReports = () => {
    clearReports();
    loadDashboardData();
  };

  const getSuccessRate = (passed: number, total: number): number => {
    return total > 0 ? Math.round((passed / total) * 100) : 0;
  };

  const getSuiteIcon = (suiteId: string) => {
    switch (suiteId) {
      case 'auth-tests': return <Shield className="h-5 w-5" />;
      case 'api-tests': return <Database className="h-5 w-5" />;
      case 'performance-tests': return <Zap className="h-5 w-5" />;
      case 'security-tests': return <Shield className="h-5 w-5" />;
      default: return <TestTube className="h-5 w-5" />;
    }
  };

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'unit': return 'bg-blue-100 text-blue-800';
      case 'integration': return 'bg-green-100 text-green-800';
      case 'e2e': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadTestReport = () => {
    const reportData = {
      summary: data.summary,
      reports: data.reports,
      suites: data.suites,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Test Dashboard</h1>
          <p className="text-gray-600 mt-1">Automated testing suite with comprehensive reporting</p>
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
          <Button 
            onClick={downloadTestReport}
            variant="outline"
            size="sm"
            disabled={!data.summary || data.summary.totalTests === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            onClick={handleClearReports}
            variant="outline"
            size="sm"
            disabled={data.isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Reports
          </Button>
          <Button 
            onClick={handleRunAllTests}
            disabled={data.isRunning}
            size="sm"
          >
            {data.isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {data.isRunning ? 'Running...' : 'Run All Tests'}
          </Button>
        </div>
      </div>

      {/* Current Test Status */}
      {data.isRunning && data.currentTest && (
        <Alert>
          <TestTube className="h-4 w-4" />
          <AlertDescription>
            Currently running: <strong>{data.currentTest.suite}</strong> - {data.currentTest.test}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TestTube className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold">{data.summary?.totalTests || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{data.summary?.passedTests || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{data.summary?.failedTests || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {getSuccessRate(data.summary?.passedTests || 0, data.summary?.totalTests || 0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Coverage */}
      {data.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Test Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Coverage</span>
                  <span className="font-medium">{data.summary.coverage.overall}%</span>
                </div>
                <Progress value={data.summary.coverage.overall} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Lines</span>
                  <span className="font-medium">{data.summary.coverage.lines}%</span>
                </div>
                <Progress value={data.summary.coverage.lines} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Functions</span>
                  <span className="font-medium">{data.summary.coverage.functions}%</span>
                </div>
                <Progress value={data.summary.coverage.functions} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Branches</span>
                  <span className="font-medium">{data.summary.coverage.branches}%</span>
                </div>
                <Progress value={data.summary.coverage.branches} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="suites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="reports">Test Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Test Suites Tab */}
        <TabsContent value="suites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.suites.map((suite) => {
              const suiteReports = data.reports.filter(r => r.suiteId === suite.id);
              const suitePassed = suiteReports.filter(r => r.result.passed).length;
              const suiteTotal = suiteReports.length;
              const suiteSuccessRate = getSuccessRate(suitePassed, suiteTotal);

              return (
                <Card key={suite.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        {getSuiteIcon(suite.id)}
                        <span className="ml-2">{suite.name}</span>
                      </CardTitle>
                      <Badge variant={suiteSuccessRate === 100 ? "default" : suiteSuccessRate >= 80 ? "secondary" : "destructive"}>
                        {suiteSuccessRate}%
                      </Badge>
                    </div>
                    <CardDescription>{suite.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{suiteTotal}</p>
                        <p className="text-gray-600">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{suitePassed}</p>
                        <p className="text-gray-600">Passed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{suiteTotal - suitePassed}</p>
                        <p className="text-gray-600">Failed</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium">{suiteSuccessRate}%</span>
                      </div>
                      <Progress value={suiteSuccessRate} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleRunTestSuite(suite.id)}
                        disabled={data.isRunning}
                        size="sm"
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run Suite
                      </Button>
                      <Button 
                        onClick={() => setSelectedSuite(selectedSuite === suite.id ? null : suite.id)}
                        variant="outline"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {selectedSuite === suite.id ? 'Hide' : 'Show'} Tests
                      </Button>
                    </div>

                    {selectedSuite === suite.id && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Tests in this suite:</h4>
                        {suite.tests.map((test) => {
                          const testReport = suiteReports.find(r => r.testId === test.id);
                          return (
                            <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{test.name}</span>
                                  <Badge className={getTestTypeColor(test.type)} variant="outline">
                                    {test.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{test.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {testReport ? (
                                  testReport.result.passed ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  )
                                ) : (
                                  <Clock className="h-5 w-5 text-gray-400" />
                                )}
                                {testReport && (
                                  <span className="text-sm text-gray-600">
                                    {testReport.result.duration.toFixed(0)}ms
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Test Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Reports</CardTitle>
              <CardDescription>Latest test execution results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.reports.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    No test reports available. Run tests to see results here.
                  </p>
                ) : (
                  data.reports.slice(0, 50).map((report) => {
                    const suite = data.suites.find(s => s.id === report.suiteId);
                    const test = suite?.tests.find(t => t.id === report.testId);
                    
                    return (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {report.result.passed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="font-medium">{test?.name || 'Unknown Test'}</span>
                            <Badge className={getTestTypeColor(test?.type || 'unknown')} variant="outline">
                              {test?.type || 'unknown'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {suite?.name} • {report.timestamp.toLocaleString()}
                          </div>
                          {report.result.error && (
                            <div className="text-sm text-red-600 mt-1">
                              Error: {report.result.error.message}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {report.result.duration.toFixed(2)}ms
                          </div>
                          <div className="text-xs text-gray-600">
                            {report.result.assertions.passed}/{report.result.assertions.total} assertions
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {data.summary && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(data.summary.byCategory).map(([category, stats]) => (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{category}</span>
                            <span>{getSuccessRate(stats.passed, stats.total)}%</span>
                          </div>
                          <Progress value={getSuccessRate(stats.passed, stats.total)} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>{stats.passed} passed</span>
                            <span>{stats.failed} failed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Test Results by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(data.summary.byType).map(([type, stats]) => (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{type}</span>
                            <span>{getSuccessRate(stats.passed, stats.total)}%</span>
                          </div>
                          <Progress value={getSuccessRate(stats.passed, stats.total)} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>{stats.passed} passed</span>
                            <span>{stats.failed} failed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{data.summary.totalDuration.toFixed(0)}ms</p>
                      <p className="text-gray-600">Total Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {data.summary.totalTests > 0 ? (data.summary.totalDuration / data.summary.totalTests).toFixed(0) : 0}ms
                      </p>
                      <p className="text-gray-600">Avg per Test</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{data.summary.performance.totalNetworkRequests}</p>
                      <p className="text-gray-600">Network Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}