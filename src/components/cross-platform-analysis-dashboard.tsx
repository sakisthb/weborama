// Cross-Platform Analysis Dashboard - Option C Component
// Advanced multi-platform campaign performance comparison and optimization

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Globe,
  Zap,
  Trophy,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  DollarSign,
  Eye,
  MousePointer,
  Heart,
  Play,
  Shield,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { 
  crossPlatformAnalysisEngine,
  CrossPlatformComparison,
  PlatformEfficiency,
  AudienceOverlap,
  AttributionAnalysis,
  CompetitiveAnalysis,
  PlatformSynergy
} from '@/lib/cross-platform-analysis-engine';

export function CrossPlatformAnalysisDashboard() {
  const [comparison, setComparison] = useState<CrossPlatformComparison | null>(null);
  const [efficiencies, setEfficiencies] = useState<PlatformEfficiency[]>([]);
  const [audienceOverlaps, setAudienceOverlaps] = useState<AudienceOverlap[]>([]);
  const [attributionAnalyses, setAttributionAnalyses] = useState<AttributionAnalysis[]>([]);
  const [competitiveAnalyses, setCompetitiveAnalyses] = useState<CompetitiveAnalysis[]>([]);
  const [platformSynergies, setPlatformSynergies] = useState<PlatformSynergy[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    setLoading(true);
    
    try {
      const comparisons = crossPlatformAnalysisEngine.getComparisons();
      const currentComparison = comparisons[0];
      
      if (currentComparison) {
        setComparison(currentComparison);
      }

      const efficiencyData = crossPlatformAnalysisEngine.getPlatformEfficiencies();
      const overlapData = crossPlatformAnalysisEngine.getAudienceOverlaps();
      const attributionData = crossPlatformAnalysisEngine.getAttributionAnalyses();
      const competitiveData = crossPlatformAnalysisEngine.getCompetitiveAnalyses();
      const synergyData = crossPlatformAnalysisEngine.getPlatformSynergies();
      const summaryData = crossPlatformAnalysisEngine.generateExecutiveSummary();

      setEfficiencies(efficiencyData);
      setAudienceOverlaps(overlapData);
      setAttributionAnalyses(attributionData);
      setCompetitiveAnalyses(competitiveData);
      setPlatformSynergies(synergyData);
      setExecutiveSummary(summaryData);

      console.log('🔗 [Cross-Platform Dashboard] Loaded analysis data');
    } catch (error) {
      console.error('🚫 [Cross-Platform Dashboard] Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runNewAnalysis = async () => {
    setLoading(true);
    try {
      const newAnalysis = await crossPlatformAnalysisEngine.runCrossPlatformAnalysis(
        {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        },
        ['meta', 'google-ads', 'tiktok', 'linkedin']
      );
      
      setComparison(newAnalysis);
      loadAnalysisData(); // Refresh all data
    } catch (error) {
      console.error('🚫 Failed to run new analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'meta': return '📘';
      case 'google-ads': return '🔍';
      case 'tiktok': return '🎵';
      case 'linkedin': return '💼';
      case 'twitter': return '🐦';
      case 'snapchat': return '👻';
      default: return '🌐';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'meta': return 'text-blue-600';
      case 'google-ads': return 'text-green-600';
      case 'tiktok': return 'text-pink-600';
      case 'linkedin': return 'text-indigo-600';
      case 'twitter': return 'text-sky-600';
      case 'snapchat': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceIcon = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value > 15 ? <TrendingUp className="h-4 w-4 text-green-600" /> : 
             value > 5 ? <ArrowUpRight className="h-4 w-4 text-blue-600" /> : 
             <Activity className="h-4 w-4 text-gray-600" />;
    } else {
      return value < -15 ? <TrendingDown className="h-4 w-4 text-red-600" /> : 
             value < -5 ? <ArrowDownRight className="h-4 w-4 text-orange-600" /> : 
             <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Cross-Platform Campaign Analysis
            <Badge variant="outline" className="text-xs">
              Option C: Advanced Features
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runNewAnalysis}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Target className="h-4 w-4 mr-1" />
              )}
              {loading ? 'Analyzing...' : 'New Analysis'}
            </Button>
          </div>
        </div>
        <CardDescription>
          Comprehensive multi-platform performance analysis with attribution insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* Executive Summary */}
            {executiveSummary && (
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-purple-600" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    
                    {/* Key Metrics */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-700">Key Metrics</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Spend:</span>
                          <span className="font-semibold">€{executiveSummary.totalSpend.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Revenue:</span>
                          <span className="font-semibold text-green-600">€{executiveSummary.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Overall ROAS:</span>
                          <span className="font-semibold text-purple-600">{executiveSummary.overallROAS.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Insights */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-700">Top Insights</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Best Platform:</span>
                          <span className="font-semibold ml-2">{executiveSummary.bestPerformingPlatform}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Biggest Opportunity:</span>
                          <div className="text-xs text-gray-700 mt-1">{executiveSummary.biggestOpportunity}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Key Recommendation:</span>
                          <div className="text-xs text-gray-700 mt-1">{executiveSummary.keyRecommendation}</div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-700">Next Steps</h5>
                      <ul className="space-y-1">
                        {executiveSummary.nextSteps.slice(0, 4).map((step: string, index: number) => (
                          <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Platform Performance Overview */}
            {comparison && (
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Platform Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Platform Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparison.platforms.map((platform, index) => (
                        <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-lg">{getPlatformIcon(platform.platform)}</div>
                            <div>
                              <div className="font-medium text-sm">{platform.platform.toUpperCase()}</div>
                              <div className="text-xs text-gray-500">
                                €{platform.spend.toLocaleString()} spend
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-lg ${getPlatformColor(platform.platform)}`}>
                              {platform.roas.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">ROAS</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {comparison.insights.slice(0, 4).map((insight, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                              {insight.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                          </div>
                          <h6 className="font-semibold text-sm mb-1">{insight.title}</h6>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-gray-500">
                                Impact: {insight.impact}/100
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-gray-500">
                                Confidence: {(insight.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            
            {comparison && (
              <>
                {/* Platform Comparison Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Platform Performance Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end justify-around p-4">
                        {comparison.platforms.map((platform, i) => {
                          const maxROAS = Math.max(...comparison.platforms.map(p => p.roas));
                          const height = (platform.roas / maxROAS) * 70;
                          
                          return (
                            <div key={i} className="flex flex-col items-center">
                              <div
                                className={`rounded-t-lg relative group cursor-pointer transition-all hover:scale-105`}
                                style={{ 
                                  width: '40px',
                                  height: `${height}%`,
                                  background: `linear-gradient(to top, ${getPlatformColor(platform.platform).replace('text-', '')}, ${getPlatformColor(platform.platform).replace('text-', '')}aa)`
                                }}
                              >
                                {/* Tooltip */}
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  ROAS: {platform.roas.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-xs mt-2 font-medium">{getPlatformIcon(platform.platform)}</div>
                              <div className="text-xs text-gray-500">{platform.platform.toUpperCase()}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Metrics */}
                <div className="grid gap-4">
                  {comparison.platforms.map((platform) => (
                    <Card key={platform.platform} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getPlatformIcon(platform.platform)}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {platform.platform.toUpperCase()}
                              </h4>
                              <div className="text-sm text-gray-500">
                                {platform.conversions} conversions • {(platform.reach / 1000000).toFixed(1)}M reach
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getPlatformColor(platform.platform)}`}>
                              {platform.roas.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">ROAS</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="text-lg font-bold text-blue-600">
                              €{platform.spend.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Spend</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="text-lg font-bold text-green-600">
                              €{platform.revenue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Revenue</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="text-lg font-bold text-purple-600">
                              {platform.ctr.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">CTR</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="text-lg font-bold text-orange-600">
                              €{platform.cpa.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">CPA</div>
                          </div>
                        </div>

                        {/* Performance Indicators */}
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span>{(platform.impressions / 1000000).toFixed(1)}M impressions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MousePointer className="h-4 w-4 text-green-500" />
                            <span>{(platform.clicks / 1000).toFixed(1)}K clicks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>{platform.engagementRate.toFixed(1)}% engagement</span>
                          </div>
                        </div>

                        {/* Video Metrics (if available) */}
                        {platform.videoViews && (
                          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Play className="h-4 w-4 text-purple-500" />
                              <span>{(platform.videoViews / 1000000).toFixed(1)}M video views</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-orange-500" />
                              <span>{((platform.videoCompletionRate || 0) * 100).toFixed(0)}% completion</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

          </TabsContent>

          {/* Efficiency Tab */}
          <TabsContent value="efficiency" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Efficiency Rankings</CardTitle>
                <CardDescription>
                  Comprehensive efficiency analysis across cost, conversion, reach, and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {efficiencies.map((efficiency, index) => (
                    <div key={efficiency.platform} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                            #{efficiency.overallRanking}
                          </div>
                          <div className="text-2xl">{getPlatformIcon(efficiency.platform)}</div>
                          <div>
                            <h4 className="font-semibold">{efficiency.platform.toUpperCase()}</h4>
                            <div className="text-sm text-gray-500">Overall Efficiency Score</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {efficiency.efficiencyScore}
                          </div>
                          <div className="text-xs text-gray-500">/100</div>
                        </div>
                      </div>

                      {/* Efficiency Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Cost Efficiency</div>
                          <div className="flex items-center gap-2">
                            <Progress value={efficiency.costEfficiency} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{efficiency.costEfficiency.toFixed(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Conversion Efficiency</div>
                          <div className="flex items-center gap-2">
                            <Progress value={efficiency.conversionEfficiency} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{efficiency.conversionEfficiency.toFixed(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Reach Efficiency</div>
                          <div className="flex items-center gap-2">
                            <Progress value={efficiency.reachEfficiency} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{efficiency.reachEfficiency.toFixed(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Engagement Efficiency</div>
                          <div className="flex items-center gap-2">
                            <Progress value={efficiency.engagementEfficiency} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{efficiency.engagementEfficiency.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Strengths and Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium text-green-700 mb-2">Strengths</h6>
                          <div className="space-y-1">
                            {efficiency.strengths.slice(0, 3).map((strength, i) => (
                              <div key={i} className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {strength}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium text-orange-700 mb-2">Areas for Improvement</h6>
                          <div className="space-y-1">
                            {efficiency.weaknesses.slice(0, 3).map((weakness, i) => (
                              <div key={i} className="text-xs text-orange-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {weakness}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            
            {/* Audience Overlaps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Audience Overlap Analysis</CardTitle>
                <CardDescription>
                  Cross-platform audience overlap and incremental reach opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceOverlaps.map((overlap, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {overlap.platforms.map((platform, i) => (
                            <React.Fragment key={platform}>
                              <span className="text-lg">{getPlatformIcon(platform)}</span>
                              {i < overlap.platforms.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {overlap.overlapPercentage.toFixed(1)}% overlap
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="text-lg font-bold text-blue-600">
                            {(overlap.uniqueReach / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-blue-600">Unique Reach</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <div className="text-lg font-bold text-purple-600">
                            {(overlap.sharedAudience / 1000).toFixed(0)}K
                          </div>
                          <div className="text-xs text-purple-600">Shared Audience</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="text-lg font-bold text-green-600">
                            {(overlap.synergyOpportunity * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-green-600">Synergy Score</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <div className="text-lg font-bold text-orange-600">
                            {(overlap.cannibalizationRisk * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-orange-600">Cannibalization Risk</div>
                        </div>
                      </div>

                      {/* Incremental Reach Breakdown */}
                      <div>
                        <h6 className="font-medium text-gray-700 mb-2">Incremental Reach by Platform</h6>
                        <div className="space-y-2">
                          {Object.entries(overlap.incrementalReach).map(([platform, reach]) => (
                            <div key={platform} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span>{getPlatformIcon(platform)}</span>
                                <span className="text-sm font-medium">{platform.toUpperCase()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={(reach / overlap.uniqueReach) * 100} 
                                  className="w-20 h-2" 
                                />
                                <span className="text-sm font-medium">
                                  {(reach / 1000).toFixed(0)}K
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Synergies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Synergy Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformSynergies.map((synergy, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPlatformIcon(synergy.primaryPlatform)}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="text-lg">{getPlatformIcon(synergy.supportingPlatform)}</span>
                          <div className="ml-2">
                            <div className="font-medium text-sm">
                              {synergy.primaryPlatform.toUpperCase()} + {synergy.supportingPlatform.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {synergy.synergyScore}/100 synergy
                        </Badge>
                      </div>

                      {/* Synergy Details */}
                      <div className="space-y-3 mb-4">
                        {synergy.synergies.map((syn, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {syn.type}
                              </Badge>
                              <span className="text-sm">{syn.description}</span>
                            </div>
                            <div className="text-sm font-medium text-blue-600">
                              {syn.impact}/100
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h6 className="font-medium text-gray-700 mb-2">Recommendations</h6>
                        <ul className="space-y-1">
                          {synergy.recommendations.map((rec, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Attribution Tab */}
          <TabsContent value="attribution" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cross-Platform Attribution Analysis</CardTitle>
                <CardDescription>
                  Understanding each platform's role in the customer journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {attributionAnalyses.map((attribution) => (
                    <div key={attribution.platform} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{getPlatformIcon(attribution.platform)}</span>
                        <div>
                          <h4 className="font-semibold">{attribution.platform.toUpperCase()}</h4>
                          <div className="text-sm text-gray-500">
                            {attribution.customerJourneyRole} role
                          </div>
                        </div>
                      </div>

                      {/* Attribution Metrics */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="text-lg font-bold text-blue-600">
                              {attribution.directConversions}
                            </div>
                            <div className="text-xs text-blue-600">Direct Conversions</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="text-lg font-bold text-green-600">
                              {attribution.assistedConversions}
                            </div>
                            <div className="text-xs text-green-600">Assisted Conversions</div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Attribution Weight</span>
                            <span className="text-sm font-medium">
                              {(attribution.attributionWeight * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={attribution.attributionWeight * 100} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Touch Point Position:</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {attribution.touchPointPosition}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-600">Incremental Value:</span>
                            <span className="font-semibold ml-2 text-green-600">
                              €{attribution.incrementalValue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            
            {comparison && (
              <>
                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Strategic Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparison.recommendations.map((rec, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                                  {rec.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {rec.type.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {rec.title}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {rec.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">
                                +{(rec.expectedImpact.change * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500">
                                {rec.expectedImpact.metric}
                              </div>
                            </div>
                          </div>

                          {/* Platform Flow */}
                          {rec.sourcePlatform && rec.targetPlatform && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">{getPlatformIcon(rec.sourcePlatform)}</span>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <span className="text-lg">{getPlatformIcon(rec.targetPlatform)}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                {rec.sourcePlatform.toUpperCase()} → {rec.targetPlatform.toUpperCase()}
                              </span>
                            </div>
                          )}

                          {/* Implementation Details */}
                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <h6 className="font-medium text-gray-700 mb-2">Implementation</h6>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Effort:</span>
                                  <Badge variant="outline" className="text-xs">
                                    {rec.implementation.effort}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Timeframe:</span>
                                  <span>{rec.implementation.timeframe}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Confidence:</span>
                                  <span>{(rec.expectedImpact.confidence * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h6 className="font-medium text-gray-700 mb-2">Requirements</h6>
                              <ul className="space-y-1">
                                {rec.implementation.requirements.slice(0, 3).map((req, i) => (
                                  <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Reasoning */}
                          <div>
                            <h6 className="font-medium text-gray-700 mb-2">Reasoning</h6>
                            <ul className="space-y-1">
                              {rec.reasoning.map((reason, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                  <Shield className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparison.insights.map((insight, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                              {insight.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                            {getPerformanceIcon(insight.impact, insight.trend === 'improving')}
                          </div>
                          <h5 className="font-semibold text-sm mb-1">{insight.title}</h5>
                          <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                          
                          {/* Affected Platforms */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Platforms:</span>
                            {insight.platforms.map((platform, i) => (
                              <span key={i} className="text-sm">
                                {getPlatformIcon(platform)}
                              </span>
                            ))}
                            <div className="ml-auto flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3 text-blue-500" />
                                <span>Impact: {insight.impact}/100</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-green-500" />
                                <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}