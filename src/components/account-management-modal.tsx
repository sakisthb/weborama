import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Star, 
  StarOff,
  Settings,
  RefreshCw,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { PlatformType, integrationManager } from '@/lib/api-integrations/integration-manager';
import { DisconnectConfirmationModal } from './disconnect-confirmation-modal';

interface AccountManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: PlatformType;
}

interface Account {
  id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

const PLATFORM_CONFIG = {
  'meta': {
    name: 'Meta (Facebook/Instagram)',
    icon: '📘',
    description: 'Manage your Meta advertising accounts',
    accountType: 'Ad Account'
  },
  'google-ads': {
    name: 'Google Ads',
    icon: '🔍',
    description: 'Manage your Google Ads accounts',
    accountType: 'Customer Account'
  },
  'google-analytics': {
    name: 'Google Analytics',
    icon: '📊',
    description: 'Manage your Google Analytics properties',
    accountType: 'Property'
  },
  'tiktok': {
    name: 'TikTok Ads',
    icon: '🎵',
    description: 'Manage your TikTok advertising accounts',
    accountType: 'Advertiser Account'
  },
  'woocommerce': {
    name: 'WooCommerce',
    icon: '🛒',
    description: 'Manage your WooCommerce stores',
    accountType: 'Store'
  }
};

export function AccountManagementModal({
  open,
  onOpenChange,
  platform
}: AccountManagementModalProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Disconnect modal state
  const [disconnectModal, setDisconnectModal] = useState<{
    open: boolean;
    accountId: string;
    accountName: string;
  }>({
    open: false,
    accountId: '',
    accountName: ''
  });

  const config = PLATFORM_CONFIG[platform];

  useEffect(() => {
    if (open) {
      loadAccounts();
    }
  }, [open, platform]);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const accountsData = await integrationManager.getAccounts(platform);
      setAccounts(accountsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (accountId: string) => {
    setActionLoading(`default-${accountId}`);

    try {
      const result = await integrationManager.setDefaultAccount(platform, accountId);
      
      if (result.success) {
        toast.success('Default account updated successfully');
        await loadAccounts(); // Refresh the list
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast.error(`Failed to set default account: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefreshToken = async (accountId: string) => {
    setActionLoading(`refresh-${accountId}`);

    try {
      const result = await integrationManager.refreshToken(platform, accountId);
      
      if (result.success) {
        toast.success('Token refreshed successfully');
      } else {
        throw new Error(result.message || 'Failed to refresh token');
      }
    } catch (err) {
      toast.error(`Failed to refresh token: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisconnect = (accountId: string, accountName: string) => {
    setDisconnectModal({
      open: true,
      accountId,
      accountName
    });
  };

  const handleConfirmDisconnect = async () => {
    try {
      const result = await integrationManager.removeAccount(platform, disconnectModal.accountId);
      
      if (result.success) {
        toast.success('Account disconnected successfully');
        await loadAccounts(); // Refresh the list
        setDisconnectModal({ open: false, accountId: '', accountName: '' });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to disconnect account: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw for modal error handling
    }
  };

  const renderAccountCard = (account: Account) => {
    const isDefaultLoading = actionLoading === `default-${account.id}`;
    const isRefreshLoading = actionLoading === `refresh-${account.id}`;

    return (
      <Card key={account.id} className={`transition-all duration-200 ${
        account.isDefault ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : ''
      }`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.icon}</span>
              <div>
                <div className="font-medium">{account.name}</div>
                <div className="text-xs text-muted-foreground">
                  ID: {account.id}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {account.isDefault && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Star className="w-3 h-3 mr-1" />
                  Default
                </Badge>
              )}
              <Badge variant={account.isActive ? "default" : "secondary"}>
                {account.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!account.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(account.id)}
                  disabled={isDefaultLoading}
                >
                  {isDefaultLoading ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Star className="w-3 h-3 mr-1" />
                  )}
                  Set Default
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRefreshToken(account.id)}
                disabled={isRefreshLoading}
              >
                {isRefreshLoading ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3 mr-1" />
                )}
                Refresh Token
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisconnect(account.id, account.name)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <div>{config.name} Account Management</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {config.description}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Manage your connected {config.accountType.toLowerCase()} accounts, set defaults, and refresh tokens.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Security Notice */}
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Security:</strong> All actions are logged for audit purposes. 
                Token refresh operations are performed securely with proper encryption.
              </AlertDescription>
            </Alert>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading accounts...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Accounts List */}
            {!loading && !error && (
              <div className="space-y-3">
                {accounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <div className="text-lg font-medium">No accounts found</div>
                    <div className="text-sm">
                      Connect your first {config.accountType.toLowerCase()} to get started.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-medium text-muted-foreground">
                      Connected Accounts ({accounts.length})
                    </div>
                    <div className="space-y-3">
                      {accounts.map(renderAccountCard)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {!loading && accounts.length > 0 && (
              <Button onClick={loadAccounts} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Modal */}
      <DisconnectConfirmationModal
        open={disconnectModal.open}
        onOpenChange={(open) => setDisconnectModal(prev => ({ ...prev, open }))}
        platform={platform}
        accountId={disconnectModal.accountId}
        accountName={disconnectModal.accountName}
        onConfirm={handleConfirmDisconnect}
        isMultiAccount={accounts.length > 1}
        totalAccounts={accounts.length}
      />
    </>
  );
} 