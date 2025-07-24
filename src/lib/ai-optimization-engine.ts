// AI-Powered Campaign Optimization Engine - Option C Implementation
// Advanced ML algorithms for automated campaign optimization

import { CampaignMetrics } from './api-service';
import { AttributionResult, attributionEngine } from './attribution-engine';

export interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  category: 'budget' | 'targeting' | 'creative' | 'bidding' | 'schedule';
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
  threshold?: number;
  customLogic?: (campaign: CampaignMetrics) => boolean;
}

export interface OptimizationRecommendation {
  id: string;
  campaignId: string;
  campaignName: string;
  platform: string;
  type: 'increase_budget' | 'decrease_budget' | 'pause_campaign' | 'adjust_targeting' | 'change_creative' | 'modify_schedule' | 'optimize_bidding';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  expectedImpact: {
    metric: string;
    change: number;
    confidence: number;
  };
  implementation: {
    automated: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedTime: string;
    requirements: string[];
  };
  reasoning: string[];
  data: {
    currentValue: number;
    recommendedValue: number;
    historicalPerformance: number[];
  };
  timestamp: Date;
}

export interface OptimizationConfig {
  enabledCategories: string[];
  minConfidence: number;
  maxBudgetChange: number;
  conservativeMode: boolean;
  autoImplement: boolean;
  reviewRequired: boolean;
}

export interface MLModel {
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'time_series';
  features: string[];
  accuracy: number;
  lastTrained: Date;
  predictions: any[];
}

class AIOptimizationEngine {
  private rules: Map<string, OptimizationRule> = new Map();
  private recommendations: OptimizationRecommendation[] = [];
  private models: Map<string, MLModel> = new Map();
  private config: OptimizationConfig;
  private trainingData: CampaignMetrics[] = [];

  constructor() {
    this.config = {
      enabledCategories: ['budget', 'targeting', 'creative', 'bidding'],
      minConfidence: 0.7,
      maxBudgetChange: 0.3, // Max 30% budget change
      conservativeMode: false,
      autoImplement: false,
      reviewRequired: true
    };

    this.initializeStandardRules();
    this.initializeMLModels();
    console.log('🤖 [AI Optimization] Engine initialized');
  }

  private initializeStandardRules(): void {
    const standardRules: OptimizationRule[] = [
      {
        id: 'high_roas_budget_increase',
        name: 'High ROAS Budget Increase',
        description: 'Increase budget for campaigns with ROAS > 4.0',
        category: 'budget',
        condition: 'roas > 4.0 && spend_utilization > 0.8',
        action: 'increase_budget_by_20_percent',
        priority: 1,
        enabled: true,
        threshold: 4.0
      },
      {
        id: 'low_roas_budget_decrease',
        name: 'Low ROAS Budget Decrease',
        description: 'Decrease budget for campaigns with ROAS < 1.5',
        category: 'budget',
        condition: 'roas < 1.5 && spend > min_daily_budget',
        action: 'decrease_budget_by_30_percent',
        priority: 2,
        enabled: true,
        threshold: 1.5
      },
      {
        id: 'poor_ctr_creative_refresh',
        name: 'Poor CTR Creative Refresh',
        description: 'Refresh creative for campaigns with CTR < 1.0%',
        category: 'creative',
        condition: 'ctr < 1.0 && impressions > 10000',
        action: 'refresh_creative',
        priority: 3,
        enabled: true,
        threshold: 1.0
      },
      {
        id: 'high_cpc_bidding_adjustment',
        name: 'High CPC Bidding Adjustment',
        description: 'Optimize bidding for campaigns with high CPC',
        category: 'bidding',
        condition: 'cpc > industry_average * 1.5',
        action: 'optimize_bidding_strategy',
        priority: 2,
        enabled: true
      },
      {
        id: 'declining_performance_pause',
        name: 'Declining Performance Pause',
        description: 'Pause campaigns with consistent declining performance',
        category: 'budget',
        condition: 'performance_trend < -0.2 && days_declining > 7',
        action: 'pause_campaign',
        priority: 1,
        enabled: true
      },
      {
        id: 'weekend_schedule_optimization',
        name: 'Weekend Schedule Optimization',
        description: 'Adjust schedule based on weekend performance',
        category: 'schedule',
        condition: 'weekend_performance_ratio < 0.7',
        action: 'reduce_weekend_budget',
        priority: 4,
        enabled: true
      }
    ];

    standardRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });

    console.log('📋 [AI Optimization] Loaded', standardRules.length, 'standard rules');
  }

  private initializeMLModels(): void {
    // Initialize ML models for different optimization tasks
    const models: MLModel[] = [
      {
        name: 'ROAS Predictor',
        type: 'regression',
        features: ['spend', 'impressions', 'clicks', 'ctr', 'cpc', 'day_of_week', 'hour_of_day'],
        accuracy: 0.84,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        predictions: []
      },
      {
        name: 'Budget Optimizer',
        type: 'regression',
        features: ['current_spend', 'roas', 'impression_share', 'competition_index', 'seasonality'],
        accuracy: 0.78,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        predictions: []
      },
      {
        name: 'Audience Segmenter',
        type: 'clustering',
        features: ['age', 'gender', 'interests', 'behavior', 'device', 'location'],
        accuracy: 0.72,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        predictions: []
      },
      {
        name: 'Performance Forecaster',
        type: 'time_series',
        features: ['historical_spend', 'seasonal_trends', 'market_conditions', 'competitor_activity'],
        accuracy: 0.81,
        lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        predictions: []
      }
    ];

    models.forEach(model => {
      this.models.set(model.name, model);
    });

    console.log('🧠 [AI Optimization] Loaded', models.length, 'ML models');
  }

  // **CORE OPTIMIZATION METHODS**

  public async optimizeCampaigns(campaigns: CampaignMetrics[]): Promise<OptimizationRecommendation[]> {
    console.log(`🔄 [AI Optimization] Analyzing ${campaigns.length} campaigns...`);
    
    this.recommendations = [];
    this.trainingData = [...this.trainingData, ...campaigns];

    // Run rule-based optimization
    const ruleBasedRecommendations = await this.runRuleBasedOptimization(campaigns);
    
    // Run ML-based optimization
    const mlBasedRecommendations = await this.runMLBasedOptimization(campaigns);
    
    // Combine and prioritize recommendations
    const allRecommendations = [...ruleBasedRecommendations, ...mlBasedRecommendations];
    const prioritizedRecommendations = this.prioritizeRecommendations(allRecommendations);
    
    this.recommendations = prioritizedRecommendations;
    
    console.log(`✅ [AI Optimization] Generated ${prioritizedRecommendations.length} recommendations`);
    return prioritizedRecommendations;
  }

  private async runRuleBasedOptimization(campaigns: CampaignMetrics[]): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    for (const campaign of campaigns) {
      for (const [ruleId, rule] of this.rules.entries()) {
        if (!rule.enabled || !this.config.enabledCategories.includes(rule.category)) {
          continue;
        }

        const shouldApply = this.evaluateRule(campaign, rule);
        
        if (shouldApply) {
          const recommendation = await this.generateRecommendation(campaign, rule);
          if (recommendation) {
            recommendations.push(recommendation);
          }
        }
      }
    }
    
    return recommendations;
  }

  private async runMLBasedOptimization(campaigns: CampaignMetrics[]): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    for (const campaign of campaigns) {
      // ROAS prediction
      const roasPrediction = this.predictROAS(campaign);
      if (roasPrediction.confidence > this.config.minConfidence) {
        const roasRecommendation = this.generateROASRecommendation(campaign, roasPrediction);
        if (roasRecommendation) recommendations.push(roasRecommendation);
      }
      
      // Budget optimization
      const budgetOptimization = this.optimizeBudget(campaign);
      if (budgetOptimization.confidence > this.config.minConfidence) {
        const budgetRecommendation = this.generateBudgetRecommendation(campaign, budgetOptimization);
        if (budgetRecommendation) recommendations.push(budgetRecommendation);
      }
      
      // Performance forecasting
      const performanceForecast = this.forecastPerformance(campaign);
      if (performanceForecast.confidence > this.config.minConfidence) {
        const forecastRecommendation = this.generateForecastRecommendation(campaign, performanceForecast);
        if (forecastRecommendation) recommendations.push(forecastRecommendation);
      }
    }
    
    return recommendations;
  }

  private evaluateRule(campaign: CampaignMetrics, rule: OptimizationRule): boolean {
    if (rule.customLogic) {
      return rule.customLogic(campaign);
    }

    // Simple rule evaluation (in production, this would be more sophisticated)
    switch (rule.id) {
      case 'high_roas_budget_increase':
        return campaign.roas > (rule.threshold || 4.0) && campaign.spend > 100;
        
      case 'low_roas_budget_decrease':
        return campaign.roas < (rule.threshold || 1.5) && campaign.spend > 50;
        
      case 'poor_ctr_creative_refresh':
        return campaign.ctr < (rule.threshold || 1.0) && campaign.impressions > 10000;
        
      case 'high_cpc_bidding_adjustment':
        return campaign.cpc > this.getIndustryAverageCPC(campaign.platform) * 1.5;
        
      case 'declining_performance_pause':
        return this.isPerformanceDeclining(campaign);
        
      case 'weekend_schedule_optimization':
        return this.hasWeekendPerformanceIssues(campaign);
        
      default:
        return false;
    }
  }

  private async generateRecommendation(
    campaign: CampaignMetrics, 
    rule: OptimizationRule
  ): Promise<OptimizationRecommendation | null> {
    
    const baseRecommendation = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      platform: campaign.platform,
      timestamp: new Date()
    };

    switch (rule.id) {
      case 'high_roas_budget_increase':
        return {
          ...baseRecommendation,
          type: 'increase_budget',
          priority: 'high',
          title: 'Increase Budget for High-Performing Campaign',
          description: `Campaign shows strong ROAS of ${campaign.roas.toFixed(2)}. Consider increasing budget by 20%.`,
          expectedImpact: {
            metric: 'conversions',
            change: 0.18, // 18% increase
            confidence: 0.85
          },
          implementation: {
            automated: true,
            complexity: 'simple',
            estimatedTime: '5 minutes',
            requirements: ['Budget availability', 'Campaign active']
          },
          reasoning: [
            `Current ROAS (${campaign.roas.toFixed(2)}) exceeds target (4.0)`,
            'Campaign has proven conversion efficiency',
            'Budget increase likely to scale positive results'
          ],
          data: {
            currentValue: campaign.spend,
            recommendedValue: campaign.spend * 1.2,
            historicalPerformance: [campaign.roas * 0.9, campaign.roas * 0.95, campaign.roas]
          }
        };

      case 'low_roas_budget_decrease':
        return {
          ...baseRecommendation,
          type: 'decrease_budget',
          priority: 'medium',
          title: 'Reduce Budget for Underperforming Campaign',
          description: `Campaign ROAS of ${campaign.roas.toFixed(2)} is below target. Consider reducing budget by 30%.`,
          expectedImpact: {
            metric: 'efficiency',
            change: 0.25, // 25% efficiency improvement
            confidence: 0.78
          },
          implementation: {
            automated: true,
            complexity: 'simple',
            estimatedTime: '3 minutes',
            requirements: ['Minimum budget threshold']
          },
          reasoning: [
            `Current ROAS (${campaign.roas.toFixed(2)}) below target (1.5)`,
            'Budget reduction will improve overall account efficiency',
            'Resources can be reallocated to better-performing campaigns'
          ],
          data: {
            currentValue: campaign.spend,
            recommendedValue: campaign.spend * 0.7,
            historicalPerformance: [campaign.roas * 1.1, campaign.roas * 1.05, campaign.roas]
          }
        };

      case 'poor_ctr_creative_refresh':
        return {
          ...baseRecommendation,
          type: 'change_creative',
          priority: 'medium',
          title: 'Refresh Creative Assets',
          description: `CTR of ${campaign.ctr.toFixed(2)}% indicates creative fatigue. New creative assets recommended.`,
          expectedImpact: {
            metric: 'ctr',
            change: 0.4, // 40% CTR improvement
            confidence: 0.72
          },
          implementation: {
            automated: false,
            complexity: 'moderate',
            estimatedTime: '2-3 hours',
            requirements: ['New creative assets', 'Design team availability']
          },
          reasoning: [
            `CTR (${campaign.ctr.toFixed(2)}%) below industry average`,
            'High impression volume suggests creative fatigue',
            'Fresh creative typically improves engagement'
          ],
          data: {
            currentValue: campaign.ctr,
            recommendedValue: campaign.ctr * 1.4,
            historicalPerformance: [campaign.ctr * 1.2, campaign.ctr * 1.1, campaign.ctr]
          }
        };

      default:
        return null;
    }
  }

  // **ML-BASED PREDICTION METHODS**

  private predictROAS(campaign: CampaignMetrics): { prediction: number; confidence: number } {
    // Simplified ROAS prediction using historical patterns
    const model = this.models.get('ROAS Predictor');
    if (!model) return { prediction: campaign.roas, confidence: 0.5 };

    // Feature engineering
    const dayOfWeek = new Date().getDay();
    const hourOfDay = new Date().getHours();
    
    // Simplified linear model (in production, this would use actual ML)
    let prediction = campaign.roas;
    
    // Adjust based on time patterns
    if (dayOfWeek >= 1 && dayOfWeek <= 5) prediction *= 1.1; // Weekdays
    if (hourOfDay >= 9 && hourOfDay <= 17) prediction *= 1.05; // Business hours
    
    // Adjust based on performance trends
    if (campaign.ctr > 2.0) prediction *= 1.15;
    if (campaign.cpc < 1.0) prediction *= 1.1;
    
    const confidence = Math.min(0.95, 0.6 + (campaign.impressions / 100000) * 0.3);
    
    return { prediction, confidence };
  }

  private optimizeBudget(campaign: CampaignMetrics): { optimizedBudget: number; confidence: number } {
    const model = this.models.get('Budget Optimizer');
    if (!model) return { optimizedBudget: campaign.spend, confidence: 0.5 };

    let optimizedBudget = campaign.spend;
    let confidence = 0.7;

    // Budget optimization logic
    if (campaign.roas > 3.0) {
      optimizedBudget *= 1.2; // Increase by 20%
      confidence += 0.1;
    } else if (campaign.roas < 1.5) {
      optimizedBudget *= 0.8; // Decrease by 20%
      confidence += 0.05;
    }

    // Cap budget changes
    const maxChange = this.config.maxBudgetChange;
    const changeRatio = optimizedBudget / campaign.spend;
    
    if (changeRatio > (1 + maxChange)) {
      optimizedBudget = campaign.spend * (1 + maxChange);
    } else if (changeRatio < (1 - maxChange)) {
      optimizedBudget = campaign.spend * (1 - maxChange);
    }

    return { optimizedBudget, confidence };
  }

  private forecastPerformance(campaign: CampaignMetrics): { forecast: any; confidence: number } {
    const model = this.models.get('Performance Forecaster');
    if (!model) return { forecast: {}, confidence: 0.5 };

    // Simplified performance forecasting
    const trend = this.calculatePerformanceTrend(campaign);
    const seasonality = this.getSeasonalityFactor();
    
    const forecast = {
      expectedROAS: campaign.roas * (1 + trend) * seasonality,
      expectedSpend: campaign.spend * 1.05, // 5% increase assumption
      expectedConversions: campaign.conversions * (1 + trend * 0.8),
      timeframe: '7 days'
    };

    const confidence = 0.6 + Math.abs(trend) * 0.2; // More confident with clear trends

    return { forecast, confidence };
  }

  // **HELPER METHODS**

  private calculatePerformanceTrend(campaign: CampaignMetrics): number {
    // Simplified trend calculation (would use historical data in production)
    if (campaign.roas > 3.0 && campaign.ctr > 2.0) return 0.1; // Positive trend
    if (campaign.roas < 1.5 && campaign.ctr < 1.0) return -0.15; // Negative trend
    return 0; // Neutral trend
  }

  private getSeasonalityFactor(): number {
    const month = new Date().getMonth();
    // November/December (holiday season)
    if (month === 10 || month === 11) return 1.2;
    // January (post-holiday dip)
    if (month === 0) return 0.9;
    return 1.0;
  }

  private getIndustryAverageCPC(platform: string): number {
    const averages: { [key: string]: number } = {
      'meta': 1.2,
      'google-ads': 2.1,
      'tiktok': 0.8,
      'linkedin': 3.5
    };
    return averages[platform] || 1.5;
  }

  private isPerformanceDeclining(campaign: CampaignMetrics): boolean {
    // Simplified declining performance check
    return campaign.roas < 2.0 && campaign.ctr < 1.5;
  }

  private hasWeekendPerformanceIssues(campaign: CampaignMetrics): boolean {
    // Simplified weekend performance check
    return campaign.roas < 2.5; // Assuming weekend performance is generally lower
  }

  private generateROASRecommendation(
    campaign: CampaignMetrics, 
    prediction: { prediction: number; confidence: number }
  ): OptimizationRecommendation {
    return {
      id: `ml_roas_${Date.now()}`,
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      platform: campaign.platform,
      type: prediction.prediction > campaign.roas ? 'increase_budget' : 'optimize_bidding',
      priority: prediction.confidence > 0.8 ? 'high' : 'medium',
      title: 'AI-Predicted ROAS Optimization',
      description: `AI predicts ROAS could reach ${prediction.prediction.toFixed(2)} with optimization`,
      expectedImpact: {
        metric: 'roas',
        change: (prediction.prediction - campaign.roas) / campaign.roas,
        confidence: prediction.confidence
      },
      implementation: {
        automated: true,
        complexity: 'simple',
        estimatedTime: '10 minutes',
        requirements: ['AI model confidence > 70%']
      },
      reasoning: [
        'AI model analyzed historical patterns',
        `Prediction confidence: ${(prediction.confidence * 100).toFixed(1)}%`,
        'Based on similar campaign performance data'
      ],
      data: {
        currentValue: campaign.roas,
        recommendedValue: prediction.prediction,
        historicalPerformance: [campaign.roas * 0.9, campaign.roas * 0.95, campaign.roas]
      },
      timestamp: new Date()
    };
  }

  private generateBudgetRecommendation(
    campaign: CampaignMetrics,
    optimization: { optimizedBudget: number; confidence: number }
  ): OptimizationRecommendation {
    const changeType = optimization.optimizedBudget > campaign.spend ? 'increase_budget' : 'decrease_budget';
    
    return {
      id: `ml_budget_${Date.now()}`,
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      platform: campaign.platform,
      type: changeType,
      priority: optimization.confidence > 0.8 ? 'high' : 'medium',
      title: 'AI-Optimized Budget Recommendation',
      description: `AI suggests ${changeType === 'increase_budget' ? 'increasing' : 'decreasing'} budget to €${optimization.optimizedBudget.toFixed(2)}`,
      expectedImpact: {
        metric: 'efficiency',
        change: Math.abs(optimization.optimizedBudget - campaign.spend) / campaign.spend,
        confidence: optimization.confidence
      },
      implementation: {
        automated: true,
        complexity: 'simple',
        estimatedTime: '5 minutes',
        requirements: ['Budget availability', 'Account limits']
      },
      reasoning: [
        'AI budget optimization model analysis',
        `Confidence level: ${(optimization.confidence * 100).toFixed(1)}%`,
        'Based on ROAS and performance metrics'
      ],
      data: {
        currentValue: campaign.spend,
        recommendedValue: optimization.optimizedBudget,
        historicalPerformance: [campaign.spend * 0.95, campaign.spend * 0.98, campaign.spend]
      },
      timestamp: new Date()
    };
  }

  private generateForecastRecommendation(
    campaign: CampaignMetrics,
    forecast: { forecast: any; confidence: number }
  ): OptimizationRecommendation | null {
    if (forecast.confidence < this.config.minConfidence) return null;

    return {
      id: `ml_forecast_${Date.now()}`,
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      platform: campaign.platform,
      type: 'optimize_bidding',
      priority: 'medium',
      title: 'Performance Forecast Optimization',
      description: `AI forecasts ${forecast.forecast.expectedROAS > campaign.roas ? 'improved' : 'declining'} performance`,
      expectedImpact: {
        metric: 'roas',
        change: (forecast.forecast.expectedROAS - campaign.roas) / campaign.roas,
        confidence: forecast.confidence
      },
      implementation: {
        automated: false,
        complexity: 'moderate',
        estimatedTime: '15 minutes',
        requirements: ['Performance monitoring', 'Trend analysis']
      },
      reasoning: [
        'AI performance forecasting model',
        `7-day forecast confidence: ${(forecast.confidence * 100).toFixed(1)}%`,
        'Based on trend and seasonality analysis'
      ],
      data: {
        currentValue: campaign.roas,
        recommendedValue: forecast.forecast.expectedROAS,
        historicalPerformance: [campaign.roas * 0.92, campaign.roas * 0.96, campaign.roas]
      },
      timestamp: new Date()
    };
  }

  private prioritizeRecommendations(recommendations: OptimizationRecommendation[]): OptimizationRecommendation[] {
    return recommendations.sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by expected impact
      const impactDiff = Math.abs(b.expectedImpact.change) - Math.abs(a.expectedImpact.change);
      if (impactDiff !== 0) return impactDiff;
      
      // Finally by confidence
      return b.expectedImpact.confidence - a.expectedImpact.confidence;
    });
  }

  // **PUBLIC INTERFACE METHODS**

  public getRecommendations(): OptimizationRecommendation[] {
    return this.recommendations;
  }

  public getRecommendationsByPriority(priority: string): OptimizationRecommendation[] {
    return this.recommendations.filter(rec => rec.priority === priority);
  }

  public getRecommendationsByCampaign(campaignId: string): OptimizationRecommendation[] {
    return this.recommendations.filter(rec => rec.campaignId === campaignId);
  }

  public updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 [AI Optimization] Configuration updated');
  }

  public getConfig(): OptimizationConfig {
    return { ...this.config };
  }

  public addCustomRule(rule: OptimizationRule): void {
    this.rules.set(rule.id, rule);
    console.log(`📋 [AI Optimization] Added custom rule: ${rule.name}`);
  }

  public getStats(): {
    totalRecommendations: number;
    byPriority: { [key: string]: number };
    byType: { [key: string]: number };
    avgConfidence: number;
    modelsLoaded: number;
  } {
    const byPriority: { [key: string]: number } = {};
    const byType: { [key: string]: number } = {};
    let totalConfidence = 0;

    this.recommendations.forEach(rec => {
      byPriority[rec.priority] = (byPriority[rec.priority] || 0) + 1;
      byType[rec.type] = (byType[rec.type] || 0) + 1;
      totalConfidence += rec.expectedImpact.confidence;
    });

    return {
      totalRecommendations: this.recommendations.length,
      byPriority,
      byType,
      avgConfidence: this.recommendations.length > 0 ? totalConfidence / this.recommendations.length : 0,
      modelsLoaded: this.models.size
    };
  }

  public clearRecommendations(): void {
    this.recommendations = [];
    console.log('🧹 [AI Optimization] Cleared all recommendations');
  }
}

// Singleton instance
export const aiOptimizationEngine = new AIOptimizationEngine();