// Optimized Landing Page - Performance First
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Check, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap, 
  Shield,
  Play,
  Award,
  Rocket,
  Brain,
  DollarSign
} from 'lucide-react';

// Lazy load heavy components
const AnimatedChart = lazy(() => import('@/components/animated-chart'));
const TestimonialsSection = lazy(() => import('@/components/testimonials-section'));

// Performance optimized hero section
function HeroSection() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        
        {/* Announcement Banner */}
        <div className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Rocket className="h-4 w-4" />
          <span className="text-sm font-medium">🚀 Production Ready - Enterprise SaaS Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Advanced Campaign
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Analytics</span>
          <br />για Marketing Pros
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Ανάλυση, βελτιστοποίηση και παρακολούθηση των Meta Ads καμπανιών σας με 
          <strong> AI-powered insights</strong> και <strong>multi-touch attribution</strong>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/welcome')}
          >
            <Rocket className="mr-2 h-5 w-5" />
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-gray-300 hover:border-blue-500 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200"
            onClick={() => navigate('/hidden-welcome')}
          >
            <Play className="mr-2 h-5 w-5" />
            Live Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Enterprise Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>5-Star Support</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Performance optimized features section
function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Real-Time Analytics",
      description: "Live campaign performance tracking με instant insights"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI Optimization",
      description: "Predictive analytics και automated budget optimization"
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Multi-Touch Attribution",
      description: "Advanced attribution modeling με ML algorithms"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Performance Acceleration",
      description: "Optimize ROAS και scale profitable campaigns"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
            ✨ Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional tools για data-driven marketing decisions
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}

// Performance optimized pricing section
function PricingSection() {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2">
            💰 Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Professional analytics για κάθε μέγεθος business
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
              <div className="text-4xl font-bold text-blue-600 mt-4">
                €29<span className="text-lg text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>5 Campaigns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Basic Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Email Support</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6" 
                variant="outline"
                onClick={() => navigate('/welcome')}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan (Popular) */}
          <Card className="border-2 border-blue-500 hover:border-blue-600 transition-all duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-6 py-2">
                🔥 Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
              <div className="text-4xl font-bold text-blue-600 mt-4">
                €99<span className="text-lg text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Unlimited Campaigns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>AI Optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Multi-Touch Attribution</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority Support</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700" 
                onClick={() => navigate('/welcome')}
              >
                <Award className="mr-2 h-4 w-4" />
                Start Professional
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
              <div className="text-4xl font-bold text-purple-600 mt-4">
                €299<span className="text-lg text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Everything in Professional</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>White-label Platform</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Custom Integrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Dedicated Account Manager</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6" 
                variant="outline"
                onClick={() => navigate('/welcome')}
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}

// Main optimized landing page component
export function OptimizedLandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      
      {/* Lazy loaded sections */}
      <Suspense fallback={<div className="h-40 bg-gray-50 animate-pulse"></div>}>
        <TestimonialsSection />
      </Suspense>
      
      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Scale Your Campaigns?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of marketers που εμπιστεύονται το Ads Pro
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl"
            onClick={() => window.location.href = '/welcome'}
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}