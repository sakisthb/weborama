// Cross-Platform Funnel Mapping Service
// Maps data from different platforms to unified funnel stages

import { 
  PlatformType, 
  TouchPoint, 
  CustomerJourney, 
  ConversionEvent,
  PlatformDataMapping 
} from '@/lib/enhanced-funnel-intelligence';

export class CrossPlatformFunnelMapper {
  // Platform-specific stage mapping configurations
  private static readonly PLATFORM_STAGE_MAPPINGS: { [K in PlatformType]: PlatformDataMapping } = {
    meta: {
      platform: 'meta',
      stageMapping: {
        // Campaign objectives to funnel stages
        'brand_awareness': 'awareness',
        'reach': 'awareness', 
        'video_views': 'awareness',
        'page_likes': 'awareness',
        'lead_generation': 'interest',
        'traffic': 'interest',
        'engagement': 'interest',
        'app_installs': 'interest',
        'messages': 'desire',
        'conversions': 'desire',
        'catalog_sales': 'action',
        'store_visits': 'action',
        'purchase': 'action'
      },
      conversionTracking: {
        events: ['purchase', 'add_to_cart', 'initiate_checkout', 'lead', 'complete_registration'],
        valueMapping: {
          'purchase': 100,
          'add_to_cart': 10,
          'initiate_checkout': 25,
          'lead': 50,
          'complete_registration': 30
        }
      }
    },
    google: {
      platform: 'google',
      stageMapping: {
        // Google Ads campaign types and goals
        'search_awareness': 'awareness',
        'display_awareness': 'awareness',
        'video_awareness': 'awareness',
        'search_consideration': 'interest',
        'shopping_consideration': 'interest', 
        'display_consideration': 'interest',
        'search_conversion': 'desire',
        'shopping_conversion': 'action',
        'call_conversion': 'action',
        'store_visit': 'action'
      },
      conversionTracking: {
        events: ['purchase', 'add_to_cart', 'begin_checkout', 'contact', 'sign_up'],
        valueMapping: {
          'purchase': 120,
          'add_to_cart': 15,
          'begin_checkout': 30,
          'contact': 60,
          'sign_up': 40
        }
      }
    },
    tiktok: {
      platform: 'tiktok',
      stageMapping: {
        // TikTok ad objectives
        'reach': 'awareness',
        'video_view': 'awareness',
        'traffic': 'interest',
        'engagement': 'interest',
        'lead_generation': 'desire',
        'conversions': 'action',
        'app_promotion': 'action'
      },
      conversionTracking: {
        events: ['purchase', 'add_to_cart', 'checkout', 'subscribe', 'download'],
        valueMapping: {
          'purchase': 90,
          'add_to_cart': 8,
          'checkout': 20,
          'subscribe': 35,
          'download': 25
        }
      }
    },
    woocommerce: {
      platform: 'woocommerce',
      stageMapping: {
        // WooCommerce events are primarily action stage
        'product_view': 'interest',
        'add_to_cart': 'desire',
        'checkout_started': 'desire',
        'purchase_completed': 'action',
        'refund': 'action' // Negative action
      },
      conversionTracking: {
        events: ['purchase_completed', 'subscription_created', 'booking_confirmed'],
        valueMapping: {
          'purchase_completed': 100,
          'subscription_created': 150,
          'booking_confirmed': 80
        }
      }
    },
    organic: {
      platform: 'organic',
      stageMapping: {
        // Organic traffic and SEO
        'blog_read': 'awareness',
        'social_share': 'awareness',
        'email_open': 'interest',
        'email_click': 'interest',
        'newsletter_signup': 'desire',
        'contact_form': 'action',
        'phone_call': 'action'
      },
      conversionTracking: {
        events: ['contact_form', 'phone_call', 'newsletter_signup', 'download'],
        valueMapping: {
          'contact_form': 75,
          'phone_call': 100,
          'newsletter_signup': 20,
          'download': 15
        }
      }
    }
  };

  /**
   * Map platform-specific campaign data to unified funnel stages
   */
  static mapCampaignToFunnelStage(
    campaignData: any,
    platform: PlatformType
  ): 'awareness' | 'interest' | 'desire' | 'action' {
    const mapping = this.PLATFORM_STAGE_MAPPINGS[platform];
    
    // Try to map by explicit objective/campaign type
    const objective = campaignData.objective?.toLowerCase() || '';
    const campaignType = campaignData.campaign_type?.toLowerCase() || '';
    const campaignName = campaignData.name?.toLowerCase() || campaignData.campaign_name?.toLowerCase() || '';
    
    // Check objective mapping first
    for (const [key, stage] of Object.entries(mapping.stageMapping)) {
      if (objective.includes(key) || campaignType.includes(key) || campaignName.includes(key)) {
        return stage;
      }
    }
    
    // Fallback to performance-based classification
    return this.classifyByPerformanceMetrics(campaignData, platform);
  }

  /**
   * Classify campaign by performance metrics when objective is unclear
   */
  private static classifyByPerformanceMetrics(
    campaignData: any,
    platform: PlatformType
  ): 'awareness' | 'interest' | 'desire' | 'action' {
    const impressions = parseFloat(campaignData.impressions || '0');
    const clicks = parseFloat(campaignData.clicks || '0');
    const conversions = parseFloat(campaignData.conversions || '0');
    
    if (impressions === 0) return 'awareness';
    
    const ctr = clicks / impressions;
    const conversionRate = clicks > 0 ? conversions / clicks : 0;
    
    // Platform-specific thresholds
    const thresholds = this.getPlatformThresholds(platform);
    
    // High conversion rate = Action stage
    if (conversionRate >= thresholds.highConversion) {
      return 'action';
    }
    
    // Medium conversion rate + good CTR = Desire stage  
    if (conversionRate >= thresholds.mediumConversion && ctr >= thresholds.goodCTR) {
      return 'desire';
    }
    
    // Good CTR but low conversion = Interest stage
    if (ctr >= thresholds.goodCTR) {
      return 'interest';
    }
    
    // Low CTR = Awareness stage
    return 'awareness';
  }

  /**
   * Get platform-specific performance thresholds
   */
  private static getPlatformThresholds(platform: PlatformType) {
    const thresholds = {
      meta: { goodCTR: 0.02, mediumConversion: 0.02, highConversion: 0.05 },
      google: { goodCTR: 0.03, mediumConversion: 0.03, highConversion: 0.06 },
      tiktok: { goodCTR: 0.015, mediumConversion: 0.015, highConversion: 0.04 },
      woocommerce: { goodCTR: 0.05, mediumConversion: 0.1, highConversion: 0.2 },
      organic: { goodCTR: 0.04, mediumConversion: 0.05, highConversion: 0.1 }
    };
    
    return thresholds[platform] || thresholds.meta;
  }

  /**
   * Create unified touchpoint from platform data
   */
  static createTouchPoint(
    platformData: any,
    platform: PlatformType,
    customerId: string
  ): TouchPoint {
    const stage = this.mapCampaignToFunnelStage(platformData, platform);
    const mapping = this.PLATFORM_STAGE_MAPPINGS[platform];
    
    return {
      timestamp: new Date(platformData.date_start || platformData.timestamp || Date.now()),
      platform,
      campaignId: platformData.campaign_id || platformData.id || 'unknown',
      campaignName: platformData.campaign_name || platformData.name || 'Unknown Campaign',
      adSetId: platformData.adset_id,
      adId: platformData.ad_id,
      stage,
      touchType: this.determineTouchType(platformData),
      value: this.calculateTouchPointValue(platformData, mapping),
      cost: parseFloat(platformData.spend || platformData.cost || '0'),
      metadata: {
        deviceType: platformData.device || 'unknown',
        placement: platformData.placement,
        audience: platformData.audience || platformData.targeting,
        creative: platformData.creative_name || platformData.ad_name
      }
    };
  }

  /**
   * Determine the type of interaction this touchpoint represents
   */
  private static determineTouchType(
    platformData: any
  ): 'impression' | 'click' | 'engagement' | 'visit' | 'conversion' {
    if (platformData.conversions && parseFloat(platformData.conversions) > 0) {
      return 'conversion';
    }
    if (platformData.clicks && parseFloat(platformData.clicks) > 0) {
      return 'click';
    }
    if (platformData.engagements && parseFloat(platformData.engagements) > 0) {
      return 'engagement';
    }
    if (platformData.link_clicks && parseFloat(platformData.link_clicks) > 0) {
      return 'visit';
    }
    return 'impression';
  }

  /**
   * Calculate the attributed value of this touchpoint
   */
  private static calculateTouchPointValue(
    platformData: any,
    mapping: PlatformDataMapping
  ): number {
    // If there's explicit conversion value, use it
    if (platformData.conversion_value && parseFloat(platformData.conversion_value) > 0) {
      return parseFloat(platformData.conversion_value);
    }
    
    // Otherwise, estimate based on action type and platform
    const actionType = platformData.action_type || 'impression';
    const baseValue = mapping.conversionTracking.valueMapping[actionType];
    
    if (baseValue) {
      return baseValue;
    }
    
    // Fallback calculation based on stage and metrics
    const conversions = parseFloat(platformData.conversions || '0');
    if (conversions > 0) {
      // Estimate value based on platform averages
      const platformMultipliers = {
        meta: 75,
        google: 100,
        tiktok: 60,
        woocommerce: 120,
        organic: 50
      };
      return conversions * (platformMultipliers[mapping.platform] || 75);
    }
    
    return 0;
  }

  /**
   * Build customer journey from multiple platform touchpoints
   */
  static buildCustomerJourney(
    touchPoints: TouchPoint[],
    conversionEvent?: ConversionEvent
  ): CustomerJourney {
    // Sort touchpoints by timestamp
    const sortedTouchPoints = [...touchPoints].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    const firstTouch = sortedTouchPoints[0];
    const lastTouch = sortedTouchPoints[sortedTouchPoints.length - 1];
    
    // Find most influential touchpoint (highest value)
    const mostInfluential = sortedTouchPoints.reduce((max, current) => 
      current.value > max.value ? current : max, sortedTouchPoints[0]
    );
    
    // Calculate journey metrics
    const journeyDuration = lastTouch ? 
      (lastTouch.timestamp.getTime() - firstTouch.timestamp.getTime()) / (1000 * 60 * 60 * 24) : 0;
    
    const totalValue = conversionEvent?.value || 
      sortedTouchPoints.reduce((sum, tp) => sum + tp.value, 0);
    
    return {
      customerId: this.generateCustomerId(firstTouch),
      totalValue,
      journeyDuration,
      touchPoints: sortedTouchPoints,
      conversionEvent: conversionEvent || this.createDefaultConversionEvent(lastTouch),
      attribution: {
        firstTouch,
        lastTouch,
        mostInfluential,
        assistingTouchPoints: sortedTouchPoints.slice(1, -1)
      },
      segments: this.inferCustomerSegments(sortedTouchPoints, totalValue)
    };
  }

  /**
   * Generate a customer ID from touchpoint data
   */
  private static generateCustomerId(touchPoint: TouchPoint): string {
    // In a real implementation, this would use actual customer/user IDs
    return `customer_${touchPoint.platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a default conversion event if none provided
   */
  private static createDefaultConversionEvent(touchPoint: TouchPoint): ConversionEvent {
    return {
      timestamp: touchPoint.timestamp,
      platform: touchPoint.platform,
      type: 'purchase',
      value: touchPoint.value,
      orderId: `order_${touchPoint.campaignId}_${Date.now()}`
    };
  }

  /**
   * Infer customer segments from journey patterns
   */
  private static inferCustomerSegments(touchPoints: TouchPoint[], totalValue: number): string[] {
    const segments: string[] = [];
    
    // Value-based segmentation
    if (totalValue > 200) {
      segments.push('High-Value Customer');
    } else if (totalValue > 100) {
      segments.push('Medium-Value Customer');
    } else {
      segments.push('Low-Value Customer');
    }
    
    // Platform behavior segmentation
    const platforms = [...new Set(touchPoints.map(tp => tp.platform))];
    if (platforms.length > 2) {
      segments.push('Multi-Platform User');
    }
    
    if (platforms.includes('tiktok')) {
      segments.push('Social Media Engaged');
    }
    
    if (platforms.includes('google')) {
      segments.push('Search-Driven');
    }
    
    if (platforms.includes('woocommerce')) {
      segments.push('Direct Buyer');
    }
    
    // Journey length segmentation
    const journeyLength = touchPoints.length;
    if (journeyLength > 5) {
      segments.push('Research-Oriented');
    } else if (journeyLength <= 2) {
      segments.push('Quick Decider');
    } else {
      segments.push('Moderate Consideration');
    }
    
    return segments;
  }

  /**
   * Extract platform metrics for funnel stage analysis
   */
  static extractPlatformMetrics(
    platformData: any[],
    platform: PlatformType,
    targetStage: 'awareness' | 'interest' | 'desire' | 'action'
  ) {
    const stageData = platformData.filter(data => 
      this.mapCampaignToFunnelStage(data, platform) === targetStage
    );
    
    const totals = stageData.reduce((acc, data) => ({
      volume: acc.volume + parseFloat(data.impressions || '0'),
      spend: acc.spend + parseFloat(data.spend || '0'),
      conversions: acc.conversions + parseFloat(data.conversions || '0'),
      clicks: acc.clicks + parseFloat(data.clicks || '0')
    }), { volume: 0, spend: 0, conversions: 0, clicks: 0 });
    
    return {
      volume: totals.volume,
      spend: totals.spend,
      conversions: totals.conversions,
      conversionRate: totals.volume > 0 ? (totals.conversions / totals.volume) * 100 : 0,
      cost: totals.volume > 0 ? totals.spend / totals.volume : 0,
      roas: totals.spend > 0 ? (totals.conversions * 50) / totals.spend : 0, // Mock $50 per conversion
      contribution: 0, // Will be calculated by the calling service
      efficiency: this.calculatePlatformEfficiency(platform, targetStage, totals),
      trend: this.calculateTrend(stageData)
    };
  }

  /**
   * Calculate platform efficiency for a specific stage
   */
  private static calculatePlatformEfficiency(
    platform: PlatformType,
    stage: string,
    totals: any
  ): number {
    // Base efficiency score
    let efficiency = 70;
    
    // Platform-stage synergy bonuses
    const synergies = {
      meta: { interest: 10, desire: 15, action: 5 },
      google: { awareness: 15, interest: 12, action: 8 },
      tiktok: { awareness: 20, interest: 5, desire: -5 },
      woocommerce: { action: 25, desire: 10 },
      organic: { awareness: 5, interest: 15, desire: 10 }
    };
    
    const platformSynergy = synergies[platform]?.[stage] || 0;
    efficiency += platformSynergy;
    
    // Performance-based adjustments
    if (totals.volume > 0) {
      const conversionRate = (totals.conversions / totals.volume) * 100;
      const roas = totals.spend > 0 ? (totals.conversions * 50) / totals.spend : 0;
      
      if (conversionRate > 5) efficiency += 10;
      if (roas > 2) efficiency += 10;
      if (conversionRate < 1) efficiency -= 10;
      if (roas < 1) efficiency -= 15;
    }
    
    return Math.max(0, Math.min(100, efficiency));
  }

  /**
   * Calculate trend based on historical data patterns
   */
  private static calculateTrend(stageData: any[]): 'up' | 'down' | 'stable' {
    // In a real implementation, this would analyze historical data
    // For now, return mock trend based on performance
    const avgRoas = stageData.reduce((sum, data) => {
      const spend = parseFloat(data.spend || '0');
      const conversions = parseFloat(data.conversions || '0');
      return sum + (spend > 0 ? (conversions * 50) / spend : 0);
    }, 0) / stageData.length;
    
    if (avgRoas > 2.5) return 'up';
    if (avgRoas < 1.5) return 'down';
    return 'stable';
  }

  /**
   * Validate platform data structure
   */
  static validatePlatformData(data: any, platform: PlatformType): boolean {
    const requiredFields = ['impressions', 'spend'];
    const optionalFields = ['clicks', 'conversions', 'campaign_name', 'objective'];
    
    // Check required fields
    for (const field of requiredFields) {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        console.warn(`Missing required field ${field} for platform ${platform}`);
        return false;
      }
    }
    
    // Validate numeric fields
    const numericFields = ['impressions', 'clicks', 'conversions', 'spend'];
    for (const field of numericFields) {
      if (data[field] && isNaN(parseFloat(data[field]))) {
        console.warn(`Invalid numeric value for ${field} in platform ${platform}`);
        return false;
      }
    }
    
    return true;
  }
}