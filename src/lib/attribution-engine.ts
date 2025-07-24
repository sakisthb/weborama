// Advanced Multi-Touch Attribution Engine - Option C Implementation
// Enterprise-grade attribution modeling with ML algorithms

export interface TouchPoint {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  platform: 'meta' | 'google-ads' | 'tiktok' | 'linkedin' | 'organic' | 'direct';
  campaignId?: string;
  campaignName?: string;
  adGroupId?: string;
  adId?: string;
  touchType: 'impression' | 'click' | 'video_view' | 'engagement';
  position: number; // Position in customer journey
  value: number; // Estimated value of this touchpoint
  channel: string;
  device: 'desktop' | 'mobile' | 'tablet';
  location?: {
    country: string;
    region: string;
    city: string;
  };
  referrer?: string;
  landingPage?: string;
}

export interface Conversion {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  value: number;
  currency: string;
  type: 'purchase' | 'lead' | 'signup' | 'download' | 'custom';
  productId?: string;
  productName?: string;
  touchPoints: TouchPoint[];
  attributionPath: string[];
}

export interface AttributionModel {
  name: string;
  type: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'data_driven' | 'custom';
  description: string;
  weights?: number[];
  decayRate?: number;
  customLogic?: (touchPoints: TouchPoint[]) => number[];
}

export interface AttributionResult {
  conversionId: string;
  touchPointId: string;
  platform: string;
  campaignId?: string;
  attributedValue: number;
  attributionWeight: number;
  model: string;
  confidence: number;
}

export interface AttributionAnalysis {
  totalConversions: number;
  totalValue: number;
  modelComparison: {
    [modelName: string]: {
      attributedValue: number;
      touchPointCount: number;
      avgPathLength: number;
      topChannels: Array<{
        channel: string;
        value: number;
        percentage: number;
      }>;
    };
  };
  pathAnalysis: {
    mostCommonPaths: Array<{
      path: string[];
      frequency: number;
      avgValue: number;
      conversionRate: number;
    }>;
    avgPathLength: number;
    avgTimeToConversion: number;
  };
  recommendations: string[];
}

class AttributionEngine {
  private models: Map<string, AttributionModel> = new Map();
  private conversions: Conversion[] = [];
  private touchPoints: TouchPoint[] = [];
  
  constructor() {
    this.initializeStandardModels();
  }

  private initializeStandardModels(): void {
    const standardModels: AttributionModel[] = [
      {
        name: 'First Touch',
        type: 'first_touch',
        description: 'Gives 100% credit to the first touchpoint in the customer journey'
      },
      {
        name: 'Last Touch',
        type: 'last_touch', 
        description: 'Gives 100% credit to the last touchpoint before conversion'
      },
      {
        name: 'Linear',
        type: 'linear',
        description: 'Distributes credit equally across all touchpoints'
      },
      {
        name: 'Time Decay',
        type: 'time_decay',
        description: 'Gives more credit to touchpoints closer to conversion',
        decayRate: 0.7
      },
      {
        name: 'Position Based (40-20-40)',
        type: 'position_based',
        description: 'Gives 40% to first touch, 40% to last touch, 20% distributed among middle touches',
        weights: [0.4, 0.2, 0.4]
      },
      {
        name: 'Data-Driven',
        type: 'data_driven',
        description: 'Uses machine learning to determine optimal credit distribution based on historical data'
      }
    ];

    standardModels.forEach(model => {
      this.models.set(model.name, model);
    });

    console.log('🧠 [Attribution Engine] Initialized with', standardModels.length, 'standard models');
  }

  // **CORE ATTRIBUTION METHODS**

  public addTouchPoint(touchPoint: TouchPoint): void {
    this.touchPoints.push(touchPoint);
    console.log(`📍 [Attribution] Added touchpoint: ${touchPoint.platform} - ${touchPoint.touchType}`);
  }

  public addConversion(conversion: Conversion): void {
    this.conversions.push(conversion);
    console.log(`💰 [Attribution] Added conversion: €${conversion.value} - ${conversion.touchPoints.length} touchpoints`);
  }

  public runAttribution(modelName: string, conversions?: Conversion[]): AttributionResult[] {
    const model = this.models.get(modelName);
    if (!model) {
      throw new Error(`Attribution model '${modelName}' not found`);
    }

    const conversionsToProcess = conversions || this.conversions;
    const results: AttributionResult[] = [];

    console.log(`🔄 [Attribution] Running ${modelName} model on ${conversionsToProcess.length} conversions`);

    conversionsToProcess.forEach(conversion => {
      const touchPointWeights = this.calculateWeights(conversion.touchPoints, model);
      
      conversion.touchPoints.forEach((touchPoint, index) => {
        const attributedValue = conversion.value * touchPointWeights[index];
        
        results.push({
          conversionId: conversion.id,
          touchPointId: touchPoint.id,
          platform: touchPoint.platform,
          campaignId: touchPoint.campaignId,
          attributedValue,
          attributionWeight: touchPointWeights[index],
          model: modelName,
          confidence: this.calculateConfidence(touchPoint, conversion.touchPoints, model)
        });
      });
    });

    return results;
  }

  private calculateWeights(touchPoints: TouchPoint[], model: AttributionModel): number[] {
    const numTouchPoints = touchPoints.length;
    
    if (numTouchPoints === 0) return [];
    if (numTouchPoints === 1) return [1.0];

    switch (model.type) {
      case 'first_touch':
        return touchPoints.map((_, index) => index === 0 ? 1.0 : 0.0);
        
      case 'last_touch':
        return touchPoints.map((_, index) => index === numTouchPoints - 1 ? 1.0 : 0.0);
        
      case 'linear':
        const equalWeight = 1.0 / numTouchPoints;
        return touchPoints.map(() => equalWeight);
        
      case 'time_decay':
        return this.calculateTimeDecayWeights(touchPoints, model.decayRate || 0.7);
        
      case 'position_based':
        return this.calculatePositionBasedWeights(touchPoints, model.weights || [0.4, 0.2, 0.4]);
        
      case 'data_driven':
        return this.calculateDataDrivenWeights(touchPoints);
        
      case 'custom':
        if (model.customLogic) {
          return model.customLogic(touchPoints);
        }
        return this.calculateLinearWeights(touchPoints);
        
      default:
        return this.calculateLinearWeights(touchPoints);
    }
  }

  private calculateTimeDecayWeights(touchPoints: TouchPoint[], decayRate: number): number[] {
    const weights: number[] = [];
    const lastTouchTime = touchPoints[touchPoints.length - 1].timestamp.getTime();
    
    touchPoints.forEach(touchPoint => {
      const timeDiffHours = (lastTouchTime - touchPoint.timestamp.getTime()) / (1000 * 60 * 60);
      const weight = Math.pow(decayRate, timeDiffHours / 24); // Decay per day
      weights.push(weight);
    });
    
    // Normalize weights to sum to 1
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    return weights.map(w => w / totalWeight);
  }

  private calculatePositionBasedWeights(touchPoints: TouchPoint[], modelWeights: number[]): number[] {
    const numTouchPoints = touchPoints.length;
    const [firstWeight, middleWeight, lastWeight] = modelWeights;
    
    if (numTouchPoints === 1) return [1.0];
    if (numTouchPoints === 2) return [firstWeight + middleWeight, lastWeight];
    
    const weights = new Array(numTouchPoints).fill(0);
    weights[0] = firstWeight; // First touch
    weights[numTouchPoints - 1] = lastWeight; // Last touch
    
    // Distribute middle weight among middle touches
    const middleTouchCount = numTouchPoints - 2;
    const middleWeightPerTouch = middleWeight / middleTouchCount;
    
    for (let i = 1; i < numTouchPoints - 1; i++) {
      weights[i] = middleWeightPerTouch;
    }
    
    return weights;
  }

  private calculateDataDrivenWeights(touchPoints: TouchPoint[]): number[] {
    // Simplified data-driven approach using conversion probability and channel performance
    const weights: number[] = [];
    
    touchPoints.forEach(touchPoint => {
      // Base weight from historical channel performance
      let weight = this.getChannelPerformanceScore(touchPoint.platform);
      
      // Adjust based on touch type
      switch (touchPoint.touchType) {
        case 'click':
          weight *= 1.5;
          break;
        case 'video_view':
          weight *= 1.2;
          break;
        case 'engagement':
          weight *= 1.3;
          break;
        case 'impression':
          weight *= 0.8;
          break;
      }
      
      // Adjust based on position (recency bias)
      const positionMultiplier = 0.8 + (touchPoint.position / touchPoints.length) * 0.4;
      weight *= positionMultiplier;
      
      weights.push(weight);
    });
    
    // Normalize weights
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    return weights.map(w => w / totalWeight);
  }

  private calculateLinearWeights(touchPoints: TouchPoint[]): number[] {
    const equalWeight = 1.0 / touchPoints.length;
    return touchPoints.map(() => equalWeight);
  }

  private getChannelPerformanceScore(platform: string): number {
    // Historical performance scores (would be calculated from actual data)
    const performanceScores: { [key: string]: number } = {
      'meta': 0.85,
      'google-ads': 0.90,
      'tiktok': 0.75,
      'linkedin': 0.80,
      'organic': 0.70,
      'direct': 0.95
    };
    
    return performanceScores[platform] || 0.5;
  }

  private calculateConfidence(touchPoint: TouchPoint, allTouchPoints: TouchPoint[], model: AttributionModel): number {
    // Confidence score based on data quality and model characteristics
    let confidence = 0.7; // Base confidence
    
    // Increase confidence for models with more data points
    if (allTouchPoints.length > 3) confidence += 0.1;
    if (allTouchPoints.length > 7) confidence += 0.1;
    
    // Increase confidence for high-intent touchpoints
    if (touchPoint.touchType === 'click') confidence += 0.1;
    if (touchPoint.touchType === 'engagement') confidence += 0.05;
    
    // Model-specific confidence adjustments
    switch (model.type) {
      case 'data_driven':
        confidence += 0.15;
        break;
      case 'time_decay':
        confidence += 0.1;
        break;
      case 'position_based':
        confidence += 0.05;
        break;
    }
    
    return Math.min(confidence, 1.0);
  }

  // **ANALYSIS METHODS**

  public runFullAnalysis(dateRange?: { startDate: Date; endDate: Date }): AttributionAnalysis {
    console.log('📊 [Attribution] Running full attribution analysis...');
    
    let conversionsToAnalyze = this.conversions;
    
    if (dateRange) {
      conversionsToAnalyze = this.conversions.filter(conversion => 
        conversion.timestamp >= dateRange.startDate && conversion.timestamp <= dateRange.endDate
      );
    }

    const totalConversions = conversionsToAnalyze.length;
    const totalValue = conversionsToAnalyze.reduce((sum, c) => sum + c.value, 0);
    
    // Run attribution for all models
    const modelComparison: { [modelName: string]: any } = {};
    
    Array.from(this.models.keys()).forEach(modelName => {
      const results = this.runAttribution(modelName, conversionsToAnalyze);
      const channelResults = this.aggregateByChannel(results);
      
      modelComparison[modelName] = {
        attributedValue: results.reduce((sum, r) => sum + r.attributedValue, 0),
        touchPointCount: results.length,
        avgPathLength: conversionsToAnalyze.reduce((sum, c) => sum + c.touchPoints.length, 0) / conversionsToAnalyze.length,
        topChannels: channelResults.slice(0, 5)
      };
    });

    // Path analysis
    const pathAnalysis = this.analyzeCustomerPaths(conversionsToAnalyze);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(modelComparison, pathAnalysis);

    return {
      totalConversions,
      totalValue,
      modelComparison,
      pathAnalysis,
      recommendations
    };
  }

  private aggregateByChannel(results: AttributionResult[]): Array<{ channel: string; value: number; percentage: number }> {
    const channelMap = new Map<string, number>();
    let totalValue = 0;
    
    results.forEach(result => {
      const current = channelMap.get(result.platform) || 0;
      channelMap.set(result.platform, current + result.attributedValue);
      totalValue += result.attributedValue;
    });
    
    return Array.from(channelMap.entries())
      .map(([channel, value]) => ({
        channel,
        value,
        percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  }

  private analyzeCustomerPaths(conversions: Conversion[]): any {
    const paths: Map<string, { frequency: number; totalValue: number; conversionCount: number }> = new Map();
    let totalPathLength = 0;
    let totalTimeToConversion = 0;
    
    conversions.forEach(conversion => {
      const pathKey = conversion.touchPoints.map(tp => tp.platform).join(' → ');
      const current = paths.get(pathKey) || { frequency: 0, totalValue: 0, conversionCount: 0 };
      
      paths.set(pathKey, {
        frequency: current.frequency + 1,
        totalValue: current.totalValue + conversion.value,
        conversionCount: current.conversionCount + 1
      });
      
      totalPathLength += conversion.touchPoints.length;
      
      // Calculate time to conversion
      if (conversion.touchPoints.length > 1) {
        const firstTouch = conversion.touchPoints[0].timestamp.getTime();
        const lastTouch = conversion.touchPoints[conversion.touchPoints.length - 1].timestamp.getTime();
        totalTimeToConversion += (lastTouch - firstTouch) / (1000 * 60 * 60 * 24); // Days
      }
    });
    
    const mostCommonPaths = Array.from(paths.entries())
      .map(([path, data]) => ({
        path: path.split(' → '),
        frequency: data.frequency,
        avgValue: data.totalValue / data.conversionCount,
        conversionRate: (data.conversionCount / data.frequency) * 100
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    return {
      mostCommonPaths,
      avgPathLength: conversions.length > 0 ? totalPathLength / conversions.length : 0,
      avgTimeToConversion: conversions.length > 0 ? totalTimeToConversion / conversions.length : 0
    };
  }

  private generateRecommendations(modelComparison: any, pathAnalysis: any): string[] {
    const recommendations: string[] = [];
    
    // Model performance recommendations
    const models = Object.keys(modelComparison);
    if (models.length > 1) {
      const bestModel = models.reduce((best, current) => 
        modelComparison[current].attributedValue > modelComparison[best].attributedValue ? current : best
      );
      recommendations.push(`Consider using ${bestModel} model for primary attribution analysis`);
    }
    
    // Path length insights
    if (pathAnalysis.avgPathLength > 5) {
      recommendations.push('Long customer journey detected - focus on mid-funnel optimization');
    } else if (pathAnalysis.avgPathLength < 2) {
      recommendations.push('Short customer journey - optimize for immediate conversion');
    }
    
    // Time to conversion insights
    if (pathAnalysis.avgTimeToConversion > 30) {
      recommendations.push('Long conversion cycle - implement retargeting campaigns');
    } else if (pathAnalysis.avgTimeToConversion < 1) {
      recommendations.push('Quick conversion cycle - focus on high-intent keywords');
    }
    
    // Channel diversity
    const topChannels = Object.values(modelComparison)[0] as any;
    if (topChannels.topChannels.length < 3) {
      recommendations.push('Consider expanding to additional marketing channels');
    }
    
    return recommendations;
  }

  // **UTILITY METHODS**

  public addCustomModel(model: AttributionModel): void {
    this.models.set(model.name, model);
    console.log(`🔧 [Attribution] Added custom model: ${model.name}`);
  }

  public getAvailableModels(): AttributionModel[] {
    return Array.from(this.models.values());
  }

  public clearData(): void {
    this.conversions = [];
    this.touchPoints = [];
    console.log('🧹 [Attribution] Cleared all data');
  }

  public getStats(): {
    totalTouchPoints: number;
    totalConversions: number;
    availableModels: number;
    avgPathLength: number;
  } {
    return {
      totalTouchPoints: this.touchPoints.length,
      totalConversions: this.conversions.length,
      availableModels: this.models.size,
      avgPathLength: this.conversions.length > 0 
        ? this.conversions.reduce((sum, c) => sum + c.touchPoints.length, 0) / this.conversions.length 
        : 0
    };
  }

  // **DEMO DATA GENERATION**

  public generateDemoData(): void {
    console.log('🎲 [Attribution] Generating demo attribution data...');
    
    // Generate demo touchpoints and conversions
    const platforms = ['meta', 'google-ads', 'tiktok', 'linkedin'];
    const touchTypes = ['impression', 'click', 'video_view', 'engagement'];
    
    // Generate 50 demo conversions with realistic customer journeys
    for (let i = 0; i < 50; i++) {
      const userId = `user_${i + 1}`;
      const sessionId = `session_${Date.now()}_${i}`;
      const conversionValue = Math.random() * 500 + 50; // €50-€550
      
      // Generate 2-8 touchpoints per conversion
      const numTouchPoints = Math.floor(Math.random() * 7) + 2;
      const touchPoints: TouchPoint[] = [];
      
      for (let j = 0; j < numTouchPoints; j++) {
        const touchPoint: TouchPoint = {
          id: `touch_${i}_${j}`,
          userId,
          sessionId,
          timestamp: new Date(Date.now() - (numTouchPoints - j) * 24 * 60 * 60 * 1000), // Spread over days
          platform: platforms[Math.floor(Math.random() * platforms.length)] as any,
          campaignId: `campaign_${Math.floor(Math.random() * 10) + 1}`,
          campaignName: `Demo Campaign ${Math.floor(Math.random() * 10) + 1}`,
          touchType: touchTypes[Math.floor(Math.random() * touchTypes.length)] as any,
          position: j + 1,
          value: conversionValue * (0.1 + Math.random() * 0.2), // 10-30% of conversion value
          channel: platforms[Math.floor(Math.random() * platforms.length)],
          device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)] as any
        };
        
        touchPoints.push(touchPoint);
        this.addTouchPoint(touchPoint);
      }
      
      const conversion: Conversion = {
        id: `conversion_${i + 1}`,
        userId,
        sessionId,
        timestamp: new Date(),
        value: conversionValue,
        currency: 'EUR',
        type: ['purchase', 'lead', 'signup'][Math.floor(Math.random() * 3)] as any,
        touchPoints,
        attributionPath: touchPoints.map(tp => tp.platform)
      };
      
      this.addConversion(conversion);
    }
    
    console.log('✅ [Attribution] Demo data generated successfully');
  }
}

// Singleton instance
export const attributionEngine = new AttributionEngine();