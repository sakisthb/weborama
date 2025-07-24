import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Phone, 
  Mail, 
  Video, 
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Users,
  Settings,
  BarChart3,
  Target,
  Globe,
  Shield,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqs = [
    {
      id: 'getting-started',
      category: 'Getting Started',
      questions: [
        {
          id: 'gs-1',
          question: 'How do I connect my first ad platform?',
          answer: 'To connect your first ad platform, go to Settings > Platform Integrations and click "Connect" next to the platform you want to add. Follow the OAuth flow to authorize access to your account. You can connect multiple platforms and manage them all from one dashboard.'
        },
        {
          id: 'gs-2',
          question: 'What platforms are supported?',
          answer: 'We currently support Meta Ads (Facebook/Instagram), Google Ads, Google Analytics 4, TikTok Ads, and WooCommerce. More platforms are being added regularly. Check our roadmap for upcoming integrations.'
        },
        {
          id: 'gs-3',
          question: 'How do I create my first campaign?',
          answer: 'Campaigns are automatically imported from your connected ad platforms. You don\'t need to create them manually in our system. Once connected, your existing campaigns will appear in the Campaigns tab with detailed analytics and insights.'
        }
      ]
    },
    {
      id: 'integrations',
      category: 'Integrations',
      questions: [
        {
          id: 'int-1',
          question: 'Why is my integration showing as disconnected?',
          answer: 'This usually happens when your access token has expired or been revoked. Go to Settings > Platform Integrations and click "Reconnect" for the affected platform. You may need to re-authorize the connection.'
        },
        {
          id: 'int-2',
          question: 'How often is data synced from my platforms?',
          answer: 'Data is synced automatically every 15 minutes for active campaigns and every hour for historical data. You can also manually refresh data by clicking the refresh button in the top right of any dashboard.'
        },
        {
          id: 'int-3',
          question: 'Can I connect multiple accounts from the same platform?',
          answer: 'Yes! You can connect multiple accounts from the same platform. Each account will be managed separately and you can switch between them using the account selector in the top navigation.'
        }
      ]
    },
    {
      id: 'analytics',
      category: 'Analytics & Reporting',
      questions: [
        {
          id: 'an-1',
          question: 'How accurate is the cross-platform attribution?',
          answer: 'Our cross-platform attribution uses advanced machine learning algorithms to provide accurate insights across all your connected platforms. The accuracy improves over time as we collect more data from your campaigns.'
        },
        {
          id: 'an-2',
          question: 'Can I export my data?',
          answer: 'Yes! You can export data in CSV, Excel, or PDF formats from any dashboard. Click the export button in the top right of any chart or table to download your data.'
        },
        {
          id: 'an-3',
          question: 'How far back does historical data go?',
          answer: 'We can access up to 2 years of historical data from most platforms, depending on your account settings and platform limitations. New data is continuously synced going forward.'
        }
      ]
    },
    {
      id: 'billing',
      category: 'Billing & Plans',
      questions: [
        {
          id: 'bill-1',
          question: 'Can I change my plan at any time?',
          answer: 'Yes! You can upgrade or downgrade your plan at any time from the Billing page. Changes take effect immediately, and you\'ll be charged or credited proportionally for the remainder of your billing cycle.'
        },
        {
          id: 'bill-2',
          question: 'What happens if I exceed my plan limits?',
          answer: 'You\'ll receive notifications when approaching your limits. If you exceed them, we\'ll contact you to discuss upgrading your plan. Your data and functionality won\'t be affected immediately.'
        },
        {
          id: 'bill-3',
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for new customers. If you\'re not satisfied, contact our support team within 30 days of your first payment for a full refund.'
        }
      ]
    }
  ];

  const quickGuides = [
    {
      id: 'setup',
      title: 'Quick Setup Guide',
      description: 'Get started in 5 minutes',
      icon: Zap,
      steps: [
        'Connect your first ad platform',
        'Review your imported campaigns',
        'Explore the analytics dashboard',
        'Set up your first report'
      ]
    },
    {
      id: 'integrations',
      title: 'Platform Integrations',
      description: 'Connect all your ad accounts',
      icon: Globe,
      steps: [
        'Navigate to Settings > Integrations',
        'Click "Connect" for each platform',
        'Authorize access to your accounts',
        'Verify data is syncing correctly'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics Deep Dive',
      description: 'Master your data insights',
      icon: BarChart3,
      steps: [
        'Explore the Analytics dashboard',
        'Use filters to segment your data',
        'Create custom reports',
        'Set up automated alerts'
      ]
    }
  ];

  const supportChannels = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Get help via email',
      icon: Mail,
      response: 'Within 24 hours',
      available: '24/7',
      action: 'Send Email'
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageSquare,
      response: 'Within 5 minutes',
      available: '9 AM - 6 PM EST',
      action: 'Start Chat'
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call us directly',
      icon: Phone,
      response: 'Immediate',
      available: '9 AM - 6 PM EST',
      action: 'Call Now'
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support request sent! We\'ll get back to you within 24 hours.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
  };

  const handleSupportAction = (channel: string) => {
    switch (channel) {
      case 'email':
        window.open('mailto:support@adspro.com', '_blank');
        break;
      case 'chat':
        toast.info('Live chat will be available soon!');
        break;
      case 'phone':
        window.open('tel:+1234567890', '_blank');
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and get the support you need
          </p>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides">
              <BookOpen className="w-4 h-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="support">
              <MessageSquare className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search FAQ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-8">
                      <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No questions found matching your search</p>
                    </div>
                  ) : (
                    filteredFaqs.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <h3 className="text-lg font-semibold">{category.category}</h3>
                        <div className="space-y-2">
                          {category.questions.map((faq) => (
                            <div key={faq.id} className="border rounded-lg">
                              <button
                                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                onClick={() => toggleFaq(faq.id)}
                              >
                                <span className="font-medium">{faq.question}</span>
                                {expandedFaq === faq.id ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              {expandedFaq === faq.id && (
                                <div className="px-4 pb-4">
                                  <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <guide.icon className="w-5 h-5" />
                      {guide.title}
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Getting Started', duration: '5:23', thumbnail: '🎥' },
                    { title: 'Platform Integrations', duration: '8:45', thumbnail: '🎥' },
                    { title: 'Analytics Dashboard', duration: '12:17', thumbnail: '🎥' },
                    { title: 'Creating Reports', duration: '6:32', thumbnail: '🎥' },
                    { title: 'Advanced Features', duration: '15:08', thumbnail: '🎥' },
                    { title: 'Troubleshooting', duration: '9:14', thumbnail: '🎥' }
                  ].map((video, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="text-2xl mb-2">{video.thumbnail}</div>
                      <h4 className="font-medium">{video.title}</h4>
                      <p className="text-sm text-muted-foreground">{video.duration}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportChannels.map((channel) => (
                <Card key={channel.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <channel.icon className="w-5 h-5" />
                      {channel.title}
                    </CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Response Time:</span>
                        <Badge variant="secondary">{channel.response}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Available:</span>
                        <span className="text-muted-foreground">{channel.available}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleSupportAction(channel.id)}
                    >
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
                <CardDescription>
                  Quick fixes for common problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      issue: 'Integration not connecting',
                      solution: 'Check your platform credentials and ensure you have the necessary permissions.',
                      icon: AlertTriangle,
                      severity: 'warning'
                    },
                    {
                      issue: 'Data not syncing',
                      solution: 'Try refreshing the data manually or reconnect the integration.',
                      icon: Info,
                      severity: 'info'
                    },
                    {
                      issue: 'Slow performance',
                      solution: 'Clear your browser cache or try accessing from a different browser.',
                      icon: Zap,
                      severity: 'info'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <item.icon className={`w-5 h-5 mt-0.5 ${
                        item.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{item.issue}</h4>
                        <p className="text-sm text-muted-foreground">{item.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Send us a message and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">First Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={contactForm.priority}
                        onValueChange={(value) => setContactForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Describe your issue or question..."
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Information</CardTitle>
                  <CardDescription>
                    Additional ways to get help
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Business Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday: 10:00 AM - 4:00 PM EST<br />
                        Sunday: Closed
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Response Times</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Email Support:</span>
                          <span className="text-muted-foreground">Within 24 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Live Chat:</span>
                          <span className="text-muted-foreground">Within 5 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone Support:</span>
                          <span className="text-muted-foreground">Immediate</span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Contact Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>support@adspro.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>+1 (234) 567-8900</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Help;