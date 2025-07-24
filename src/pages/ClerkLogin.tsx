// Clerk Authentication Page
// Professional sign-in with Clerk

import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSaaS } from '@/lib/clerk-provider';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

export default function ClerkLogin() {
  const { isAuthenticated } = useSaaS();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  
  // Check if we're in mock mode
  const isUseMockAuth = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

  // Αν είμαστε σε mock mode, κάνε redirect στο /welcome (ή render fallback)
  if (isUseMockAuth) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-500">Mock mode ενεργό. Χρησιμοποίησε το /welcome για login.</div>;
  }

  // Redirect if already signed in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle mock login
  const handleMockLogin = async () => {
    try {
      // The original code had login('Αλέξανδρος', 'Ads Pro Platform');
      // This line is removed as per the edit hint.
      toast.success('Επιτυχής σύνδεση! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Σφάλμα σύνδεσης');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AP</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Ads Pro
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Professional Campaign Analytics Platform
          </p>
          <Badge variant="secondary" className="mb-4">
            {isUseMockAuth ? '🔧 Development Mode' : '🔐 Powered by Clerk'}
          </Badge>
        </div>

        {/* Authentication Components */}
        <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl shadow-gray-500/10">
          <CardHeader className="text-center">
            <CardTitle>
              {isUseMockAuth ? 'Development Access' : (mode === 'sign-in' ? 'Sign In' : 'Create Account')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUseMockAuth ? (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Quick development access - no credentials required
                </div>
                <Button 
                  onClick={handleMockLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  Continue to Dashboard
                </Button>
                <div className="text-center text-xs text-gray-500">
                  Development Mode: Auto-login as Αλέξανδρος
                </div>
              </div>
            ) : (
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                  <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sign-in" className="mt-4">
                  <SignIn 
                    routing="hash"
                    afterSignInUrl="/dashboard"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                      }
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="sign-up" className="mt-4">
                  <SignUp 
                    routing="hash"
                    afterSignUpUrl="/dashboard"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden", 
                        headerSubtitle: "hidden",
                      }
                    }}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            🚀 Advanced Campaign Analytics • 📊 Real-time Reporting
          </p>
          <p className="text-sm text-gray-500">
            🤖 AI-Powered Insights • 🔄 Multi-platform Integration
          </p>
        </div>
      </div>
    </div>
  );
}