// Audience Segmentation Dashboard - Option C Component
// Advanced audience analysis and segmentation with ML insights

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Target,
  TrendingUp,
  Brain,
  Zap,
  Eye,
  Copy,
  Share2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  DollarSign,
  BarChart3,
  PieChart,
  Lightbulb,
  Filter,
  Download
} from 'lucide-react';
import { 
  audienceSegmentationEngine, 
  AudienceProfile, 
  SegmentationModel, 
  LookalikeAudience, 
  AudienceInsight 
} from '@/lib/audience-segmentation-engine';

export function AudienceSegmentationDashboard() {
  const [audiences, setAudiences] = useState<AudienceProfile[]>([]);
  const [models, setModels] = useState<SegmentationModel[]>([]);
  const [lookalikes, setLookalikes] = useState<LookalikeAudience[]>([]);
  const [insights, setInsights] = useState<AudienceInsight[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<AudienceProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAudienceData();
  }, []);

  const loadAudienceData = async () => {
    setLoading(true);
    
    try {
      // Load all audience data
      const audienceData = audienceSegmentationEngine.getAudiences();
      const modelData = audienceSegmentationEngine.getModels();
      const lookalikeData = audienceSegmentationEngine.getLookalikeAudiences();
      const insightData = audienceSegmentationEngine.generateAudienceInsights();
      const statsData = audienceSegmentationEngine.getSegmentationStats();

      setAudiences(audienceData);
      setModels(modelData);
      setLookalikes(lookalikeData);
      setInsights(insightData);
      setStats(statsData);

      console.log('👥 [Audience Dashboard] Loaded audience segmentation data');
    } catch (error) {
      console.error('🚫 [Audience Dashboard] Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLookalikeAudience = async (sourceId: string) => {
    try {
      const lookalike = await audienceSegmentationEngine.createLookalikeAudience(sourceId, 0.85, 8);
      setLookalikes(prev => [...prev, lookalike]);
      console.log('✅ Created lookalike audience:', lookalike.name);
    } catch (error) {
      console.error('🚫 Failed to create lookalike audience:', error);
    }
  };

  const getPerformanceColor = (value: number, metric: string) => {
    const thresholds: { [key: string]: { good: number; excellent: number } } = {
      roas: { good: 3.0, excellent: 4.5 },
      conversionRate: { good: 4.0, excellent: 7.0 },
      ctr: { good: 2.0, excellent: 3.5 },
      engagementScore: { good: 0.7, excellent: 0.85 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'text-gray-600';

    if (value >= threshold.excellent) return 'text-green-600';
    if (value >= threshold.good) return 'text-blue-600';
    return 'text-orange-600';
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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'trend': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'optimization': return <Zap className="h-4 w-4 text-purple-600" />;
      default: return <Lightbulb className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Audience Segmentation Dashboard
            <Badge variant="outline" className="text-xs">
              Option C: Advanced Features
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadAudienceData} disabled={loading}>
              <Settings className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        <CardDescription>
          Advanced ML-powered audience segmentation and behavioral analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="lookalikes">Lookalikes</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* Key Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Audiences</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalAudiences}</div>
                  <div className="text-xs text-blue-600/80">Active Segments</div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Total Users</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600/80">Segmented Users</div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Avg ROAS</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.averageROAS.toFixed(2)}
                  </div>
                  <div className="text-xs text-purple-600/80">Across All Segments</div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">ML Models</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{stats.modelsAvailable}</div>
                  <div className="text-xs text-orange-600/80">Active Models</div>
                </div>
              </div>
            )}

            {/* Top Performing Segments */}
            <div className="grid md:grid-cols-2 gap-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Performing Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {audiences
                      .sort((a, b) => b.performance.roas - a.performance.roas)
                      .slice(0, 5)
                      .map((audience, index) => (
                        <div key={audience.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <Badge variant="outline">#{index + 1}</Badge>
                            </div>
                            <div>
                              <div className="font-medium text-sm">{audience.name}</div>
                              <div className="text-xs text-gray-500">
                                {audience.size.toLocaleString()} users
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getPerformanceColor(audience.performance.roas, 'roas')}`}>
                              {audience.performance.roas.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">ROAS</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Segmentation Models Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {models.slice(0, 4).map((model) => (
                      <div key={model.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">{model.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {model.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Accuracy</span>
                            <span>{(model.accuracy * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={model.accuracy * 100} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                          <span>{model.segments} segments</span>
                          <span>Updated: {model.lastTrained.toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Segments Tab */}
          <TabsContent value="segments" className="space-y-4">
            
            <div className="grid gap-4">
              {audiences.map((audience) => (
                <Card key={audience.id} className="border hover:border-blue-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {audience.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {audience.size.toLocaleString()} users
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {audience.description}
                        </p>
                        
                        {/* Key Demographics */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>Age: {audience.criteria.ageRange.join('-')}</span>
                          <span>Engagement: {audience.criteria.engagementLevel}</span>
                          <span>Updated: {audience.lastUpdated.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAudience(audience)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => createLookalikeAudience(audience.id)}
                        >
                          <Copy className="h-4 w-4" />
                          Lookalike
                        </Button>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getPerformanceColor(audience.performance.roas, 'roas')}`}>
                          {audience.performance.roas.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">ROAS</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getPerformanceColor(audience.performance.conversionRate, 'conversionRate')}`}>
                          {audience.performance.conversionRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Conv. Rate</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getPerformanceColor(audience.performance.ctr, 'ctr')}`}>
                          {audience.performance.ctr.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          €{audience.performance.lifetimeValue.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">LTV</div>
                      </div>
                    </div>

                    {/* Device & Location Quick View */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Monitor className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {audience.devicePreferences.find(d => d.device === 'desktop')?.percentage || 0}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Smartphone className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {audience.devicePreferences.find(d => d.device === 'mobile')?.percentage || 0}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {audience.geolocation.length} locations
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded-full bg-green-500"
                          style={{ 
                            opacity: audience.performance.engagementScore,
                            transform: `scale(${audience.performance.engagementScore})`
                          }}
                        />
                        <span className="text-xs text-gray-500">
                          {(audience.performance.engagementScore * 100).toFixed(0)}% engaged
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Audience Details Modal */}
            {selectedAudience && (
              <Card className="mt-6 border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{selectedAudience.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAudience(null)}
                    >
                      ×
                    </Button>
                  </div>
                  <CardDescription>{selectedAudience.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Demographics Breakdown */}
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Demographics</h5>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-2">Age Distribution</div>
                          {Object.entries(selectedAudience.demographics.ageDistribution).map(([age, percentage]) => (
                            <div key={age} className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">{age}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={percentage * 100} className="w-20 h-1" />
                                <span className="text-xs font-medium">{(percentage * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-2">Gender Split</div>
                          {Object.entries(selectedAudience.demographics.genderDistribution).map(([gender, percentage]) => (
                            <div key={gender} className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600 capitalize">{gender}</span>
                              <span className="text-xs font-medium">{(percentage * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Top Interests & Behaviors */}
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Top Interests</h5>
                      <div className="space-y-2">
                        {selectedAudience.interests.slice(0, 5).map((interest, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div>
                              <div className="text-sm font-medium">{interest.category}</div>
                              <div className="text-xs text-gray-500">{interest.subcategory}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-600">
                                {(interest.affinity * 100).toFixed(0)}%
                              </div>
                              <div className="text-xs text-gray-500">affinity</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                AI-Generated Audience Insights
              </h4>
              
              {insights.map((insight, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {insight.title}
                          </h5>
                          <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.type}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {insight.description}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Impact Score</div>
                            <div className="flex items-center gap-2">
                              <Progress value={insight.impact} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{insight.impact}/100</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Confidence</div>
                            <div className="flex items-center gap-2">
                              <Progress value={insight.confidence * 100} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{(insight.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-2">Recommended Actions:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {insight.recommendedActions.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-xs text-gray-700 dark:text-gray-300">
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Affected segments:</span>
                          {insight.affectedSegments.map((segment, segIndex) => (
                            <Badge key={segIndex} variant="outline" className="text-xs">
                              {segment.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

          {/* Lookalikes Tab */}
          <TabsContent value="lookalikes" className="space-y-4">
            
            {lookalikes.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Lookalike Audiences Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create lookalike audiences from your best performing segments.
                </p>
                <Button 
                  onClick={() => audiences.length > 0 && createLookalikeAudience(audiences[0].id)}
                  disabled={audiences.length === 0}
                >
                  Create First Lookalike
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {lookalikes.map((lookalike) => (
                  <Card key={lookalike.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {lookalike.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Source: {audiences.find(a => a.id === lookalike.sourceAudience)?.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {lookalike.size.toLocaleString()} users
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${lookalike.confidence > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {(lookalike.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {lookalike.predictedPerformance.roas.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">Predicted ROAS</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {lookalike.predictedPerformance.conversionRate.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">Conv. Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {lookalike.similarity.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">Similarity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {lookalike.expansionRatio}x
                          </div>
                          <div className="text-xs text-gray-500">Expansion</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Features:</span>
                          {lookalike.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-4">
            
            <div className="grid md:grid-cols-2 gap-6">
              {models.map((model) => (
                <Card key={model.id} className="border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        {model.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {model.algorithm}
                      </Badge>
                    </div>
                    <CardDescription>
                      {model.type.replace(/_/g, ' ')} segmentation model
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Model Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                        <div className="flex items-center gap-2">
                          <Progress value={model.accuracy * 100} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Stability</div>
                        <div className="flex items-center gap-2">
                          <Progress value={model.performance.stabilityScore * 100} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{(model.performance.stabilityScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Segments Generated</div>
                        <div className="font-semibold">{model.segments || 'Dynamic'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Features Used</div>
                        <div className="font-semibold">{model.features.length}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Last Trained</div>
                        <div className="font-semibold">{model.lastTrained.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Silhouette Score</div>
                        <div className="font-semibold">{model.performance.silhouetteScore.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    {/* Model Features */}
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Key Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {model.features.slice(0, 6).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
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