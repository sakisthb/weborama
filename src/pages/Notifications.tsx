import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaaS } from '@/lib/clerk-provider';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  Clock,
  Filter,
  Search,
  Trash2,
  Archive,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';

const Notifications: React.FC = () => {
  const { user } = useSaaS();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      title: 'Campaign Performance Alert',
      message: 'Your Facebook campaign "Summer Sale" has exceeded 150% of its daily budget.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      category: 'campaigns'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Integration Issue',
      message: 'Google Ads integration is experiencing delays. Data may be incomplete.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      category: 'integrations'
    },
    {
      id: '3',
      type: 'info',
      title: 'New Feature Available',
      message: 'AI-powered campaign optimization is now available for Professional plans.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      category: 'features'
    },
    {
      id: '4',
      type: 'success',
      title: 'Data Sync Complete',
      message: 'All platform data has been successfully synchronized.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
      category: 'system'
    }
  ]);

  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      frequency: 'immediate',
      categories: {
        campaigns: true,
        integrations: true,
        features: true,
        system: true,
        billing: false
      }
    },
    browser: {
      enabled: true,
      sound: true,
      categories: {
        campaigns: true,
        integrations: true,
        features: false,
        system: false,
        billing: false
      }
    },
    mobile: {
      enabled: false,
      categories: {
        campaigns: true,
        integrations: true,
        features: false,
        system: false,
        billing: false
      }
    }
  });

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge variant="default" className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.category === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success('Marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const updateSetting = (channel: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof typeof prev],
        [setting]: value
      }
    }));
    toast.success('Settings updated');
  };

  const updateCategorySetting = (channel: string, category: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof typeof prev],
        categories: {
          ...prev[channel as keyof typeof prev].categories,
          [category]: enabled
        }
      }
    }));
    toast.success(`${category} notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Manage your notification preferences and view your notification history
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {unreadCount} unread
              </Badge>
            )}
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark all as read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">
              <Bell className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Filter className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notification History</CardTitle>
                    <CardDescription>
                      View and manage your recent notifications
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={clearAll} disabled={notifications.length === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="campaigns">Campaigns</SelectItem>
                        <SelectItem value="integrations">Integrations</SelectItem>
                        <SelectItem value="features">Features</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Notifications List */}
                  <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No notifications found</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                            notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{notification.title}</h4>
                                  {getNotificationBadge(notification.type)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {getTimeAgo(notification.timestamp)}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure email notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                    <Switch
                      id="email-enabled"
                      checked={settings.email.enabled}
                      onCheckedChange={(checked) => updateSetting('email', 'enabled', checked)}
                    />
                  </div>
                  
                  {settings.email.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email-frequency">Frequency</Label>
                        <Select
                          value={settings.email.frequency}
                          onValueChange={(value) => updateSetting('email', 'frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Categories</h4>
                        {Object.entries(settings.email.categories).map(([category, enabled]) => (
                          <div key={category} className="flex items-center justify-between">
                            <Label htmlFor={`email-${category}`} className="capitalize">
                              {category}
                            </Label>
                            <Switch
                              id={`email-${category}`}
                              checked={enabled}
                              onCheckedChange={(checked) => updateCategorySetting('email', category, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Browser Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Browser Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure browser push notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="browser-enabled">Enable Browser Notifications</Label>
                    <Switch
                      id="browser-enabled"
                      checked={settings.browser.enabled}
                      onCheckedChange={(checked) => updateSetting('browser', 'enabled', checked)}
                    />
                  </div>
                  
                  {settings.browser.enabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="browser-sound">Play Sound</Label>
                        <Switch
                          id="browser-sound"
                          checked={settings.browser.sound}
                          onCheckedChange={(checked) => updateSetting('browser', 'sound', checked)}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Categories</h4>
                        {Object.entries(settings.browser.categories).map(([category, enabled]) => (
                          <div key={category} className="flex items-center justify-between">
                            <Label htmlFor={`browser-${category}`} className="capitalize">
                              {category}
                            </Label>
                            <Switch
                              id={`browser-${category}`}
                              checked={enabled}
                              onCheckedChange={(checked) => updateCategorySetting('browser', category, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Mobile Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Mobile Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure mobile push notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile-enabled">Enable Mobile Notifications</Label>
                    <Switch
                      id="mobile-enabled"
                      checked={settings.mobile.enabled}
                      onCheckedChange={(checked) => updateSetting('mobile', 'enabled', checked)}
                    />
                  </div>
                  
                  {settings.mobile.enabled && (
                    <>
                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Categories</h4>
                        {Object.entries(settings.mobile.categories).map(([category, enabled]) => (
                          <div key={category} className="flex items-center justify-between">
                            <Label htmlFor={`mobile-${category}`} className="capitalize">
                              {category}
                            </Label>
                            <Switch
                              id={`mobile-${category}`}
                              checked={enabled}
                              onCheckedChange={(checked) => updateCategorySetting('mobile', category, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Customize your notification experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Quiet Hours</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiet-start">Start Time</Label>
                        <Input id="quiet-start" type="time" defaultValue="22:00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quiet-end">End Time</Label>
                        <Input id="quiet-end" type="time" defaultValue="08:00" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="quiet-enabled" />
                      <Label htmlFor="quiet-enabled">Enable quiet hours</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Priority Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>High Priority Alerts</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Campaign Performance</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>System Maintenance</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Feature Updates</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Advanced Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Group Similar Notifications</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Preview in Notifications</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Auto-dismiss after 5 seconds</Label>
                        <Switch />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Include User Avatar</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Action Buttons</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Persistent Notifications</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;