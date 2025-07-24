// Enhanced Funnel Intelligence - Building on existing funnel analysis
// This extends the current 3-stage funnel with advanced Russell Brunson AIDA methodology

import { FunnelStage, FunnelAnalysis, CampaignFunnelData } from './funnel-analysis';

// Platform Types
export type PlatformType = 'meta' | 'google' | 'tiktok' | 'woocommerce' | 'organic' | 'direct';

// Enhanced Funnel Stage Data with Cross-Platform Attribution
export interface EnhancedFunnelStage extends FunnelStage {
  // 4-Stage Russell Brunson AIDA Extension
  aidaClassification: 'awareness' | 'interest' | 'desire' | 'action';
  
  // Cross-Platform Performance
  platformBreakdown: {
    meta: PlatformStageMetrics;
    google: PlatformStageMetrics;
    tiktok: PlatformStageMetrics;
    woocommerce: PlatformStageMetrics;
    organic: PlatformStageMetrics;
  };
  
  // Stage Health & Performance
  healthScore: number; // 0-100
  performance: 'excellent' | 'good' | 'poor' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  
  // AI-Generated Insights
  aiRecommendations: AIRecommendation[];
  bottleneckAnalysis: BottleneckInsight[];
}

export interface PlatformStageMetrics {
  volume: number; // People at this stage from this platform
  spend: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  roas: number;
  contribution: number; // % of total stage volume
  efficiency: number; // Performance score vs other platforms
  trend: 'up' | 'down' | 'stable';
}

export interface AIRecommendation {
  id: string;
  type: 'optimization' | 'alert' | 'opportunity' | 'budget';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  impact: string; // Expected improvement (e.g., "+€2,340 monthly revenue")
  confidence: number; // 0-1 confidence score
  platform?: PlatformType;
  stage?: 'awareness' | 'interest' | 'desire' | 'action';
  actions: string[]; // Specific action items
  estimatedROI: number; // Expected return on investment
  timeframe: string; // Implementation timeframe
}

export interface BottleneckInsight {
  stage: string;
  issueType: 'high_cost' | 'low_conversion' | 'traffic_quality' | 'attribution_gap' | 'platform_mismatch';
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: number; // Revenue lost per month in currency
  description: string;
  rootCauses: string[];
  solutions: {
    quickWins: string[]; // Immediate 0-7 day fixes
    strategicChanges: string[]; // Long-term 30+ day optimizations
    budgetAdjustments: BudgetRecommendation[];
  };
  affectedPlatforms: PlatformType[];
}

export interface BudgetRecommendation {
  platform: PlatformType;
  currentAllocation: number;
  recommendedAllocation: number;
  changePercent: number;
  reasoning: string;
  expectedImprovement: number;
}

// Customer Journey & Attribution
export interface CustomerJourney {
  customerId: string;
  totalValue: number;
  journeyDuration: number; // days from first touch to conversion
  touchPoints: TouchPoint[];
  conversionEvent: ConversionEvent;
  attribution: {
    firstTouch: TouchPoint;
    lastTouch: TouchPoint;
    mostInfluential: TouchPoint;
    assistingTouchPoints: TouchPoint[];
  };
  segments: string[]; // Customer segments this journey represents
}

export interface TouchPoint {
  timestamp: Date;
  platform: PlatformType;
  campaignId: string;
  campaignName: string;
  adSetId?: string;
  adId?: string;
  stage: 'awareness' | 'interest' | 'desire' | 'action';
  touchType: 'impression' | 'click' | 'engagement' | 'visit' | 'conversion';
  value: number; // Attributed value
  cost: number;
  metadata: {
    deviceType?: string;
    placement?: string;
    audience?: string;
    creative?: string;
  };
}

export interface ConversionEvent {
  timestamp: Date;
  platform: PlatformType;
  type: 'purchase' | 'lead' | 'signup' | 'download' | 'call';
  value: number;
  orderId?: string;
  productIds?: string[];
}

// Cross-Platform Attribution Analysis
export interface AttributionAnalysis {
  models: {
    firstTouch: AttributionResult;
    lastTouch: AttributionResult;
    linear: AttributionResult;
    timeDecay: AttributionResult;
    positionBased: AttributionResult;
    datadriven: AttributionResult;
  };
  platformContribution: PlatformContribution[];
  journeyPatterns: JourneyPattern[];
  crossPlatformSynergy: SynergyInsight[];
}

export interface AttributionResult {
  modelName: string;
  platformAttributions: Array<{
    platform: PlatformType;
    attributedRevenue: number;
    attributedConversions: number;
    contributionPercent: number;
  }>;
  totalAttributedValue: number;
  confidence: number;
}

export interface PlatformContribution {
  platform: PlatformType;
  role: 'initiator' | 'nurturing' | 'converter' | 'assisting';
  contribution: number; // % of total conversions influenced
  avgInfluence: number; // Average influence per journey
  bestStages: string[]; // Stages where this platform performs best
  synergies: string[]; // Other platforms it works well with
}

export interface JourneyPattern {
  pattern: string; // e.g., "Google → Meta → Direct → Purchase"
  frequency: number; // How often this pattern occurs
  avgValue: number;
  avgDuration: number;
  conversionRate: number;
  efficiency: number; // Value per cost ratio
  segments: string[]; // Customer segments using this pattern
}

export interface SynergyInsight {
  platforms: PlatformType[];
  synergyType: 'sequential' | 'complementary' | 'reinforcing';
  description: string;
  lift: number; // Performance improvement when used together
  recommendation: string;
}

// Enhanced Funnel Analysis with Intelligence
export interface EnhancedFunnelAnalysis extends Omit<FunnelAnalysis, 'awareness' | 'consideration' | 'conversion' | 'tofu' | 'mofu' | 'bofu'> {
  // 4-Stage AIDA Funnel
  stages: {
    awareness: EnhancedFunnelStage;
    interest: EnhancedFunnelStage;
    desire: EnhancedFunnelStage;
    action: EnhancedFunnelStage;
  };
  
  // Legacy compatibility (mapped to AIDA)
  awareness: EnhancedFunnelStage; // Maps to AIDA awareness
  consideration: EnhancedFunnelStage; // Maps to AIDA interest + desire
  conversion: EnhancedFunnelStage; // Maps to AIDA action
  tofu: EnhancedFunnelStage; // Legacy alias for awareness
  mofu: EnhancedFunnelStage; // Legacy alias for consideration  
  bofu: EnhancedFunnelStage; // Legacy alias for conversion

  // Advanced Analytics
  crossPlatformAttribution: AttributionAnalysis;
  customerJourneys: CustomerJourney[];
  funnelHealth: FunnelHealthScore;
  predictiveAnalytics: PredictiveInsights;
  
  // AI-Powered Insights
  aiInsights: {
    keyFindings: string[];
    criticalAlerts: AIRecommendation[];
    optimizationOpportunities: AIRecommendation[];
    budgetOptimization: BudgetOptimizationSuggestion;
    competitivePosition: CompetitiveInsight[];
  };
}

export interface FunnelHealthScore {
  overall: number; // 0-100
  stageScores: {
    awareness: number;
    interest: number;
    desire: number;
    action: number;
  };
  trends: {
    weekly: number; // Change vs last week
    monthly: number; // Change vs last month
    quarterly: number; // Change vs last quarter
  };
  alerts: HealthAlert[];
}

export interface HealthAlert {
  type: 'critical' | 'warning' | 'info';
  stage?: string;
  platform?: PlatformType;
  message: string;
  impact: string;
  suggestedActions: string[];
}

export interface PredictiveInsights {
  forecasts: {
    '7d': FunnelForecast;
    '30d': FunnelForecast;
    '90d': FunnelForecast;
  };
  scenarios: {
    currentTrajectory: ScenarioOutcome;
    optimizedPerformance: ScenarioOutcome;
    budgetIncrease: ScenarioOutcome;
    budgetReallocation: ScenarioOutcome;
  };
  seasonality: {
    patterns: SeasonalPattern[];
    upcoming: SeasonalPrediction[];
  };
}

export interface FunnelForecast {
  timeframe: string;
  confidence: number;
  expectedMetrics: {
    conversions: number;
    revenue: number;
    spend: number;
    roas: number;
  };
  risks: string[];
  opportunities: string[];
}

export interface ScenarioOutcome {
  scenarioName: string;
  description: string;
  expectedResults: {
    revenueChange: number;
    roasChange: number;
    conversionChange: number;
  };
  requiredActions: string[];
  investment: number;
  timeframe: string;
}

export interface SeasonalPattern {
  period: string;
  impact: number; // % change from baseline
  affectedMetrics: string[];
  platforms: PlatformType[];
  description: string;
}

export interface SeasonalPrediction {
  period: string;
  expectedImpact: number;
  recommendations: string[];
  preparationActions: string[];
}

export interface BudgetOptimizationSuggestion {
  currentAllocation: PlatformBudgetAllocation[];
  recommendedAllocation: PlatformBudgetAllocation[];
  expectedImprovement: {
    revenue: number;
    roas: number;
    conversions: number;
  };
  reasoning: string;
  confidence: number;
  timeframe: string;
  risks: string[];
}

export interface PlatformBudgetAllocation {
  platform: PlatformType;
  currentBudget: number;
  currentPercent: number;
  recommendedBudget: number;
  recommendedPercent: number;
  expectedROI: number;
  reasoning: string;
}

export interface CompetitiveInsight {
  category: string;
  position: 'leader' | 'challenger' | 'follower';
  benchmark: number;
  ourPerformance: number;
  gap: number;
  opportunities: string[];
  threats: string[];
}

// Service Class Extensions
export interface FunnelIntelligenceConfig {
  includePredictive: boolean;
  includeAttribution: boolean;
  includeAI: boolean;
  attributionWindow: number; // days
  minimumTouchPoints: number;
  platforms: PlatformType[];
}

export interface PlatformDataMapping {
  platform: PlatformType;
  stageMapping: {
    [key: string]: 'awareness' | 'interest' | 'desire' | 'action';
  };
  conversionTracking: {
    events: string[];
    valueMapping: { [key: string]: number };
  };
}

// Export mock data generation functions
export interface MockDataConfig {
  platforms: PlatformType[];
  dateRange: { start: Date; end: Date };
  volumeScale: 'small' | 'medium' | 'large';
  seasonality: boolean;
  trends: 'improving' | 'stable' | 'declining';
}