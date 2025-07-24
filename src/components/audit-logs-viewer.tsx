import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Calendar,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: number;
  user_id: string;
  platform: string;
  account_id?: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  details?: any;
  error_message?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface AuditLogsViewerProps {
  userId: string;
}

const PLATFORM_CONFIG = {
  'meta': { name: 'Meta Ads', icon: '📘', color: 'bg-blue-100 text-blue-700' },
  'google-ads': { name: 'Google Ads', icon: '🔍', color: 'bg-green-100 text-green-700' },
  'google-analytics': { name: 'Google Analytics', icon: '📊', color: 'bg-orange-100 text-orange-700' },
  'tiktok': { name: 'TikTok Ads', icon: '🎵', color: 'bg-pink-100 text-pink-700' },
  'woocommerce': { name: 'WooCommerce', icon: '🛒', color: 'bg-purple-100 text-purple-700' }
};

const ACTION_CONFIG = {
  'connect': { name: 'Connection', icon: '🔗', color: 'bg-green-100 text-green-700' },
  'disconnect': { name: 'Disconnection', icon: '🔌', color: 'bg-red-100 text-red-700' },
  'refresh_token': { name: 'Token Refresh', icon: '🔄', color: 'bg-blue-100 text-blue-700' },
  'sync_data': { name: 'Data Sync', icon: '📊', color: 'bg-purple-100 text-purple-700' },
  'error': { name: 'Error', icon: '❌', color: 'bg-red-100 text-red-700' },
  'update': { name: 'Update', icon: '✏️', color: 'bg-yellow-100 text-yellow-700' },
  'test': { name: 'Test', icon: '🧪', color: 'bg-gray-100 text-gray-700' },
  'delete': { name: 'Delete', icon: '🗑️', color: 'bg-red-100 text-red-700' }
};

export function AuditLogsViewer({ userId }: AuditLogsViewerProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    platform: '',
    action: '',
    status: '',
    search: '',
    dateRange: '7d'
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, [userId]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadAuditLogs, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      const response = await fetch(`/api/v1/audit-logs?userId=${userId}&limit=100`);
      if (!response.ok) {
        throw new Error('Failed to load audit logs');
      }

      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filters.platform && log.platform !== filters.platform) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.status && log.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        log.platform.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.account_id?.toLowerCase().includes(searchLower) ||
        log.error_message?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Platform', 'Action', 'Status', 'Account ID', 'IP Address', 'Error Message'],
      ...filteredLogs.map(log => [
        new Date(log.created_at).toISOString(),
        log.platform,
        log.action,
        log.status,
        log.account_id || '',
        log.ip_address || '',
        log.error_message || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Audit logs exported successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('el-GR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffMs = now.getTime() - logTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">
            Monitor all integration activities and security events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={loadAuditLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Security:</strong> All integration actions are logged for audit purposes. 
          This includes connections, disconnections, token refreshes, and data synchronization.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform-filter">Platform</Label>
              <Select
                value={filters.platform}
                onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All platforms</SelectItem>
                  {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-filter">Action</Label>
              <Select
                value={filters.action}
                onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  {Object.entries(ACTION_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Audit Logs
            </div>
            <Badge variant="outline">
              {filteredLogs.length} logs
            </Badge>
          </CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} total logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading audit logs...</span>
            </div>
          ) : error ? (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium">No audit logs found</div>
              <div className="text-sm">
                {filters.platform || filters.action || filters.status || filters.search
                  ? 'Try adjusting your filters'
                  : 'No integration activities have been logged yet'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Account ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const platformConfig = PLATFORM_CONFIG[log.platform as keyof typeof PLATFORM_CONFIG];
                    const actionConfig = ACTION_CONFIG[log.action as keyof typeof ACTION_CONFIG];
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {formatTimestamp(log.created_at)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getTimeAgo(log.created_at)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {platformConfig && (
                            <Badge className={platformConfig.color}>
                              <span className="mr-1">{platformConfig.icon}</span>
                              {platformConfig.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {actionConfig && (
                            <Badge variant="outline" className="font-mono text-xs">
                              <span className="mr-1">{actionConfig.icon}</span>
                              {actionConfig.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge
                              variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}
                            >
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {log.account_id || 'N/A'}
                          </code>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {log.ip_address || 'N/A'}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLog(log);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this integration action
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Platform</Label>
                  <div className="text-sm text-muted-foreground">
                    {PLATFORM_CONFIG[selectedLog.platform as keyof typeof PLATFORM_CONFIG]?.name || selectedLog.platform}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Action</Label>
                  <div className="text-sm text-muted-foreground">
                    {ACTION_CONFIG[selectedLog.action as keyof typeof ACTION_CONFIG]?.name || selectedLog.action}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedLog.status)}
                    <span className="text-sm">{selectedLog.status}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Timestamp</Label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedLog.created_at).toLocaleString('el-GR')}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account ID</Label>
                  <div className="text-sm text-muted-foreground">
                    {selectedLog.account_id || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">IP Address</Label>
                  <div className="text-sm text-muted-foreground">
                    {selectedLog.ip_address || 'N/A'}
                  </div>
                </div>
              </div>

              {selectedLog.error_message && (
                <div>
                  <Label className="text-sm font-medium text-red-600">Error Message</Label>
                  <div className="text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {selectedLog.error_message}
                  </div>
                </div>
              )}

              {selectedLog.details && (
                <div>
                  <Label className="text-sm font-medium">Details</Label>
                  <pre className="text-sm bg-muted p-3 rounded-md overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.user_agent && (
                <div>
                  <Label className="text-sm font-medium">User Agent</Label>
                  <div className="text-sm text-muted-foreground break-all">
                    {selectedLog.user_agent}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 