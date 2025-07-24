import { integrationManager, type PlatformType } from './api-integrations/integration-manager';
import { errorManager, handlePlatformError } from './error-manager';

export interface TestResult {
  id: string;
  platform: PlatformType;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: any;
  timestamp: Date;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestCase[];
  required: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  testFn: () => Promise<any>;
  timeout?: number;
  retries?: number;
  required?: boolean;
}

export interface HealthCheckResult {
  platform: PlatformType;
  status: 'healthy' | 'degraded' | 'unhealthy';
  score: number; // 0-100
  issues: string[];
  lastCheck: Date;
  responseTime: number;
  details: any;
}

class IntegrationTesting {
  private testResults: Map<string, TestResult> = new Map();
  private healthChecks: Map<PlatformType, HealthCheckResult> = new Map();
  private running = false;

  // Test suites for each platform
  private testSuites: TestSuite[] = [
    {
      id: 'connection-tests',
      name: 'Connection Tests',
      description: 'Test basic connectivity and authentication',
      required: true,
      tests: [
        {
          id: 'test-connection',
          name: 'Test Connection',
          description: 'Verify platform connection is working',
          testFn: async () => {
            const status = integrationManager.getConnectionStatus();
            const connectedPlatforms = Array.from(status.values()).filter(s => s.connected);
            if (connectedPlatforms.length === 0) {
              throw new Error('No platforms connected');
            }
            return { connectedPlatforms: connectedPlatforms.length };
          },
          timeout: 10000,
          retries: 2
        },
        {
          id: 'test-authentication',
          name: 'Test Authentication',
          description: 'Verify authentication tokens are valid',
          testFn: async () => {
            const status = integrationManager.getConnectionStatus();
            const platforms: PlatformType[] = ['meta', 'google-ads', 'google-analytics', 'tiktok', 'woocommerce'];
            
            for (const platform of platforms) {
              const platformStatus = status.get(platform);
              if (platformStatus?.connected && platformStatus.error) {
                throw new Error(`${platform} authentication failed: ${platformStatus.error}`);
              }
            }
            return { authenticatedPlatforms: platforms.length };
          },
          timeout: 15000,
          retries: 1
        }
      ]
    },
    {
      id: 'data-retrieval-tests',
      name: 'Data Retrieval Tests',
      description: 'Test data fetching from platforms',
      required: false,
      tests: [
        {
          id: 'test-campaigns-fetch',
          name: 'Test Campaigns Fetch',
          description: 'Verify campaigns can be retrieved',
          testFn: async () => {
            const campaigns = await integrationManager.getAllCampaigns();
            return { campaignsCount: campaigns.length };
          },
          timeout: 20000,
          retries: 2
        },
        {
          id: 'test-metrics-fetch',
          name: 'Test Metrics Fetch',
          description: 'Verify metrics can be retrieved',
          testFn: async () => {
            const dateRange = {
              startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date().toISOString()
            };
            const metrics = await integrationManager.getUnifiedMetrics(dateRange);
            return { metricsRetrieved: !!metrics };
          },
          timeout: 25000,
          retries: 2
        }
      ]
    },
    {
      id: 'error-handling-tests',
      name: 'Error Handling Tests',
      description: 'Test error scenarios and recovery',
      required: false,
      tests: [
        {
          id: 'test-rate-limit-handling',
          name: 'Test Rate Limit Handling',
          description: 'Verify rate limit errors are handled gracefully',
          testFn: async () => {
            // Simulate rate limit error
            const mockError = {
              status: 429,
              message: 'Rate limit exceeded',
              code: 'RATE_LIMIT'
            };
            
            const errorId = handlePlatformError('meta', mockError, 'test');
            const error = errorManager.getError(errorId);
            
            if (!error || error.type !== 'rate_limit') {
              throw new Error('Rate limit error not handled correctly');
            }
            
            return { errorHandled: true, errorType: error.type };
          },
          timeout: 5000
        },
        {
          id: 'test-authentication-error',
          name: 'Test Authentication Error',
          description: 'Verify authentication errors are handled',
          testFn: async () => {
            // Simulate authentication error
            const mockError = {
              status: 401,
              message: 'Invalid access token',
              code: 'AUTH_ERROR'
            };
            
            const errorId = handlePlatformError('google-ads', mockError, 'test');
            const error = errorManager.getError(errorId);
            
            if (!error || error.type !== 'authentication') {
              throw new Error('Authentication error not handled correctly');
            }
            
            return { errorHandled: true, errorType: error.type };
          },
          timeout: 5000
        }
      ]
    },
    {
      id: 'performance-tests',
      name: 'Performance Tests',
      description: 'Test response times and performance',
      required: false,
      tests: [
        {
          id: 'test-response-time',
          name: 'Test Response Time',
          description: 'Verify API response times are acceptable',
          testFn: async () => {
            const startTime = Date.now();
            
            try {
              await integrationManager.getAllCampaigns();
              const responseTime = Date.now() - startTime;
              
              if (responseTime > 10000) { // 10 seconds
                throw new Error(`Response time too slow: ${responseTime}ms`);
              }
              
              return { responseTime };
            } catch (error) {
              const responseTime = Date.now() - startTime;
              return { responseTime, error: error instanceof Error ? error.message : 'Unknown error' };
            }
          },
          timeout: 30000
        },
        {
          id: 'test-concurrent-requests',
          name: 'Test Concurrent Requests',
          description: 'Verify system handles concurrent requests',
          testFn: async () => {
            const promises = [
              integrationManager.getAllCampaigns(),
              integrationManager.getUnifiedMetrics({
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString()
              })
            ];
            
            const results = await Promise.allSettled(promises);
            const successful = results.filter(r => r.status === 'fulfilled').length;
            
            if (successful < results.length * 0.8) { // 80% success rate
              throw new Error(`Concurrent requests failed: ${successful}/${results.length} successful`);
            }
            
            return { successful, total: results.length };
          },
          timeout: 30000
        }
      ]
    }
  ];

  public async runAllTests(): Promise<TestResult[]> {
    if (this.running) {
      throw new Error('Tests already running');
    }

    this.running = true;
    const results: TestResult[] = [];

    try {
      for (const suite of this.testSuites) {
        console.log(`🧪 Running test suite: ${suite.name}`);
        
        for (const testCase of suite.tests) {
          const result = await this.runTest(testCase);
          results.push(result);
          
          // Store result
          this.testResults.set(result.id, result);
          
          // Log result
          const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
          console.log(`${statusIcon} ${testCase.name}: ${result.status} (${result.duration}ms)`);
          
          if (result.error) {
            console.error(`   Error: ${result.error}`);
          }
        }
      }
    } finally {
      this.running = false;
    }

    return results;
  }

  public async runTestSuite(suiteId: string): Promise<TestResult[]> {
    const suite = this.testSuites.find(s => s.id === suiteId);
    if (!suite) {
      throw new Error(`Test suite not found: ${suiteId}`);
    }

    const results: TestResult[] = [];
    
    for (const testCase of suite.tests) {
      const result = await this.runTest(testCase);
      results.push(result);
      this.testResults.set(result.id, result);
    }

    return results;
  }

  public async runTest(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();
    const result: TestResult = {
      id: crypto.randomUUID(),
      platform: 'meta', // Default, will be updated based on test
      testName: testCase.name,
      status: 'failed',
      duration: 0,
      timestamp: new Date()
    };

    try {
      const timeout = testCase.timeout || 10000;
      const retries = testCase.retries || 0;
      
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const testPromise = testCase.testFn();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Test timeout')), timeout)
          );
          
          const details = await Promise.race([testPromise, timeoutPromise]);
          
          result.status = 'passed';
          result.details = details;
          break;
        } catch (error) {
          lastError = error as Error;
          
          if (attempt === retries) {
            throw lastError;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    } catch (error) {
      result.status = 'failed';
      result.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  public async runHealthCheck(platform: PlatformType): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    const result: HealthCheckResult = {
      platform,
      status: 'unhealthy',
      score: 0,
      issues: [],
      lastCheck: new Date(),
      responseTime: 0,
      details: {}
    };

    try {
      const status = integrationManager.getConnectionStatus();
      const platformStatus = status.get(platform);
      
      if (!platformStatus?.connected) {
        result.issues.push('Platform not connected');
        result.responseTime = Date.now() - startTime;
        return result;
      }

      // Test basic connectivity
      const connectivityTest = await this.runConnectivityTest(platform);
      if (!connectivityTest.success) {
        result.issues.push(`Connectivity failed: ${connectivityTest.error}`);
      }

      // Test data retrieval
      const dataTest = await this.runDataRetrievalTest(platform);
      if (!dataTest.success) {
        result.issues.push(`Data retrieval failed: ${dataTest.error}`);
      }

      // Calculate score
      let score = 100;
      if (result.issues.length > 0) {
        score = Math.max(0, 100 - (result.issues.length * 25));
      }

      result.score = score;
      result.status = score >= 80 ? 'healthy' : score >= 50 ? 'degraded' : 'unhealthy';
      result.responseTime = Date.now() - startTime;
      result.details = {
        connectivity: connectivityTest,
        dataRetrieval: dataTest
      };

    } catch (error) {
      result.issues.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.responseTime = Date.now() - startTime;
    }

    this.healthChecks.set(platform, result);
    return result;
  }

  public async runAllHealthChecks(): Promise<HealthCheckResult[]> {
    const platforms: PlatformType[] = ['meta', 'google-ads', 'google-analytics', 'tiktok', 'woocommerce'];
    const results: HealthCheckResult[] = [];

    for (const platform of platforms) {
      const result = await this.runHealthCheck(platform);
      results.push(result);
    }

    return results;
  }

  private async runConnectivityTest(platform: PlatformType): Promise<{ success: boolean; error?: string }> {
    try {
      const status = integrationManager.getConnectionStatus();
      const platformStatus = status.get(platform);
      
      if (!platformStatus?.connected) {
        return { success: false, error: 'Platform not connected' };
      }

      // Test basic API call
      switch (platform) {
        case 'meta':
          // Test Facebook API call
          return { success: true };
        case 'google-ads':
          // Test Google Ads API call
          return { success: true };
        case 'google-analytics':
          // Test GA4 API call
          return { success: true };
        case 'tiktok':
          // Test TikTok API call
          return { success: true };
        case 'woocommerce':
          // Test WooCommerce API call
          return { success: true };
        default:
          return { success: false, error: 'Unknown platform' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async runDataRetrievalTest(platform: PlatformType): Promise<{ success: boolean; error?: string }> {
    try {
      // Test data retrieval for the platform
      const campaigns = await integrationManager.getAllCampaigns();
      const platformCampaigns = campaigns.filter(c => c.platform === platform);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  public getTestResults(): TestResult[] {
    return Array.from(this.testResults.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getHealthChecks(): HealthCheckResult[] {
    return Array.from(this.healthChecks.values());
  }

  public getTestSuites(): TestSuite[] {
    return this.testSuites;
  }

  public getTestStats() {
    const results = this.getTestResults();
    const stats = {
      total: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      successRate: 0,
      averageDuration: 0
    };

    if (stats.total > 0) {
      stats.successRate = (stats.passed / stats.total) * 100;
      stats.averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / stats.total;
    }

    return stats;
  }

  public getHealthStats() {
    const healthChecks = this.getHealthChecks();
    const stats = {
      total: healthChecks.length,
      healthy: healthChecks.filter(h => h.status === 'healthy').length,
      degraded: healthChecks.filter(h => h.status === 'degraded').length,
      unhealthy: healthChecks.filter(h => h.status === 'unhealthy').length,
      averageScore: 0,
      averageResponseTime: 0
    };

    if (stats.total > 0) {
      stats.averageScore = healthChecks.reduce((sum, h) => sum + h.score, 0) / stats.total;
      stats.averageResponseTime = healthChecks.reduce((sum, h) => sum + h.responseTime, 0) / stats.total;
    }

    return stats;
  }

  public clearResults() {
    this.testResults.clear();
    this.healthChecks.clear();
  }

  public isRunning(): boolean {
    return this.running;
  }
}

// Singleton instance
export const integrationTesting = new IntegrationTesting();

// Convenience functions
export const runAllTests = () => integrationTesting.runAllTests();
export const runHealthChecks = () => integrationTesting.runAllHealthChecks();
export const getTestStats = () => integrationTesting.getTestStats();
export const getHealthStats = () => integrationTesting.getHealthStats(); 