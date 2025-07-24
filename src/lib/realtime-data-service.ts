// Real-Time Data Fetching Service - Option B Implementation
// Production-grade WebSocket and polling-based data synchronization

import { realAPIService, CampaignMetrics, APIHealthStatus } from './api-service';
import { FacebookAdsClient } from './api-integrations/facebook-ads-client';
import { GoogleAdsClient } from './api-integrations/google-ads-client';

export interface RealtimeConfig {
  enabled: boolean;
  pollInterval: number; // milliseconds
  platforms: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  autoRefresh: boolean;
}

export interface RealtimeDataUpdate {
  platform: string;
  timestamp: string;
  data: CampaignMetrics[];
  status: 'success' | 'error' | 'partial';
  errorMessage?: string;
  updateCount: number;
}

export interface DataSubscription {
  id: string;
  callback: (update: RealtimeDataUpdate) => void;
  platforms: string[];
  active: boolean;
}

class RealtimeDataService {
  private config: RealtimeConfig;
  private subscriptions: Map<string, DataSubscription> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private updateCounters: Map<string, number> = new Map();
  private lastUpdateTimes: Map<string, number> = new Map();
  
  // WebSocket connections (for platforms that support real-time)
  private wsConnections: Map<string, WebSocket> = new Map();
  
  constructor() {
    this.config = {
      enabled: true,
      pollInterval: 30000, // 30 seconds default
      platforms: ['meta', 'google-ads'],
      dateRange: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      autoRefresh: true
    };

    this.initializeService();
  }

  private initializeService(): void {
    console.log('🔄 Real-time Data Service initialized');
    
    // Start automatic health monitoring
    this.startHealthMonitoring();
    
    // Initialize platform connections if configured
    if (this.config.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  // **SUBSCRIPTION MANAGEMENT**

  public subscribe(
    id: string,
    callback: (update: RealtimeDataUpdate) => void,
    platforms: string[] = this.config.platforms
  ): void {
    const subscription: DataSubscription = {
      id,
      callback,
      platforms,
      active: true
    };

    this.subscriptions.set(id, subscription);
    console.log(`📡 [Realtime] Subscription created: ${id} for platforms: ${platforms.join(', ')}`);

    // Start data fetching for this subscription
    this.startDataFetching(id);
  }

  public unsubscribe(id: string): void {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      subscription.active = false;
      this.subscriptions.delete(id);
      
      // Clear interval if exists
      const interval = this.updateIntervals.get(id);
      if (interval) {
        clearInterval(interval);
        this.updateIntervals.delete(id);
      }
      
      console.log(`🔇 [Realtime] Subscription removed: ${id}`);
    }
  }

  public updateSubscription(id: string, platforms: string[]): void {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      subscription.platforms = platforms;
      
      // Restart data fetching with new platforms
      this.stopDataFetching(id);
      this.startDataFetching(id);
      
      console.log(`🔄 [Realtime] Subscription updated: ${id} for platforms: ${platforms.join(', ')}`);
    }
  }

  // **DATA FETCHING**

  private startDataFetching(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || !subscription.active) return;

    // Initial fetch
    this.fetchDataForSubscription(subscriptionId);

    // Set up polling interval
    const interval = setInterval(() => {
      this.fetchDataForSubscription(subscriptionId);
    }, this.config.pollInterval);

    this.updateIntervals.set(subscriptionId, interval);
    console.log(`⏰ [Realtime] Polling started for ${subscriptionId} every ${this.config.pollInterval}ms`);
  }

  private stopDataFetching(subscriptionId: string): void {
    const interval = this.updateIntervals.get(subscriptionId);
    if (interval) {
      clearInterval(interval);
      this.updateIntervals.delete(subscriptionId);
      console.log(`⏹️ [Realtime] Polling stopped for ${subscriptionId}`);
    }
  }

  private async fetchDataForSubscription(subscriptionId: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || !subscription.active) return;

    const currentTime = Date.now();
    const lastUpdate = this.lastUpdateTimes.get(subscriptionId) || 0;
    
    // Prevent too frequent updates (minimum 10 seconds apart)
    if (currentTime - lastUpdate < 10000) {
      return;
    }

    try {
      // Fetch data from all subscribed platforms in parallel
      const promises = subscription.platforms.map(platform => 
        this.fetchPlatformData(platform)
      );

      const results = await Promise.allSettled(promises);
      
      // Process results and notify subscription
      subscription.platforms.forEach((platform, index) => {
        const result = results[index];
        const updateCount = this.updateCounters.get(platform) || 0;
        this.updateCounters.set(platform, updateCount + 1);

        if (result.status === 'fulfilled') {
          const update: RealtimeDataUpdate = {
            platform,
            timestamp: new Date().toISOString(),
            data: result.value,
            status: 'success',
            updateCount: updateCount + 1
          };

          subscription.callback(update);
        } else {
          const update: RealtimeDataUpdate = {
            platform,
            timestamp: new Date().toISOString(),
            data: [],
            status: 'error',
            errorMessage: result.reason?.message || 'Unknown error',
            updateCount: updateCount + 1
          };

          subscription.callback(update);
        }
      });

      this.lastUpdateTimes.set(subscriptionId, currentTime);

    } catch (error: any) {
      console.error(`🚫 [Realtime] Fetch failed for subscription ${subscriptionId}:`, error.message);
    }
  }

  private async fetchPlatformData(platform: string): Promise<CampaignMetrics[]> {
    const response = await realAPIService.getCampaignMetrics(
      platform, 
      this.config.dateRange
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.error || `Failed to fetch ${platform} data`);
    }
  }

  // **WEBSOCKET CONNECTIONS** (for platforms that support real-time)

  public async connectWebSocket(platform: string, apiKey: string): Promise<boolean> {
    try {
      // This would be implemented for platforms that support WebSocket
      // For now, we'll use polling as the primary method
      
      console.log(`🔌 [Realtime] WebSocket connection attempted for ${platform}`);
      
      // Simulated WebSocket connection
      const ws = new WebSocket(`wss://api.${platform}.com/realtime?key=${apiKey}`);
      
      ws.onopen = () => {
        console.log(`✅ [Realtime] WebSocket connected for ${platform}`);
        this.wsConnections.set(platform, ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketUpdate(platform, data);
        } catch (error) {
          console.error(`🚫 [Realtime] WebSocket message parse error for ${platform}:`, error);
        }
      };

      ws.onerror = (error) => {
        console.error(`🚫 [Realtime] WebSocket error for ${platform}:`, error);
      };

      ws.onclose = () => {
        console.log(`🔌 [Realtime] WebSocket disconnected for ${platform}`);
        this.wsConnections.delete(platform);
        
        // Attempt reconnection after 5 seconds
        setTimeout(() => {
          this.connectWebSocket(platform, apiKey);
        }, 5000);
      };

      return true;

    } catch (error: any) {
      console.error(`🚫 [Realtime] WebSocket connection failed for ${platform}:`, error.message);
      return false;
    }
  }

  private handleWebSocketUpdate(platform: string, data: any): void {
    // Process real-time WebSocket updates
    console.log(`📡 [Realtime] WebSocket update received for ${platform}:`, data);
    
    // Notify all relevant subscriptions
    this.subscriptions.forEach((subscription) => {
      if (subscription.platforms.includes(platform) && subscription.active) {
        const update: RealtimeDataUpdate = {
          platform,
          timestamp: new Date().toISOString(),
          data: [], // Process WebSocket data into CampaignMetrics format
          status: 'success',
          updateCount: (this.updateCounters.get(platform) || 0) + 1
        };

        subscription.callback(update);
        this.updateCounters.set(platform, update.updateCount);
      }
    });
  }

  // **CONFIGURATION**

  public updateConfig(newConfig: Partial<RealtimeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    console.log('🔧 [Realtime] Configuration updated:', this.config);
    
    // Restart services if needed
    if (newConfig.pollInterval) {
      this.restartAllPolling();
    }
    
    if (newConfig.dateRange) {
      this.forceRefreshAll();
    }
  }

  public getConfig(): RealtimeConfig {
    return { ...this.config };
  }

  // **MONITORING AND CONTROL**

  private startHealthMonitoring(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Check every minute
  }

  private performHealthCheck(): void {
    // Check subscription health
    const activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.active).length;
    
    // Check platform connection health
    const healthStatuses = realAPIService.getAllHealthStatuses();
    const connectedPlatforms = Object.values(healthStatuses)
      .filter(status => status.status === 'connected').length;

    console.log(`💊 [Realtime Health] ${activeSubscriptions} active subscriptions, ${connectedPlatforms} connected platforms`);
    
    // Auto-recovery for failed connections
    Object.entries(healthStatuses).forEach(([platform, status]) => {
      if (status.status === 'error') {
        console.log(`🔄 [Realtime] Attempting recovery for ${platform}`);
        // Could implement automatic reconnection logic here
      }
    });
  }

  private startAutoRefresh(): void {
    // Global refresh every 5 minutes for all platforms
    setInterval(() => {
      console.log('🔄 [Realtime] Global auto-refresh initiated');
      this.forceRefreshAll();
    }, 5 * 60 * 1000); // 5 minutes
  }

  private restartAllPolling(): void {
    console.log('🔄 [Realtime] Restarting all polling with new interval');
    
    this.subscriptions.forEach((_, subscriptionId) => {
      this.stopDataFetching(subscriptionId);
      this.startDataFetching(subscriptionId);
    });
  }

  private forceRefreshAll(): void {
    console.log('🔄 [Realtime] Force refresh all subscriptions');
    
    this.subscriptions.forEach((_, subscriptionId) => {
      this.fetchDataForSubscription(subscriptionId);
    });
  }

  // **STATISTICS AND DEBUGGING**

  public getStatistics(): {
    activeSubscriptions: number;
    totalUpdates: { [platform: string]: number };
    lastUpdateTimes: { [subscription: string]: string };
    wsConnections: string[];
    config: RealtimeConfig;
  } {
    const stats = {
      activeSubscriptions: Array.from(this.subscriptions.values())
        .filter(sub => sub.active).length,
      totalUpdates: Object.fromEntries(this.updateCounters.entries()),
      lastUpdateTimes: Object.fromEntries(
        Array.from(this.lastUpdateTimes.entries()).map(([id, time]) => [
          id, 
          new Date(time).toISOString()
        ])
      ),
      wsConnections: Array.from(this.wsConnections.keys()),
      config: this.config
    };

    return stats;
  }

  public async testConnection(platform: string): Promise<{
    success: boolean;
    latency: number;
    message: string;
  }> {
    const startTime = Date.now();
    
    try {
      const testData = await this.fetchPlatformData(platform);
      const latency = Date.now() - startTime;
      
      return {
        success: true,
        latency,
        message: `✅ ${platform} connection successful (${testData.length} campaigns, ${latency}ms)`
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      
      return {
        success: false,
        latency,
        message: `🚫 ${platform} connection failed: ${error.message} (${latency}ms)`
      };
    }
  }

  // **CLEANUP**

  public cleanup(): void {
    console.log('🧹 [Realtime] Cleaning up service');
    
    // Stop all polling
    this.updateIntervals.forEach(interval => clearInterval(interval));
    this.updateIntervals.clear();
    
    // Close WebSocket connections
    this.wsConnections.forEach(ws => ws.close());
    this.wsConnections.clear();
    
    // Clear subscriptions
    this.subscriptions.clear();
    
    // Clear counters
    this.updateCounters.clear();
    this.lastUpdateTimes.clear();
  }

  // **MANUAL TRIGGERS**

  public async manualRefresh(platform?: string): Promise<RealtimeDataUpdate[]> {
    const platforms = platform ? [platform] : this.config.platforms;
    const updates: RealtimeDataUpdate[] = [];
    
    console.log(`🔄 [Realtime] Manual refresh triggered for: ${platforms.join(', ')}`);
    
    for (const plt of platforms) {
      try {
        const data = await this.fetchPlatformData(plt);
        const updateCount = (this.updateCounters.get(plt) || 0) + 1;
        this.updateCounters.set(plt, updateCount);
        
        const update: RealtimeDataUpdate = {
          platform: plt,
          timestamp: new Date().toISOString(),
          data,
          status: 'success',
          updateCount
        };
        
        updates.push(update);
        
        // Notify subscriptions
        this.subscriptions.forEach(subscription => {
          if (subscription.platforms.includes(plt) && subscription.active) {
            subscription.callback(update);
          }
        });
        
      } catch (error: any) {
        const update: RealtimeDataUpdate = {
          platform: plt,
          timestamp: new Date().toISOString(),
          data: [],
          status: 'error',
          errorMessage: error.message,
          updateCount: (this.updateCounters.get(plt) || 0) + 1
        };
        
        updates.push(update);
      }
    }
    
    return updates;
  }
}

// Singleton instance
export const realtimeDataService = new RealtimeDataService();