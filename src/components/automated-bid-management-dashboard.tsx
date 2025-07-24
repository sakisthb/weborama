// Automated Bid Management Dashboard - Option C Component
// AI-powered bidding optimization with real-time monitoring

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Target,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Settings,
  AlertTriangle,
  CheckCircle,
  Activity,
  DollarSign,
  BarChart3,
  Clock,
  Brain,
  Shield,
  Eye,
  Edit,
  Plus,
  Lightbulb,
  Globe,
  Users,
  MousePointer,
  Timer
} from 'lucide-react';
import { 
  automatedBidManagement, 
  BidStrategy, 
  BidRecommendation, 
  MarketConditions, 
  BiddingRule 
} from '@/lib/automated-bid-management';

export function AutomatedBidManagementDashboard() {
  const [strategies, setStrategies] = useState<BidStrategy[]>([]);
  const [recommendations, setRecommendations] = useState<BidRecommendation[]>([]);
  const [marketConditions, setMarketConditions] = useState<MarketConditions[]>([]);
  const [biddingRules, setBiddingRules] = useState<BiddingRule[]>([]);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBiddingData();
  }, []);

  const loadBiddingData = async () => {
    setLoading(true);
    
    try {
      const strategiesData = automatedBidManagement.getStrategies();
      const recommendationsData = automatedBidManagement.getRecommendations();
      const marketData = automatedBidManagement.getMarketConditions();
      const rulesData = automatedBidManagement.getBiddingRules();
      const statsData = automatedBidManagement.getSystemStats();

      setStrategies(strategiesData);
      setRecommendations(recommendationsData);
      setMarketConditions(marketData);
      setBiddingRules(rulesData);
      setSystemStats(statsData);

      console.log('🤖 [Bid Management Dashboard] Loaded bidding data');
    } catch (error) {
      console.error('🚫 [Bid Management Dashboard] Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSystem = async () => {
    try {
      if (systemStats?.isRunning) {
        automatedBidManagement.stopAutomatedBidding();
      } else {
        await automatedBidManagement.startAutomatedBidding();
      }
      loadBiddingData(); // Refresh data
    } catch (error) {
      console.error('🚫 Failed to toggle system:', error);
    }
  };

  const toggleStrategy = async (strategyId: string) => {
    try {
      const success = automatedBidManagement.toggleStrategy(strategyId);
      if (success) {
        loadBiddingData(); // Refresh data
      }
    } catch (error) {
      console.error('🚫 Failed to toggle strategy:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value > 15 ? 'text-green-600' : value > 5 ? 'text-blue-600' : 'text-gray-600';
    } else {
      return value < -15 ? 'text-red-600' : value < -5 ? 'text-orange-600' : 'text-gray-600';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Automated Bid Management
            <Badge variant="outline" className="text-xs">
              Option C: Advanced Features
            </Badge>
            {systemStats?.isRunning && (
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                ACTIVE
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={systemStats?.isRunning ? "destructive" : "default"}
              size="sm"
              onClick={toggleSystem}
              disabled={loading}
            >
              {systemStats?.isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Stop System
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start System
                </>
              )}
            </Button>
          </div>
        </div>
        <CardDescription>
          AI-powered automated bidding with real-time optimization and market analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* System Status */}
            {systemStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Active Strategies</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {systemStats.activeStrategies}
                  </div>
                  <div className="text-xs text-green-600/80">Running Now</div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Adjustments</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {systemStats.totalAdjustments.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600/80">Total Made</div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Performance</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    +{systemStats.avgPerformanceImprovement.toFixed(1)}%
                  </div>
                  <div className="text-xs text-purple-600/80">Avg Improvement</div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    €{systemStats.totalCostSavings.toLocaleString()}
                  </div>
                  <div className="text-xs text-orange-600/80">Total Saved</div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Active Strategies Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Strategy Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategies
                      .filter(s => s.isActive)
                      .slice(0, 4)
                      .map((strategy) => (
                        <div key={strategy.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <Brain className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{strategy.name}</div>
                              <div className="text-xs text-gray-500">
                                {strategy.platform.toUpperCase()} • {strategy.type.replace(/_/g, ' ')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getPerformanceColor(strategy.performance.performanceImprovement)}`}>
                              +{strategy.performance.performanceImprovement.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {(strategy.performance.successRate * 100).toFixed(0)}% success
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Urgent Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations
                      .filter(r => r.urgency === 'high' || r.urgency === 'critical')
                      .slice(0, 4)
                      .map((rec, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <div>
                              <div className="font-medium text-sm">{rec.campaignName}</div>
                              <div className="text-xs text-gray-600">
                                {rec.currentBid.toFixed(2)} → {rec.recommendedBid.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`text-xs ${getUrgencyColor(rec.urgency)}`}>
                              {rec.urgency}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {rec.bidChange > 0 ? '+' : ''}{rec.bidChange.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}

                    {recommendations.filter(r => r.urgency === 'high' || r.urgency === 'critical').length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="text-sm">No urgent recommendations</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                System Health
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automation Status</span>
                  <Badge className={systemStats?.isRunning ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {systemStats?.isRunning ? 'Active' : 'Stopped'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Optimization</span>
                  <span className="text-sm text-gray-600">
                    {systemStats?.lastOptimization ? new Date(systemStats.lastOptimization).toLocaleTimeString() : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Actions</span>
                  <Badge variant="outline">
                    {systemStats?.pendingRecommendations || 0}
                  </Badge>
                </div>
              </div>
            </div>

          </TabsContent>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="space-y-4">
            
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Bidding Strategies
              </h4>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                New Strategy
              </Button>
            </div>

            <div className="grid gap-4">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {strategy.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {strategy.platform.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {strategy.type.replace(/_/g, ' ')}
                          </Badge>
                          {strategy.isActive && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {strategy.description}
                        </p>
                        
                        {/* Strategy Configuration */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Target Metric</div>
                            <div className="font-semibold">{strategy.config.targetMetric.toUpperCase()}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Target Value</div>
                            <div className="font-semibold">
                              {strategy.config.targetValue ? strategy.config.targetValue.toFixed(2) : 'Dynamic'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Automation</div>
                            <div className="font-semibold capitalize">{strategy.config.automationLevel}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Frequency</div>
                            <div className="font-semibold">{strategy.config.frequencyHours}h</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={strategy.isActive}
                          onCheckedChange={() => toggleStrategy(strategy.id)}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-lg font-bold text-blue-600">
                          {strategy.performance.totalAdjustments.toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-600">Adjustments</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-lg font-bold text-green-600">
                          +{strategy.performance.performanceImprovement.toFixed(1)}%
                        </div>
                        <div className="text-xs text-green-600">Performance</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="text-lg font-bold text-purple-600">
                          €{strategy.performance.costSavings.toLocaleString()}
                        </div>
                        <div className="text-xs text-purple-600">Savings</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="text-lg font-bold text-orange-600">
                          {(strategy.performance.successRate * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-orange-600">Success Rate</div>
                      </div>
                    </div>

                    {/* Bid Adjustments */}
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Active Adjustments ({strategy.config.bidAdjustments.filter(a => a.isEnabled).length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {strategy.config.bidAdjustments
                          .filter(adj => adj.isEnabled)
                          .slice(0, 6)
                          .map((adj, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {adj.name}: {adj.adjustment > 0 ? '+' : ''}{adj.adjustment}%
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Bid Recommendations ({recommendations.length})
              </h4>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${recommendations.filter(r => r.urgency === 'critical').length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {recommendations.filter(r => r.urgency === 'critical').length} Critical
                </Badge>
                <Badge className="text-xs bg-orange-100 text-orange-800">
                  {recommendations.filter(r => r.urgency === 'high').length} High
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Active Recommendations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All campaigns are performing optimally. The system will generate new recommendations as needed.
                  </p>
                </div>
              ) : (
                recommendations.map((rec, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-semibold text-gray-900 dark:text-white">
                              {rec.campaignName}
                            </h5>
                            <Badge variant="outline" className="text-xs">
                              {rec.platform.toUpperCase()}
                            </Badge>
                            <Badge className={`text-xs ${getUrgencyColor(rec.urgency)}`}>
                              {rec.urgency}
                            </Badge>
                            {rec.autoImplement && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Auto-Implement
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-gray-500">Current Bid</div>
                              <div className="font-semibold">€{rec.currentBid.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Recommended Bid</div>
                              <div className="font-semibold text-blue-600">€{rec.recommendedBid.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Change</div>
                              <div className={`font-semibold flex items-center gap-1 ${getPerformanceColor(rec.bidChange, rec.bidChange > 0)}`}>
                                {rec.bidChange > 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {rec.bidChange > 0 ? '+' : ''}{rec.bidChange.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Apply
                          </Button>
                        </div>
                      </div>

                      {/* Expected Impact */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Expected Impact</div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{rec.expectedImpact.metric.toUpperCase()}</span>
                            <span className={`text-sm ${getPerformanceColor(rec.expectedImpact.change * 100, rec.expectedImpact.change > 0)}`}>
                              {rec.expectedImpact.change > 0 ? '+' : ''}{(rec.expectedImpact.change * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Confidence:</span>
                            <Progress 
                              value={rec.expectedImpact.confidence * 100} 
                              className="w-16 h-2" 
                            />
                            <span className="text-xs font-medium">
                              {(rec.expectedImpact.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Reasoning</div>
                        <ul className="list-disc list-inside space-y-1">
                          {rec.reasoning.map((reason, reasonIndex) => (
                            <li key={reasonIndex} className="text-xs text-gray-700 dark:text-gray-300">
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Valid Until */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Valid until: {rec.validUntil.toLocaleString()}</span>
                        <span>ID: {rec.id.slice(-8)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

          </TabsContent>

          {/* Market Conditions Tab */}
          <TabsContent value="market" className="space-y-4">
            
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              Market Conditions & Intelligence
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              {marketConditions.map((market) => (
                <Card key={market.platform} className="border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        {market.platform.toUpperCase()}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Updated: {market.updatedAt.toLocaleTimeString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Competition Level */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Competition Level</span>
                      <Badge className={`text-xs ${getCompetitionColor(market.competitionLevel)}`}>
                        {market.competitionLevel.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    {/* CPC Trend */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">CPC Trend</span>
                        <div className={`flex items-center gap-1 ${getPerformanceColor(market.avgCPCTrend, market.avgCPCTrend < 0)}`}>
                          {market.avgCPCTrend > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="text-sm font-medium">
                            {market.avgCPCTrend > 0 ? '+' : ''}{market.avgCPCTrend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={Math.abs(market.avgCPCTrend) * 2} 
                        className="h-2" 
                      />
                    </div>

                    {/* Impression Volume */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Impression Volume</span>
                      <span className="font-semibold">
                        {(market.impressionVolume / 1000000).toFixed(1)}M
                      </span>
                    </div>

                    {/* Seasonality Factor */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Seasonality Factor</span>
                        <span className="font-semibold">
                          {market.seasonalityFactor.toFixed(2)}x
                        </span>
                      </div>
                      <Progress 
                        value={(market.seasonalityFactor - 0.5) * 100} 
                        className="h-2" 
                      />
                    </div>

                    {/* Special Conditions */}
                    <div className="space-y-2">
                      {market.holidayEffect && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          🎉 Holiday Effect Active
                        </Badge>
                      )}
                      {market.weatherImpact && (
                        <Badge variant="outline" className="text-xs">
                          🌤️ Weather Impact: {market.weatherImpact > 0 ? '+' : ''}{market.weatherImpact.toFixed(1)}%
                        </Badge>
                      )}
                    </div>

                    {/* Economic Indicators */}
                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-500 mb-2">Economic Indicators</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Consumer Confidence:</span>
                          <span className="font-medium ml-1">
                            {market.economicIndicators.consumerConfidence.toFixed(0)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Market Volatility:</span>
                          <span className="font-medium ml-1">
                            {market.economicIndicators.marketVolatility.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Bidding Rules ({biddingRules.filter(r => r.isEnabled).length} active)
              </h4>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                New Rule
              </Button>
            </div>

            <div className="space-y-4">
              {biddingRules.map((rule) => (
                <Card key={rule.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {rule.name}
                          </h5>
                          <Badge 
                            variant={rule.isEnabled ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {rule.isEnabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Priority {rule.priority}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Condition:</strong> {rule.condition}
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Action:</strong> {rule.action.replace(/_/g, ' ')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isEnabled}
                          onCheckedChange={() => {
                            rule.isEnabled = !rule.isEnabled;
                            setBiddingRules([...biddingRules]);
                          }}
                        />
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Rule Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Triggered Count</div>
                        <div className="font-semibold">{rule.triggeredCount}</div>
                      </div>
                      {rule.lastTriggered && (
                        <div>
                          <div className="text-gray-500">Last Triggered</div>
                          <div className="font-semibold">
                            {rule.lastTriggered.toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-gray-500">Status</div>
                        <div className={`font-semibold ${rule.isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                          {rule.isEnabled ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>

                    {/* Rule Parameters */}
                    {Object.keys(rule.parameters).length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-gray-500 mb-2">Parameters</div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(rule.parameters).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {typeof value === 'boolean' ? (value ? 'true' : 'false') : value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}