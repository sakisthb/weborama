// Integration Manager - Centralized & Secure API Management
// Manages all platform integrations with security and compliance at the core

import { MetaAdsClient } from './meta-ads-client';
import { GoogleAdsClient } from './google-ads-client';
import { GoogleAnalyticsClient } from './google-analytics-client';
import { WooCommerceClient } from './woocommerce-client';
import { TikTokAdsClient } from './tiktok-ads-client';
import { APICredentials, APIResponse } from './base-api-client';

export type PlatformType = 'meta' | 'google-ads' | 'google-analytics' | 'tiktok' | 'woocommerce';

export interface PlatformStatus {
  platform: PlatformType;
  connected: boolean;
  lastSync: Date | null;
  error: string | null;
  accountInfo?: any;
  accounts?: Array<{
    id: string;
    name: string;
    isDefault: boolean;
    isActive: boolean;
  }>;
}

export interface UnifiedCampaignData {
  id: string;
  name: string;
  platform: PlatformType;
  accountId: string;
  accountName: string;
  status: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  startDate: string;
  endDate?: string;
}

export interface UnifiedMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageCPC: number;
  overallROAS: number;
  platformBreakdown: Array<{
    platform: PlatformType;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
  }>;
}

export class IntegrationManager {
  private clients: Map<PlatformType, any> = new Map();
  private connectionStatus: Map<PlatformType, PlatformStatus> = new Map();
  private currentUserId: string | null = null;

  constructor() {
    this.initializeStatusMap();
  }

  public setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  private initializeStatusMap(): void {
    const platforms: PlatformType[] = ['meta', 'google-ads', 'google-analytics', 'tiktok', 'woocommerce'];
    
    platforms.forEach(platform => {
      this.connectionStatus.set(platform, {
        platform,
        connected: false,
        lastSync: null,
        error: null,
        accounts: []
      });
    });
  }

  // **MULTI-ACCOUNT SUPPORT**: Get all accounts for a platform
  public async getAccounts(platform: PlatformType): Promise<Array<{id: string; name: string; isDefault: boolean; isActive: boolean}>> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`/api/v1/integrations/${platform}/accounts`, {
        headers: {
          'Authorization': `Bearer ${this.currentUserId}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.accounts || [];
      }
    } catch (error) {
      console.error(`Error fetching ${platform} accounts:`, error);
    }

    return [];
  }

  // **MULTI-ACCOUNT SUPPORT**: Add new account
  public async addAccount(platform: PlatformType, credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    if (!this.currentUserId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const response = await fetch(`/api/v1/integrations/${platform}/accounts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentUserId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (data.success) {
        await this.updateConnectionStatusFromAPI(platform);
        return { success: true, message: `${platform} account added successfully` };
      } else {
        return { success: false, message: data.message || 'Failed to add account' };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // **MULTI-ACCOUNT SUPPORT**: Remove account
  public async removeAccount(platform: PlatformType, accountId: string): Promise<{ success: boolean; message: string }> {
    if (!this.currentUserId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const response = await fetch(`/api/v1/integrations/${platform}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.currentUserId}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        await this.updateConnectionStatusFromAPI(platform);
        return { success: true, message: `${platform} account removed successfully` };
      } else {
        return { success: false, message: data.message || 'Failed to remove account' };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // **MULTI-ACCOUNT SUPPORT**: Set default account
  public async setDefaultAccount(platform: PlatformType, accountId: string): Promise<{ success: boolean; message: string }> {
    if (!this.currentUserId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const response = await fetch(`/api/v1/integrations/${platform}/accounts/${accountId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.currentUserId}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        await this.updateConnectionStatusFromAPI(platform);
        return { success: true, message: `${platform} default account updated` };
      } else {
        return { success: false, message: data.message || 'Failed to update default account' };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  private async updateConnectionStatusFromAPI(platform: PlatformType): Promise<void> {
    try {
      const accounts = await this.getAccounts(platform);
      const isConnected = accounts.length > 0;
      
      this.connectionStatus.set(platform, {
        platform,
        connected: isConnected,
        lastSync: isConnected ? new Date() : null,
        error: null,
        accounts: accounts,
        accountInfo: accounts
      });
    } catch (error) {
      console.error(`Error updating ${platform} status:`, error);
    }
  }

  // **SECURITY**: Connect to Meta Ads with proper credentials
  public async connectMeta(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    return this.addAccount('meta', credentials);
  }

  // **SECURITY**: Connect to Google Ads with developer token
  public async connectGoogleAds(credentials: APICredentials, developerToken: string): Promise<{ success: boolean; message: string }> {
    const enhancedCredentials = { ...credentials, developerToken };
    return this.addAccount('google-ads', enhancedCredentials);
  }

  // **SECURITY**: Connect to Google Analytics
  public async connectGoogleAnalytics(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    return this.addAccount('google-analytics', credentials);
  }

  // **SECURITY**: Connect to TikTok Ads
  public async connectTikTok(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    return this.addAccount('tiktok', credentials);
  }

  // **SECURITY**: Connect to WooCommerce
  public async connectWooCommerce(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    return this.addAccount('woocommerce', credentials);
  }

  // **TOKEN MANAGEMENT**: Refresh token for an account
  public async refreshToken(platform: PlatformType, accountId: string): Promise<{ success: boolean; message: string; newToken?: string }> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`/api/v1/integrations/${platform}/accounts/${accountId}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentUserId}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Token refreshed for ${platform} account ${accountId}`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error refreshing token for ${platform}:`, error);
      return { success: false, message: 'Failed to refresh token' };
    }
  }

  // **TOKEN MANAGEMENT**: Check if token needs refresh
  public async checkTokenExpiry(platform: PlatformType, accountId: string): Promise<{ needsRefresh: boolean; expiresAt?: Date }> {
    if (!this.currentUserId) {
      return { needsRefresh: false };
    }

    try {
      const accounts = await this.getAccounts(platform);
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account) {
        return { needsRefresh: false };
      }

      // For now, assume tokens expire in 1 hour if we don't have expiry info
      // In a real implementation, you'd store and check the actual expiry
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
      
      return {
        needsRefresh: true, // Simplified logic for demo
        expiresAt: oneHourFromNow
      };
    } catch (error) {
      console.error(`Error checking token expiry for ${platform}:`, error);
      return { needsRefresh: false };
    }
  }

  private updateConnectionStatus(platform: PlatformType, updates: Partial<PlatformStatus>): void {
    const current = this.connectionStatus.get(platform);
    if (current) {
      this.connectionStatus.set(platform, { ...current, ...updates });
    }
  }

  // **UNIFIED DATA RETRIEVAL** - Now supports multi-account

  public async getAllCampaigns(dateRange?: { startDate: string; endDate: string }): Promise<UnifiedCampaignData[]> {
    const allCampaigns: UnifiedCampaignData[] = [];

    // Get campaigns from all connected platforms and accounts
    for (const [platform, status] of this.connectionStatus.entries()) {
      if (status.connected && status.accounts) {
        for (const account of status.accounts) {
          if (account.isActive) {
            try {
              const campaigns = await this.getAccountCampaigns(platform, account.id, dateRange);
              allCampaigns.push(...campaigns);
            } catch (error) {
              console.error(`Error fetching campaigns for ${platform} account ${account.id}:`, error);
            }
          }
        }
      }
    }

    return allCampaigns;
  }

  private async getAccountCampaigns(platform: PlatformType, accountId: string, dateRange?: { startDate: string; endDate: string }): Promise<UnifiedCampaignData[]> {
    if (!this.currentUserId) {
      return [];
    }

    try {
      const response = await fetch(`/api/v1/integrations/${platform}/accounts/${accountId}/campaigns`, {
        headers: {
          'Authorization': `Bearer ${this.currentUserId}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.campaigns || [];
      }
    } catch (error) {
      console.error(`Error fetching campaigns for ${platform} account ${accountId}:`, error);
    }

    return [];
  }

  public async getUnifiedMetrics(dateRange: { startDate: string; endDate: string }): Promise<UnifiedMetrics> {
    const platformMetrics: Array<{
      platform: PlatformType;
      spend: number;
      impressions: number;
      clicks: number;
      conversions: number;
      roas: number;
    }> = [];

    // Collect metrics from each platform and account
    for (const [platform, status] of this.connectionStatus.entries()) {
      if (status.connected && status.accounts) {
        let platformTotal = {
          platform,
          spend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          roas: 0
        };

        for (const account of status.accounts) {
          if (account.isActive) {
            try {
              const metrics = await this.getAccountMetrics(platform, account.id, dateRange);
              if (metrics) {
                platformTotal.spend += metrics.spend;
                platformTotal.impressions += metrics.impressions;
                platformTotal.clicks += metrics.clicks;
                platformTotal.conversions += metrics.conversions;
              }
            } catch (error) {
              console.error(`Error fetching metrics for ${platform} account ${account.id}:`, error);
            }
          }
        }

        if (platformTotal.spend > 0) {
          platformTotal.roas = platformTotal.conversions > 0 ? (platformTotal.conversions * 50) / platformTotal.spend : 0;
          platformMetrics.push(platformTotal);
        }
      }
    }

    // Calculate unified totals
    const totals = platformMetrics.reduce(
      (acc, metrics) => ({
        totalSpend: acc.totalSpend + metrics.spend,
        totalImpressions: acc.totalImpressions + metrics.impressions,
        totalClicks: acc.totalClicks + metrics.clicks,
        totalConversions: acc.totalConversions + metrics.conversions
      }),
      { totalSpend: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0 }
    );

    return {
      ...totals,
      averageCTR: totals.totalImpressions > 0 ? (totals.totalClicks / totals.totalImpressions) * 100 : 0,
      averageCPC: totals.totalClicks > 0 ? totals.totalSpend / totals.totalClicks : 0,
      overallROAS: totals.totalSpend > 0 ? (totals.totalConversions * 50) / totals.totalSpend : 0,
      platformBreakdown: platformMetrics
    };
  }

  private async getAccountMetrics(platform: PlatformType, accountId: string, dateRange: { startDate: string; endDate: string }) {
    if (!this.currentUserId) {
      return null;
    }

    try {
      const response = await fetch(`/api/v1/integrations/${platform}/accounts/${accountId}/metrics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentUserId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateRange)
      });

      if (response.ok) {
        const data = await response.json();
        return data.metrics;
      }
    } catch (error) {
      console.error(`Error fetching metrics for ${platform} account ${accountId}:`, error);
    }

    return null;
  }

  public getConnectionStatus(): Map<PlatformType, PlatformStatus> {
    return new Map(this.connectionStatus);
  }

  public isConnected(platform: PlatformType): boolean {
    const status = this.connectionStatus.get(platform);
    return status?.connected || false;
  }

  public getConnectedPlatforms(): PlatformType[] {
    return Array.from(this.connectionStatus.entries())
      .filter(([_, status]) => status.connected)
      .map(([platform, _]) => platform);
  }

  public disconnect(platform: PlatformType): void {
    this.clients.delete(platform);
    this.updateConnectionStatus(platform, {
      connected: false,
      lastSync: null,
      error: null,
      accounts: []
    });
  }

  public disconnectAll(): void {
    this.clients.clear();
    this.connectionStatus.forEach((status, platform) => {
      this.updateConnectionStatus(platform, {
        connected: false,
        lastSync: null,
        error: null,
        accounts: []
      });
    });
  }
}

// Singleton instance
export const integrationManager = new IntegrationManager();