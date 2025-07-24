import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Settings,
  Database,
  Zap,
  Globe,
  ShoppingCart,
  Target,
  BarChart3,
  Key,
  Lock,
  RefreshCw,
  Trash2,
  Sparkles,
  Loader2,
  ArrowRight,
  Plus,
  Info,
  Star,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { integrationManager, type PlatformType } from '@/lib/api-integrations/integration-manager';
import { DisconnectConfirmationModal } from './disconnect-confirmation-modal';
import { AccountManagementModal } from './account-management-modal';

const PLATFORM_CONFIG = {
  meta: {
    name: 'Meta Ads (Facebook)',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    description: 'Συνδέστε τα Facebook & Instagram Ads',
    authUrl: 'https://developers.facebook.com/apps',
    requiredFields: ['clientId', 'clientSecret', 'accessToken'],
    permissions: ['ads_read', 'ads_management', 'business_management'],
    features: ['Campaign Management', 'Audience Insights', 'Creative Optimization'],
    benefits: ['Unified Facebook & Instagram', 'Advanced Targeting', 'Real-time Analytics']
  },
  'google-ads': {
    name: 'Google Ads',
    icon: Globe,
    color: 'from-green-500 to-green-600',
    description: 'Συνδέστε το Google Ads account',
    authUrl: 'https://console.developers.google.com',
    requiredFields: ['clientId', 'clientSecret', 'accessToken', 'refreshToken', 'developerToken', 'customerId'],
    permissions: ['https://www.googleapis.com/auth/adwords'],
    features: ['Search & Display Ads', 'Shopping Campaigns', 'Video Advertising'],
    benefits: ['Google Search Network', 'YouTube Advertising', 'Shopping Feeds']
  },
  'google-analytics': {
    name: 'Google Analytics 4',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
    description: 'Συνδέστε το Google Analytics',
    authUrl: 'https://console.developers.google.com',
    requiredFields: ['clientId', 'clientSecret', 'accessToken', 'refreshToken', 'propertyId'],
    permissions: ['https://www.googleapis.com/auth/analytics.readonly'],
    features: ['Website Analytics', 'Conversion Tracking', 'User Behavior'],
    benefits: ['Real-time Data', 'Advanced Segments', 'E-commerce Tracking']
  },
  tiktok: {
    name: 'TikTok Ads',
    icon: Zap,
    color: 'from-pink-500 to-pink-600',
    description: 'Συνδέστε το TikTok for Business',
    authUrl: 'https://ads.tiktok.com/marketing_api',
    requiredFields: ['clientId', 'clientSecret', 'accessToken', 'advertiserId'],
    permissions: ['ads:read', 'ads:manage'],
    features: ['TikTok Campaigns', 'Creative Studio', 'Audience Targeting'],
    benefits: ['TikTok Network', 'Creative Tools', 'Trending Content']
  },
  woocommerce: {
    name: 'WooCommerce',
    icon: ShoppingCart,
    color: 'from-purple-500 to-purple-600',
    description: 'Συνδέστε το WooCommerce store',
    authUrl: 'Direct API Keys',
    requiredFields: ['siteUrl', 'consumerKey', 'consumerSecret'],
    permissions: ['read', 'write'],
    features: ['Order Management', 'Product Analytics', 'Customer Insights'],
    benefits: ['E-commerce Data', 'Revenue Tracking', 'Customer Journey']
  }
};

export function EnhancedPlatformIntegrations() {
  const [connectionStatus, setConnectionStatus] = useState(new Map());
  const [isConnecting, setIsConnecting] = useState<PlatformType | null>(null);
  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({});
  const [isInitializing, setIsInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('advertising');
  
  // Disconnect modal state
  const [disconnectModal, setDisconnectModal] = useState<{
    open: boolean;
    platform: PlatformType | null;
    accountId: string;
    accountName: string;
  }>({
    open: false,
    platform: null,
    accountId: '',
    accountName: ''
  });

  // Account management modal state
  const [accountManagementModal, setAccountManagementModal] = useState<{
    open: boolean;
    platform: PlatformType | null;
  }>({
    open: false,
    platform: null
  });

  useEffect(() => {
    initializeIntegrations();
  }, []);

  const initializeIntegrations = async () => {
    setIsInitializing(true);
    
    // Simulate initialization delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateConnectionStatus();
    
    // Check if user is new (no connections)
    const status = integrationManager.getConnectionStatus();
    const hasConnections = Array.from(status.values()).some(s => s.connected);
    
    if (!hasConnections) {
      setShowOnboarding(true);
    }
    
    setIsInitializing(false);
  };

  const updateConnectionStatus = () => {
    setConnectionStatus(integrationManager.getConnectionStatus());
  };

  const handleConnect = async (platform: PlatformType) => {
    const platformCreds = credentials[platform];
    if (!platformCreds) {
      toast.error('Παρακαλώ συμπληρώστε τα απαιτούμενα πεδία');
      return;
    }

    setIsConnecting(platform);

    try {
      let result;
      const apiCredentials = {
        platform,
        ...platformCreds
      };

      switch (platform) {
        case 'meta':
          result = await integrationManager.connectMeta(apiCredentials);
          break;
        case 'google-ads':
          result = await integrationManager.connectGoogleAds(apiCredentials, platformCreds.developerToken);
          break;
        case 'google-analytics':
          result = await integrationManager.connectGoogleAnalytics(apiCredentials);
          break;
        case 'tiktok':
          result = await integrationManager.connectTikTok(apiCredentials);
          break;
        case 'woocommerce':
          result = await integrationManager.connectWooCommerce(apiCredentials);
          break;
      }

      if (result?.success) {
        toast.success(`${PLATFORM_CONFIG[platform].name} συνδέθηκε επιτυχώς! 🎉`);
        updateConnectionStatus();
        setShowOnboarding(false);
        // Clear credentials from state for security
        setCredentials(prev => ({ ...prev, [platform]: {} }));
      } else {
        toast.error(`Σφάλμα σύνδεσης: ${result?.message}`);
      }
    } catch (error: any) {
      toast.error(`Σφάλμα: ${error.message}`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = (platform: PlatformType, accountId?: string, accountName?: string) => {
    const status = connectionStatus.get(platform);
    const accounts = status?.accounts || [];
    
    if (accounts.length > 0) {
      const accountToDisconnect = accountId ? 
        accounts.find(acc => acc.id === accountId) : 
        accounts[0];
      
      if (accountToDisconnect) {
        setDisconnectModal({
          open: true,
          platform,
          accountId: accountToDisconnect.id,
          accountName: accountToDisconnect.name
        });
      }
    } else {
      setDisconnectModal({
        open: true,
        platform,
        accountId: 'default',
        accountName: PLATFORM_CONFIG[platform].name
      });
    }
  };

  const handleConfirmDisconnect = async () => {
    if (!disconnectModal.platform) return;

    try {
      const result = await integrationManager.removeAccount(
        disconnectModal.platform, 
        disconnectModal.accountId
      );

      if (result.success) {
        toast.success(`${PLATFORM_CONFIG[disconnectModal.platform].name} αποσυνδέθηκε επιτυχώς`);
        updateConnectionStatus();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(`Σφάλμα αποσύνδεσης: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`);
      throw error;
    }
  };

  const handleManageAccounts = (platform: PlatformType) => {
    setAccountManagementModal({
      open: true,
      platform
    });
  };

  const updateCredential = (platform: PlatformType, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const renderOnboardingCard = () => (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl">Καλώς ήρθατε στο Ads Pro! 🎉</CardTitle>
        <CardDescription className="text-base">
          Ξεκινήστε συνδέοντας τις πρώτες σας διαφημιστικές πλατφόρμες για να δείτε τα δεδομένα σας σε έναν ενοποιημένο dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold">Unified Analytics</h4>
            <p className="text-sm text-muted-foreground">Όλα τα δεδομένα σε ένα μέρος</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold">Smart Insights</h4>
            <p className="text-sm text-muted-foreground">AI-powered recommendations</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold">Real-time Data</h4>
            <p className="text-sm text-muted-foreground">Live campaign performance</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowOnboarding(false)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Ξεκινήστε με τις συνδέσεις
        </Button>
      </CardContent>
    </Card>
  );

  const renderPlatformCard = (platform: PlatformType) => {
    const config = PLATFORM_CONFIG[platform];
    const status = connectionStatus.get(platform);
    const isConnected = status?.connected || false;
    const Icon = config.icon;
    const accountCount = status?.accountInfo ? (Array.isArray(status.accountInfo) ? status.accountInfo.length : 1) : 0;
    const isConnectingThis = isConnecting === platform;

    return (
      <Card 
        key={platform} 
        className={`group relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:scale-[1.02] ${
          isConnected 
            ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20 shadow-green-100 dark:shadow-green-900/20' 
            : 'border-gray-200 hover:border-gray-300'
        } ${isConnectingThis ? 'animate-pulse' : ''}`}
      >
        {/* Connection Status Indicator */}
        <div className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
        }`} />
        
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`relative p-3 rounded-xl bg-gradient-to-r ${config.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <Icon className="w-6 h-6 text-white" />
                {isConnectingThis && (
                  <div className="absolute inset-0 bg-white/20 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-lg">{config.name}</div>
                <div className="text-sm text-muted-foreground">{config.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {accountCount > 1 ? `${accountCount} Λογαριασμοί` : 'Συνδεδεμένο'}
                </Badge>
              ) : (
                <Badge variant="outline" className="shadow-sm">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Μη συνδεδεμένο
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              {/* Success State */}
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">
                    ✅ Σύνδεση ενεργή
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Δεδομένα διαθέσιμα για ανάλυση
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Διαθέσιμες λειτουργίες:
                </div>
                <div className="flex flex-wrap gap-1">
                  {config.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {config.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{config.features.length - 2} ακόμα
                    </Badge>
                  )}
                </div>
              </div>

              {/* Last Sync Info */}
              {status?.lastSync && (
                <div className="text-xs text-muted-foreground">
                  Τελευταίος συγχρονισμός: {status.lastSync.toLocaleString('el-GR')}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(platform)}
                  className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Αποσύνδεση
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleManageAccounts(platform)}
                  className="flex-1"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Διαχείριση
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Benefits */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Οφέλη:
                </div>
                <ul className="space-y-1">
                  {config.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connection Form */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Απαιτούμενα στοιχεία:
                </div>
                
                {config.requiredFields.map(field => (
                  <div key={field} className="space-y-1">
                    <Label htmlFor={`${platform}-${field}`} className="text-xs">
                      {getFieldLabel(field)}
                    </Label>
                    <Input
                      id={`${platform}-${field}`}
                      type={field.includes('secret') || field.includes('token') ? 'password' : 'text'}
                      placeholder={getFieldPlaceholder(field)}
                      value={credentials[platform]?.[field] || ''}
                      onChange={(e) => updateCredential(platform, field, e.target.value)}
                      className="h-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <a 
                  href={config.authUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Developer Console
                </a>
                
                <Button 
                  size="sm" 
                  onClick={() => handleConnect(platform)}
                  disabled={isConnectingThis}
                  className={`bg-gradient-to-r ${config.color} text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  {isConnectingThis ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Σύνδεση...
                    </>
                  ) : (
                    <>
                      <Key className="w-3 h-3 mr-1" />
                      Σύνδεση
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      accessToken: 'Access Token',
      refreshToken: 'Refresh Token',
      developerToken: 'Developer Token',
      customerId: 'Customer ID',
      propertyId: 'Property ID',
      advertiserId: 'Advertiser ID',
      siteUrl: 'Site URL',
      consumerKey: 'Consumer Key',
      consumerSecret: 'Consumer Secret'
    };
    return labels[field] || field;
  };

  const getFieldPlaceholder = (field: string): string => {
    const placeholders: Record<string, string> = {
      clientId: 'Το App/Client ID σας',
      clientSecret: 'Το App/Client Secret σας',
      accessToken: 'Το access token σας',
      refreshToken: 'Το refresh token σας',
      developerToken: 'Το Google Ads developer token',
      customerId: 'Το Google Ads customer ID',
      propertyId: 'Το GA4 property ID',
      advertiserId: 'Το TikTok advertiser ID',
      siteUrl: 'https://yourstore.com',
      consumerKey: 'Το WooCommerce consumer key',
      consumerSecret: 'Το WooCommerce consumer secret'
    };
    return placeholders[field] || `Εισάγετε ${field}`;
  };

  const connectedCount = Array.from(connectionStatus.values()).filter(status => status.connected).length;

  if (isInitializing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Platform Integrations</h2>
            <p className="text-muted-foreground">
              Φόρτωση διαθέσιμων πλατφορμών...
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Integrations</h2>
          <p className="text-muted-foreground">
            Συνδέστε τις διαφημιστικές πλατφόρμες και το e-shop σας για ενοποιημένη ανάλυση
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {connectedCount}/5 Συνδεδεμένα
          </Badge>
          {connectedCount > 0 && (
            <div className="w-32">
              <Progress value={(connectedCount / 5) * 100} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Card */}
      {showOnboarding && renderOnboardingCard()}

      {/* Security Notice */}
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          <strong>Ασφάλεια:</strong> Όλες οι συνδέσεις χρησιμοποιούν official APIs με proper rate limiting για να μην κινδυνεύσουν οι λογαριασμοί σας. 
          Τα credentials αποθηκεύονται κρυπτογραφημένα με AES-256-GCM.
        </AlertDescription>
      </Alert>

      {/* Platform Cards */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advertising">Διαφημιστικές Πλατφόρμες</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        </TabsList>

        <TabsContent value="advertising" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {renderPlatformCard('meta')}
            {renderPlatformCard('google-ads')}
            {renderPlatformCard('tiktok')}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-1 max-w-2xl">
            {renderPlatformCard('google-analytics')}
          </div>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-1 max-w-2xl">
            {renderPlatformCard('woocommerce')}
          </div>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Database className="w-5 h-5" />
            Οδηγίες Σύνδεσης
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-600 dark:text-blue-400">
          <div>• <strong>Meta Ads:</strong> Δημιουργήστε Facebook App στο developers.facebook.com</div>
          <div>• <strong>Google Ads:</strong> Χρειάζεστε Developer Token + OAuth credentials</div>
          <div>• <strong>Google Analytics:</strong> Ενεργοποιήστε το Analytics Data API</div>
          <div>• <strong>TikTok Ads:</strong> Εγγραφή στο TikTok Marketing API</div>
          <div>• <strong>WooCommerce:</strong> Δημιουργήστε API keys στο WP Admin → WooCommerce → Settings → Advanced → REST API</div>
        </CardContent>
      </Card>

      {/* Disconnect Confirmation Modal */}
      {disconnectModal.platform && (
        <DisconnectConfirmationModal
          open={disconnectModal.open}
          onOpenChange={(open) => setDisconnectModal(prev => ({ ...prev, open }))}
          platform={disconnectModal.platform}
          accountId={disconnectModal.accountId}
          accountName={disconnectModal.accountName}
          onConfirm={handleConfirmDisconnect}
          isMultiAccount={true}
          totalAccounts={connectionStatus.get(disconnectModal.platform)?.accounts?.length || 1}
        />
      )}

      {/* Account Management Modal */}
      {accountManagementModal.platform && (
        <AccountManagementModal
          open={accountManagementModal.open}
          onOpenChange={(open) => setAccountManagementModal(prev => ({ ...prev, open }))}
          platform={accountManagementModal.platform}
        />
      )}
    </div>
  );
} 