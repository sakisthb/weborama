// Backup and Recovery Dashboard - Option D Implementation
// Real-time monitoring and management interface for backup and disaster recovery

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Database, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Upload,
  RotateCcw,
  FileText,
  Calendar,
  HardDrive,
  Zap
} from 'lucide-react';
import { useBackupRecovery, BackupMetadata, RecoveryPlan, DisasterScenario, BackupMetrics } from '@/lib/backup-recovery';

export function BackupDashboard() {
  const {
    createBackup,
    verifyBackup,
    restoreFromBackup,
    executeRecoveryPlan,
    getBackupMetrics,
    getBackups,
    getRecoveryPlans,
    getDisasterScenarios,
    exportBackupReport
  } = useBackupRecovery();

  const [metrics, setMetrics] = useState<BackupMetrics | null>(null);
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>([]);
  const [scenarios, setScenarios] = useState<DisasterScenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setMetrics(getBackupMetrics());
    setBackups(getBackups({ limit: 20 }));
    setRecoveryPlans(getRecoveryPlans());
    setScenarios(getDisasterScenarios());
  };

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    setIsLoading(true);
    try {
      await createBackup(type);
      loadData();
    } catch (error) {
      console.error('Backup creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyBackup = async (backupId: string) => {
    setIsLoading(true);
    try {
      await verifyBackup(backupId);
      loadData();
    } catch (error) {
      console.error('Backup verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (backupId: string, dryRun: boolean = true) => {
    setIsLoading(true);
    try {
      await restoreFromBackup(backupId, { dryRun });
      loadData();
    } catch (error) {
      console.error('Backup restore failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecutePlan = async (planId: string, dryRun: boolean = true) => {
    setIsLoading(true);
    try {
      await executeRecoveryPlan(planId, dryRun);
      loadData();
    } catch (error) {
      console.error('Recovery plan execution failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Backup & Recovery</h2>
          <p className="text-muted-foreground">
            Comprehensive data protection and disaster recovery management
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleCreateBackup('incremental')}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Incremental Backup</span>
          </Button>
          <Button 
            onClick={() => handleCreateBackup('full')}
            disabled={isLoading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Database className="h-4 w-4" />
            <span>Full Backup</span>
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Readiness</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.recoveryReadiness}%</div>
            <Progress value={metrics.recoveryReadiness} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Overall system recovery preparedness
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBackups}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.successfulBackups} successful, {metrics.failedBackups} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(metrics.storageUsed)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatBytes(metrics.averageBackupSize)} per backup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.lastBackupTime ? 
                new Date(metrics.lastBackupTime).toLocaleDateString() : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              Next: {metrics.nextBackupTime ? 
                new Date(metrics.nextBackupTime).toLocaleString() : 'Not scheduled'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Alert */}
      {metrics.recoveryReadiness < 80 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Recovery Readiness Warning</AlertTitle>
          <AlertDescription>
            Your recovery readiness is below 80%. Consider creating a verified backup and testing recovery plans.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Plans</TabsTrigger>
          <TabsTrigger value="scenarios">Disaster Scenarios</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Backups</CardTitle>
              <CardDescription>
                Backup history and management controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div 
                    key={backup.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBackup === backup.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedBackup(backup.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(backup.status)}>
                          {backup.status}
                        </Badge>
                        <Badge variant="outline">
                          {backup.type}
                        </Badge>
                        <span className="font-medium">{backup.id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {backup.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyBackup(backup.id);
                            }}
                            disabled={isLoading}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {(backup.status === 'completed' || backup.status === 'verified') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreBackup(backup.id, true);
                            }}
                            disabled={isLoading}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Created:</span><br />
                        {new Date(backup.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span><br />
                        {formatBytes(backup.size)}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span><br />
                        {formatDuration(backup.duration)}
                      </div>
                      <div>
                        <span className="font-medium">Tables:</span><br />
                        {backup.tables.length} tables
                      </div>
                    </div>
                    {backup.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        Error: {backup.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recovery Plans Tab */}
        <TabsContent value="recovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recovery Plans</CardTitle>
              <CardDescription>
                Disaster recovery procedures and execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recoveryPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getPriorityColor(plan.priority)}>
                          {plan.priority}
                        </Badge>
                        <span className="font-medium">{plan.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecutePlan(plan.id, true);
                          }}
                          disabled={isLoading}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to execute this recovery plan?')) {
                              handleExecutePlan(plan.id, false);
                            }
                          }}
                          disabled={isLoading}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Execute
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">RTO:</span><br />
                        {plan.rto} minutes
                      </div>
                      <div>
                        <span className="font-medium">RPO:</span><br />
                        {plan.rpo} minutes
                      </div>
                      <div>
                        <span className="font-medium">Steps:</span><br />
                        {plan.steps.length} steps
                      </div>
                      <div>
                        <span className="font-medium">Last Tested:</span><br />
                        {plan.lastTested ? new Date(plan.lastTested).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                    {selectedPlan === plan.id && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Recovery Steps:</h4>
                        {plan.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-2 text-sm">
                            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span>{step.name}</span>
                            <Badge variant="outline">{step.type}</Badge>
                            <span className="text-muted-foreground">({step.estimatedTime}m)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disaster Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disaster Scenarios</CardTitle>
              <CardDescription>
                Potential disaster scenarios and mitigation strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{scenario.likelihood}</Badge>
                        <Badge className={scenario.impact === 'catastrophic' ? 'bg-red-500' : 
                                         scenario.impact === 'major' ? 'bg-orange-500' : 'bg-yellow-500'}>
                          {scenario.impact}
                        </Badge>
                        <span className="font-medium">{scenario.name}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{scenario.description}</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Mitigation Strategies:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {scenario.mitigation.map((item, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Detection Methods:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {scenario.detection.map((item, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery Reports</CardTitle>
              <CardDescription>
                Generate comprehensive reports for compliance and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    const report = exportBackupReport();
                    const blob = new Blob([report], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `backup-report-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Full Report</span>
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 border rounded">
                    <div className="font-medium">Backup Compliance</div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((metrics.successfulBackups / Math.max(metrics.totalBackups, 1)) * 100)}%
                    </div>
                    <div className="text-muted-foreground">Success rate</div>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="font-medium">Recovery Testing</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {recoveryPlans.filter(p => p.lastTested).length}
                    </div>
                    <div className="text-muted-foreground">Plans tested</div>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="font-medium">Data Protection</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatBytes(metrics.storageUsed)}
                    </div>
                    <div className="text-muted-foreground">Protected data</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}