// Enhanced Funnel Intelligence Service
// Extends the existing FunnelAnalysisService with advanced cross-platform intelligence

import { FunnelAnalysisService } from '../lib/funnel-analysis';
import {
  EnhancedFunnelAnalysis,
  EnhancedFunnelStage,
  PlatformType,
  AttributionAnalysis,
  CustomerJourney,
  TouchPoint,
  AIRecommendation,
  BottleneckInsight,
  FunnelHealthScore,
  PredictiveInsights,
  BudgetOptimizationSuggestion,
  PlatformStageMetrics,
  FunnelIntelligenceConfig,
  MockDataConfig
} from '../lib/enhanced-funnel-intelligence';

export class EnhancedFunnelIntelligenceService extends FunnelAnalysisService {
  private static readonly DEFAULT_CONFIG: FunnelIntelligenceConfig = {
    includePredictive: true,
    includeAttribution: true,
    includeAI: true,
    attributionWindow: 30,
    minimumTouchPoints: 2,
    platforms: ['meta', 'google', 'tiktok', 'woocommerce']
  };

  /**
   * Main entry point: Analyze funnel with enhanced intelligence
   */
  static async analyzeEnhancedFunnel(
    campaignData: any[],
    platformData: { [key in PlatformType]?: any[] } = {},
    config: Partial<FunnelIntelligenceConfig> = {}
  ): Promise<EnhancedFunnelAnalysis> {
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    // Get base funnel analysis
    const baseFunnel = this.analyzeFunnel(campaignData);
    
    // Generate enhanced stages with cross-platform intelligence
    const enhancedStages = await this.generateEnhancedStages(baseFunnel, platformData, fullConfig);
    
    // Cross-platform attribution analysis
    const attribution = fullConfig.includeAttribution 
      ? await this.analyzeAttribution(platformData, fullConfig)
      : this.generateMockAttribution();
    
    // Customer journey analysis  
    const journeys = await this.analyzeCustomerJourneys(platformData, fullConfig);
    
    // Funnel health scoring
    const funnelHealth = this.calculateFunnelHealth(enhancedStages);
    
    // Predictive analytics
    const predictiveAnalytics = fullConfig.includePredictive
      ? await this.generatePredictiveInsights(enhancedStages, platformData)
      : this.generateMockPredictive();
    
    // AI-powered insights
    const aiInsights = fullConfig.includeAI
      ? await this.generateAIInsights(enhancedStages, attribution, journeys)
      : this.generateMockAIInsights();

    return {
      // Enhanced 4-stage AIDA funnel
      stages: {
        awareness: enhancedStages.awareness,
        interest: enhancedStages.interest,
        desire: enhancedStages.desire,
        action: enhancedStages.action
      },
      
      // Legacy compatibility
      awareness: enhancedStages.awareness,
      consideration: this.combineStages(enhancedStages.interest, enhancedStages.desire),
      conversion: enhancedStages.action,
      tofu: enhancedStages.awareness,
      mofu: this.combineStages(enhancedStages.interest, enhancedStages.desire),
      bofu: enhancedStages.action,
      
      // Base metrics (inherited)
      ...baseFunnel,
      
      // Enhanced analytics
      crossPlatformAttribution: attribution,
      customerJourneys: journeys,
      funnelHealth,
      predictiveAnalytics,
      aiInsights
    };
  }

  /**
   * Generate enhanced funnel stages with cross-platform breakdown
   */
  private static async generateEnhancedStages(
    baseFunnel: any,
    platformData: { [key in PlatformType]?: any[] },
    config: FunnelIntelligenceConfig
  ): Promise<{
    awareness: EnhancedFunnelStage;
    interest: EnhancedFunnelStage;
    desire: EnhancedFunnelStage;
    action: EnhancedFunnelStage;
  }> {
    // Map existing 3-stage to 4-stage AIDA
    const awareness = await this.enhanceStage(baseFunnel.tofu, 'awareness', platformData, config);
    const interest = await this.enhanceStage(
      this.splitConsiderationStage(baseFunnel.mofu, 'interest'), 
      'interest', 
      platformData, 
      config
    );
    const desire = await this.enhanceStage(
      this.splitConsiderationStage(baseFunnel.mofu, 'desire'),
      'desire',
      platformData,
      config
    );
    const action = await this.enhanceStage(baseFunnel.bofu, 'action', platformData, config);

    return { awareness, interest, desire, action };
  }

  /**
   * Enhance a single funnel stage with intelligence
   */
  private static async enhanceStage(
    baseStage: any,
    aidaStage: 'awareness' | 'interest' | 'desire' | 'action',
    platformData: { [key in PlatformType]?: any[] },
    config: FunnelIntelligenceConfig
  ): Promise<EnhancedFunnelStage> {
    // Generate platform breakdown
    const platformBreakdown = this.generatePlatformBreakdown(baseStage, platformData, aidaStage);
    
    // Calculate health score
    const healthScore = this.calculateStageHealthScore(baseStage, platformBreakdown);
    
    // Determine performance level
    const performance = this.determineStagePerformance(healthScore);
    
    // Generate AI recommendations
    const aiRecommendations = await this.generateStageRecommendations(
      baseStage, 
      aidaStage, 
      platformBreakdown
    );
    
    // Analyze bottlenecks
    const bottleneckAnalysis = this.analyzeStageBottlenecks(
      baseStage, 
      aidaStage, 
      platformBreakdown
    );

    return {
      ...baseStage,
      aidaClassification: aidaStage,
      platformBreakdown,
      healthScore,
      performance,
      trend: this.calculateTrend(baseStage),
      aiRecommendations,
      bottleneckAnalysis
    };
  }

  /**
   * Generate cross-platform breakdown for a stage
   */
  private static generatePlatformBreakdown(
    stage: any,
    platformData: { [key in PlatformType]?: any[] },
    aidaStage: 'awareness' | 'interest' | 'desire' | 'action'
  ): {
    meta: PlatformStageMetrics;
    google: PlatformStageMetrics;
    tiktok: PlatformStageMetrics;
    woocommerce: PlatformStageMetrics;
    organic: PlatformStageMetrics;
  } {
    const platforms: PlatformType[] = ['meta', 'google', 'tiktok', 'woocommerce', 'organic'];
    const breakdown = {} as any;

    platforms.forEach(platform => {
      breakdown[platform] = this.generatePlatformMetrics(
        stage,
        platform,
        aidaStage,
        platformData[platform] || []
      );
    });

    return breakdown;
  }

  /**
   * Generate metrics for a specific platform at a funnel stage
   */
  private static generatePlatformMetrics(
    stage: any,
    platform: PlatformType,
    aidaStage: string,
    data: any[]
  ): PlatformStageMetrics {
    // Mock intelligent platform distribution based on stage and platform characteristics
    const stageMultipliers = {
      awareness: { meta: 0.4, google: 0.35, tiktok: 0.2, woocommerce: 0.05, organic: 0.15 },
      interest: { meta: 0.35, google: 0.4, tiktok: 0.15, woocommerce: 0.1, organic: 0.25 },
      desire: { meta: 0.45, google: 0.3, tiktok: 0.1, woocommerce: 0.15, organic: 0.2 },
      action: { meta: 0.25, google: 0.2, tiktok: 0.05, woocommerce: 0.5, organic: 0.1 }
    };

    const multiplier = stageMultipliers[aidaStage as keyof typeof stageMultipliers]?.[platform] || 0.25;
    const volume = Math.round(stage.metrics.impressions * multiplier);
    const spend = stage.metrics.spend * multiplier;
    const conversions = Math.round(stage.metrics.conversions * multiplier);

    return {
      volume,
      spend,
      conversions,
      conversionRate: volume > 0 ? (conversions / volume) * 100 : 0,
      cost: volume > 0 ? spend / volume : 0,
      roas: spend > 0 ? (conversions * 50) / spend : 0, // Mock $50 per conversion
      contribution: multiplier * 100,
      efficiency: this.calculatePlatformEfficiency(platform, aidaStage),
      trend: this.generateTrend()
    };
  }

  /**
   * Calculate platform efficiency score for a stage
   */
  private static calculatePlatformEfficiency(platform: PlatformType, stage: string): number {
    // Mock efficiency scores based on platform strengths
    const efficiencyMap = {
      awareness: { meta: 85, google: 78, tiktok: 90, woocommerce: 40, organic: 70 },
      interest: { meta: 80, google: 88, tiktok: 75, woocommerce: 60, organic: 85 },
      desire: { meta: 90, google: 82, tiktok: 65, woocommerce: 75, organic: 80 },
      action: { meta: 75, google: 70, tiktok: 50, woocommerce: 95, organic: 60 }
    };

    return efficiencyMap[stage as keyof typeof efficiencyMap]?.[platform] || 70;
  }

  /**
   * Calculate health score for a funnel stage
   */
  private static calculateStageHealthScore(stage: any, platformBreakdown: any): number {
    const ctrWeight = 0.3;
    const conversionWeight = 0.4;
    const roasWeight = 0.3;

    const ctrScore = Math.min(stage.metrics.ctr * 20, 100); // Scale CTR to 0-100
    const conversionScore = Math.min(stage.metrics.conversionRate * 10, 100);
    const roasScore = Math.min(stage.metrics.roas * 25, 100);

    return Math.round(
      ctrScore * ctrWeight + 
      conversionScore * conversionWeight + 
      roasScore * roasWeight
    );
  }

  /**
   * Determine stage performance level
   */
  private static determineStagePerformance(healthScore: number): 'excellent' | 'good' | 'poor' | 'critical' {
    if (healthScore >= 85) return 'excellent';
    if (healthScore >= 70) return 'good';
    if (healthScore >= 50) return 'poor';
    return 'critical';
  }

  /**
   * Generate AI recommendations for a stage
   */
  private static async generateStageRecommendations(
    stage: any,
    aidaStage: string,
    platformBreakdown: any
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Platform optimization recommendations
    const topPlatform = Object.entries(platformBreakdown)
      .sort(([,a], [,b]) => (b as any).efficiency - (a as any).efficiency)[0];
    
    const worstPlatform = Object.entries(platformBreakdown)
      .sort(([,a], [,b]) => (a as any).efficiency - (b as any).efficiency)[0];

    if (topPlatform && worstPlatform) {
      recommendations.push({
        id: `${aidaStage}_platform_optimization`,
        type: 'optimization',
        priority: 'high',
        title: `Optimize ${aidaStage} stage platform allocation`,
        message: `${topPlatform[0]} is outperforming ${worstPlatform[0]} by ${Math.round((topPlatform[1] as any).efficiency - (worstPlatform[1] as any).efficiency)}% in the ${aidaStage} stage`,
        impact: `+€${Math.round(stage.metrics.spend * 0.15).toLocaleString()} monthly revenue`,
        confidence: 0.82,
        platform: topPlatform[0] as PlatformType,
        stage: aidaStage as any,
        actions: [
          `Reallocate 20% budget from ${worstPlatform[0]} to ${topPlatform[0]}`,
          `Review targeting settings on underperforming platform`,
          `Test creative variations on top-performing platform`
        ],
        estimatedROI: 2.3,
        timeframe: '2-4 weeks'
      });
    }

    // Performance-specific recommendations
    if (stage.metrics.ctr < 2) {
      recommendations.push({
        id: `${aidaStage}_ctr_improvement`,
        type: 'opportunity',
        priority: 'high',
        title: `Improve ${aidaStage} stage CTR`,
        message: `Current CTR of ${stage.metrics.ctr.toFixed(2)}% is below industry benchmarks`,
        impact: `+${Math.round(stage.metrics.impressions * 0.01).toLocaleString()} additional clicks`,
        confidence: 0.75,
        stage: aidaStage as any,
        actions: [
          'A/B test new ad creatives',
          'Refine audience targeting',
          'Update ad copy with stronger CTAs'
        ],
        estimatedROI: 1.8,
        timeframe: '1-2 weeks'
      });
    }

    return recommendations;
  }

  /**
   * Analyze bottlenecks in a funnel stage
   */
  private static analyzeStageBottlenecks(
    stage: any,
    aidaStage: string,
    platformBreakdown: any
  ): BottleneckInsight[] {
    const bottlenecks: BottleneckInsight[] = [];

    // High cost bottleneck
    if (stage.metrics.costPerConversion > 100) {
      bottlenecks.push({
        stage: aidaStage,
        issueType: 'high_cost',
        severity: 'high',
        impact: stage.metrics.spend * 0.3,
        description: `Cost per conversion (€${stage.metrics.costPerConversion.toFixed(2)}) is above optimal range`,
        rootCauses: [
          'Poor audience targeting',
          'Inefficient bid strategies', 
          'Low-converting creative assets'
        ],
        solutions: {
          quickWins: [
            'Pause worst-performing ad sets',
            'Increase budget on top performers',
            'Adjust bid caps'
          ],
          strategicChanges: [
            'Implement audience lookalike modeling',
            'Develop conversion-optimized creatives',
            'Implement advanced attribution tracking'
          ],
          budgetAdjustments: [
            {
              platform: 'meta',
              currentAllocation: 40,
              recommendedAllocation: 50,
              changePercent: 25,
              reasoning: 'Meta shows highest conversion efficiency',
              expectedImprovement: 0.20
            }
          ]
        },
        affectedPlatforms: ['meta', 'google']
      });
    }

    return bottlenecks;
  }

  /**
   * Generate mock attribution analysis
   */
  private static generateMockAttribution(): AttributionAnalysis {
    return {
      models: {
        firstTouch: {
          modelName: 'First Touch',
          platformAttributions: [
            { platform: 'google', attributedRevenue: 25000, attributedConversions: 500, contributionPercent: 35 },
            { platform: 'meta', attributedRevenue: 20000, attributedConversions: 400, contributionPercent: 30 },
            { platform: 'tiktok', attributedRevenue: 10000, attributedConversions: 200, contributionPercent: 20 },
            { platform: 'organic', attributedRevenue: 8000, attributedConversions: 160, contributionPercent: 15 }
          ],
          totalAttributedValue: 63000,
          confidence: 0.7
        },
        lastTouch: {
          modelName: 'Last Touch',
          platformAttributions: [
            { platform: 'woocommerce', attributedRevenue: 30000, attributedConversions: 600, contributionPercent: 40 },
            { platform: 'meta', attributedRevenue: 22000, attributedConversions: 440, contributionPercent: 30 },
            { platform: 'google', attributedRevenue: 15000, attributedConversions: 300, contributionPercent: 20 },
            { platform: 'direct', attributedRevenue: 8000, attributedConversions: 160, contributionPercent: 10 }
          ],
          totalAttributedValue: 75000,
          confidence: 0.8
        },
        linear: {
          modelName: 'Linear Attribution',
          platformAttributions: [
            { platform: 'meta', attributedRevenue: 28000, attributedConversions: 560, contributionPercent: 32 },
            { platform: 'google', attributedRevenue: 22000, attributedConversions: 440, contributionPercent: 28 },
            { platform: 'woocommerce', attributedRevenue: 20000, attributedConversions: 400, contributionPercent: 25 },
            { platform: 'tiktok', attributedRevenue: 12000, attributedConversions: 240, contributionPercent: 15 }
          ],
          totalAttributedValue: 82000,
          confidence: 0.85
        },
        timeDecay: {
          modelName: 'Time Decay',
          platformAttributions: [
            { platform: 'woocommerce', attributedRevenue: 32000, attributedConversions: 640, contributionPercent: 38 },
            { platform: 'meta', attributedRevenue: 26000, attributedConversions: 520, contributionPercent: 32 },
            { platform: 'google', attributedRevenue: 18000, attributedConversions: 360, contributionPercent: 22 },
            { platform: 'organic', attributedRevenue: 7000, attributedConversions: 140, contributionPercent: 8 }
          ],
          totalAttributedValue: 83000,
          confidence: 0.82
        },
        positionBased: {
          modelName: 'Position Based (40-20-40)',
          platformAttributions: [
            { platform: 'google', attributedRevenue: 28000, attributedConversions: 560, contributionPercent: 33 },
            { platform: 'woocommerce', attributedRevenue: 26000, attributedConversions: 520, contributionPercent: 31 },
            { platform: 'meta', attributedRevenue: 24000, attributedConversions: 480, contributionPercent: 28 },
            { platform: 'tiktok', attributedRevenue: 7000, attributedConversions: 140, contributionPercent: 8 }
          ],
          totalAttributedValue: 85000,
          confidence: 0.88
        },
        datadriven: {
          modelName: 'Data-Driven Attribution',
          platformAttributions: [
            { platform: 'meta', attributedRevenue: 35000, attributedConversions: 700, contributionPercent: 35 },
            { platform: 'woocommerce', attributedRevenue: 28000, attributedConversions: 560, contributionPercent: 28 },
            { platform: 'google', attributedRevenue: 25000, attributedConversions: 500, contributionPercent: 25 },
            { platform: 'tiktok', attributedRevenue: 12000, attributedConversions: 240, contributionPercent: 12 }
          ],
          totalAttributedValue: 100000,
          confidence: 0.92
        }
      },
      platformContribution: [
        {
          platform: 'meta',
          role: 'nurturing',
          contribution: 35,
          avgInfluence: 2.8,
          bestStages: ['interest', 'desire'],
          synergies: ['google', 'organic']
        },
        {
          platform: 'google',
          role: 'initiator',
          contribution: 30,
          avgInfluence: 3.2,
          bestStages: ['awareness', 'interest'],
          synergies: ['meta', 'woocommerce']
        },
        {
          platform: 'woocommerce',
          role: 'converter',
          contribution: 25,
          avgInfluence: 4.1,
          bestStages: ['action'],
          synergies: ['meta', 'google']
        },
        {
          platform: 'tiktok',
          role: 'initiator',
          contribution: 10,
          avgInfluence: 1.8,
          bestStages: ['awareness'],
          synergies: ['meta']
        }
      ],
      journeyPatterns: [
        {
          pattern: 'Google → Meta → WooCommerce',
          frequency: 35,
          avgValue: 125,
          avgDuration: 7.5,
          conversionRate: 12.5,
          efficiency: 2.8,
          segments: ['High-intent searchers', 'Social media engaged']
        },
        {
          pattern: 'TikTok → Meta → Direct',
          frequency: 20,
          avgValue: 85,
          avgDuration: 14.2,
          conversionRate: 8.3,
          efficiency: 2.1,
          segments: ['Young demographics', 'Video-first consumers']
        },
        {
          pattern: 'Meta → Google → WooCommerce',
          frequency: 25,
          avgValue: 110,
          avgDuration: 9.1,
          conversionRate: 11.2,
          efficiency: 2.5,
          segments: ['Social discovery', 'Research-oriented buyers']
        }
      ],
      crossPlatformSynergy: [
        {
          platforms: ['google', 'meta'],
          synergyType: 'sequential',
          description: 'Google search ads effectively warm up audiences for Meta retargeting campaigns',
          lift: 0.35,
          recommendation: 'Increase retargeting budget for Google search visitors'
        },
        {
          platforms: ['meta', 'woocommerce'],
          synergyType: 'reinforcing',
          description: 'Meta campaigns drive higher-quality traffic that converts better on WooCommerce',
          lift: 0.28,
          recommendation: 'Implement Meta Conversions API for better tracking'
        }
      ]
    };
  }

  /**
   * Helper methods
   */
  private static splitConsiderationStage(mofu: any, type: 'interest' | 'desire'): any {
    const multiplier = type === 'interest' ? 0.6 : 0.4; // Interest gets more of MOFU
    return {
      ...mofu,
      metrics: {
        ...mofu.metrics,
        impressions: Math.round(mofu.metrics.impressions * multiplier),
        clicks: Math.round(mofu.metrics.clicks * multiplier),
        conversions: Math.round(mofu.metrics.conversions * multiplier),
        spend: mofu.metrics.spend * multiplier,
        revenue: mofu.metrics.revenue * multiplier
      }
    };
  }

  private static combineStages(stage1: EnhancedFunnelStage, stage2: EnhancedFunnelStage): EnhancedFunnelStage {
    return {
      ...stage1,
      metrics: {
        impressions: stage1.metrics.impressions + stage2.metrics.impressions,
        clicks: stage1.metrics.clicks + stage2.metrics.clicks,
        conversions: stage1.metrics.conversions + stage2.metrics.conversions,
        spend: stage1.metrics.spend + stage2.metrics.spend,
        revenue: stage1.metrics.revenue + stage2.metrics.revenue,
        ctr: (stage1.metrics.ctr + stage2.metrics.ctr) / 2,
        conversionRate: (stage1.metrics.conversionRate + stage2.metrics.conversionRate) / 2,
        costPerConversion: (stage1.metrics.costPerConversion + stage2.metrics.costPerConversion) / 2,
        roas: (stage1.metrics.roas + stage2.metrics.roas) / 2
      }
    };
  }

  private static calculateTrend(stage: any): 'improving' | 'stable' | 'declining' {
    // Mock trend calculation
    const random = Math.random();
    if (random > 0.6) return 'improving';
    if (random > 0.3) return 'stable';
    return 'declining';
  }

  private static generateTrend(): 'up' | 'down' | 'stable' {
    const random = Math.random();
    if (random > 0.6) return 'up';
    if (random > 0.3) return 'stable';
    return 'down';
  }

  private static calculateFunnelHealth(stages: any): FunnelHealthScore {
    const stageScores = {
      awareness: stages.awareness.healthScore,
      interest: stages.interest.healthScore,
      desire: stages.desire.healthScore,
      action: stages.action.healthScore
    };

    const overall = Object.values(stageScores).reduce((sum, score) => sum + score, 0) / 4;

    return {
      overall: Math.round(overall),
      stageScores,
      trends: {
        weekly: Math.round((Math.random() - 0.5) * 20),
        monthly: Math.round((Math.random() - 0.5) * 30),
        quarterly: Math.round((Math.random() - 0.5) * 40)
      },
      alerts: []
    };
  }

  private static async analyzeCustomerJourneys(
    platformData: { [key in PlatformType]?: any[] },
    config: FunnelIntelligenceConfig
  ): Promise<CustomerJourney[]> {
    // Mock customer journey data
    return [];
  }

  private static async analyzeAttribution(
    platformData: { [key in PlatformType]?: any[] },
    config: FunnelIntelligenceConfig
  ): Promise<AttributionAnalysis> {
    return this.generateMockAttribution();
  }

  private static generateMockPredictive(): PredictiveInsights {
    return {
      forecasts: {
        '7d': {
          timeframe: '7 days',
          confidence: 0.85,
          expectedMetrics: {
            conversions: 120,
            revenue: 6000,
            spend: 2400,
            roas: 2.5
          },
          risks: ['Seasonal decline in TikTok traffic'],
          opportunities: ['Meta retargeting campaign launch']
        },
        '30d': {
          timeframe: '30 days',
          confidence: 0.78,
          expectedMetrics: {
            conversions: 480,
            revenue: 24000,
            spend: 9600,
            roas: 2.5
          },
          risks: ['Google CPC inflation', 'iOS 14.5 tracking changes'],
          opportunities: ['Black Friday season boost', 'New product launch']
        },
        '90d': {
          timeframe: '90 days',
          confidence: 0.65,
          expectedMetrics: {
            conversions: 1440,
            revenue: 72000,
            spend: 28800,
            roas: 2.5
          },
          risks: ['Market saturation', 'Increased competition'],
          opportunities: ['Q4 holiday traffic', 'Expanded targeting options']
        }
      },
      scenarios: {
        currentTrajectory: {
          scenarioName: 'Current Performance',
          description: 'Continuing with existing strategy',
          expectedResults: {
            revenueChange: 0,
            roasChange: 0,
            conversionChange: 0
          },
          requiredActions: [],
          investment: 0,
          timeframe: 'Ongoing'
        },
        optimizedPerformance: {
          scenarioName: 'AI-Optimized Campaign',
          description: 'Implementing all AI recommendations',
          expectedResults: {
            revenueChange: 0.35,
            roasChange: 0.25,
            conversionChange: 0.30
          },
          requiredActions: [
            'Reallocate budget based on attribution analysis',
            'Implement advanced bidding strategies',
            'Optimize creative rotation'
          ],
          investment: 2000,
          timeframe: '4-6 weeks'
        },
        budgetIncrease: {
          scenarioName: '25% Budget Increase',
          description: 'Scaling successful campaigns',
          expectedResults: {
            revenueChange: 0.20,
            roasChange: -0.05,
            conversionChange: 0.25
          },
          requiredActions: [
            'Identify scaling opportunities',
            'Monitor performance closely',
            'Adjust bids for volume'
          ],
          investment: 7200,
          timeframe: '2-3 weeks'
        },
        budgetReallocation: {
          scenarioName: 'Strategic Budget Reallocation',
          description: 'Moving budget to highest-performing channels',
          expectedResults: {
            revenueChange: 0.15,
            roasChange: 0.18,
            conversionChange: 0.12
          },
          requiredActions: [
            'Reduce spend on underperforming platforms',
            'Increase investment in top performers',
            'Test new audience segments'
          ],
          investment: 0,
          timeframe: '1-2 weeks'
        }
      },
      seasonality: {
        patterns: [],
        upcoming: []
      }
    };
  }

  private static generateMockAIInsights(): any {
    return {
      keyFindings: [
        'Meta drives 35% more conversions when combined with Google search campaigns',
        'TikTok audiences convert 2.3x better when retargeted on Meta within 3 days',
        'WooCommerce checkout abandonment is 40% higher on mobile devices'
      ],
      criticalAlerts: [],
      optimizationOpportunities: [],
      budgetOptimization: {
        currentAllocation: [
          { platform: 'meta' as const, currentBudget: 4000, currentPercent: 40, recommendedBudget: 4500, recommendedPercent: 45, expectedROI: 2.8, reasoning: 'Highest cross-platform synergy' },
          { platform: 'google' as const, currentBudget: 3000, currentPercent: 30, recommendedBudget: 2800, recommendedPercent: 28, expectedROI: 2.4, reasoning: 'Good for awareness, lower conversion' },
          { platform: 'tiktok' as const, currentBudget: 2000, currentPercent: 20, recommendedBudget: 1700, recommendedPercent: 17, expectedROI: 1.9, reasoning: 'High CPMs, young demographic only' },
          { platform: 'woocommerce' as const, currentBudget: 1000, currentPercent: 10, recommendedBudget: 1000, recommendedPercent: 10, expectedROI: 3.5, reasoning: 'Direct sales, maintain investment' }
        ],
        recommendedAllocation: [
          { platform: 'meta' as const, currentBudget: 4000, currentPercent: 40, recommendedBudget: 4500, recommendedPercent: 45, expectedROI: 2.8, reasoning: 'Highest cross-platform synergy' },
          { platform: 'google' as const, currentBudget: 3000, currentPercent: 30, recommendedBudget: 2800, recommendedPercent: 28, expectedROI: 2.4, reasoning: 'Good for awareness, lower conversion' },
          { platform: 'tiktok' as const, currentBudget: 2000, currentPercent: 20, recommendedBudget: 1700, recommendedPercent: 17, expectedROI: 1.9, reasoning: 'High CPMs, young demographic only' },
          { platform: 'woocommerce' as const, currentBudget: 1000, currentPercent: 10, recommendedBudget: 1000, recommendedPercent: 10, expectedROI: 3.5, reasoning: 'Direct sales, maintain investment' }
        ],
        expectedImprovement: {
          revenue: 3200,
          roas: 0.15,
          conversions: 64
        },
        reasoning: 'Meta shows strongest cross-platform synergy effects and highest conversion assistance rates',
        confidence: 0.84,
        timeframe: '2-4 weeks',
        risks: ['iOS tracking limitations', 'Meta ad fatigue']
      },
      competitivePosition: []
    };
  }
}