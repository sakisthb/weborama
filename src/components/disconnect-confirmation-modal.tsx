import React, { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Trash2, Shield, Info } from 'lucide-react';
import { PlatformType } from '@/lib/api-integrations/integration-manager';

interface DisconnectConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: PlatformType;
  accountId: string;
  accountName: string;
  onConfirm: () => Promise<void>;
  isMultiAccount?: boolean;
  totalAccounts?: number;
}

const PLATFORM_CONFIG = {
  'meta': {
    name: 'Meta (Facebook/Instagram)',
    icon: '📘',
    description: 'Facebook and Instagram advertising accounts',
    warning: 'This will revoke access to all Meta advertising data for this account.',
    impact: [
      'Campaign performance data will no longer be available',
      'Ad spend tracking will be disabled',
      'Real-time metrics will stop updating'
    ]
  },
  'google-ads': {
    name: 'Google Ads',
    icon: '🔍',
    description: 'Google Ads advertising accounts',
    warning: 'This will revoke access to all Google Ads data for this account.',
    impact: [
      'Campaign and keyword data will be removed',
      'Performance metrics will no longer sync',
      'Budget and spend tracking will stop'
    ]
  },
  'google-analytics': {
    name: 'Google Analytics',
    icon: '📊',
    description: 'Google Analytics 4 properties',
    warning: 'This will revoke access to all Google Analytics data for this property.',
    impact: [
      'Website traffic data will no longer be available',
      'Conversion tracking will be disabled',
      'User behavior analytics will stop'
    ]
  },
  'tiktok': {
    name: 'TikTok Ads',
    icon: '🎵',
    description: 'TikTok advertising accounts',
    warning: 'This will revoke access to all TikTok Ads data for this account.',
    impact: [
      'TikTok campaign data will be removed',
      'Ad performance metrics will stop syncing',
      'Creative performance data will be unavailable'
    ]
  },
  'woocommerce': {
    name: 'WooCommerce',
    icon: '🛒',
    description: 'WooCommerce stores',
    warning: 'This will revoke access to all WooCommerce data for this store.',
    impact: [
      'Order and product data will no longer sync',
      'Revenue tracking will be disabled',
      'Customer data will be removed'
    ]
  }
};

export function DisconnectConfirmationModal({
  open,
  onOpenChange,
  platform,
  accountId,
  accountName,
  onConfirm,
  isMultiAccount = false,
  totalAccounts = 1
}: DisconnectConfirmationModalProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [error, setError] = useState<string | null>(null);

  const config = PLATFORM_CONFIG[platform];

  const handleConfirm = async () => {
    setIsDisconnecting(true);
    setStep('processing');
    setError(null);

    try {
      await onConfirm();
      setStep('success');
      
      // Auto-close after success
      setTimeout(() => {
        onOpenChange(false);
        setStep('confirm');
        setIsDisconnecting(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep('error');
      setIsDisconnecting(false);
    }
  };

  const handleCancel = () => {
    if (!isDisconnecting) {
      onOpenChange(false);
      setStep('confirm');
      setError(null);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'confirm':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <div>Disconnect {config.name}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Account: {accountName}
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>
                {config.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Security Warning */}
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Security Notice:</strong> {config.warning}
                </AlertDescription>
              </Alert>

              {/* Impact Assessment */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 text-blue-600" />
                  What will happen:
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {config.impact.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Multi-Account Warning */}
              {isMultiAccount && totalAccounts > 1 && (
                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>Multi-Account:</strong> You have {totalAccounts} connected accounts. 
                    Only this account will be disconnected. Other accounts will remain active.
                  </AlertDescription>
                </Alert>
              )}

              {/* Account Details */}
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Account Details</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {accountId}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {platform.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isDisconnecting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={isDisconnecting}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Disconnect Account
              </Button>
            </DialogFooter>
          </>
        );

      case 'processing':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                Disconnecting {config.name}
              </DialogTitle>
              <DialogDescription>
                Please wait while we securely disconnect your account...
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Current actions:</div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Revoking platform access tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Updating database records
                  </li>
                  <li className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Logging security audit
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" disabled>
                Please wait...
              </Button>
            </DialogFooter>
          </>
        );

      case 'success':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                Successfully Disconnected
              </DialogTitle>
              <DialogDescription>
                Your {config.name} account has been securely disconnected.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Account disconnected successfully!</strong>
                  <br />
                  All access tokens have been revoked and data access has been terminated.
                </AlertDescription>
              </Alert>

              <div className="text-sm text-muted-foreground">
                <div className="font-medium">What was completed:</div>
                <ul className="mt-1 space-y-1">
                  <li>• Platform access tokens revoked</li>
                  <li>• Database records updated</li>
                  <li>• Security audit logged</li>
                  <li>• Local cache cleared</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        );

      case 'error':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <span className="text-2xl">❌</span>
                Disconnection Failed
              </DialogTitle>
              <DialogDescription>
                There was an error disconnecting your {config.name} account.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>

              <div className="text-sm text-muted-foreground">
                <div className="font-medium">Troubleshooting:</div>
                <ul className="mt-1 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Verify the account is still accessible</li>
                  <li>• Try again in a few minutes</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Try Again
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
} 