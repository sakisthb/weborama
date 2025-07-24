// Enhanced AI Settings - Multi-AI Configuration
// Supports Claude AI + ChatGPT integration with intelligent routing

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Brain, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  ExternalLink,
  Zap,
  Shield,
  Settings,
  DollarSign,
  BarChart3,
  Lightbulb,
  Image,
  FileText,
  TrendingUp,
  Cpu,
  Clock,
  Target
} from "lucide-react";
import { toast } from "sonner";
import claudeAI from '@/lib/claude-ai-service';
import { ChatGPTService, type ChatGPTConfig, type ChatGPTUsage } from '@/services/chatgpt-service';
import { AIRouter, type AIProvider, type AIConfig, type TaskPerformanceMetrics } from '@/services/ai-router';

interface AIProviderStatus {
  id: 'claude' | 'chatgpt';
  name: string;
  connected: boolean;
  status: string;
  icon: any;
  color: string;
  capabilities: string[];
  usage?: any;
}

export function EnhancedAISettings() {
  // Provider states
  const [providers, setProviders] = useState<AIProviderStatus[]>([
    {
      id: 'claude',
      name: 'Claude AI',
      connected: false,
      status: 'Disconnected',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      capabilities: ['Strategic Analysis', 'Detailed Reports', 'Funnel Intelligence', 'Customer Journey Analysis']
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      connected: false,
      status: 'Disconnected',
      icon: Zap,
      color: 'from-green-500 to-green-600',
      capabilities: ['Creative Generation', 'Visual Creation (DALL-E)', 'Ad Copy Writing', 'Quick Insights']
    }
  ]);

  // API Key states
  const [claudeKey, setClaudeKey] = useState('');
  const [chatgptKey, setChatgptKey] = useState('');
  const [keysVisible, setKeysVisible] = useState({ claude: false, chatgpt: false });
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);

  // Configuration states
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    defaultProvider: 'auto',
    costOptimization: true,
    qualityFirst: false,
    budgetLimit: {
      daily: 50,
      monthly: 1000
    },
    providerPreferences: {}
  });

  // Usage states
  const [chatgptUsage, setChatgptUsage] = useState<ChatGPTUsage | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<TaskPerformanceMetrics[]>([]);

  useEffect(() => {
    loadCurrentConfiguration();
    updateProviderStatus();
  }, []);

  const loadCurrentConfiguration = () => {
    // Load Claude key
    const claudeExisting = localStorage.getItem('claude_api_key');
    if (claudeExisting) {
      setClaudeKey('sk-...' + claudeExisting.slice(-8));
    }

    // Load ChatGPT key
    const chatgptApiKey = ChatGPTService.getApiKey();
    if (chatgptApiKey) {
      setChatgptKey('sk-...' + chatgptApiKey.slice(-8));
    }

    // Load AI Router config
    const routerConfig = AIRouter.getConfig();
    setAiConfig(routerConfig);

    // Load usage data
    setChatgptUsage(ChatGPTService.getUsage());

    // Load performance metrics
    setPerformanceMetrics(AIRouter.getPerformanceMetrics());
  };

  const updateProviderStatus = () => {
    setProviders(prev => prev.map(provider => {
      if (provider.id === 'claude') {
        const connected = claudeAI.isConnected();
        return {
          ...provider,
          connected,
          status: connected ? 'Connected' : 'Disconnected'
        };
      } else if (provider.id === 'chatgpt') {
        const hasKey = ChatGPTService.getApiKey().length > 0;
        return {
          ...provider,
          connected: hasKey,
          status: hasKey ? 'Connected' : 'Disconnected'
        };
      }
      return provider;
    }));
  };

  const handleSaveApiKey = async (provider: 'claude' | 'chatgpt', key: string) => {
    if (!key.startsWith('sk-')) {
      toast.error(`${provider} API key must start with "sk-"`);
      return;
    }

    if (key.length < 20) {
      toast.error('API key seems too short');
      return;
    }

    setIsTestingConnection(provider);

    try {
      let success = false;
      let message = '';

      if (provider === 'claude') {
        claudeAI.setApiKey(key);
        success = claudeAI.isConnected();
        message = success ? 'Claude AI connected successfully! 🎉' : 'Failed to connect to Claude AI';
        if (success) {
          setClaudeKey('sk-...' + key.slice(-8));
        }
      } else if (provider === 'chatgpt') {
        ChatGPTService.setApiKey(key);
        const result = await ChatGPTService.testConnection();
        success = result.success;
        message = result.success ? 'ChatGPT connected successfully! 🎉' : `ChatGPT connection failed: ${result.message}`;
        if (success) {
          setChatgptKey('sk-...' + key.slice(-8));
        }
      }

      if (success) {
        toast.success(message);
        setKeysVisible(prev => ({ ...prev, [provider]: false }));
      } else {
        toast.error(message);
      }

      updateProviderStatus();
    } finally {
      setIsTestingConnection(null);
    }
  };

  const testConnection = async (provider: 'claude' | 'chatgpt') => {
    setIsTestingConnection(provider);
    
    try {
      if (provider === 'claude') {
        const response = await claudeAI.generateResponse({
          prompt: 'Test connection - respond with "OK" only',
          maxTokens: 10
        });
        
        if (response.isFromAI) {
          toast.success('Claude AI connection test successful! ✅');
        } else {
          toast.warning('Using mock responses (offline mode)');
        }
      } else if (provider === 'chatgpt') {
        const result = await ChatGPTService.testConnection();
        
        if (result.success) {
          toast.success('ChatGPT connection test successful! ✅');
        } else {
          toast.error(`ChatGPT test failed: ${result.message}`);
        }
      }
    } catch (error) {
      toast.error(`${provider} connection test failed`);
    } finally {
      setIsTestingConnection(null);
    }
  };

  const clearApiKey = (provider: 'claude' | 'chatgpt') => {
    if (provider === 'claude') {
      localStorage.removeItem('claude_api_key');
      setClaudeKey('');
    } else if (provider === 'chatgpt') {
      localStorage.removeItem('chatgpt_api_key');
      setChatgptKey('');
    }
    
    updateProviderStatus();
    toast.info(`${provider} API key removed`);
  };

  const updateAIConfig = (newConfig: Partial<AIConfig>) => {
    const updated = { ...aiConfig, ...newConfig };
    setAiConfig(updated);
    AIRouter.configure(updated);
    toast.success('AI configuration updated');
  };

  const resetUsage = (provider: 'chatgpt') => {
    if (provider === 'chatgpt') {
      ChatGPTService.resetUsage();
      setChatgptUsage(ChatGPTService.getUsage());
      toast.info('ChatGPT usage statistics reset');
    }
  };

  const renderProviderCard = (provider: AIProviderStatus) => (
    <Card key={provider.id} className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${provider.color}`}></div>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${provider.color} rounded-lg shadow-lg`}>
              <provider.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <div className="flex items-center gap-2">
                {provider.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {provider.connected && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => testConnection(provider.id)}
                disabled={isTestingConnection === provider.id}
              >
                {isTestingConnection === provider.id ? 'Testing...' : 'Test'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* API Key Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${provider.id}-key`}>API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id={`${provider.id}-key`}
                  type={keysVisible[provider.id] ? 'text' : 'password'}
                  placeholder={`Enter ${provider.name} API key`}
                  value={provider.id === 'claude' ? claudeKey : chatgptKey}
                  onChange={(e) => provider.id === 'claude' ? setClaudeKey(e.target.value) : setChatgptKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setKeysVisible(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {keysVisible[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                onClick={() => handleSaveApiKey(provider.id, provider.id === 'claude' ? claudeKey : chatgptKey)}
                disabled={isTestingConnection === provider.id}
                size="default"
              >
                {isTestingConnection === provider.id ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Capabilities</Label>
            <div className="flex flex-wrap gap-1">
              {provider.capabilities.map((capability, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {provider.connected && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => clearApiKey(provider.id)}
              >
                Disconnect
              </Button>
              {provider.id === 'chatgpt' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resetUsage('chatgpt')}
                >
                  Reset Usage
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const connectedProviders = providers.filter(p => p.connected);
  const hasMultipleAIs = connectedProviders.length > 1;

  return (
    <div className="space-y-6">
      {/* Multi-AI Status Overview */}
      {hasMultipleAIs && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">
            🎉 Multi-AI System Active!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            You have {connectedProviders.length} AI providers connected. Smart routing and multi-AI insights are now available!
          </AlertDescription>
        </Alert>
      )}

      {/* AI Providers Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h3 className="text-lg font-semibold">AI Providers</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {providers.map(renderProviderCard)}
        </div>
      </div>

      {/* Multi-AI Configuration (only show if multiple AIs connected) */}
      {hasMultipleAIs && (
        <Tabs defaultValue="routing" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="routing">Smart Routing</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="routing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI Task Routing Configuration
                </CardTitle>
                <CardDescription>
                  Configure how tasks are distributed between your AI providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Default Provider */}
                <div className="space-y-2">
                  <Label>Default Provider</Label>
                  <Select
                    value={aiConfig.defaultProvider}
                    onValueChange={(value: AIProvider) => updateAIConfig({ defaultProvider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">🤖 Auto (Smart Routing)</SelectItem>
                      <SelectItem value="claude">🧠 Claude AI</SelectItem>
                      <SelectItem value="chatgpt">⚡ ChatGPT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Optimization Settings */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label>Cost Optimization</Label>
                      <p className="text-sm text-muted-foreground">Prefer cost-effective AI for simple tasks</p>
                    </div>
                    <Switch
                      checked={aiConfig.costOptimization}
                      onCheckedChange={(checked) => updateAIConfig({ costOptimization: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label>Quality First</Label>
                      <p className="text-sm text-muted-foreground">Prefer higher-quality AI for all tasks</p>
                    </div>
                    <Switch
                      checked={aiConfig.qualityFirst}
                      onCheckedChange={(checked) => updateAIConfig({ qualityFirst: checked })}
                    />
                  </div>
                </div>

                {/* Budget Limits */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Daily Budget Limit ($)</Label>
                    <Input
                      type="number"
                      value={aiConfig.budgetLimit.daily}
                      onChange={(e) => updateAIConfig({
                        budgetLimit: { ...aiConfig.budgetLimit, daily: parseFloat(e.target.value) }
                      })}
                      min="0"
                      step="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Budget Limit ($)</Label>
                    <Input
                      type="number"
                      value={aiConfig.budgetLimit.monthly}
                      onChange={(e) => updateAIConfig({
                        budgetLimit: { ...aiConfig.budgetLimit, monthly: parseFloat(e.target.value) }
                      })}
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Claude Usage (if connected) */}
              {providers.find(p => p.id === 'claude')?.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      Claude AI Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2" />
                      <p>Usage tracking coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ChatGPT Usage */}
              {chatgptUsage && providers.find(p => p.id === 'chatgpt')?.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      ChatGPT Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Requests Today</span>
                        <span className="font-semibold">{chatgptUsage.requestsToday}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tokens Today</span>
                        <span className="font-semibold">{chatgptUsage.tokensToday.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cost Today</span>
                        <span className="font-semibold">${chatgptUsage.costToday.toFixed(4)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Monthly Usage</Label>
                      <Progress 
                        value={(chatgptUsage.monthlyUsed / chatgptUsage.monthlyLimit) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{chatgptUsage.monthlyUsed.toLocaleString()} tokens</span>
                        <span>{chatgptUsage.monthlyLimit.toLocaleString()} limit</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Estimated Monthly Cost</span>
                        <span className="font-semibold">${chatgptUsage.estimatedMonthlyCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  AI Performance Metrics
                </CardTitle>
                <CardDescription>
                  Performance comparison between AI providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceMetrics.length > 0 ? (
                  <div className="space-y-4">
                    {performanceMetrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{metric.taskType}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{metric.provider}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="font-semibold">{(metric.avgConfidence * 100).toFixed(0)}%</div>
                            <div className="text-muted-foreground">Confidence</div>
                          </div>
                          <div>
                            <div className="font-semibold">${metric.avgCost.toFixed(3)}</div>
                            <div className="text-muted-foreground">Avg Cost</div>
                          </div>
                          <div>
                            <div className="font-semibold">{(metric.avgResponseTime / 1000).toFixed(1)}s</div>
                            <div className="text-muted-foreground">Response</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <p>No performance data available yet</p>
                    <p className="text-sm">Use AI features to collect performance metrics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Getting Your API Keys
          </CardTitle>
          <CardDescription>
            Secure your API keys from official sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Claude AI</h4>
              <p className="text-sm text-muted-foreground">
                Get your Claude API key from Anthropic Console
              </p>
              <Button size="sm" variant="outline" asChild>
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Anthropic Console
                </a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">ChatGPT</h4>
              <p className="text-sm text-muted-foreground">
                Get your OpenAI API key from OpenAI Platform
              </p>
              <Button size="sm" variant="outline" asChild>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  OpenAI Platform
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}