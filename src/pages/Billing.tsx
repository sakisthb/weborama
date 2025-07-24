import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaaS } from '@/lib/clerk-provider';
import { SubscriptionPlan, getPlanDisplayName, getPlanPrice } from '@/lib/clerk-config';
import { 
  CreditCard, 
  Receipt, 
  Download, 
  Calendar, 
  Users, 
  Zap, 
  Shield, 
  Crown,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

const Billing: React.FC = () => {
  const { user, organization } = useSaaS();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(user?.subscriptionPlan || SubscriptionPlan.FREE);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Mock data
  const currentUsage = {
    users: 3,
    maxUsers: 5,
    campaigns: 25,
    maxCampaigns: 25,
    platforms: 3,
    maxPlatforms: 3,
    storage: 2.5,
    maxStorage: 5
  };

  const invoices = [
    {
      id: 'INV-001',
      date: '2025-01-15',
      amount: 99.00,
      status: 'paid',
      description: 'Professional Plan - January 2025'
    },
    {
      id: 'INV-002',
      date: '2024-12-15',
      amount: 99.00,
      status: 'paid',
      description: 'Professional Plan - December 2024'
    },
    {
      id: 'INV-003',
      date: '2024-11-15',
      amount: 29.00,
      status: 'paid',
      description: 'Starter Plan - November 2024'
    }
  ];

  const paymentMethods = [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiry: '12/26',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'card',
      last4: '5555',
      brand: 'mastercard',
      expiry: '08/25',
      isDefault: false
    }
  ];

  const plans = [
    {
      id: SubscriptionPlan.FREE,
      name: 'Free',
      price: 0,
      features: [
        '2 users',
        '5 campaigns',
        '1 platform',
        'Basic analytics',
        'Email support'
      ],
      limitations: [
        'No advanced features',
        'Limited data retention',
        'No priority support'
      ]
    },
    {
      id: SubscriptionPlan.STARTER,
      name: 'Starter',
      price: 29,
      features: [
        '5 users',
        '25 campaigns',
        '3 platforms',
        'Advanced analytics',
        'Priority support',
        'Data export'
      ],
      limitations: [
        'No white-label',
        'Limited integrations'
      ]
    },
    {
      id: SubscriptionPlan.PROFESSIONAL,
      name: 'Professional',
      price: 99,
      features: [
        '15 users',
        '100 campaigns',
        '5 platforms',
        'AI predictions',
        'White-label options',
        'API access',
        'Advanced reporting',
        'Phone support'
      ],
      limitations: [
        'No enterprise features'
      ]
    },
    {
      id: SubscriptionPlan.ENTERPRISE,
      name: 'Enterprise',
      price: 299,
      features: [
        'Unlimited users',
        'Unlimited campaigns',
        'All platforms',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Custom features',
        'On-premise option'
      ],
      limitations: []
    }
  ];

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    setIsUpgrading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully upgraded to ${getPlanDisplayName(plan)} plan! 🎉`);
      setSelectedPlan(plan);
    } catch (error) {
      toast.error('Failed to upgrade plan. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleDowngrade = async (plan: SubscriptionPlan) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Successfully downgraded to ${getPlanDisplayName(plan)} plan.`);
      setSelectedPlan(plan);
    } catch (error) {
      toast.error('Failed to downgrade plan. Please try again.');
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}...`);
    // Simulate download
    setTimeout(() => {
      toast.success('Invoice downloaded successfully!');
    }, 1000);
  };

  const getUsagePercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="plans">
              <Crown className="w-4 h-4 mr-2" />
              Plans
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <Receipt className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>
                    Your active subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{getPlanDisplayName(user?.subscriptionPlan)}</h3>
                      <p className="text-muted-foreground">€{getPlanPrice(user?.subscriptionPlan)}/month</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Next billing date</p>
                    <p className="font-medium">February 15, 2025</p>
                  </div>
                </CardContent>
              </Card>

              {/* Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Usage This Month
                  </CardTitle>
                  <CardDescription>
                    Your current resource usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Users</span>
                      <span className="text-sm font-medium">
                        {currentUsage.users}/{currentUsage.maxUsers}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-blue-600 h-2 rounded-full ${getUsageColor(getUsagePercentage(currentUsage.users, currentUsage.maxUsers))}`}
                        style={{ width: `${getUsagePercentage(currentUsage.users, currentUsage.maxUsers)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Campaigns</span>
                      <span className="text-sm font-medium">
                        {currentUsage.campaigns}/{currentUsage.maxCampaigns}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-green-600 h-2 rounded-full ${getUsageColor(getUsagePercentage(currentUsage.campaigns, currentUsage.maxCampaigns))}`}
                        style={{ width: `${getUsagePercentage(currentUsage.campaigns, currentUsage.maxCampaigns)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Platforms</span>
                      <span className="text-sm font-medium">
                        {currentUsage.platforms}/{currentUsage.maxPlatforms}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-purple-600 h-2 rounded-full ${getUsageColor(getUsagePercentage(currentUsage.platforms, currentUsage.maxPlatforms))}`}
                        style={{ width: `${getUsagePercentage(currentUsage.platforms, currentUsage.maxPlatforms)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.id === user?.subscriptionPlan ? 'ring-2 ring-blue-500' : ''}`}>
                  {plan.id === user?.subscriptionPlan && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2" variant="default">
                      Current Plan
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {plan.id === SubscriptionPlan.ENTERPRISE && <Crown className="w-5 h-5 text-yellow-500" />}
                      {plan.id === SubscriptionPlan.PROFESSIONAL && <Shield className="w-5 h-5 text-blue-500" />}
                      {plan.id === SubscriptionPlan.STARTER && <Zap className="w-5 h-5 text-green-500" />}
                      {plan.id === SubscriptionPlan.FREE && <Settings className="w-5 h-5 text-gray-500" />}
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">€{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Features:</h4>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600">Limitations:</h4>
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                              <X className="w-4 h-4" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4">
                      {plan.id === user?.subscriptionPlan ? (
                        <Button variant="outline" className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : plan.price > (user?.subscriptionPlan === SubscriptionPlan.FREE ? 0 : getPlanPrice(user?.subscriptionPlan)) ? (
                        <Button 
                          className="w-full" 
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isUpgrading}
                        >
                          {isUpgrading ? 'Upgrading...' : 'Upgrade'}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleDowngrade(plan.id)}
                        >
                          Downgrade
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{invoice.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.id} • {new Date(invoice.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">€{invoice.amount.toFixed(2)}</p>
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        <div>
                          <p className="font-medium">
                            {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiry}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                  <CardDescription>
                    Update your billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Main St" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="Athens" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" defaultValue="12345" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="gr">
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gr">Greece</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Update Billing Address</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing; 