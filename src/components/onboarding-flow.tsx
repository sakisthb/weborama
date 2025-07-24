import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  BarChart3,
  ShoppingCart,
  Globe,
  Zap,
  Users,
  TrendingUp,
  Activity,
  Star,
  Award,
  Rocket,
  Lightbulb,
  Shield,
  Zap as Lightning
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  content: React.ReactNode;
  completed: boolean;
  required: boolean;
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  currentStep?: number;
}

const ONBOARDING_STEPS: Omit<OnboardingStep, 'completed'>[] = [
  {
    id: 'welcome',
    title: 'Καλώς ήρθατε στο Ads Pro! 🎉',
    description: 'Ας ξεκινήσουμε με μια γρήγορη περιήγηση',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    required: false,
    content: (
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Το πιο προηγμένο platform για διαφημιστικές πλατφόρμες
          </h2>
          <p className="text-muted-foreground text-lg">
            Ενοποιήστε όλες τις διαφημιστικές σας πλατφόρμες σε έναν έξυπνο dashboard με AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg"
          >
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Unified Analytics</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Όλα τα δεδομένα σε ένα μέρος</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg"
          >
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">Smart Insights</h3>
            <p className="text-sm text-green-700 dark:text-green-300">AI-powered recommendations</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg"
          >
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Real-time Data</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">Live campaign performance</p>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: 'platforms',
    title: 'Επιλέξτε τις πλατφόρμες σας',
    description: 'Συνδέστε τις διαφημιστικές πλατφόρμες που χρησιμοποιείτε',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    required: true,
    content: (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Επιλέξτε τις πλατφόρμες που θέλετε να συνδέσετε. Μπορείτε να προσθέσετε περισσότερες αργότερα.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'meta',
              name: 'Meta Ads',
              icon: Target,
              color: 'from-blue-500 to-blue-600',
              description: 'Facebook & Instagram Ads',
              features: ['Campaign Management', 'Audience Insights', 'Creative Optimization']
            },
            {
              id: 'google-ads',
              name: 'Google Ads',
              icon: Globe,
              color: 'from-green-500 to-green-600',
              description: 'Search & Display Advertising',
              features: ['Search Network', 'Display Network', 'Shopping Campaigns']
            },
            {
              id: 'google-analytics',
              name: 'Google Analytics',
              icon: BarChart3,
              color: 'from-orange-500 to-orange-600',
              description: 'Website Analytics',
              features: ['User Behavior', 'Conversion Tracking', 'Real-time Data']
            },
            {
              id: 'tiktok',
              name: 'TikTok Ads',
              icon: Zap,
              color: 'from-pink-500 to-pink-600',
              description: 'TikTok for Business',
              features: ['TikTok Network', 'Creative Studio', 'Trending Content']
            },
            {
              id: 'woocommerce',
              name: 'WooCommerce',
              icon: ShoppingCart,
              color: 'from-purple-500 to-purple-600',
              description: 'E-commerce Store',
              features: ['Order Management', 'Product Analytics', 'Customer Insights']
            }
          ].map((platform) => (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                      <platform.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{platform.description}</p>
                      <div className="space-y-1">
                        {platform.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Ξεκινήστε με τις πλατφόρμες που χρησιμοποιείτε περισσότερο
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'security',
    title: 'Ασφάλεια & Προστασία',
    description: 'Μάθετε για τα μέτρα ασφαλείας που προστατεύουν τα δεδομένα σας',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    required: false,
    content: (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Τα δεδομένα σας είναι ασφαλή</h3>
          <p className="text-muted-foreground">
            Χρησιμοποιούμε τα πιο προηγμένα μέτρα ασφαλείας για να προστατέψουμε τα credentials σας
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Shield,
              title: 'AES-256-GCM Encryption',
              description: 'Όλα τα credentials κρυπτογραφούνται με military-grade encryption'
            },
            {
              icon: Users,
              title: 'User Isolation',
              description: 'Κάθε user έχει πρόσβαση μόνο στα δικά του δεδομένα'
            },
            {
              icon: Activity,
              title: 'Audit Logging',
              description: 'Όλες οι ενέργειες καταγράφονται για ασφάλεια'
            },
            {
              icon: Lightning,
              title: 'Rate Limiting',
              description: 'Προστασία από API abuse και rate limits'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg"
            >
              <feature.icon className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">{feature.title}</h4>
                <p className="text-sm text-green-700 dark:text-green-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <Lightbulb className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Δεν αποθηκεύουμε ποτέ</strong> τα credentials σας σε plain text. 
            Όλα κρυπτογραφούνται πριν αποθηκευτούν στη βάση δεδομένων.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'features',
    title: 'Δυνατότητες & Οφέλη',
    description: 'Ανακαλύψτε τι μπορείτε να κάνετε με το Ads Pro',
    icon: Award,
    color: 'from-purple-500 to-indigo-500',
    required: false,
    content: (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Δυνατότητες που θα σας εντυπωσιάσουν</h3>
          <p className="text-muted-foreground">
            Από βασική ανάλυση έως προηγμένα AI insights
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              category: '📊 Analytics & Reporting',
              features: [
                'Unified dashboard για όλες τις πλατφόρμες',
                'Real-time performance metrics',
                'Custom reports και exports',
                'Historical data analysis'
              ]
            },
            {
              category: '🤖 AI-Powered Insights',
              features: [
                'Automated campaign optimization',
                'Predictive analytics',
                'Audience segmentation',
                'Creative performance analysis'
              ]
            },
            {
              category: '🎯 Campaign Management',
              features: [
                'Cross-platform campaign overview',
                'Budget allocation optimization',
                'Performance alerts και notifications',
                'A/B testing insights'
              ]
            },
            {
              category: '📈 Advanced Features',
              features: [
                'Multi-touch attribution modeling',
                'Customer journey analysis',
                'ROI optimization',
                'Competitive analysis'
              ]
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border rounded-lg"
            >
              <h4 className="font-semibold mb-3">{category.category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {category.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
          <Rocket className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>Ετοιμοι να ξεκινήσετε;</strong> Συνδέστε την πρώτη σας πλατφόρμα και δείτε τα αποτελέσματα σε λιγότερο από 5 λεπτά!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'complete',
    title: 'Είστε έτοιμοι! 🚀',
    description: 'Ξεκινήστε να χρησιμοποιείτε το Ads Pro',
    icon: Rocket,
    color: 'from-orange-500 to-red-500',
    required: false,
    content: (
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
        >
          <Rocket className="w-12 h-12 text-white" />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600">
            Καλώς ήρθατε στο Ads Pro!
          </h2>
          <p className="text-muted-foreground text-lg">
            Είστε έτοιμοι να μεταμορφώσετε τον τρόπο που διαχειρίζεστε τις διαφημιστικές σας καμπάνιες
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Setup Complete</h3>
            <p className="text-sm text-muted-foreground">Όλα είναι έτοιμα</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
          >
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Next Steps</h3>
            <p className="text-sm text-muted-foreground">Συνδέστε τις πλατφόρμες σας</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Start Growing</h3>
            <p className="text-sm text-muted-foreground">Βελτιώστε τις καμπάνιες σας</p>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-green-100 text-green-700">✓ Setup Complete</Badge>
            <Badge className="bg-blue-100 text-blue-700">Ready to Connect</Badge>
            <Badge className="bg-purple-100 text-purple-700">AI Powered</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Μπορείτε να επιστρέψετε σε αυτό το onboarding οποιαδήποτε στιγμή από το Settings menu
          </p>
        </div>
      </div>
    )
  }
];

export function OnboardingFlow({ isOpen, onClose, onComplete, currentStep = 0 }: OnboardingFlowProps) {
  const [step, setStep] = useState(currentStep);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());

  const steps = ONBOARDING_STEPS.map(s => ({
    ...s,
    completed: completedSteps.has(s.id)
  }));

  const currentStepData = steps[step];
  const progress = ((step + 1) / steps.length) * 100;
  const canGoNext = !currentStepData.required || currentStepData.completed;
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(platformId)) {
        newSet.delete(platformId);
      } else {
        newSet.add(platformId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (selectedPlatforms.size > 0) {
      handleStepComplete('platforms');
    }
  }, [selectedPlatforms]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {currentStepData.title}
              </DialogTitle>
              <DialogDescription>
                {currentStepData.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {step + 1} / {steps.length}
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Προηγούμενο
          </Button>

          <div className="flex items-center gap-2">
            {!isLastStep && (
              <Button
                variant="outline"
                onClick={onClose}
              >
                Παράλειψη
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLastStep ? (
                <>
                  Ξεκινήστε!
                  <Rocket className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Επόμενο
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 