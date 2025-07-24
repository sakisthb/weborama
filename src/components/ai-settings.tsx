import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  ExternalLink,
  Zap,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import claudeAI from '@/lib/claude-ai-service';

export function AISettings() {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    // Check current connection status
    updateConnectionStatus();
    
    // Load existing API key (masked)
    const existingKey = localStorage.getItem('claude_api_key');
    if (existingKey) {
      setApiKey('sk-...' + existingKey.slice(-8));
    }
  }, []);

  const updateConnectionStatus = () => {
    setIsConnected(claudeAI.isConnected());
    setConnectionStatus(claudeAI.getConnectionStatus());
  };

  const handleSaveApiKey = () => {
    if (!apiKey.startsWith('sk-')) {
      toast.error('Το Claude API key πρέπει να ξεκινάει με "sk-"');
      return;
    }

    if (apiKey.length < 20) {
      toast.error('Το API key φαίνεται να είναι πολύ μικρό');
      return;
    }

    claudeAI.setApiKey(apiKey);
    updateConnectionStatus();
    
    if (claudeAI.isConnected()) {
      toast.success('Claude AI συνδέθηκε επιτυχώς! 🎉');
      setApiKey('sk-...' + apiKey.slice(-8)); // Mask the key
      setIsVisible(false);
    } else {
      toast.error('Αποτυχία σύνδεσης με Claude AI');
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      const response = await claudeAI.generateResponse({
        prompt: 'Hello, are you working?',
        maxTokens: 50
      });
      
      if (response.isFromAI) {
        toast.success('Claude AI connection test επιτυχής! ✅');
      } else {
        toast.warning('Χρησιμοποιούνται mock responses (offline mode)');
      }
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('claude_api_key');
    setApiKey('');
    updateConnectionStatus();
    toast.info('Claude API key αφαιρέθηκε');
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className={`border-l-4 ${isConnected ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20' : 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className={`w-5 h-5 ${isConnected ? 'text-green-600' : 'text-orange-600'}`} />
            Claude AI Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">{connectionStatus}</div>
              <div className="text-sm text-muted-foreground">
                {isConnected 
                  ? 'Οι AI απαντήσεις παρέχονται από το Claude AI του Anthropic'
                  : 'Χρησιμοποιούνται προκαθορισμένες expert απαντήσεις'
                }
              </div>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
          </div>
          
          {isConnected && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={isTestingConnection}
              className="mt-3"
            >
              {isTestingConnection ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            Claude API Configuration
          </CardTitle>
          <CardDescription>
            Συνδέστε το Claude AI για έξυπνες, πραγματικές απαντήσεις
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Claude API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={isVisible ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button onClick={handleSaveApiKey} disabled={!apiKey}>
                Αποθήκευση
              </Button>
            </div>
          </div>

          {apiKey && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearApiKey}
              className="text-red-600 hover:text-red-700"
            >
              Clear API Key
            </Button>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-3">
            <div className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-300">
              <Shield className="w-4 h-4" />
              Πώς να πάρετε το Claude API Key:
            </div>
            <ol className="text-sm space-y-2 text-blue-600 dark:text-blue-400">
              <li>1. Πηγαίνετε στο <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">Anthropic Console <ExternalLink className="w-3 h-3" /></a></li>
              <li>2. Συνδεθείτε ή δημιουργήστε λογαριασμό</li>
              <li>3. Πηγαίνετε στο "API Keys" section</li>
              <li>4. Δημιουργήστε ένα νέο API key</li>
              <li>5. Αντιγράψτε και επικολλήστε το key εδώ</li>
            </ol>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-amber-700 dark:text-amber-300">Security Notice:</div>
                <div className="text-amber-600 dark:text-amber-400">
                  Το API key αποθηκεύεται τοπικά στον browser σας και δεν αποστέλλεται πουθενά αλλού παρά μόνο στο Claude AI.
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="font-medium">Features με Claude AI σύνδεση:</div>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Πραγματικές AI απαντήσεις με 15+ χρόνια εμπειρία
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Εξατομικευμένες campaign προτάσεις
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Advanced budget optimization
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Real-time creative analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Context-aware recommendations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}