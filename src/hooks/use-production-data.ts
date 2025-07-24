// Production Data Hook - Manages real vs demo data
import { useState, useEffect } from 'react';
import { useSaaS } from '@/lib/clerk-provider';
import { supabase } from '@/lib/supabase';
import demoData from '@/data/demoData';

interface ProductionDataState {
  campaigns: any[];
  analytics: any[];
  organizations: any[];
  isLoading: boolean;
  error: string | null;
  isUsingDemoData: boolean;
}

export function useProductionData() {
  const { user, isAuthenticated } = useSaaS();
  const [state, setState] = useState<ProductionDataState>({
    campaigns: [],
    analytics: [],
    organizations: [],
    isLoading: true,
    error: null,
    isUsingDemoData: true
  });

  const isSupabaseEnabled = import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true';

  const loadProductionData = async () => {
    if (!isAuthenticated || !user || !isSupabaseEnabled) {
      // Use demo data for unauthenticated users or mock auth
      setState(prev => ({
        ...prev,
        campaigns: demoData.campaigns || [],
        analytics: demoData.analytics || [],
        organizations: [],
        isLoading: false,
        isUsingDemoData: true
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Try to load real data from Supabase
      const [campaignsResult, organizationsResult] = await Promise.all([
        supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', user.id)
          .limit(10),
        
        supabase
          .from('organizations')
          .select('*')
          .limit(5)
      ]);

      // Check if we have real data
      const hasRealData = (
        campaignsResult.data && campaignsResult.data.length > 0
      );

      if (hasRealData) {
        // Use real production data
        setState(prev => ({
          ...prev,
          campaigns: campaignsResult.data || [],
          analytics: [], // TODO: Load real analytics data
          organizations: organizationsResult.data || [],
          isLoading: false,
          isUsingDemoData: false
        }));
        console.log('✅ Loaded production data');
      } else {
        // Fallback to demo data with notification
        setState(prev => ({
          ...prev,
          campaigns: demoData.campaigns || [],
          analytics: demoData.analytics || [],
          organizations: organizationsResult.data || [],
          isLoading: false,
          isUsingDemoData: true
        }));
        console.log('📊 Using demo data - no production data found');
      }

    } catch (error) {
      console.error('❌ Error loading production data:', error);
      
      // Fallback to demo data on error
      setState(prev => ({
        ...prev,
        campaigns: demoData.campaigns || [],
        analytics: demoData.analytics || [],
        organizations: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
        isUsingDemoData: true
      }));
    }
  };

  const createSampleData = async () => {
    if (!isAuthenticated || !user || !isSupabaseEnabled) {
      console.log('⚠️ Cannot create sample data - not authenticated or Supabase not enabled');
      return;
    }

    try {
      console.log('📊 Creating sample campaign data...');

      // Create sample campaigns
      const sampleCampaigns = [
        {
          id: `campaign_${Date.now()}_1`,
          user_id: user.id,
          name: 'Meta Ads - Winter Collection',
          platform: 'facebook',
          status: 'active',
          budget: 1500,
          spent: 892,
          impressions: 45230,
          clicks: 1203,
          conversions: 47,
          revenue: 2340,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: `campaign_${Date.now()}_2`,
          user_id: user.id,
          name: 'Google Ads - Brand Awareness',
          platform: 'google',
          status: 'active',
          budget: 2000,
          spent: 1456,
          impressions: 67890,
          clicks: 2341,
          conversions: 89,
          revenue: 4567,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const { error } = await supabase
        .from('campaigns')
        .insert(sampleCampaigns);

      if (error) {
        console.error('❌ Error creating sample data:', error);
      } else {
        console.log('✅ Sample data created successfully');
        // Reload data
        loadProductionData();
      }

    } catch (error) {
      console.error('❌ Error in createSampleData:', error);
    }
  };

  useEffect(() => {
    loadProductionData();
  }, [isAuthenticated, user?.id, isSupabaseEnabled]);

  return {
    ...state,
    refresh: loadProductionData,
    createSampleData
  };
}