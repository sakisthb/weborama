// Quick Button Test Page - Fast Button Functionality Verification
import { ButtonDebugPanel } from '@/components/button-debug-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Zap, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export function ButtonTest() {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});

  const quickTests = [
    {
      id: 'toast',
      name: 'Toast Test',
      action: () => {
        toast.success('🎉 Toast working!');
        setTestResults(prev => ({ ...prev, toast: true }));
      }
    },
    {
      id: 'navigation',
      name: 'Navigation Test',
      action: () => {
        try {
          navigate('/settings');
          setTestResults(prev => ({ ...prev, navigation: true }));
        } catch (error) {
          setTestResults(prev => ({ ...prev, navigation: false }));
          toast.error('Navigation failed');
        }
      }
    },
    {
      id: 'localStorage',
      name: 'LocalStorage Test',
      action: () => {
        try {
          localStorage.setItem('test', 'working');
          const result = localStorage.getItem('test') === 'working';
          localStorage.removeItem('test');
          setTestResults(prev => ({ ...prev, localStorage: result }));
          toast.success(result ? 'LocalStorage working!' : 'LocalStorage failed!');
        } catch (error) {
          setTestResults(prev => ({ ...prev, localStorage: false }));
          toast.error('LocalStorage failed');
        }
      }
    },
    {
      id: 'state',
      name: 'State Update Test',
      action: () => {
        const timestamp = Date.now();
        setTestResults(prev => ({ ...prev, state: true, timestamp }));
        toast.success('State updates working!');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            🚨 Emergency Button Test Page
          </h1>
          <p className="text-lg text-muted-foreground">
            Quick diagnostics for button functionality issues
          </p>
        </div>

        {/* Quick Tests */}
        <Card className="mb-8 border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Zap className="w-5 h-5" />
              Quick Button Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickTests.map((test) => (
                <div key={test.id} className="space-y-2">
                  <Button 
                    onClick={test.action}
                    className="w-full"
                    variant={testResults[test.id] === true ? "default" : testResults[test.id] === false ? "destructive" : "outline"}
                  >
                    {testResults[test.id] === true && <CheckCircle className="w-4 h-4 mr-2" />}
                    {testResults[test.id] === false && <AlertTriangle className="w-4 h-4 mr-2" />}
                    {test.name}
                  </Button>
                  <div className="text-xs text-center">
                    {testResults[test.id] === true && <span className="text-green-600">✅ Passed</span>}
                    {testResults[test.id] === false && <span className="text-red-600">❌ Failed</span>}
                    {testResults[test.id] === undefined && <span className="text-gray-500">⏳ Not tested</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debug Panel */}
        <ButtonDebugPanel />

        {/* Emergency Info */}
        <Card className="mt-8 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200">
              🔧 Emergency Button Fix Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700 dark:text-yellow-300">
            <div className="space-y-2 text-sm">
              <div><strong>1. TypeScript Errors:</strong> Check npm run build for compilation errors</div>
              <div><strong>2. Import Issues:</strong> Verify all button component imports are correct</div>
              <div><strong>3. Event Handlers:</strong> Ensure onClick handlers are properly defined</div>
              <div><strong>4. Router Issues:</strong> Check React Router setup for navigation buttons</div>
              <div><strong>5. Context Issues:</strong> Verify useSettings and other context providers</div>
              <div><strong>6. Toast Issues:</strong> Check Sonner toast provider setup</div>
              <div><strong>7. State Issues:</strong> Look for useState/useEffect problems</div>
              <div><strong>8. Network Issues:</strong> Check API endpoint connectivity</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}