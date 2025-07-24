// Data Source Context - Global state management for demo/live data
// Handles switching between demo mode and real data sources

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  DataSource, 
  Connection, 
  UserDataSources, 
  DashboardData,
  DataSourceEvent,
  ConnectionStatus
} from '@/types/dataSource';
import { wooCommerceService } from '@/services/woocommerceService';
import { useSaaS } from '@/lib/clerk-provider';
import { WooCommerceCredentialsService } from '@/services/woocommerceCredentialsService';

// Demo data import (we'll create this) 
import { demoData } from '@/data/demoData';
// Real API service integration - Option B
import { realAPIService, CampaignMetrics } from '@/lib/api-service';
import { realtimeDataService, RealtimeDataUpdate } from '@/lib/realtime-data-service';

interface DataSourceState {
  // Current state
  currentSource: DataSource;
  demoMode: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Connections
  connections: Connection[];
  activeConnection: Connection | null;
  
  // Data
  dashboardData: DashboardData | null;
  lastSync: Date | null;
  
  // UI state
  showConnectionModal: boolean;
  showSourceSwitcher: boolean;
}

type DataSourceAction =
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'SET_CURRENT_SOURCE'; payload: DataSource }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CONNECTION'; payload: Connection }
  | { type: 'UPDATE_CONNECTION'; payload: { id: string; updates: Partial<Connection> } }
  | { type: 'REMOVE_CONNECTION'; payload: string }
  | { type: 'SET_ACTIVE_CONNECTION'; payload: Connection | null }
  | { type: 'SET_DASHBOARD_DATA'; payload: DashboardData }
  | { type: 'SET_LAST_SYNC'; payload: Date }
  | { type: 'SHOW_CONNECTION_MODAL'; payload: boolean }
  | { type: 'SHOW_SOURCE_SWITCHER'; payload: boolean }
  | { type: 'RESET_STATE' };

const initialState: DataSourceState = {
  currentSource: 'demo',
  demoMode: true,
  isLoading: false,
  error: null,
  connections: [],
  activeConnection: null,
  dashboardData: null,
  lastSync: null,
  showConnectionModal: false,
  showSourceSwitcher: false
};

function dataSourceReducer(state: DataSourceState, action: DataSourceAction): DataSourceState {
  switch (action.type) {
    case 'SET_DEMO_MODE':
      return {
        ...state,
        demoMode: action.payload,
        currentSource: action.payload ? 'demo' : state.currentSource,
        error: null
      };

    case 'SET_CURRENT_SOURCE':
      return {
        ...state,
        currentSource: action.payload,
        demoMode: action.payload === 'demo',
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'ADD_CONNECTION':
      return {
        ...state,
        connections: [...state.connections, action.payload]
      };

    case 'UPDATE_CONNECTION':
      return {
        ...state,
        connections: state.connections.map(conn =>
          conn.id === action.payload.id
            ? { ...conn, ...action.payload.updates, updatedAt: new Date() }
            : conn
        )
      };

    case 'REMOVE_CONNECTION':
      return {
        ...state,
        connections: state.connections.filter(conn => conn.id !== action.payload),
        activeConnection: state.activeConnection?.id === action.payload ? null : state.activeConnection
      };

    case 'SET_ACTIVE_CONNECTION':
      return {
        ...state,
        activeConnection: action.payload,
        currentSource: action.payload?.platform || 'demo',
        demoMode: !action.payload
      };

    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        dashboardData: action.payload,
        isLoading: false,
        error: null
      };

    case 'SET_LAST_SYNC':
      return {
        ...state,
        lastSync: action.payload
      };

    case 'SHOW_CONNECTION_MODAL':
      return {
        ...state,
        showConnectionModal: action.payload
      };

    case 'SHOW_SOURCE_SWITCHER':
      return {
        ...state,
        showSourceSwitcher: action.payload
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

interface DataSourceContextType {
  // State
  state: DataSourceState;
  
  // Mode switching
  setDemoMode: (enabled: boolean) => void;
  switchToSource: (source: DataSource) => Promise<void>;
  toggleMode: () => void;
  
  // Connection management
  addConnection: (connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  removeConnection: (id: string) => Promise<void>;
  testConnection: (connection: Partial<Connection>) => Promise<boolean>;
  syncConnection: (id: string) => Promise<void>;
  
  // Data fetching
  refreshData: () => Promise<void>;
  getDashboardData: () => DashboardData | null;
  
  // UI helpers
  showConnectionModal: (show: boolean) => void;
  showSourceSwitcher: (show: boolean) => void;
  
  // Utility
  isDemo: () => boolean;
  hasConnections: () => boolean;
  canSwitchToLive: () => boolean;
  
  // Option B: Real API Integration
  connectRealPlatform: (platform: string, credentials: any) => Promise<boolean>;
  fetchLiveData: (platforms?: string[]) => Promise<void>;
  getRealApiHealth: () => { [platform: string]: any };
  getRealtimeStats: () => any;
}

const DataSourceContext = createContext<DataSourceContextType | null>(null);

export function useDataSource() {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within DataSourceProvider');
  }
  return context;
}

interface DataSourceProviderProps {
  children: ReactNode;
}

export function DataSourceProvider({ children }: DataSourceProviderProps) {
  const [state, dispatch] = useReducer(dataSourceReducer, initialState);
  const { user } = useSaaS();

  // Initialize with demo data
  useEffect(() => {
    if (state.demoMode && !state.dashboardData) {
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: demoData });
    }
  }, [state.demoMode, state.dashboardData]);

  // Load user preferences and connections
  useEffect(() => {
    if (user?.id) {
      loadUserDataSources();
    }
  }, [user?.id]);

  const loadUserDataSources = async () => {
    try {
      // Load WooCommerce credentials from backend
      const creds = await WooCommerceCredentialsService.fetchCredentials();
      if (creds) {
        const connection = {
          id: generateConnectionId(),
          platform: 'woocommerce' as const,
          config: {
            siteUrl: creds.siteUrl,
            consumerKey: creds.consumerKey,
            consumerSecret: creds.consumerSecret,
            version: 'wc/v3'
          },
          status: 'connected' as const,
          displayName: 'WooCommerce',
          credentials: {},
          createdAt: new Date(),
          updatedAt: new Date()
        };
        dispatch({ type: 'ADD_CONNECTION', payload: connection });
      }
      // (Optional) Load other sources from backend/localStorage if needed
    } catch (error) {
      console.error('Failed to load WooCommerce credentials:', error);
    }
  };

  const saveUserDataSources = () => {
    // No-op for WooCommerce, credentials are saved securely in backend
  };

  const setDemoMode = (enabled: boolean) => {
    dispatch({ type: 'SET_DEMO_MODE', payload: enabled });
    if (enabled) {
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: demoData });
    }
    saveUserDataSources();
    
    // Emit event
    emitDataSourceEvent({
      type: 'data_updated',
      source: enabled ? 'demo' : state.currentSource,
      timestamp: new Date(),
      data: { demoMode: enabled }
    });
  };

  const switchToSource = async (source: DataSource) => {
    if (source === 'demo') {
      setDemoMode(true);
      return;
    }

    // Find connection for this source
    const connection = state.connections.find(c => c.platform === source && c.status === 'connected');
    if (!connection) {
      dispatch({ type: 'SET_ERROR', payload: `No active connection found for ${source}` });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_CURRENT_SOURCE', payload: source });
    dispatch({ type: 'SET_ACTIVE_CONNECTION', payload: connection });

    try {
      await refreshDataForSource(source, connection);
      saveUserDataSources();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Failed to switch to ${source}` });
      console.error('Error switching data source:', error);
    }
  };

  const toggleMode = () => {
    setDemoMode(!state.demoMode);
  };

  const addConnection = async (connectionData: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const connection: Connection = {
      ...connectionData,
      id: generateConnectionId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Test connection before adding
    const isValid = await testConnectionInternal(connection);
    if (!isValid) {
      throw new Error('Connection test failed');
    }

    // Save WooCommerce credentials securely in backend
    if (connection.platform === 'woocommerce') {
      await WooCommerceCredentialsService.saveCredentials({
        siteUrl: connection.config.siteUrl!,
        consumerKey: connection.config.consumerKey!,
        consumerSecret: connection.config.consumerSecret!
      });
    }

    dispatch({ type: 'ADD_CONNECTION', payload: connection });
    // No localStorage for WooCommerce
    emitDataSourceEvent({
      type: 'connection_success',
      source: connection.platform,
      timestamp: new Date(),
      data: { connectionId: connection.id }
    });

    return connection.id;
  };

  const updateConnection = (id: string, updates: Partial<Connection>) => {
    dispatch({ type: 'UPDATE_CONNECTION', payload: { id, updates } });
    saveUserDataSources();
  };

  const removeConnection = async (id: string) => {
    const connection = state.connections.find(c => c.id === id);
    if (connection && state.activeConnection?.id === id) {
      // Switch back to demo mode if removing active connection
      setDemoMode(true);
    }
    
    dispatch({ type: 'REMOVE_CONNECTION', payload: id });
    saveUserDataSources();
  };

  const testConnection = async (connection: Partial<Connection>): Promise<boolean> => {
    return testConnectionInternal(connection as Connection);
  };

  const testConnectionInternal = async (connection: Connection): Promise<boolean> => {
    try {
      if (connection.platform === 'woocommerce') {
        const result = await wooCommerceService.testConnection({
          siteUrl: connection.config.siteUrl!,
          consumerKey: connection.config.consumerKey!,
          consumerSecret: connection.config.consumerSecret!,
          version: (connection.config.version as any) || 'wc/v3'
        });
        return result.success;
      }
      
      // Add other platform tests here
      return false;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  };

  const syncConnection = async (id: string) => {
    const connection = state.connections.find(c => c.id === id);
    if (!connection) return;

    dispatch({ type: 'UPDATE_CONNECTION', payload: { 
      id, 
      updates: { status: 'syncing' as ConnectionStatus } 
    }});

    try {
      await refreshDataForSource(connection.platform, connection);
      
      dispatch({ type: 'UPDATE_CONNECTION', payload: { 
        id, 
        updates: { 
          status: 'connected' as ConnectionStatus,
          lastSync: new Date()
        } 
      }});
      
      emitDataSourceEvent({
        type: 'sync_completed',
        source: connection.platform,
        timestamp: new Date(),
        data: { connectionId: id }
      });
    } catch (error) {
      dispatch({ type: 'UPDATE_CONNECTION', payload: { 
        id, 
        updates: { status: 'error' as ConnectionStatus } 
      }});
      
      emitDataSourceEvent({
        type: 'sync_failed',
        source: connection.platform,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const refreshData = async () => {
    if (state.demoMode) {
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: demoData });
      return;
    }

    if (state.activeConnection) {
      await refreshDataForSource(state.currentSource, state.activeConnection);
    }
  };

  const refreshDataForSource = async (source: DataSource, connection: Connection) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (source === 'woocommerce') {
        wooCommerceService.configure({
          siteUrl: connection.config.siteUrl!,
          consumerKey: connection.config.consumerKey!,
          consumerSecret: connection.config.consumerSecret!,
          version: (connection.config.version as any) || 'wc/v3'
        });

        const result = await wooCommerceService.fetchAllData();
        if (result.success && result.data) {
          const dashboardData = convertWooCommerceToDashboardData(result.data);
          dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
          dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
        } else {
          throw new Error(result.error || 'Failed to fetch WooCommerce data');
        }
      }
      
      // Add other platform integrations here
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  const convertWooCommerceToDashboardData = (wooData: any): DashboardData => {
    // Convert WooCommerce data to standard dashboard format
    return {
      revenue: {
        total: wooData.analytics.revenue.total,
        today: wooData.analytics.revenue.today,
        thisWeek: wooData.analytics.revenue.thisWeek,
        thisMonth: wooData.analytics.revenue.thisMonth,
        growth: wooData.analytics.revenue.growth,
        currency: 'EUR',
        trend: wooData.analytics.revenue.growth > 0 ? 'up' : 'down'
      },
      campaigns: [], // WooCommerce doesn't have campaigns, so empty
      analytics: {
        pageViews: 0,
        sessions: wooData.analytics.customers.total,
        users: wooData.analytics.customers.total,
        bounceRate: 0,
        avgSessionDuration: 0,
        conversionRate: 0,
        topPages: [],
        traffic: []
      },
      customers: {
        total: wooData.analytics.customers.total,
        new: wooData.analytics.customers.new,
        returning: wooData.analytics.customers.returning,
        ltv: 0,
        segments: []
      },
      products: {
        total: wooData.analytics.products.total,
        inStock: wooData.analytics.products.inStock,
        outOfStock: wooData.analytics.products.outOfStock,
        topSelling: wooData.analytics.products.topSelling.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          sales: p.total_sales
        })),
        categories: []
      },
      source: 'woocommerce',
      lastUpdated: new Date(),
      isDemo: false
    };
  };

  const getDashboardData = (): DashboardData | null => {
    return state.dashboardData;
  };

  const showConnectionModal = (show: boolean) => {
    dispatch({ type: 'SHOW_CONNECTION_MODAL', payload: show });
  };

  const showSourceSwitcher = (show: boolean) => {
    dispatch({ type: 'SHOW_SOURCE_SWITCHER', payload: show });
  };

  const isDemo = (): boolean => {
    return state.demoMode;
  };

  const hasConnections = (): boolean => {
    return state.connections.some(c => c.status === 'connected');
  };

  const canSwitchToLive = (): boolean => {
    return hasConnections();
  };

  const generateConnectionId = (): string => {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const emitDataSourceEvent = (event: DataSourceEvent) => {
    // In a real app, this would emit to an event bus or websocket
    console.log('DataSource Event:', event);
    
    // You could also dispatch custom events for other components to listen to
    window.dispatchEvent(new CustomEvent('dataSourceEvent', { detail: event }));
  };

  // **OPTION B: REAL API INTEGRATION METHODS**

  const connectRealPlatform = async (platform: string, credentials: any): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await realAPIService.connectPlatform(platform, credentials);
      
      if (response.success) {
        // Create connection entry
        const connection: Connection = {
          id: generateConnectionId(),
          name: response.data?.accountName || `${platform.toUpperCase()} Account`,
          platform: platform as DataSource,
          status: 'connected',
          config: credentials,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        dispatch({ type: 'ADD_CONNECTION', payload: connection });
        dispatch({ type: 'SET_ACTIVE_CONNECTION', payload: connection });
        dispatch({ type: 'SET_CURRENT_SOURCE', payload: platform as DataSource });
        
        // Start real-time data subscription
        realtimeDataService.subscribe(
          `datasource_${platform}`,
          handleRealtimeUpdate,
          [platform]
        );
        
        emitDataSourceEvent({
          type: 'connection_success',
          source: platform as DataSource,
          timestamp: new Date(),
          data: { connectionId: connection.id, accountInfo: response.data }
        });
        
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Connection failed' });
        return false;
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleRealtimeUpdate = (update: RealtimeDataUpdate) => {
    console.log(`📡 [DataSource] Realtime update from ${update.platform}:`, update.data.length, 'campaigns');
    
    if (update.status === 'success' && update.data.length > 0) {
      // Convert CampaignMetrics to DashboardData format
      const dashboardData = convertCampaignMetricsToDashboardData(update.data, update.platform);
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
      
      emitDataSourceEvent({
        type: 'data_updated',
        source: update.platform as DataSource,
        timestamp: new Date(),
        data: { campaignCount: update.data.length, updateCount: update.updateCount }
      });
    } else if (update.status === 'error') {
      dispatch({ type: 'SET_ERROR', payload: update.errorMessage || 'Data fetch failed' });
      
      emitDataSourceEvent({
        type: 'sync_failed',
        source: update.platform as DataSource,
        timestamp: new Date(),
        error: update.errorMessage
      });
    }
  };

  const convertCampaignMetricsToDashboardData = (
    campaigns: CampaignMetrics[], 
    platform: string
  ): DashboardData => {
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    
    const avgCtr = totalClicks > 0 ? (totalClicks / totalImpressions * 100) : 0;
    const avgRoas = totalSpend > 0 ? (campaigns.reduce((sum, c) => sum + (c.roas * c.spend), 0) / totalSpend) : 0;

    return {
      overview: {
        totalRevenue: totalSpend * avgRoas,
        totalOrders: totalConversions,
        averageOrderValue: totalConversions > 0 ? (totalSpend * avgRoas) / totalConversions : 0,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0
      },
      campaigns: campaigns.map(c => ({
        id: c.campaignId,
        name: c.campaignName,
        status: c.status === 'active' ? 'Active' : 'Paused',
        budget: c.spend,
        spend: c.spend,
        impressions: c.impressions,
        clicks: c.clicks,
        conversions: c.conversions,
        roas: c.roas,
        ctr: c.ctr,
        cpc: c.cpc,
        platform: c.platform
      })),
      metrics: {
        totalSpend,
        totalImpressions,
        totalClicks,
        totalConversions,
        averageCTR: avgCtr,
        averageROAS: avgRoas,
        costPerConversion: totalConversions > 0 ? totalSpend / totalConversions : 0
      },
      customers: [],
      products: {
        topProducts: [],
        categories: []
      },
      source: platform as DataSource,
      lastUpdated: new Date(),
      isDemo: false
    };
  };

  const fetchLiveData = async (platforms: string[] = ['meta', 'google-ads']): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const dateRange = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      };
      
      const response = await realAPIService.getAllPlatformsData(dateRange);
      
      if (response.success && response.data) {
        // Combine data from all platforms
        const allCampaigns: CampaignMetrics[] = [];
        Object.values(response.data).forEach(campaigns => {
          allCampaigns.push(...campaigns);
        });
        
        if (allCampaigns.length > 0) {
          const dashboardData = convertCampaignMetricsToDashboardData(allCampaigns, 'multi-platform');
          dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
          dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
        }
      }
      
      if (response.errors) {
        const errorMessages = Object.entries(response.errors)
          .map(([platform, error]) => `${platform}: ${error}`)
          .join(', ');
        dispatch({ type: 'SET_ERROR', payload: `Partial failure: ${errorMessages}` });
      }
      
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getRealApiHealth = () => {
    return realAPIService.getAllHealthStatuses();
  };

  const getRealtimeStats = () => {
    return realtimeDataService.getStatistics();
  };

  const contextValue: DataSourceContextType = {
    state,
    setDemoMode,
    switchToSource,
    toggleMode,
    addConnection,
    updateConnection,
    removeConnection,
    testConnection,
    syncConnection,
    refreshData,
    getDashboardData,
    showConnectionModal,
    showSourceSwitcher,
    isDemo,
    hasConnections,
    canSwitchToLive,
    // Option B: Real API methods
    connectRealPlatform,
    fetchLiveData,
    getRealApiHealth,
    getRealtimeStats
  };

  return (
    <DataSourceContext.Provider value={contextValue}>
      {children}
    </DataSourceContext.Provider>
  );
}