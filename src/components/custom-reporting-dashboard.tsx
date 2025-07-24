// Custom Reporting & Visualization Dashboard - Option C Component
// Advanced reporting with customizable charts and data visualization

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  BarChart3, 
  LineChart,
  PieChart,
  Download,
  Share2,
  Settings,
  Calendar,
  Filter,
  Eye,
  Save,
  Plus,
  Trash2,
  Edit,
  Copy,
  FileText,
  Database,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  MousePointer,
  Clock,
  Globe
} from 'lucide-react';
import { useDataSource } from '@/contexts/DataSourceContext';

interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'chart' | 'table' | 'kpi';
  config: ReportConfig;
  createdAt: Date;
  lastModified: Date;
  isPublic: boolean;
  tags: string[];
}

interface ReportConfig {
  timeRange: string;
  platforms: string[];
  metrics: string[];
  dimensions: string[];
  filters: ReportFilter[];
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  groupBy: string;
  sortBy: string;
  limit: number;
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: string | number | [number, number];
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

export function CustomReportingDashboard() {
  const { getCampaignMetrics } = useDataSource();
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [reportBuilder, setReportBuilder] = useState<Partial<ReportConfig>>({
    timeRange: '30d',
    platforms: [],
    metrics: ['spend', 'impressions', 'clicks', 'conversions'],
    dimensions: ['date'],
    filters: [],
    chartType: 'line',
    groupBy: 'date',
    sortBy: 'date',
    limit: 100
  });

  // Initialize with sample reports
  useEffect(() => {
    initializeSampleReports();
  }, []);

  const initializeSampleReports = () => {
    const sampleReports: CustomReport[] = [
      {
        id: 'weekly_performance',
        name: 'Weekly Performance Summary',
        description: 'Comprehensive weekly overview of all campaigns',
        type: 'dashboard',
        config: {
          timeRange: '7d',
          platforms: ['meta', 'google-ads', 'tiktok'],
          metrics: ['spend', 'conversions', 'roas', 'ctr'],
          dimensions: ['date', 'platform'],
          filters: [],
          chartType: 'line',
          groupBy: 'date',
          sortBy: 'date',
          limit: 50
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isPublic: true,
        tags: ['weekly', 'overview', 'performance']
      },
      {
        id: 'platform_comparison',
        name: 'Platform Performance Comparison',
        description: 'Side-by-side comparison of all advertising platforms',
        type: 'chart',
        config: {
          timeRange: '30d',
          platforms: ['meta', 'google-ads', 'tiktok', 'linkedin'],
          metrics: ['roas', 'cpc', 'ctr', 'conversions'],
          dimensions: ['platform'],
          filters: [],
          chartType: 'bar',
          groupBy: 'platform',
          sortBy: 'roas',
          limit: 10
        },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isPublic: false,
        tags: ['platforms', 'comparison', 'roas']
      },
      {
        id: 'conversion_funnel',
        name: 'Conversion Funnel Analysis',
        description: 'Detailed analysis of the conversion funnel across touchpoints',
        type: 'dashboard',
        config: {
          timeRange: '30d',
          platforms: ['meta', 'google-ads'],
          metrics: ['impressions', 'clicks', 'conversions', 'value'],
          dimensions: ['touchpoint', 'position'],
          filters: [{ field: 'conversions', operator: 'greater', value: 0 }],
          chartType: 'area',
          groupBy: 'touchpoint',
          sortBy: 'conversions',
          limit: 20
        },
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isPublic: true,
        tags: ['funnel', 'attribution', 'conversion']
      },
      {
        id: 'budget_efficiency',
        name: 'Budget Efficiency Report',
        description: 'Analysis of budget allocation efficiency across campaigns',
        type: 'table',
        config: {
          timeRange: '30d',
          platforms: ['meta', 'google-ads', 'tiktok'],
          metrics: ['spend', 'roas', 'cpa', 'conversions'],
          dimensions: ['campaign', 'platform'],
          filters: [{ field: 'spend', operator: 'greater', value: 100 }],
          chartType: 'bar',
          groupBy: 'campaign',
          sortBy: 'roas',
          limit: 25
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lastModified: new Date(),
        isPublic: false,
        tags: ['budget', 'efficiency', 'campaigns']
      }
    ];

    setReports(sampleReports);
    console.log('📊 [Custom Reports] Loaded', sampleReports.length, 'sample reports');
  };

  const generateChartData = (config: ReportConfig): ChartData => {
    // Simulate chart data based on configuration
    const timeLabels = generateTimeLabels(config.timeRange);
    const datasets = config.metrics.map((metric, index) => ({
      label: metric.toUpperCase(),
      data: timeLabels.map(() => Math.random() * 1000 + 100),
      color: getMetricColor(metric, index)
    }));

    return {
      labels: timeLabels,
      datasets
    };
  };

  const generateTimeLabels = (timeRange: string): string[] => {
    const days = parseInt(timeRange.replace('d', ''));
    const labels: string[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.getDate().toString());
    }
    
    return labels;
  };

  const getMetricColor = (metric: string, index: number): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const metricColors: { [key: string]: string } = {
      'spend': '#EF4444',
      'roas': '#10B981',
      'conversions': '#3B82F6',
      'ctr': '#F59E0B',
      'cpc': '#8B5CF6',
      'impressions': '#06B6D4'
    };
    
    return metricColors[metric] || colors[index % colors.length];
  };

  const createNewReport = (name: string, description: string) => {
    const newReport: CustomReport = {
      id: `custom_${Date.now()}`,
      name,
      description,
      type: 'dashboard',
      config: { ...reportBuilder } as ReportConfig,
      createdAt: new Date(),
      lastModified: new Date(),
      isPublic: false,
      tags: []
    };

    setReports(prev => [...prev, newReport]);
    setIsCreating(false);
    setSelectedReport(newReport);
    console.log('✅ [Custom Reports] Created new report:', name);
  };

  const duplicateReport = (report: CustomReport) => {
    const duplicated: CustomReport = {
      ...report,
      id: `copy_${Date.now()}`,
      name: `${report.name} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date()
    };

    setReports(prev => [...prev, duplicated]);
    console.log('📋 [Custom Reports] Duplicated report:', report.name);
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
    console.log('🗑️ [Custom Reports] Deleted report:', reportId);
  };

  const exportReport = (report: CustomReport, format: 'pdf' | 'csv' | 'json') => {
    console.log(`📥 [Custom Reports] Exporting ${report.name} as ${format.toUpperCase()}`);
    // Simulate export
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_').toLowerCase()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderChart = (config: ReportConfig, data: ChartData) => {
    switch (config.chartType) {
      case 'line':
        return renderLineChart(data);
      case 'bar':
        return renderBarChart(data);
      case 'pie':
        return renderPieChart(data);
      case 'area':
        return renderAreaChart(data);
      default:
        return renderLineChart(data);
    }
  };

  const renderLineChart = (data: ChartData) => (
    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-end justify-around p-4">
        {data.labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center">
            {data.datasets.map((dataset, j) => (
              <div
                key={j}
                className="rounded-t-sm mb-1"
                style={{ 
                  width: '4px',
                  height: `${(dataset.data[i] / Math.max(...dataset.data)) * 60}%`,
                  backgroundColor: dataset.color,
                  marginLeft: j * 6
                }}
              />
            ))}
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="absolute top-4 left-4">
        {data.datasets.map((dataset, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: dataset.color }}
            />
            <span className="text-xs font-medium">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBarChart = (data: ChartData) => (
    <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-end justify-around p-4">
        {data.labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="flex items-end gap-1">
              {data.datasets.map((dataset, j) => (
                <div
                  key={j}
                  className="rounded-t"
                  style={{ 
                    width: '12px',
                    height: `${(dataset.data[i] / Math.max(...dataset.data)) * 60}%`,
                    backgroundColor: dataset.color
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPieChart = (data: ChartData) => (
    <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-8 border-purple-200 relative overflow-hidden">
          {data.datasets[0]?.data.map((value, i) => {
            const percentage = (value / data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100;
            return (
              <div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${getMetricColor('', i)} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg 360deg)`,
                  transform: `rotate(${i * 90}deg)`
                }}
              />
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <PieChart className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAreaChart = (data: ChartData) => (
    <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-end justify-around p-4">
        {data.labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center relative">
            {data.datasets.map((dataset, j) => (
              <div
                key={j}
                className="absolute bottom-0 rounded-t-sm opacity-60"
                style={{ 
                  width: '16px',
                  height: `${(dataset.data[i] / Math.max(...dataset.data)) * 60}%`,
                  backgroundColor: dataset.color,
                  left: `${j * 2}px`
                }}
              />
            ))}
            <div className="text-xs text-gray-500 mt-12">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Custom Reporting & Visualization
            <Badge variant="outline" className="text-xs">
              Option C: Advanced Features
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Report
            </Button>
          </div>
        </div>
        <CardDescription>
          Create custom reports and visualizations with advanced analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="builder">Report Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          {/* My Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            
            {/* Reports Grid */}
            <div className="grid gap-4">
              {reports.map((report) => (
                <Card key={report.id} className="border hover:border-indigo-200 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {report.name}
                          </h4>
                          <Badge variant={report.isPublic ? "default" : "secondary"} className="text-xs">
                            {report.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created: {report.createdAt.toLocaleDateString()}</span>
                          <span>Modified: {report.lastModified.toLocaleDateString()}</span>
                          <span>Type: {report.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateReport(report)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportReport(report, 'json')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReport(report.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Tags */}
                    {report.tags.length > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        {report.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Preview Chart */}
                    <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded border">
                      {renderChart(report.config, generateChartData(report.config))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Report Modal */}
            {selectedReport && (
              <Card className="mt-6 border-indigo-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{selectedReport.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportReport(selectedReport, 'pdf')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReport(null)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{selectedReport.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    
                    {/* Main Chart */}
                    <div className="md:col-span-2">
                      <div className="h-80">
                        {renderChart(selectedReport.config, generateChartData(selectedReport.config))}
                      </div>
                    </div>

                    {/* Report Details */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Configuration</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Time Range:</span>
                            <span>{selectedReport.config.timeRange}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platforms:</span>
                            <span>{selectedReport.config.platforms.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Metrics:</span>
                            <span>{selectedReport.config.metrics.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Chart Type:</span>
                            <span>{selectedReport.config.chartType}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Metrics</h5>
                        <div className="space-y-1">
                          {selectedReport.config.metrics.map((metric, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: getMetricColor(metric, index) }}
                              />
                              <span>{metric.toUpperCase()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Platforms</h5>
                        <div className="space-y-1">
                          {selectedReport.config.platforms.map((platform, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {platform.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </TabsContent>

          {/* Report Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            
            {isCreating && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-base">Create New Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input id="report-name" placeholder="Enter report name" />
                    </div>
                    <div>
                      <Label htmlFor="report-description">Description</Label>
                      <Input id="report-description" placeholder="Enter description" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => {
                        const nameInput = document.getElementById('report-name') as HTMLInputElement;
                        const descInput = document.getElementById('report-description') as HTMLInputElement;
                        createNewReport(nameInput.value, descInput.value);
                      }}
                    >
                      Create Report
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Report Builder Interface */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Configuration Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Time Range */}
                  <div>
                    <Label>Time Range</Label>
                    <Select 
                      value={reportBuilder.timeRange} 
                      onValueChange={(value) => setReportBuilder(prev => ({ ...prev, timeRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="14d">Last 14 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chart Type */}
                  <div>
                    <Label>Chart Type</Label>
                    <Select 
                      value={reportBuilder.chartType} 
                      onValueChange={(value: any) => setReportBuilder(prev => ({ ...prev, chartType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Metrics Selection */}
                  <div>
                    <Label>Metrics</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['spend', 'impressions', 'clicks', 'conversions', 'roas', 'ctr', 'cpc', 'cpa'].map((metric) => (
                        <div key={metric} className="flex items-center space-x-2">
                          <Checkbox 
                            id={metric}
                            checked={reportBuilder.metrics?.includes(metric)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setReportBuilder(prev => ({ 
                                  ...prev, 
                                  metrics: [...(prev.metrics || []), metric] 
                                }));
                              } else {
                                setReportBuilder(prev => ({ 
                                  ...prev, 
                                  metrics: prev.metrics?.filter(m => m !== metric) 
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={metric} className="text-sm">{metric.toUpperCase()}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platforms Selection */}
                  <div>
                    <Label>Platforms</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['meta', 'google-ads', 'tiktok', 'linkedin'].map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox 
                            id={platform}
                            checked={reportBuilder.platforms?.includes(platform)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setReportBuilder(prev => ({ 
                                  ...prev, 
                                  platforms: [...(prev.platforms || []), platform] 
                                }));
                              } else {
                                setReportBuilder(prev => ({ 
                                  ...prev, 
                                  platforms: prev.platforms?.filter(p => p !== platform) 
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={platform} className="text-sm">{platform.toUpperCase()}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Preview Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {renderChart(reportBuilder as ReportConfig, generateChartData(reportBuilder as ReportConfig))}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Metrics: {reportBuilder.metrics?.length || 0}</div>
                      <div>Platforms: {reportBuilder.platforms?.length || 0}</div>
                      <div>Time Range: {reportBuilder.timeRange}</div>
                      <div>Chart: {reportBuilder.chartType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Performance Overview Template */}
              <Card className="border hover:border-blue-200 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold">Performance Overview</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Comprehensive dashboard with key metrics and trends
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Template</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Attribution Analysis Template */}
              <Card className="border hover:border-green-200 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold">Attribution Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Multi-touch attribution with conversion path analysis
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Template</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Optimization Template */}
              <Card className="border hover:border-purple-200 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold">Budget Optimization</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Budget allocation efficiency and optimization insights
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Template</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Audience Insights Template */}
              <Card className="border hover:border-orange-200 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <h4 className="font-semibold">Audience Insights</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Audience behavior and segmentation analysis
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Template</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Shared Reports Tab */}
          <TabsContent value="shared" className="space-y-4">
            <div className="text-center py-8">
              <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Shared Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Reports shared with your team will appear here.
              </p>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Browse Public Reports
              </Button>
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}