import React from 'react';
import { useSaaS } from '@/lib/clerk-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { log } from '@/lib/logger';
import claudeAI from '@/lib/claude-ai-service';
import { DataFetchStatus } from '@/components/data-fetch-status';

const data = [
  { name: 'Jan', uv: 400 },
  { name: 'Feb', uv: 300 },
  { name: 'Mar', uv: 200 },
  { name: 'Apr', uv: 278 },
  { name: 'May', uv: 189 },
  { name: 'Jun', uv: 239 },
  { name: 'Jul', uv: 349 },
];

// Test 7: Custom Services (claudeAI)
const DashboardIncremental: React.FC = () => {
  const { user, organization } = useSaaS();
  const { t } = useTranslation();

  // Test log
  React.useEffect(() => {
    log.info('DashboardIncremental: log test message', { user });
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Incremental Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>✅ Test 1: Basic Imports</CardTitle>
            <CardDescription>useSaaS hook works correctly.</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>User:</strong> {user?.firstName} {user?.lastName}</p>
            <Badge variant="secondary">{user?.role}</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>✅ Test 2: UI Components</CardTitle>
            <CardDescription>Card, Button, Badge components.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you can see this card, UI components work!</p>
            <Button className="mt-2">Test Button</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Test 3: Lucide React Icon</CardTitle>
            <CardDescription>Rocket icon from lucide-react.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you can see the rocket icon below, lucide-react works!</p>
            <div className="flex items-center gap-2 mt-2">
              <Rocket className="w-6 h-6 text-blue-500" />
              <span>Rocket Icon</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Test 4: Recharts LineChart</CardTitle>
            <CardDescription>Simple LineChart from recharts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 150 }}>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Test 5: react-i18next</CardTitle>
            <CardDescription>useTranslation hook from react-i18next.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you can see the translated string below, react-i18next works!</p>
            <div className="mt-2">
              <span>{t('dashboard.greeting', 'Hello from i18next!')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Test 6: log from @/lib/logger</CardTitle>
            <CardDescription>Logging a test message to the console.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you can see this card, the log import works!</p>
            <div className="mt-2 text-xs text-muted-foreground">
              Check the browser console for a log message.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Test 7: claudeAI from @/lib/claude-ai-service</CardTitle>
            <CardDescription>Testing claudeAI import and property.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you can see this card, the claudeAI import works!</p>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>typeof claudeAI: {typeof claudeAI}</span><br />
              <span>keys: {Object.keys(claudeAI).join(', ')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>📋 Test Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>✅ Test 1: useSaaS hook</p>
              <p>✅ Test 2: UI components (Card, Button, Badge)</p>
              <p>✅ Test 3: Lucide React icons</p>
              <p>✅ Test 4: Recharts library</p>
              <p>✅ Test 5: react-i18next</p>
              <p>✅ Test 6: log from @/lib/logger</p>
              <p>✅ Test 7: claudeAI from @/lib/claude-ai-service</p>
              <p>✅ Test 8: DataFetchStatus from @/components/data-fetch-status</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardIncremental; 