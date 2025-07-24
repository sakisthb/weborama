// ChatGPT AI Service - Multi-AI Integration
// Provides ChatGPT capabilities alongside Claude AI for comprehensive marketing intelligence

export interface ChatGPTConfig {
  apiKey: string;
  model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo';
  maxTokens: number;
  temperature: number;
  organizationId?: string;
}

export interface CreativeBrief {
  description: string;
  targetAudience: string;
  platform: 'meta' | 'google' | 'tiktok' | 'universal';
  tone: 'professional' | 'casual' | 'playful' | 'urgent';
  objectives: string[];
  brandGuidelines?: string;
}

export interface CreativeResult {
  adCopy: {
    headlines: string[];
    descriptions: string[];
    ctas: string[];
  };
  visuals?: VisualContent[];
  provider: 'chatgpt';
  timestamp: Date;
  brief: CreativeBrief;
  cost: number;
}

export interface VisualContent {
  url: string;
  revisedPrompt: string;
  description: string;
  provider: 'chatgpt-dalle';
  size: '1024x1024' | '1792x1024' | '1024x1792';
}

export interface AIInsight {
  provider: 'chatgpt';
  analysis: string;
  recommendations: string[];
  confidence: number;
  timestamp: Date;
  cost: number;
  tokensUsed: number;
}

export interface ChatGPTUsage {
  requestsToday: number;
  tokensToday: number;
  costToday: number;
  monthlyLimit: number;
  monthlyUsed: number;
  estimatedMonthlyCost: number;
}

export class ChatGPTService {
  private static config: ChatGPTConfig = {
    apiKey: '',
    model: 'gpt-4o-mini', // Cost-effective default
    maxTokens: 1500,
    temperature: 0.7
  };

  private static usage: ChatGPTUsage = {
    requestsToday: 0,
    tokensToday: 0,
    costToday: 0,
    monthlyLimit: 1000000, // 1M tokens default
    monthlyUsed: 0,
    estimatedMonthlyCost: 0
  };

  private static readonly PRICING = {
    'gpt-4o': { input: 0.0025, output: 0.010 }, // per 1K tokens
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 }, // per 1K tokens
    'gpt-4-turbo': { input: 0.01, output: 0.03 }, // per 1K tokens
    'dall-e-3': 0.040 // per image (1024x1024)
  };

  /**
   * Initialize ChatGPT service with API key
   */
  static initialize(apiKey: string, config?: Partial<ChatGPTConfig>) {
    this.config = {
      ...this.config,
      apiKey,
      ...config
    };
    
    // Load usage from storage
    const savedUsage = localStorage.getItem('chatgpt_usage');
    if (savedUsage) {
      this.usage = { ...this.usage, ...JSON.parse(savedUsage) };
    }

    console.log('🤖 ChatGPT Service initialized');
    return this.testConnection();
  }

  /**
   * Set API key securely
   */
  static setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    // Store encrypted (basic encoding for demo - use proper encryption in production)
    const encoded = btoa(apiKey);
    localStorage.setItem('chatgpt_api_key', encoded);
  }

  /**
   * Get API key from storage
   */
  static getApiKey(): string {
    if (this.config.apiKey) return this.config.apiKey;
    
    const stored = localStorage.getItem('chatgpt_api_key');
    if (stored) {
      try {
        this.config.apiKey = atob(stored);
        return this.config.apiKey;
      } catch (e) {
        console.error('Failed to decode ChatGPT API key');
      }
    }
    return '';
  }

  /**
   * Test API connection
   */
  static async testConnection(): Promise<{ success: boolean; message: string; error?: string }> {
    if (!this.config.apiKey) {
      return {
        success: false,
        message: 'No API key configured',
        error: 'MISSING_API_KEY'
      };
    }

    try {
      const response = await this.makeRequest({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Test connection - respond with "OK" only'
          }
        ],
        max_tokens: 10
      });

      if (response.choices && response.choices[0]) {
        return {
          success: true,
          message: 'ChatGPT connection successful'
        };
      }

      return {
        success: false,
        message: 'Invalid API response',
        error: 'INVALID_RESPONSE'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Connection failed',
        error: error.message
      };
    }
  }

  /**
   * Analyze campaign data with ChatGPT
   */
  static async analyzeCampaignData(campaignData: any, options?: {
    focusArea?: 'performance' | 'optimization' | 'creative' | 'budget';
    includeRecommendations?: boolean;
  }): Promise<AIInsight> {
    const focusArea = options?.focusArea || 'performance';
    const includeRecommendations = options?.includeRecommendations ?? true;

    const systemPrompt = `You are an expert marketing analyst for the ADPD platform, specializing in Meta, Google, TikTok ads and WooCommerce optimization. 

Your expertise includes:
- Cross-platform campaign analysis
- Performance optimization strategies  
- Budget allocation recommendations
- Creative performance insights
- Funnel optimization
- ROI maximization

Focus on ${focusArea} analysis. Be specific, actionable, and data-driven.`;

    const userPrompt = `Analyze this campaign performance data and provide insights:

Campaign Data:
${JSON.stringify(campaignData, null, 2)}

Please provide:
1. Key performance insights
2. Identified opportunities
3. Risk areas
${includeRecommendations ? '4. Specific actionable recommendations' : ''}

Format your response clearly with specific metrics and percentages where relevant.`;

    try {
      const startTime = Date.now();
      
      const response = await this.makeRequest({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });

      const analysis = response.choices[0].message.content;
      const tokensUsed = response.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokensUsed, 0);

      // Extract recommendations using regex
      const recommendations = this.extractRecommendations(analysis);

      // Update usage tracking
      this.updateUsage(tokensUsed, cost);

      return {
        provider: 'chatgpt',
        analysis,
        recommendations,
        confidence: this.calculateConfidence(response),
        timestamp: new Date(),
        cost,
        tokensUsed
      };
    } catch (error) {
      console.error('ChatGPT campaign analysis failed:', error);
      throw new Error(`ChatGPT analysis failed: ${error}`);
    }
  }

  /**
   * Generate creative content (ad copy, headlines, CTAs)
   */
  static async generateCreativeContent(brief: CreativeBrief, options?: {
    generateVisuals?: boolean;
    variations?: number;
  }): Promise<CreativeResult> {
    const generateVisuals = options?.generateVisuals ?? false;
    const variations = options?.variations ?? 3;

    const systemPrompt = `You are an expert creative director and copywriter specializing in digital advertising across Meta, Google, TikTok, and e-commerce platforms.

Your expertise includes:
- Platform-specific ad copy optimization
- Audience-targeted messaging
- Conversion-focused CTAs
- Brand voice adaptation
- Performance-driven creative strategies

Platform: ${brief.platform}
Audience: ${brief.targetAudience}
Tone: ${brief.tone}
Objectives: ${brief.objectives.join(', ')}`;

    const userPrompt = `Create compelling ad creative for this brief:

${brief.description}

Please generate:
1. ${variations} compelling headlines (max 60 characters each)
2. ${variations} description variations (max 155 characters each)
3. ${variations} strong call-to-action buttons
4. Platform-specific optimization tips

${brief.brandGuidelines ? `Brand Guidelines: ${brief.brandGuidelines}` : ''}

Format as JSON with clear structure for headlines, descriptions, and ctas arrays.`;

    try {
      const response = await this.makeRequest({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.config.maxTokens,
        temperature: 0.8 // Higher creativity for content generation
      });

      const content = response.choices[0].message.content;
      const tokensUsed = response.usage?.total_tokens || 0;
      let totalCost = this.calculateCost(tokensUsed, 0);

      // Parse creative content
      const adCopy = this.parseCreativeContent(content);

      // Generate visuals if requested
      let visuals: VisualContent[] | undefined;
      if (generateVisuals) {
        try {
          visuals = await this.generateVisuals(brief);
          totalCost += visuals.length * this.PRICING['dall-e-3'];
        } catch (error) {
          console.warn('Visual generation failed:', error);
        }
      }

      this.updateUsage(tokensUsed, totalCost);

      return {
        adCopy,
        visuals,
        provider: 'chatgpt',
        timestamp: new Date(),
        brief,
        cost: totalCost
      };
    } catch (error) {
      console.error('ChatGPT creative generation failed:', error);
      throw new Error(`Creative generation failed: ${error}`);
    }
  }

  /**
   * Generate visuals using DALL-E 3
   */
  static async generateVisuals(brief: CreativeBrief, options?: {
    style?: 'photographic' | 'illustration' | 'digital_art' | 'minimalist';
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
  }): Promise<VisualContent[]> {
    const style = options?.style || 'photographic';
    const size = options?.size || '1024x1024';
    const quality = options?.quality || 'standard';

    const prompt = `Create a professional ${style} style advertisement visual for ${brief.platform}: ${brief.description}. 
Target audience: ${brief.targetAudience}. 
Tone: ${brief.tone}.
Make it compelling, modern, and conversion-focused. Include space for text overlay.`;

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          ...(this.config.organizationId && { 'OpenAI-Organization': this.config.organizationId })
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          size,
          quality,
          n: 1 // DALL-E 3 only supports n=1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`DALL-E API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      return data.data.map((img: any) => ({
        url: img.url,
        revisedPrompt: img.revised_prompt || prompt,
        description: brief.description,
        provider: 'chatgpt-dalle' as const,
        size
      }));
    } catch (error) {
      console.error('DALL-E visual generation failed:', error);
      throw error;
    }
  }

  /**
   * Get usage statistics
   */
  static getUsage(): ChatGPTUsage {
    return { ...this.usage };
  }

  /**
   * Get current configuration
   */
  static getConfig(): ChatGPTConfig {
    return { ...this.config, apiKey: this.config.apiKey ? '***hidden***' : '' };
  }

  /**
   * Update model configuration
   */
  static updateConfig(newConfig: Partial<ChatGPTConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('ChatGPT configuration updated');
  }

  /**
   * Reset usage statistics (for testing/demo)
   */
  static resetUsage(): void {
    this.usage = {
      requestsToday: 0,
      tokensToday: 0,
      costToday: 0,
      monthlyLimit: this.usage.monthlyLimit,
      monthlyUsed: 0,
      estimatedMonthlyCost: 0
    };
    localStorage.removeItem('chatgpt_usage');
  }

  // Private helper methods
  private static async makeRequest(body: any): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...(this.config.organizationId && { 'OpenAI-Organization': this.config.organizationId })
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ChatGPT API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  private static calculateCost(inputTokens: number, outputTokens: number): number {
    const pricing = this.PRICING[this.config.model];
    if (!pricing) return 0;
    
    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (outputTokens / 1000) * pricing.output;
    
    return inputCost + outputCost;
  }

  private static calculateConfidence(response: any): number {
    // Simple confidence calculation based on response quality
    const content = response.choices[0]?.message?.content || '';
    const hasSpecificMetrics = /\d+(\.\d+)?%/.test(content);
    const hasRecommendations = /recommend|suggest|should|improve/i.test(content);
    const lengthFactor = Math.min(content.length / 500, 1);
    
    let confidence = 0.7; // Base confidence
    if (hasSpecificMetrics) confidence += 0.1;
    if (hasRecommendations) confidence += 0.1;
    confidence += lengthFactor * 0.1;
    
    return Math.min(confidence, 0.95);
  }

  private static extractRecommendations(analysis: string): string[] {
    // Extract bullet points and numbered recommendations
    const recommendations: string[] = [];
    
    // Match bullet points
    const bulletMatches = analysis.match(/[•\-\*]\s*(.+)/g);
    if (bulletMatches) {
      recommendations.push(...bulletMatches.map(m => m.replace(/^[•\-\*]\s*/, '').trim()));
    }
    
    // Match numbered items
    const numberMatches = analysis.match(/\d+\.\s*(.+)/g);
    if (numberMatches) {
      recommendations.push(...numberMatches.map(m => m.replace(/^\d+\.\s*/, '').trim()));
    }
    
    return recommendations.slice(0, 5); // Limit to top 5
  }

  private static parseCreativeContent(content: string): {
    headlines: string[];
    descriptions: string[];
    ctas: string[];
  } {
    try {
      // Try to parse as JSON first
      if (content.includes('{') && content.includes('}')) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.headlines && parsed.descriptions && parsed.ctas) {
            return parsed;
          }
        }
      }
    } catch (e) {
      // Fall back to regex parsing
    }

    // Fallback: extract using regex patterns
    const headlines = this.extractSection(content, /headlines?:?\s*/i, 3);
    const descriptions = this.extractSection(content, /descriptions?:?\s*/i, 3);
    const ctas = this.extractSection(content, /ctas?|call.?to.?actions?:?\s*/i, 3);

    return { headlines, descriptions, ctas };
  }

  private static extractSection(content: string, pattern: RegExp, limit: number): string[] {
    const section = content.match(new RegExp(`${pattern.source}([\\s\\S]*?)(?=\\n\\n|$)`, 'i'));
    if (!section) return [];

    const items = section[1]
      .split('\n')
      .map(line => line.replace(/^[\d\.\-\*\s]*/, '').trim())
      .filter(line => line.length > 0 && line.length < 200)
      .slice(0, limit);

    return items.length > 0 ? items : [`Generated ${pattern.source.replace(/[^a-zA-Z]/g, '')} content`];
  }

  private static updateUsage(tokens: number, cost: number): void {
    this.usage.requestsToday += 1;
    this.usage.tokensToday += tokens;
    this.usage.costToday += cost;
    this.usage.monthlyUsed += tokens;
    this.usage.estimatedMonthlyCost += cost;

    // Persist usage data
    localStorage.setItem('chatgpt_usage', JSON.stringify(this.usage));
  }
}