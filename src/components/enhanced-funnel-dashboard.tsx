// Enhanced Funnel Intelligence Dashboard
// Extends the existing funnel analysis with AI-powered cross-platform intelligence

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Search, 
  Target, 
  DollarSign, 
  Users, 
  ArrowRight,
  Activity,
  PieChart,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Star,
  Lightbulb,
  ChevronRight,
  ExternalLink,
  BarChart2,
  GitBranch,
} from "lucide-react";
import { EnhancedFunnelAnalysis, EnhancedFunnelStage, PlatformType, AIRecommendation } from "@/lib/enhanced-funnel-intelligence";

interface EnhancedFunnelDashboardProps {
  analysis: EnhancedFunnelAnalysis;
  loading?: boolean;
}

export function EnhancedFunnelDashboard({ analysis, loading = false }: EnhancedFunnelDashboardProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStageIcon = (stage: 'awareness' | 'interest' | 'desire' | 'action') => {
    switch (stage) {
      case 'awareness': return <Eye className="w-5 h-5" />;
      case 'interest': return <Search className="w-5 h-5" />;
      case 'desire': return <Target className="w-5 h-5" />;
      case 'action': return <CheckCircle className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Good</Badge>;
      case 'poor': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Needs Work</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlatformIcon = (platform: PlatformType) => {
    // Return platform-specific icons or colors
    const platformColors = {
      meta: '#1877F2',
      google: '#4285F4', 
      tiktok: '#FF0050',
      woocommerce: '#96588A',
      organic: '#22C55E'
    };
    return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platformColors[platform] || '#6B7280' }}></div>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const renderEnhancedStageCard = (stage: EnhancedFunnelStage, stageKey: string) => (
    <Card key={stageKey} className="relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2">
        {getPerformanceBadge(stage.performance)}
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <div className="text-primary">
              {getStageIcon(stage.aidaClassification)}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{stage.name}</CardTitle>
              {getTrendIcon(stage.trend)}
            </div>
            <CardDescription className="text-sm">{stage.description}</CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium">Health Score:</span>
              <div className="flex items-center gap-2">
                <Progress value={stage.healthScore} className="w-16 h-2" />
                <span className="text-sm font-bold">{stage.healthScore}/100</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Core Metrics */}
        <div className="grid gap-3 md:grid-cols-2 mb-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xl font-bold">{stage.metrics.impressions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Volume</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xl font-bold">{stage.metrics.conversions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Conversions</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Conversion Rate</span>
            <span className="font-semibold">{stage.metrics.conversionRate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>ROAS</span>
            <span className={`font-semibold ${stage.metrics.roas >= 2 ? 'text-green-600' : 'text-red-600'}`}>
              {stage.metrics.roas.toFixed(2)}x
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cost/Conversion</span>
            <span className="font-semibold">€{stage.metrics.costPerConversion.toFixed(2)}</span>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Top Platforms</h4>
          {Object.entries(stage.platformBreakdown)
            .sort(([,a], [,b]) => b.contribution - a.contribution)
            .slice(0, 3)
            .map(([platform, metrics]) => (
              <div key={platform} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(platform as PlatformType)}
                  <span className="capitalize">{platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{metrics.contribution.toFixed(1)}%</span>
                  {getTrendIcon(metrics.trend)}
                </div>
              </div>
            ))
          }
        </div>

        {/* AI Recommendations Preview */}
        {stage.aiRecommendations.length > 0 && (
          <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <Brain className="w-3 h-3 text-blue-600" />
              <span className="font-medium text-blue-600">AI Insight</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {stage.aiRecommendations[0]?.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAIRecommendation = (recommendation: AIRecommendation) => (
    <Card key={recommendation.id} className={`${getPriorityColor(recommendation.priority)} border-l-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              {recommendation.type === 'optimization' && <Lightbulb className="w-4 h-4 text-yellow-600" />}
              {recommendation.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
              {recommendation.type === 'opportunity' && <Star className="w-4 h-4 text-blue-600" />}
              {recommendation.type === 'budget' && <DollarSign className="w-4 h-4 text-green-600" />}
            </div>
            <div>
              <CardTitle className="text-sm">{recommendation.title}</CardTitle>
              <CardDescription className="text-xs">{recommendation.message}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {recommendation.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Expected Impact: </span>
            <span className="font-semibold text-green-600">{recommendation.impact}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Confidence: </span>
            <span className="font-semibold">{(recommendation.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        {recommendation.actions.length > 0 && (
          <div className="space-y-1">
            <h5 className="text-xs font-semibold">Action Items:</h5>
            {recommendation.actions.slice(0, 2).map((action, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span>{action}</span>
              </div>
            ))}
            {recommendation.actions.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{recommendation.actions.length - 2} more actions
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>ROI: {recommendation.estimatedROI}x</span>
          <span>{recommendation.timeframe}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Funnel Health Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Funnel Health Score
              </CardTitle>
              <CardDescription>
                Overall funnel performance with AI-powered insights
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{analysis.funnelHealth.overall}/100</div>
              <div className="flex items-center gap-1 text-sm">
                {analysis.funnelHealth.trends.weekly > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={analysis.funnelHealth.trends.weekly > 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(analysis.funnelHealth.trends.weekly)} pts this week
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(analysis.funnelHealth.stageScores).map(([stage, score]) => (
              <div key={stage} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getStageIcon(stage as any)}
                  <span className="text-sm font-medium capitalize">{stage}</span>
                </div>
                <Progress value={score} className="mb-2" />
                <div className="text-lg font-bold">{score}/100</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced AIDA Funnel Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Enhanced AIDA Funnel Analysis
          </CardTitle>
          <CardDescription>
            4-stage Russell Brunson AIDA funnel with cross-platform intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {renderEnhancedStageCard(analysis.stages.awareness, 'awareness')}
            {renderEnhancedStageCard(analysis.stages.interest, 'interest')}
            {renderEnhancedStageCard(analysis.stages.desire, 'desire')}
            {renderEnhancedStageCard(analysis.stages.action, 'action')}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Tabs */}
      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="budget">Budget Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {analysis.aiInsights.criticalAlerts.length > 0 && (
              <Alert className="border-red-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Critical Alerts</AlertTitle>
                <AlertDescription>
                  {analysis.aiInsights.criticalAlerts.length} critical issues require immediate attention
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ...analysis.aiInsights.criticalAlerts,
                ...analysis.aiInsights.optimizationOpportunities
              ].slice(0, 6).map(renderAIRecommendation)}
            </div>
            
            {analysis.aiInsights.keyFindings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Key AI Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.aiInsights.keyFindings.map((finding, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Attribution Models Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Attribution Models</CardTitle>
                <CardDescription>Revenue attribution across different models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analysis.crossPlatformAttribution.models).map(([model, data]) => (
                    <div key={model} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{model.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="text-right">
                        <div className="font-semibold">€{data.totalAttributedValue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {(data.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Contributions */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Roles</CardTitle>
                <CardDescription>How each platform contributes to conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.crossPlatformAttribution.platformContribution.map((platform) => (
                    <div key={platform.platform} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(platform.platform)}
                        <div>
                          <span className="text-sm font-medium capitalize">{platform.platform}</span>
                          <div className="text-xs text-muted-foreground capitalize">{platform.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{platform.contribution}%</div>
                        <div className="text-xs text-muted-foreground">
                          Avg influence: {platform.avgInfluence}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Journey Patterns */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Customer Journey Patterns</CardTitle>
                <CardDescription>Most common conversion paths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.crossPlatformAttribution.journeyPatterns.map((pattern, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{pattern.pattern}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {pattern.segments.join(', ')}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center text-xs">
                        <div>
                          <div className="font-semibold">{pattern.frequency}%</div>
                          <div className="text-muted-foreground">Frequency</div>
                        </div>
                        <div>
                          <div className="font-semibold">€{pattern.avgValue}</div>
                          <div className="text-muted-foreground">Avg Value</div>
                        </div>
                        <div>
                          <div className="font-semibold">{pattern.avgDuration}d</div>
                          <div className="text-muted-foreground">Duration</div>
                        </div>
                        <div>
                          <div className="font-semibold">{pattern.conversionRate}%</div>
                          <div className="text-muted-foreground">Conv Rate</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(analysis.predictiveAnalytics.forecasts).map(([timeframe, forecast]) => (
              <Card key={timeframe}>
                <CardHeader>
                  <CardTitle className="text-sm">{forecast.timeframe} Forecast</CardTitle>
                  <CardDescription>
                    {(forecast.confidence * 100).toFixed(0)}% confidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversions</span>
                      <span className="font-semibold">{forecast.expectedMetrics.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue</span>
                      <span className="font-semibold">€{forecast.expectedMetrics.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">ROAS</span>
                      <span className="font-semibold">{forecast.expectedMetrics.roas}x</span>
                    </div>
                  </div>
                  
                  {forecast.opportunities.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-xs font-semibold mb-2">Opportunities</h5>
                      {forecast.opportunities.slice(0, 2).map((opp, idx) => (
                        <div key={idx} className="text-xs text-green-600">{opp}</div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis</CardTitle>
              <CardDescription>Compare different optimization scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(analysis.predictiveAnalytics.scenarios).map(([scenario, data]) => (
                  <div key={scenario} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm">{data.scenarioName}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Revenue Change</span>
                        <span className={`font-semibold ${data.expectedResults.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.expectedResults.revenueChange >= 0 ? '+' : ''}{(data.expectedResults.revenueChange * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROAS Change</span>
                        <span className={`font-semibold ${data.expectedResults.roasChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.expectedResults.roasChange >= 0 ? '+' : ''}{(data.expectedResults.roasChange * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment</span>
                        <span className="font-semibold">€{data.investment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeframe</span>
                        <span className="font-semibold">{data.timeframe}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                AI-Powered Budget Optimization
              </CardTitle>
              <CardDescription>
                Recommended budget allocation based on cross-platform performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Current Allocation</h4>
                  <div className="space-y-2">
                    {analysis.aiInsights.budgetOptimization.currentAllocation.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(platform.platform)}
                          <span className="text-sm capitalize">{platform.platform}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">€{platform.currentBudget}</div>
                          <div className="text-xs text-muted-foreground">{platform.currentPercent}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommended Allocation</h4>
                  <div className="space-y-2">
                    {analysis.aiInsights.budgetOptimization.recommendedAllocation.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(platform.platform)}
                          <span className="text-sm capitalize">{platform.platform}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">€{platform.recommendedBudget}</div>
                          <div className="text-xs text-muted-foreground">
                            {platform.recommendedPercent}% 
                            {platform.recommendedPercent !== platform.currentPercent && (
                              <span className={platform.recommendedPercent > platform.currentPercent ? 'text-green-600' : 'text-red-600'}>
                                {' '}({platform.recommendedPercent > platform.currentPercent ? '+' : ''}{(platform.recommendedPercent - platform.currentPercent).toFixed(1)}pp)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Expected Results</h4>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <span className="text-blue-600">Additional Revenue: </span>
                    <span className="font-semibold">+€{analysis.aiInsights.budgetOptimization.expectedImprovement.revenue}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">ROAS Improvement: </span>
                    <span className="font-semibold">+{(analysis.aiInsights.budgetOptimization.expectedImprovement.roas * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Additional Conversions: </span>
                    <span className="font-semibold">+{analysis.aiInsights.budgetOptimization.expectedImprovement.conversions}</span>
                  </div>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
                  {analysis.aiInsights.budgetOptimization.reasoning}
                </p>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-blue-600">
                    Confidence: {(analysis.aiInsights.budgetOptimization.confidence * 100).toFixed(0)}%
                  </span>
                  <span className="text-blue-600">
                    Implementation: {analysis.aiInsights.budgetOptimization.timeframe}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legacy Compatibility View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            Traditional 3-Stage View
          </CardTitle>
          <CardDescription>
            Compatible with existing funnel analysis for comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold">TOFU (Awareness)</div>
              <div className="text-2xl font-bold text-blue-600">{analysis.tofu.metrics.impressions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Impressions</div>
              <div className="mt-2 text-sm">
                CTR: <span className="font-semibold">{analysis.tofu.metrics.ctr.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold">MOFU (Interest + Desire)</div>
              <div className="text-2xl font-bold text-green-600">{analysis.mofu.metrics.clicks.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Engaged Users</div>
              <div className="mt-2 text-sm">
                Conv Rate: <span className="font-semibold">{analysis.mofu.metrics.conversionRate.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold">BOFU (Action)</div>
              <div className="text-2xl font-bold text-orange-600">{analysis.bofu.metrics.conversions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Conversions</div>
              <div className="mt-2 text-sm">
                ROAS: <span className="font-semibold">{analysis.bofu.metrics.roas.toFixed(2)}x</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Overall Conversion Rate: 
              <span className="font-semibold ml-1">{analysis.overallConversion.toFixed(3)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}