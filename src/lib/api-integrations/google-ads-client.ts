// Google Ads API Client - Production Ready Integration
// Built with professional experience for enterprise compliance

import { BaseAPIClient, APICredentials, APIRequest, APIResponse, RateLimitConfig } from './base-api-client';

export interface GoogleAdsAccount {
  resourceName: string;
  id: string;
  name: string;
  currencyCode: string;
  timeZone: string;
  descriptiveName: string;
  canManageClients: boolean;
  testAccount: boolean;
}

export interface GoogleAdsCampaign {
  resourceName: string;
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  advertisingChannelType: string;
  biddingStrategyType: string;
  startDate?: string;
  endDate?: string;
  budget: {
    resourceName: string;
    amountMicros: string;
    deliveryMethod: string;
  };
}

export interface GoogleAdsMetrics {
  campaignId: string;
  campaignName: string;
  impressions: string;
  clicks: string;
  costMicros: string;
  conversions: string;
  conversionValue: string;
  ctr: string;
  averageCpc: string;
  averageCpm: string;
  searchImpressionShare?: string;
  searchExactMatchImpressionShare?: string;
  allConversions: string;
  allConversionsValue: string;
  date: string;
}

export interface GoogleAdsQuery {
  query: string;
  customerId: string;
}

export class GoogleAdsClient extends BaseAPIClient {
  private static readonly API_VERSION = 'v17';
  private static readonly BASE_URL = `https://googleads.googleapis.com/${GoogleAdsClient.API_VERSION}`;
  
  private static readonly RATE_LIMITS: RateLimitConfig = {
    requestsPerSecond: 1, // Conservative approach
    requestsPerMinute: 30, // Google Ads allows higher, but we stay safe
    requestsPerHour: 1500,
    requestsPerDay: 30000,
    burstLimit: 3
  };

  private developerId: string;

  constructor(credentials: APICredentials, developerId: string = 'your-developer-id') {
    super('google-ads', credentials, GoogleAdsClient.RATE_LIMITS);
    
    if (!credentials.accessToken) {
      throw new Error('Google Ads access token is required');
    }
    
    if (!credentials.customerId) {
      throw new Error('Google Ads customer ID is required');
    }
    
    this.developerId = developerId;
    console.log('🔗 Google Ads API Client initialized');
  }

  protected async executeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    const url = `${GoogleAdsClient.BASE_URL}${request.endpoint}`;
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.credentials.accessToken}`,
      'Content-Type': 'application/json',
      'developer-token': this.developerId,
      'login-customer-id': this.credentials.customerId!,
      ...request.headers
    };

    const fetchOptions: RequestInit = {
      method: request.method,
      headers
    };

    if (request.body && (request.method === 'POST' || request.method === 'PUT')) {
      fetchOptions.body = JSON.stringify(request.body);
    } else if (request.params && request.method === 'GET') {
      const urlObj = new URL(url);
      Object.entries(request.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlObj.searchParams.set(key, String(value));
        }
      });
    }

    try {
      console.log(`📡 [Google Ads] ${request.method} ${request.endpoint}`);
      
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        // Handle Google Ads API specific errors
        if (data.error) {
          const googleError = data.error;
          
          // Handle specific error codes
          if (googleError.code === 401) {
            throw new Error('Unauthorized: Invalid or expired access token');
          }
          
          if (googleError.code === 429) {
            throw new Error('Rate limit exceeded');
          }
          
          if (googleError.code === 400) {
            throw new Error(`Bad request: ${googleError.message}`);
          }
          
          throw new Error(`Google Ads API Error ${googleError.code}: ${googleError.message}`);
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        data: data as T,
        rateLimitRemaining: this.parseRateLimitHeaders(response.headers)
      };

    } catch (error: any) {
      console.error('🚫 [Google Ads] API request failed:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  protected async performTokenRefresh(): Promise<boolean> {
    if (!this.credentials.refreshToken || !this.credentials.clientId || !this.credentials.clientSecret) {
      console.error('[Google Ads] Missing refresh token or client credentials');
      return false;
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          refresh_token: this.credentials.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        this.credentials.accessToken = data.access_token;
        this.credentials.expiresAt = Date.now() + (data.expires_in * 1000);
        
        console.log('✅ [Google Ads] Token refreshed successfully');
        return true;
      } else {
        console.error('[Google Ads] Token refresh failed:', data);
        return false;
      }

    } catch (error) {
      console.error('[Google Ads] Token refresh error:', error);
      return false;
    }
  }

  protected getHealthCheckEndpoint(): string {
    return `/customers/${this.credentials.customerId}`;
  }

  private parseRateLimitHeaders(headers: Headers): number | undefined {
    // Google Ads API doesn't expose rate limit info in headers
    // We manage it internally
    return undefined;
  }

  // **PRODUCTION METHODS**

  /**
   * Get accessible customer accounts
   */
  public async getCustomerClients(): Promise<APIResponse<GoogleAdsAccount[]>> {
    return this.queueRequest<{ results: GoogleAdsAccount[] }>({
      endpoint: `/customers/${this.credentials.customerId}/customerClients:search`,
      method: 'POST',
      body: {
        query: `
          SELECT 
            customer_client.resource_name,
            customer_client.id,
            customer_client.descriptive_name,
            customer_client.currency_code,
            customer_client.time_zone,
            customer_client.test_account,
            customer_client.manager
          FROM customer_client
          WHERE customer_client.status = 'ENABLED'
        `
      }
    }).then(response => ({
      ...response,
      data: response.data?.results || []
    }));
  }

  /**
   * Get campaigns for a specific customer
   */
  public async getCampaigns(customerId: string, limit = 50): Promise<APIResponse<GoogleAdsCampaign[]>> {
    return this.queueRequest<{ results: any[] }>({
      endpoint: `/customers/${customerId}/googleAds:search`,
      method: 'POST',
      body: {
        query: `
          SELECT 
            campaign.resource_name,
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.advertising_channel_type,
            campaign.bidding_strategy_type,
            campaign.start_date,
            campaign.end_date,
            campaign_budget.resource_name,
            campaign_budget.amount_micros,
            campaign_budget.delivery_method
          FROM campaign
          WHERE campaign.status != 'REMOVED'
          ORDER BY campaign.id
          LIMIT ${limit}
        `
      }
    }).then(response => {
      const campaigns: GoogleAdsCampaign[] = response.data?.results?.map((result: any) => ({
        resourceName: result.campaign.resourceName,
        id: result.campaign.id,
        name: result.campaign.name,
        status: result.campaign.status,
        advertisingChannelType: result.campaign.advertisingChannelType,
        biddingStrategyType: result.campaign.biddingStrategyType,
        startDate: result.campaign.startDate,
        endDate: result.campaign.endDate,
        budget: {
          resourceName: result.campaignBudget?.resourceName || '',
          amountMicros: result.campaignBudget?.amountMicros || '0',
          deliveryMethod: result.campaignBudget?.deliveryMethod || 'STANDARD'
        }
      })) || [];

      return {
        ...response,
        data: campaigns
      };
    });
  }

  /**
   * Get campaign performance metrics
   */
  public async getCampaignMetrics(
    customerId: string,
    dateRange: { startDate: string; endDate: string },
    campaignIds?: string[]
  ): Promise<APIResponse<GoogleAdsMetrics[]>> {
    
    let campaignFilter = '';
    if (campaignIds && campaignIds.length > 0) {
      const resourceNames = campaignIds.map(id => `customers/${customerId}/campaigns/${id}`);
      campaignFilter = `AND campaign.resource_name IN ('${resourceNames.join("','")}')`;
    }

    return this.queueRequest<{ results: any[] }>({
      endpoint: `/customers/${customerId}/googleAds:search`,
      method: 'POST',
      body: {
        query: `
          SELECT 
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversions_value,
            metrics.ctr,
            metrics.average_cpc,
            metrics.average_cpm,
            metrics.search_impression_share,
            metrics.search_exact_match_impression_share,
            metrics.all_conversions,
            metrics.all_conversions_value,
            segments.date
          FROM campaign
          WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
            AND campaign.status != 'REMOVED'
            ${campaignFilter}
          ORDER BY segments.date DESC
        `
      }
    }).then(response => {
      const metrics: GoogleAdsMetrics[] = response.data?.results?.map((result: any) => ({
        campaignId: result.campaign.id,
        campaignName: result.campaign.name,
        impressions: result.metrics.impressions || '0',
        clicks: result.metrics.clicks || '0',
        costMicros: result.metrics.costMicros || '0',
        conversions: result.metrics.conversions || '0',
        conversionValue: result.metrics.conversionsValue || '0',
        ctr: result.metrics.ctr || '0',
        averageCpc: result.metrics.averageCpc || '0',
        averageCpm: result.metrics.averageCpm || '0',
        searchImpressionShare: result.metrics.searchImpressionShare,
        searchExactMatchImpressionShare: result.metrics.searchExactMatchImpressionShare,
        allConversions: result.metrics.allConversions || '0',
        allConversionsValue: result.metrics.allConversionsValue || '0',
        date: result.segments.date
      })) || [];

      return {
        ...response,
        data: metrics
      };
    });
  }

  /**
   * Test API connection
   */
  public async validateConnection(): Promise<{ 
    isValid: boolean; 
    customerInfo?: any; 
    error?: string; 
  }> {
    try {
      const response = await this.queueRequest({
        endpoint: `/customers/${this.credentials.customerId}`,
        method: 'GET'
      });

      if (response.success) {
        return {
          isValid: true,
          customerInfo: response.data
        };
      } else {
        return {
          isValid: false,
          error: response.error
        };
      }
    } catch (error: any) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }
}