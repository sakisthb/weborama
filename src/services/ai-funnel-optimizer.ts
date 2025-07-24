// AI-Powered Funnel Optimization Service
// Generates intelligent recommendations and insights for funnel optimization

import {
  EnhancedFunnelStage,
  AIRecommendation,
  BottleneckInsight,
  BudgetOptimizationSuggestion,
  PlatformType,
  AttributionAnalysis,
  CustomerJourney,
  CompetitiveInsight,
  PlatformBudgetAllocation
} from '@/lib/enhanced-funnel-intelligence';

export class AIFunnelOptimizer {
  
  /**
   * Generate comprehensive AI recommendations for all funnel stages
   */
  static generateFunnelRecommendations(
    stages: {
      awareness: EnhancedFunnelStage;
      interest: EnhancedFunnelStage;
      desire: EnhancedFunnelStage;
      action: EnhancedFunnelStage;
    },
    attribution?: AttributionAnalysis,
    journeys?: CustomerJourney[]
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Stage-specific recommendations
    recommendations.push(...this.generateStageRecommendations(stages.awareness, 'awareness'));
    recommendations.push(...this.generateStageRecommendations(stages.interest, 'interest'));
    recommendations.push(...this.generateStageRecommendations(stages.desire, 'desire'));
    recommendations.push(...this.generateStageRecommendations(stages.action, 'action'));
    
    // Cross-platform optimization recommendations
    if (attribution) {
      recommendations.push(...this.generateAttributionRecommendations(attribution));
    }
    
    // Customer journey optimization recommendations
    if (journeys && journeys.length > 0) {
      recommendations.push(...this.generateJourneyRecommendations(journeys));
    }
    
    // Global funnel optimization recommendations
    recommendations.push(...this.generateGlobalOptimizationRecommendations(stages));
    
    // Sort by priority and confidence
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
  }

  /**
   * Generate stage-specific recommendations
   */
  private static generateStageRecommendations(
    stage: EnhancedFunnelStage,
    stageType: 'awareness' | 'interest' | 'desire' | 'action'
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Performance-based recommendations
    if (stage.healthScore < 50) {
      recommendations.push(this.createCriticalPerformanceRecommendation(stage, stageType));
    }
    
    // Platform optimization recommendations
    const platformRecommendation = this.generatePlatformOptimizationRecommendation(stage, stageType);
    if (platformRecommendation) {
      recommendations.push(platformRecommendation);
    }
    
    // Metric-specific recommendations
    if (stage.metrics.conversionRate < this.getBenchmarkConversionRate(stageType)) {
      recommendations.push(this.createConversionRateRecommendation(stage, stageType));
    }
    
    if (stage.metrics.roas < 2.0) {
      recommendations.push(this.createROASOptimizationRecommendation(stage, stageType));
    }
    
    if (stage.metrics.costPerConversion > this.getBenchmarkCost(stageType)) {
      recommendations.push(this.createCostOptimizationRecommendation(stage, stageType));
    }
    
    return recommendations;
  }

  /**
   * Create critical performance recommendation
   */
  private static createCriticalPerformanceRecommendation(
    stage: EnhancedFunnelStage,
    stageType: string
  ): AIRecommendation {
    return {
      id: `critical_${stageType}_performance`,
      type: 'alert',
      priority: 'critical',
      title: `Critical ${stageType.charAt(0).toUpperCase() + stageType.slice(1)} Stage Performance`,
      message: `${stageType.charAt(0).toUpperCase() + stageType.slice(1)} stage health score of ${stage.healthScore}/100 requires immediate attention`,
      impact: `+€${Math.round(stage.metrics.spend * 0.4).toLocaleString()} potential monthly recovery`,
      confidence: 0.95,
      stage: stageType as any,
      actions: [
        'Pause underperforming campaigns immediately',
        'Reallocate budget to top-performing platforms',
        'Implement emergency optimization measures',
        'Review and update targeting parameters',
        'A/B test new creative assets urgently'
      ],
      estimatedROI: 2.8,
      timeframe: '24-48 hours'
    };
  }

  /**
   * Generate platform optimization recommendation
   */
  private static generatePlatformOptimizationRecommendation(
    stage: EnhancedFunnelStage,
    stageType: string
  ): AIRecommendation | null {
    const platformEntries = Object.entries(stage.platformBreakdown);
    const topPlatform = platformEntries.reduce((max, current) => 
      current[1].efficiency > max[1].efficiency ? current : max
    );
    const worstPlatform = platformEntries.reduce((min, current) =>
      current[1].efficiency < min[1].efficiency ? current : min
    );
    
    if (topPlatform[1].efficiency - worstPlatform[1].efficiency > 20) {
      return {
        id: `platform_optimization_${stageType}`,
        type: 'optimization',
        priority: 'high',
        title: `Optimize Platform Mix for ${stageType.charAt(0).toUpperCase() + stageType.slice(1)} Stage`,
        message: `${topPlatform[0].charAt(0).toUpperCase() + topPlatform[0].slice(1)} outperforms ${worstPlatform[0]} by ${Math.round(topPlatform[1].efficiency - worstPlatform[1].efficiency)}% in ${stageType} stage`,
        impact: `+€${Math.round(stage.metrics.spend * 0.25).toLocaleString()} monthly improvement`,
        confidence: 0.87,
        platform: topPlatform[0] as PlatformType,
        stage: stageType as any,
        actions: [
          `Increase ${topPlatform[0]} budget by 30%`,
          `Reduce ${worstPlatform[0]} budget by 20%`,
          `Test ${topPlatform[0]} best practices on other platforms`,
          'Analyze high-performing creative elements',
          'Implement cross-platform audience sharing'
        ],
        estimatedROI: 2.1,
        timeframe: '1-2 weeks'
      };
    }
    
    return null;
  }

  /**
   * Create conversion rate optimization recommendation
   */
  private static createConversionRateRecommendation(
    stage: EnhancedFunnelStage,
    stageType: string
  ): AIRecommendation {
    const benchmark = this.getBenchmarkConversionRate(stageType);
    const improvement = benchmark - stage.metrics.conversionRate;
    
    return {
      id: `conversion_rate_${stageType}`,
      type: 'opportunity',
      priority: improvement > 3 ? 'high' : 'medium',
      title: `Improve ${stageType.charAt(0).toUpperCase() + stageType.slice(1)} Conversion Rate`,
      message: `Current conversion rate of ${stage.metrics.conversionRate.toFixed(2)}% is ${improvement.toFixed(1)}pp below industry benchmark`,
      impact: `+${Math.round(stage.metrics.impressions * (improvement / 100)).toLocaleString()} additional conversions`,
      confidence: 0.78,
      stage: stageType as any,
      actions: this.getConversionRateActions(stageType),
      estimatedROI: 1.9,
      timeframe: '2-4 weeks'
    };
  }

  /**
   * Create ROAS optimization recommendation
   */
  private static createROASOptimizationRecommendation(
    stage: EnhancedFunnelStage,
    stageType: string
  ): AIRecommendation {
    return {
      id: `roas_optimization_${stageType}`,
      type: 'optimization',
      priority: stage.metrics.roas < 1 ? 'critical' : 'high',
      title: `Optimize ${stageType.charAt(0).toUpperCase() + stageType.slice(1)} ROAS`,
      message: `Current ROAS of ${stage.metrics.roas.toFixed(2)}x is below target of 2.0x`,
      impact: `+€${Math.round(stage.metrics.spend * 0.3).toLocaleString()} monthly revenue improvement`,
      confidence: 0.82,
      stage: stageType as any,
      actions: [
        'Optimize bidding strategies for profitability',
        'Focus budget on high-LTV customer segments',
        'Implement value-based bidding',
        'Review and adjust target CPA',
        'Test higher-intent keyword targeting'
      ],
      estimatedROI: 2.5,
      timeframe: '1-3 weeks'
    };
  }

  /**
   * Create cost optimization recommendation
   */
  private static createCostOptimizationRecommendation(
    stage: EnhancedFunnelStage,
    stageType: string
  ): AIRecommendation {
    const benchmark = this.getBenchmarkCost(stageType);
    const overspend = stage.metrics.costPerConversion - benchmark;
    
    return {
      id: `cost_optimization_${stageType}`,
      type: 'budget',
      priority: 'medium',
      title: `Reduce ${stageType.charAt(0).toUpperCase() + stageType.slice(1)} Stage Costs`,
      message: `Cost per conversion of €${stage.metrics.costPerConversion.toFixed(2)} is €${overspend.toFixed(2)} above optimal`,
      impact: `-€${Math.round(stage.metrics.conversions * overspend).toLocaleString()} monthly savings`,
      confidence: 0.73,
      stage: stageType as any,
      actions: [
        'Implement automated bid adjustments',
        'Exclude low-performing placements',
        'Optimize audience targeting precision',
        'Test lower-cost creative formats',
        'Implement negative keyword strategies'
      ],
      estimatedROI: 1.6,
      timeframe: '1-2 weeks'
    };
  }

  /**
   * Generate attribution-based recommendations
   */
  private static generateAttributionRecommendations(attribution: AttributionAnalysis): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Platform synergy recommendations
    for (const synergy of attribution.crossPlatformSynergy) {
      if (synergy.lift > 0.2) {
        recommendations.push({
          id: `synergy_${synergy.platforms.join('_')}`,
          type: 'optimization',
          priority: 'high',
          title: `Leverage ${synergy.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' + ')} Synergy`,
          message: synergy.description,
          impact: `+${(synergy.lift * 100).toFixed(0)}% performance lift`,
          confidence: 0.85,
          actions: [
            synergy.recommendation,
            'Implement cross-platform audience sharing',
            'Coordinate campaign timing and messaging',
            'Track cross-platform customer journeys'
          ],
          estimatedROI: 1 + synergy.lift,
          timeframe: '2-3 weeks'
        });
      }
    }
    
    // Attribution model recommendations
    const bestModel = Object.entries(attribution.models)
      .sort(([,a], [,b]) => b.confidence - a.confidence)[0];
    
    if (bestModel[1].confidence > 0.8) {
      recommendations.push({
        id: 'attribution_model_optimization',
        type: 'opportunity',
        priority: 'medium',
        title: 'Optimize Attribution Modeling',
        message: `${bestModel[0]} attribution model shows highest confidence at ${(bestModel[1].confidence * 100).toFixed(0)}%`,
        impact: `More accurate budget allocation across €${bestModel[1].totalAttributedValue.toLocaleString()} in attributed revenue`,
        confidence: bestModel[1].confidence,
        actions: [
          `Implement ${bestModel[0]} attribution model`,
          'Update conversion tracking and measurement',
          'Realign budgets based on true platform contribution',
          'Educate stakeholders on attribution insights'
        ],
        estimatedROI: 1.3,
        timeframe: '2-4 weeks'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate journey-based recommendations
   */
  private static generateJourneyRecommendations(journeys: CustomerJourney[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Find most valuable journey patterns
    const avgJourneyValue = journeys.reduce((sum, j) => sum + j.totalValue, 0) / journeys.length;
    const highValueJourneys = journeys.filter(j => j.totalValue > avgJourneyValue * 1.5);
    
    if (highValueJourneys.length > 0) {
      const commonPattern = this.findMostCommonJourneyPattern(highValueJourneys);
      
      recommendations.push({
        id: 'high_value_journey_optimization',
        type: 'opportunity',
        priority: 'high',
        title: 'Scale High-Value Customer Journeys',
        message: `${highValueJourneys.length} journeys with ${commonPattern} pattern generate ${((highValueJourneys.length / journeys.length) * 100).toFixed(0)}% of total value`,
        impact: `+€${Math.round((highValueJourneys.reduce((sum, j) => sum + j.totalValue, 0) * 0.3)).toLocaleString()} potential monthly increase`,
        confidence: 0.81,
        actions: [
          `Increase investment in ${commonPattern} sequence`,
          'Create lookalike audiences based on high-value journeys',
          'Optimize touchpoint timing and messaging',
          'Implement journey-specific attribution weighting'
        ],
        estimatedROI: 2.2,
        timeframe: '3-4 weeks'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate global funnel optimization recommendations
   */
  private static generateGlobalOptimizationRecommendations(stages: any): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Overall funnel health assessment
    const overallHealth = Object.values(stages).reduce(
      (sum: number, stage: any) => sum + stage.healthScore, 0
    ) / 4;
    
    if (overallHealth < 70) {
      recommendations.push({
        id: 'overall_funnel_optimization',
        type: 'optimization',
        priority: 'high',
        title: 'Comprehensive Funnel Overhaul Needed',
        message: `Overall funnel health score of ${overallHealth.toFixed(0)}/100 indicates systematic optimization opportunities`,
        impact: `+€${Math.round(Object.values(stages).reduce((sum: number, stage: any) => sum + stage.metrics.spend, 0) * 0.35).toLocaleString()} potential monthly improvement`,
        confidence: 0.88,
        actions: [
          'Implement end-to-end funnel audit',
          'Redesign customer journey experience',
          'Coordinate cross-platform messaging',
          'Implement advanced attribution tracking',
          'Launch comprehensive A/B testing program'
        ],
        estimatedROI: 2.7,
        timeframe: '6-8 weeks'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate budget optimization suggestions
   */
  static generateBudgetOptimization(
    currentAllocation: PlatformBudgetAllocation[],
    stages: any,
    attribution?: AttributionAnalysis
  ): BudgetOptimizationSuggestion {
    const totalBudget = currentAllocation.reduce((sum, p) => sum + p.currentBudget, 0);
    
    // Calculate optimal allocation based on efficiency and attribution
    const recommendedAllocation = this.calculateOptimalBudgetAllocation(
      currentAllocation,
      stages,
      attribution,
      totalBudget
    );
    
    const expectedImprovement = this.calculateBudgetOptimizationImpact(
      currentAllocation,
      recommendedAllocation
    );
    
    return {
      currentAllocation,
      recommendedAllocation,
      expectedImprovement,
      reasoning: this.generateBudgetOptimizationReasoning(recommendedAllocation),
      confidence: 0.84,
      timeframe: '2-4 weeks',
      risks: [
        'Short-term performance fluctuations during transition',
        'Platform-specific learning periods',
        'Seasonal variations may affect results'
      ]
    };
  }

  /**
   * Calculate optimal budget allocation
   */
  private static calculateOptimalBudgetAllocation(
    current: PlatformBudgetAllocation[],
    stages: any,
    attribution: AttributionAnalysis | undefined,
    totalBudget: number
  ): PlatformBudgetAllocation[] {
    const recommended = [...current];
    
    // Calculate efficiency scores for each platform across all stages
    const platformEfficiencies = current.map(platform => {
      const avgEfficiency = Object.values(stages).reduce((sum: number, stage: any) => {
        return sum + (stage.platformBreakdown[platform.platform]?.efficiency || 50);
      }, 0) / 4;
      
      // Attribution bonus
      let attributionBonus = 0;
      if (attribution) {
        const contribution = attribution.platformContribution.find(
          p => p.platform === platform.platform
        );
        if (contribution) {
          attributionBonus = contribution.contribution * 0.5; // 0.5x weight
        }
      }
      
      return {
        platform: platform.platform,
        totalEfficiency: avgEfficiency + attributionBonus
      };
    });
    
    // Normalize and redistribute budget
    const totalEfficiency = platformEfficiencies.reduce((sum, p) => sum + p.totalEfficiency, 0);
    
    return recommended.map((platform, index) => {
      const efficiency = platformEfficiencies[index].totalEfficiency;
      const newPercent = Math.round((efficiency / totalEfficiency) * 100);
      const newBudget = Math.round((newPercent / 100) * totalBudget);
      
      return {
        ...platform,
        recommendedBudget: newBudget,
        recommendedPercent: newPercent,
        reasoning: this.generatePlatformBudgetReasoning(platform.platform, efficiency)
      };
    });
  }

  /**
   * Helper methods
   */
  private static getBenchmarkConversionRate(stageType: string): number {
    const benchmarks = {
      awareness: 1.5,
      interest: 3.0,
      desire: 8.0,
      action: 15.0
    };
    return benchmarks[stageType as keyof typeof benchmarks] || 5.0;
  }

  private static getBenchmarkCost(stageType: string): number {
    const benchmarks = {
      awareness: 25,
      interest: 35,
      desire: 45,
      action: 60
    };
    return benchmarks[stageType as keyof typeof benchmarks] || 40;
  }

  private static getConversionRateActions(stageType: string): string[] {
    const actionMap = {
      awareness: [
        'Test more compelling brand messaging',
        'Optimize ad creative for engagement',
        'Refine audience targeting precision',
        'A/B test different value propositions'
      ],
      interest: [
        'Improve landing page relevance',
        'Test interactive content formats',
        'Implement retargeting campaigns',
        'Optimize for mobile experience'
      ],
      desire: [
        'Add social proof and testimonials',
        'Implement urgency and scarcity',
        'Test different price points',
        'Optimize checkout process flow'
      ],
      action: [
        'Streamline purchase process',
        'Test payment options and security',
        'Implement cart abandonment recovery',
        'Add live chat support'
      ]
    };
    
    return actionMap[stageType as keyof typeof actionMap] || actionMap.interest;
  }

  private static findMostCommonJourneyPattern(journeys: CustomerJourney[]): string {
    // Simplified pattern detection
    const patterns = journeys.map(j => 
      j.touchPoints.map(tp => tp.platform).join(' → ')
    );
    
    const patternCounts = patterns.reduce((acc: any, pattern) => {
      acc[pattern] = (acc[pattern] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(patternCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Multi-Platform';
  }

  private static calculateBudgetOptimizationImpact(
    current: PlatformBudgetAllocation[],
    recommended: PlatformBudgetAllocation[]
  ) {
    return {
      revenue: Math.round(current.reduce((sum, p) => sum + p.currentBudget, 0) * 0.15),
      roas: 0.12,
      conversions: Math.round(current.reduce((sum, p) => sum + p.currentBudget, 0) * 0.08 / 50) // Assume $50 per conversion
    };
  }

  private static generateBudgetOptimizationReasoning(
    recommended: PlatformBudgetAllocation[]
  ): string {
    const topPlatform = recommended.sort((a, b) => b.recommendedPercent - a.recommendedPercent)[0];
    return `${topPlatform.platform.charAt(0).toUpperCase() + topPlatform.platform.slice(1)} shows strongest cross-platform synergy and attribution contribution, warranting increased investment.`;
  }

  private static generatePlatformBudgetReasoning(platform: string, efficiency: number): string {
    if (efficiency > 80) return 'Highest performance across funnel stages';
    if (efficiency > 60) return 'Strong performance with growth potential';
    return 'Needs optimization or reduced allocation';
  }
}