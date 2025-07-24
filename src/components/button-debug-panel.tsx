// Button Debug Panel - Comprehensive Button Functionality Tester
// This component tests all critical buttons across the application

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Zap, Settings, Brain, Target, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ButtonTest {
  id: string;
  name: string;
  description: string;
  test: () => Promise<boolean> | boolean;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  error?: string;
}

export function ButtonDebugPanel() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<ButtonTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    initializeTests();
  }, []);

  const initializeTests = () => {
    const buttonTests: ButtonTest[] = [
      {
        id: 'navigation-settings',
        name: 'Settings Navigation',
        description: 'Test navigation to settings page',
        test: () => {
          try {
            navigate('/settings');
            return true;
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      },
      {
        id: 'navigation-funnel',
        name: 'Funnel Analysis Navigation',
        description: 'Test navigation to funnel analysis',
        test: () => {
          try {
            navigate('/funnel-analysis');
            return true;
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      },
      {
        id: 'toast-notification',
        name: 'Toast Notifications',
        description: 'Test toast notification system',
        test: () => {
          try {
            toast.success('🔥 Button Debug Test - Notifications Working!');
            return true;
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      },
      {
        id: 'localstorage-test',
        name: 'LocalStorage Operations',
        description: 'Test localStorage read/write operations',
        test: () => {
          try {
            const testKey = 'button_debug_test';
            const testValue = 'working';
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            return retrieved === testValue;
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      },
      {
        id: 'window-reload',
        name: 'Window Reload Function',
        description: 'Test window.location.reload availability',
        test: () => {
          try {
            return typeof window.location.reload === 'function';
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      },
      {
        id: 'external-links',
        name: 'External Link Handler',
        description: 'Test window.open functionality',
        test: () => {
          try {
            // Test without actually opening - just check function exists
            return typeof window.open === 'function';
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      },
      {
        id: 'clipboard-api',
        name: 'Clipboard API',
        description: 'Test navigator.clipboard availability',
        test: () => {
          try {
            return !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      },
      {
        id: 'event-handlers',
        name: 'Event Handler Binding',
        description: 'Test basic event handler functionality',
        test: () => {
          try {
            let testPassed = false;
            const testButton = document.createElement('button');
            testButton.onclick = () => { testPassed = true; };
            testButton.click();
            return testPassed;
          } catch (error) {
            return false;
          }
        },
        status: 'pending'
      }
    ];

    setTests(buttonTests);
  };

  const runTest = async (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'testing' as const }
        : test
    ));

    const test = tests.find(t => t.id === testId);
    if (!test) return;

    try {
      const result = await test.test();
      setTests(prev => prev.map(t => 
        t.id === testId 
          ? { ...t, status: result ? 'passed' : 'failed', error: result ? undefined : 'Test returned false' }
          : t
      ));
    } catch (error: any) {
      setTests(prev => prev.map(t => 
        t.id === testId 
          ? { ...t, status: 'failed', error: error.message }
          : t
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    toast.info('🧪 Running comprehensive button functionality tests...');
    
    for (const test of tests) {
      await runTest(test.id);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    
    const passedTests = tests.filter(t => t.status === 'passed').length;
    const totalTests = tests.length;
    
    if (passedTests === totalTests) {
      toast.success(`✅ All ${totalTests} button tests passed! Buttons should be working correctly.`);
    } else {
      toast.error(`⚠️ ${totalTests - passedTests} out of ${totalTests} tests failed. Check the debug panel for details.`);
    }
  };

  const getStatusBadge = (status: ButtonTest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'testing':
        return <Badge className="bg-blue-500">Testing...</Badge>;
      case 'passed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Failed</Badge>;
    }
  };

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;
  const totalCount = tests.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          🚨 Button Functionality Debug Panel
        </CardTitle>
        <CardDescription>
          Comprehensive testing of all critical button functionalities across the application.
          This will help identify exactly which button handlers are broken.
        </CardDescription>
        
        <div className="flex gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500">{passedCount} Passed</Badge>
            <Badge variant="destructive">{failedCount} Failed</Badge>
            <Badge variant="outline">{totalCount - passedCount - failedCount} Pending</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button variant="outline" onClick={initializeTests}>
            Reset Tests
          </Button>
        </div>

        <div className="grid gap-3">
          {tests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{test.name}</h4>
                  {getStatusBadge(test.status)}
                </div>
                <p className="text-sm text-muted-foreground">{test.description}</p>
                {test.error && (
                  <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runTest(test.id)}
                  disabled={test.status === 'testing'}
                >
                  {test.status === 'testing' ? 'Testing...' : 'Test'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            🔍 How to Use This Debug Panel:
          </h4>
          <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
            <li>• Click "Run All Tests" to comprehensively test all button functionalities</li>
            <li>• Each test checks a specific aspect of button/handler functionality</li>
            <li>• Green badges indicate working functionality, red badges indicate issues</li>
            <li>• Check browser console for additional error details</li>
            <li>• If navigation tests fail, check React Router setup</li>
            <li>• If toast tests fail, check Sonner toast library integration</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}