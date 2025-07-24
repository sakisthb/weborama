// AI Router - Intelligent Multi-AI Task Distribution
// Routes tasks to optimal AI provider based on complexity, cost, and capabilities

import claudeAI from '@/lib/claude-ai-service';
import { ChatGPTService, type AIInsight, type CreativeBrief, type CreativeResult } from './chatgpt-service';

export type AIProvider = 'claude' | 'chatgpt' | 'both' | 'auto';

export interface AITaskType {
  id: string;
  name: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
  primaryProvider: AIProvider;
  fallbackProvider?: AIProvider;
  costEfficiencyFactor: number; // 1.0 = normal, <1 = cost-sensitive, >1 = quality-first
}

export interface AIConfig {
  defaultProvider: AIProvider;
  costOptimization: boolean;
  qualityFirst: boolean;
  budgetLimit: {
    daily: number;
    monthly: number;
  };
  providerPreferences: {
    [key: string]: AIProvider;
  };
}

export interface ClaudeInsight {
  provider: 'claude';
  analysis: string;
  recommendations: string[];
  confidence: number;
  timestamp: Date;
  cost?: number;
}

export interface MultiAIInsight {
  claude?: ClaudeInsight;
  chatgpt?: AIInsight;
  consensus?: {
    agreement: number; // 0-1, how much AIs agree
    keyPoints: string[];
    recommendations: string[];
    confidence: number;
  };
  costComparison: {
    claude: number;
    chatgpt: number;
    savings: number;
  };
  provider: 'multi-ai';
  timestamp: Date;
}

export interface TaskPerformanceMetrics {
  taskType: string;
  provider: AIProvider;
  avgCost: number;
  avgConfidence: number;
  avgResponseTime: number;
  successRate: number;
  userSatisfaction: number;
}

export class AIRouter {
  private static config: AIConfig = {
    defaultProvider: 'auto',
    costOptimization: true,
    qualityFirst: false,
    budgetLimit: {
      daily: 50, // $50 daily limit
      monthly: 1000 // $1000 monthly limit
    },
    providerPreferences: {}
  };

  private static taskDefinitions: AITaskType[] = [
    // Claude AI specializations - Strategic & Deep Analysis
    {
      id: 'funnel-analysis',
      name: 'Funnel Analysis',
      description: 'Deep funnel performance analysis with strategic insights',
      complexity: 'complex',
      primaryProvider: 'claude',
      fallbackProvider: 'chatgpt',
      costEfficiencyFactor: 1.2 // Quality over cost
    },
    {
      id: 'detailed-reports',
      name: 'Detailed Reports',
      description: 'Comprehensive performance reports with recommendations',
      complexity: 'complex',
      primaryProvider: 'claude',
      fallbackProvider: 'chatgpt',
      costEfficiencyFactor: 1.1
    },
    {
      id: 'strategic-planning',
      name: 'Strategic Planning',
      description: 'Long-term campaign and budget strategy development',
      complexity: 'complex',
      primaryProvider: 'claude',
      costEfficiencyFactor: 1.3
    },
    {
      id: 'customer-journey-analysis',
      name: 'Customer Journey Analysis',
      description: 'Multi-touchpoint attribution and journey optimization',
      complexity: 'complex',
      primaryProvider: 'claude',
      fallbackProvider: 'chatgpt',
      costEfficiencyFactor: 1.2
    },

    // ChatGPT specializations - Creative & Real-time
    {
      id: 'creative-generation',
      name: 'Creative Generation',
      description: 'Ad copy, headlines, and visual content creation',
      complexity: 'medium',
      primaryProvider: 'chatgpt',
      fallbackProvider: 'claude',
      costEfficiencyFactor: 0.8 // Cost-efficient
    },
    {
      id: 'visual-creation',
      name: 'Visual Creation',
      description: 'AI-generated images and visual content (DALL-E)',
      complexity: 'medium',
      primaryProvider: 'chatgpt', // Only ChatGPT has DALL-E
      costEfficiencyFactor: 1.0
    },
    {
      id: 'ad-copy-writing',
      name: 'Ad Copy Writing',
      description: 'Platform-specific ad copy and CTAs',
      complexity: 'simple',
      primaryProvider: 'chatgpt',
      fallbackProvider: 'claude',
      costEfficiencyFactor: 0.7
    },
    {
      id: 'trend-analysis',
      name: 'Trend Analysis',
      description: 'Real-time market and performance trend analysis',
      complexity: 'medium',
      primaryProvider: 'chatgpt',
      fallbackProvider: 'claude',
      costEfficiencyFactor: 0.9
    },
    {
      id: 'quick-insights',
      name: 'Quick Insights',
      description: 'Fast performance insights and recommendations',
      complexity: 'simple',
      primaryProvider: 'chatgpt', // GPT-4o Mini for cost efficiency
      fallbackProvider: 'claude',
      costEfficiencyFactor: 0.5
    },

    // Both AIs capable - Route based on preferences
    {
      id: 'campaign-optimization',
      name: 'Campaign Optimization',
      description: 'Campaign performance optimization recommendations',
      complexity: 'medium',
      primaryProvider: 'auto',
      costEfficiencyFactor: 1.0
    },
    {
      id: 'budget-optimization',
      name: 'Budget Optimization',
      description: 'Budget allocation and spending optimization',
      complexity: 'medium',
      primaryProvider: 'auto',
      costEfficiencyFactor: 1.0
    },
    {
      id: 'performance-analysis',
      name: 'Performance Analysis',
      description: 'General campaign and ad performance analysis',
      complexity: 'medium',
      primaryProvider: 'auto',
      costEfficiencyFactor: 0.9
    },
    {
      id: 'competitive-analysis',
      name: 'Competitive Analysis',
      description: 'Market and competitor performance analysis',
      complexity: 'medium',
      primaryProvider: 'auto',
      costEfficiencyFactor: 1.1
    }
  ];

  private static performanceMetrics: TaskPerformanceMetrics[] = [];

  /**
   * Configure AI Router settings
   */
  static configure(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('ai_router_config', JSON.stringify(this.config));
    console.log('🤖 AI Router configured:', this.config);
  }

  /**
   * Get optimal AI provider for a specific task
   */
  static getOptimalProvider(
    taskType: string, 
    options?: {
      forceProvider?: AIProvider;
      costPriority?: boolean;
      qualityPriority?: boolean;
    }
  ): AIProvider {
    // Handle force provider override
    if (options?.forceProvider && options.forceProvider !== 'auto') {
      return options.forceProvider;
    }

    const task = this.taskDefinitions.find(t => t.id === taskType);
    if (!task) {
      console.warn(`Unknown task type: ${taskType}, using default provider`);
      return this.config.defaultProvider === 'auto' ? 'claude' : this.config.defaultProvider;
    }

    // Handle specific provider assignments
    if (task.primaryProvider !== 'auto') {
      return task.primaryProvider;
    }

    // Intelligent routing for 'auto' tasks
    return this.intelligentSelection(task, options);
  }

  /**
   * Intelligent AI selection based on performance metrics and preferences
   */
  private static intelligentSelection(
    task: AITaskType, 
    options?: {
      costPriority?: boolean;
      qualityPriority?: boolean;
    }
  ): AIProvider {
    const costPriority = options?.costPriority ?? this.config.costOptimization;
    const qualityPriority = options?.qualityPriority ?? this.config.qualityFirst;

    // Check user preferences first
    if (this.config.providerPreferences[task.id]) {
      return this.config.providerPreferences[task.id];
    }

    // Get performance metrics for this task
    const claudeMetrics = this.performanceMetrics.find(
      m => m.taskType === task.id && m.provider === 'claude'
    );
    const chatgptMetrics = this.performanceMetrics.find(
      m => m.taskType === task.id && m.provider === 'chatgpt'
    );

    // If no metrics available, use default routing
    if (!claudeMetrics && !chatgptMetrics) {
      return this.defaultRouting(task);
    }

    // Calculate weighted scores
    const claudeScore = this.calculateProviderScore(claudeMetrics, task, costPriority, qualityPriority);
    const chatgptScore = this.calculateProviderScore(chatgptMetrics, task, costPriority, qualityPriority);

    return claudeScore > chatgptScore ? 'claude' : 'chatgpt';
  }

  /**
   * Calculate provider score based on metrics and preferences
   */
  private static calculateProviderScore(
    metrics: TaskPerformanceMetrics | undefined,
    task: AITaskType,
    costPriority: boolean,
    qualityPriority: boolean
  ): number {
    if (!metrics) return 0;

    let score = 0;
    
    // Base performance factors
    score += metrics.avgConfidence * 0.3; // 30% confidence weight
    score += metrics.successRate * 0.2; // 20% success rate weight
    score += metrics.userSatisfaction * 0.2; // 20% user satisfaction weight
    
    // Response time factor (inverse - faster is better)
    const responseTimeScore = Math.max(0, 1 - (metrics.avgResponseTime / 10000)); // Normalize to 10s max
    score += responseTimeScore * 0.1; // 10% response time weight

    // Cost efficiency factor
    const costScore = Math.max(0, 1 - (metrics.avgCost / 1)); // Normalize to $1 max
    const costWeight = costPriority ? 0.3 : 0.1;
    score += costScore * costWeight;

    // Quality factor
    if (qualityPriority) {
      score += metrics.avgConfidence * 0.2; // Additional quality bonus
    }

    // Task-specific cost efficiency multiplier
    score *= task.costEfficiencyFactor;

    return Math.min(score, 1.0); // Cap at 1.0
  }

  /**
   * Default routing logic when no metrics available
   */
  private static defaultRouting(task: AITaskType): AIProvider {
    // Task complexity based routing
    if (task.complexity === 'complex') {
      return 'claude'; // Claude better for complex analysis
    }
    
    if (task.complexity === 'simple') {
      return 'chatgpt'; // ChatGPT more cost-effective for simple tasks
    }

    // Medium complexity - check cost optimization
    if (this.config.costOptimization) {
      return 'chatgpt'; // More cost-effective for medium tasks
    }

    return 'claude'; // Quality-first approach
  }

  /**
   * Get multi-AI insight by running task on both providers
   */
  static async getMultiAIInsight(
    taskType: string, 
    data: any,
    options?: {
      includeConsensus?: boolean;
      costComparison?: boolean;
    }
  ): Promise<MultiAIInsight> {
    const includeConsensus = options?.includeConsensus ?? true;
    const costComparison = options?.costComparison ?? true;

    const startTime = Date.now();
    let claudeResult: ClaudeInsight | undefined;
    let chatgptResult: AIInsight | undefined;
    const costs = { claude: 0, chatgpt: 0, savings: 0 };

    try {
      // Run both AIs in parallel
      const [claudeResponse, chatgptResponse] = await Promise.allSettled([
        this.runClaudeTask(taskType, data),
        this.runChatGPTTask(taskType, data)
      ]);

      // Process Claude result
      if (claudeResponse.status === 'fulfilled') {
        claudeResult = claudeResponse.value;
        costs.claude = claudeResult.cost || 0;
      } else {
        console.warn('Claude task failed:', claudeResponse.reason);
      }

      // Process ChatGPT result  
      if (chatgptResponse.status === 'fulfilled') {
        chatgptResult = chatgptResponse.value;
        costs.chatgpt = chatgptResult.cost || 0;
      } else {
        console.warn('ChatGPT task failed:', chatgptResponse.reason);
      }

      // Calculate cost comparison
      if (costComparison && claudeResult && chatgptResult) {
        costs.savings = Math.abs(costs.claude - costs.chatgpt);
      }

      // Generate consensus if both succeeded
      let consensus;
      if (includeConsensus && claudeResult && chatgptResult) {
        consensus = this.generateConsensus(claudeResult, chatgptResult);
      }

      // Track performance metrics  
      this.trackPerformance(taskType, 'claude', {
        avgCost: costs.claude + costs.chatgpt,
        avgConfidence: consensus?.confidence || 0,
        avgResponseTime: Date.now() - startTime,
        successRate: (claudeResult ? 1 : 0) + (chatgptResult ? 1 : 0) / 2,
        userSatisfaction: 0.8 // Default, should be collected from user feedback
      });

      return {
        claude: claudeResult,
        chatgpt: chatgptResult,
        consensus,
        costComparison: costs,
        provider: 'multi-ai',
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Multi-AI insight generation failed:', error);
      throw new Error(`Multi-AI analysis failed: ${error}`);
    }
  }

  /**
   * Generate consensus analysis from multiple AI results
   */
  private static generateConsensus(
    claudeResult: ClaudeInsight,
    chatgptResult: AIInsight
  ): {
    agreement: number;
    keyPoints: string[];
    recommendations: string[];
    confidence: number;
  } {
    // Simple consensus algorithm - can be made more sophisticated
    const claudeText = claudeResult.analysis?.toLowerCase() || '';
    const chatgptText = chatgptResult.analysis?.toLowerCase() || '';

    // Calculate agreement based on common keywords
    const claudeWords = new Set(claudeText.split(/\s+/).filter(w => w.length > 3));
    const chatgptWords = new Set(chatgptText.split(/\s+/).filter(w => w.length > 3));
    const commonWords = new Set([...claudeWords].filter(w => chatgptWords.has(w)));
    const agreement = commonWords.size / Math.max(claudeWords.size, chatgptWords.size);

    // Extract common key points
    const keyPoints: string[] = [];
    const claudeRecommendations = claudeResult.recommendations || [];
    const chatgptRecommendations = chatgptResult.recommendations || [];

    // Find similar recommendations
    const recommendations: string[] = [];
    claudeRecommendations.forEach(cr => {
      const similar = chatgptRecommendations.find(cgr => 
        this.calculateSimilarity(cr, cgr) > 0.6
      );
      if (similar) {
        recommendations.push(`Both AIs recommend: ${cr}`);
      } else {
        recommendations.push(`Claude suggests: ${cr}`);
      }
    });

    // Add unique ChatGPT recommendations
    chatgptRecommendations.forEach(cgr => {
      const alreadyIncluded = claudeRecommendations.some(cr =>
        this.calculateSimilarity(cr, cgr) > 0.6
      );
      if (!alreadyIncluded) {
        recommendations.push(`ChatGPT suggests: ${cgr}`);
      }
    });

    // Calculate overall confidence
    const avgConfidence = (claudeResult.confidence + chatgptResult.confidence) / 2;
    const consensusConfidence = avgConfidence * (0.7 + agreement * 0.3);

    return {
      agreement,
      keyPoints,
      recommendations: recommendations.slice(0, 8), // Limit to top 8
      confidence: consensusConfidence
    };
  }

  /**
   * Calculate similarity between two strings
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  /**
   * Run task on Claude AI
   */
  private static async runClaudeTask(taskType: string, data: any): Promise<ClaudeInsight> {
    // Create a detailed prompt for Claude based on task type and data
    const prompt = this.createClaudePrompt(taskType, data);
    
    try {
      const response = await claudeAI.generateResponse({
        prompt,
        maxTokens: 1500,
        temperature: 0.7
      });

      return {
        provider: 'claude',
        analysis: response.content,
        recommendations: this.extractRecommendations(response.content),
        confidence: response.confidence / 100, // Normalize to 0-1
        timestamp: new Date(),
        cost: 0 // Cost tracking not implemented in current Claude service
      };
    } catch (error) {
      throw new Error(`Claude task failed: ${error}`);
    }
  }

  /**
   * Create specialized prompts for Claude based on task type
   */
  private static createClaudePrompt(taskType: string, data: any): string {
    const baseContext = `You are an expert marketing analyst for the ADPD platform, specializing in Meta, Google, TikTok ads and WooCommerce optimization. Analyze the following data and provide actionable insights.`;
    
    const taskPrompts = {
      'funnel-analysis': `${baseContext}\n\nPerform a comprehensive funnel analysis focusing on conversion rates, drop-off points, and optimization opportunities.\n\nData: ${JSON.stringify(data, null, 2)}\n\nProvide:\n1. Current funnel performance assessment\n2. Key bottlenecks and drop-off points\n3. Specific optimization recommendations\n4. Expected impact of changes`,
      
      'detailed-reports': `${baseContext}\n\nGenerate a detailed performance report with strategic insights and recommendations.\n\nData: ${JSON.stringify(data, null, 2)}\n\nProvide:\n1. Executive summary of performance\n2. Detailed analysis by platform/campaign\n3. Trend analysis and insights\n4. Strategic recommendations for improvement`,
      
      'strategic-planning': `${baseContext}\n\nDevelop strategic planning recommendations for campaign optimization and budget allocation.\n\nData: ${JSON.stringify(data, null, 2)}\n\nProvide:\n1. Strategic assessment of current approach\n2. Long-term optimization strategy\n3. Budget reallocation recommendations\n4. Timeline for implementation`,
      
      'customer-journey-analysis': `${baseContext}\n\nAnalyze customer journey and attribution data to optimize touchpoints.\n\nData: ${JSON.stringify(data, null, 2)}\n\nProvide:\n1. Customer journey mapping insights\n2. Attribution analysis across platforms\n3. Touchpoint optimization opportunities\n4. Cross-platform synergy recommendations`,
      
      'default': `${baseContext}\n\nAnalyze the provided campaign data and provide insights for ${taskType}.\n\nData: ${JSON.stringify(data, null, 2)}\n\nProvide specific, actionable recommendations based on the data.`
    };

    return taskPrompts[taskType as keyof typeof taskPrompts] || taskPrompts.default;
  }

  /**
   * Extract recommendations from Claude response
   */
  private static extractRecommendations(content: string): string[] {
    const recommendations: string[] = [];
    
    // Look for numbered recommendations
    const numberedMatches = content.match(/\d+\.\s*([^.\n]+(?:\.[^.\n]*)*)/g);
    if (numberedMatches) {
      recommendations.push(...numberedMatches.slice(0, 5));
    }
    
    // Look for bullet points
    const bulletMatches = content.match(/[•\-\*]\s*([^\n]+)/g);
    if (bulletMatches) {
      recommendations.push(...bulletMatches.slice(0, 3));
    }
    
    // If no structured recommendations found, extract key sentences
    if (recommendations.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => 
        s.length > 20 && 
        s.length < 200 && 
        (s.includes('recommend') || s.includes('should') || s.includes('optimize'))
      );
      recommendations.push(...sentences.slice(0, 3));
    }
    
    return recommendations.filter(rec => rec.length > 0).slice(0, 5);
  }

  /**
   * Run task on ChatGPT
   */
  private static async runChatGPTTask(taskType: string, data: any): Promise<AIInsight> {
    // Map task types to ChatGPT methods
    switch (taskType) {
      case 'creative-generation':
        if (this.isCreativeBrief(data)) {
          const result = await ChatGPTService.generateCreativeContent(data);
          return {
            provider: 'chatgpt',
            analysis: `Generated creative content: ${result.adCopy.headlines.length} headlines, ${result.adCopy.descriptions.length} descriptions`,
            recommendations: result.adCopy.headlines.slice(0, 3),
            confidence: 0.85,
            timestamp: result.timestamp,
            cost: result.cost,
            tokensUsed: 0
          };
        }
        break;

      case 'visual-creation':
        if (this.isCreativeBrief(data)) {
          const visuals = await ChatGPTService.generateVisuals(data);
          return {
            provider: 'chatgpt',
            analysis: `Generated ${visuals.length} visual asset(s)`,
            recommendations: visuals.map(v => `Visual: ${v.description}`),
            confidence: 0.8,
            timestamp: new Date(),
            cost: visuals.length * 0.040, // DALL-E 3 pricing
            tokensUsed: 0
          };
        }
        break;

      default:
        // Default to campaign analysis for other task types
        return await ChatGPTService.analyzeCampaignData(data, {
          focusArea: this.mapTaskToFocusArea(taskType)
        });
    }

    throw new Error(`Unsupported ChatGPT task type: ${taskType}`);
  }

  /**
   * Type guard for CreativeBrief
   */
  private static isCreativeBrief(data: any): data is CreativeBrief {
    return data && typeof data === 'object' && 
           data.description && data.targetAudience && data.platform;
  }

  /**
   * Map task type to ChatGPT focus area
   */
  private static mapTaskToFocusArea(taskType: string): 'performance' | 'optimization' | 'creative' | 'budget' {
    const mapping: { [key: string]: 'performance' | 'optimization' | 'creative' | 'budget' } = {
      'campaign-optimization': 'optimization',
      'budget-optimization': 'budget',
      'performance-analysis': 'performance',
      'competitive-analysis': 'performance',
      'ad-copy-writing': 'creative',
      'trend-analysis': 'performance',
      'quick-insights': 'performance'
    };
    
    return mapping[taskType] || 'performance';
  }

  /**
   * Track performance metrics for continuous improvement
   */
  private static trackPerformance(
    taskType: string, 
    provider: AIProvider, 
    metrics: Omit<TaskPerformanceMetrics, 'taskType' | 'provider'>
  ): void {
    const existing = this.performanceMetrics.findIndex(
      m => m.taskType === taskType && m.provider === provider
    );

    const newMetric: TaskPerformanceMetrics = {
      taskType,
      provider,
      ...metrics
    };

    if (existing >= 0) {
      // Update existing metrics with moving average
      const current = this.performanceMetrics[existing];
      const weight = 0.8; // 80% weight to existing, 20% to new
      
      this.performanceMetrics[existing] = {
        ...current,
        avgCost: current.avgCost * weight + metrics.avgCost * (1 - weight),
        avgConfidence: current.avgConfidence * weight + metrics.avgConfidence * (1 - weight),
        avgResponseTime: current.avgResponseTime * weight + metrics.avgResponseTime * (1 - weight),
        successRate: current.successRate * weight + metrics.successRate * (1 - weight),
        userSatisfaction: current.userSatisfaction * weight + metrics.userSatisfaction * (1 - weight)
      };
    } else {
      this.performanceMetrics.push(newMetric);
    }

    // Persist metrics
    localStorage.setItem('ai_performance_metrics', JSON.stringify(this.performanceMetrics));
  }

  /**
   * Get available task types
   */
  static getTaskTypes(): AITaskType[] {
    return [...this.taskDefinitions];
  }

  /**
   * Get performance metrics
   */
  static getPerformanceMetrics(): TaskPerformanceMetrics[] {
    return [...this.performanceMetrics];
  }

  /**
   * Get current configuration
   */
  static getConfig(): AIConfig {
    return { ...this.config };
  }

  /**
   * Initialize AI Router
   */
  static initialize(): void {
    // Load config from storage
    const savedConfig = localStorage.getItem('ai_router_config');
    if (savedConfig) {
      try {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      } catch (e) {
        console.warn('Failed to load AI Router config from storage');
      }
    }

    // Load performance metrics
    const savedMetrics = localStorage.getItem('ai_performance_metrics');
    if (savedMetrics) {
      try {
        this.performanceMetrics = JSON.parse(savedMetrics);
      } catch (e) {
        console.warn('Failed to load AI performance metrics from storage');
      }
    }

    console.log('🤖 AI Router initialized with config:', this.config);
  }
}

// Initialize on import
AIRouter.initialize();