import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Home, 
  BarChart3, 
  Target, 
  TrendingUp, 
  HelpCircle,
  Play,
  X,
  Check
} from 'lucide-react';

interface OnboardingTourProps {
  isFirstTime?: boolean;
  onComplete?: () => void;
}

export function OnboardingTour({ isFirstTime = false, onComplete }: OnboardingTourProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: "Καλώς ήρθατε στο Ads Pro! 🎉",
      content: "Ξεκινήστε να βελτιστοποιείτε τις καμπάνιες σας με AI-powered insights.",
      icon: <Home className="h-6 w-6" />
    },
    {
      title: "Analytics Dashboard 📊",
      content: "Παρακολουθήστε την απόδοση των καμπανιών σας σε πραγματικό χρόνο.",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Multi-Touch Attribution 🎯",
      content: "Κατανοήστε το customer journey και τη συνεισφορά κάθε touchpoint.",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "AI Optimization 🚀",
      content: "Αφήστε το AI να βελτιστοποιήσει αυτόματα τις καμπάνιες σας για καλύτερα αποτελέσματα.",
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  useEffect(() => {
    if (isFirstTime) {
      setIsVisible(true);
    }
  }, [isFirstTime]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const skipTour = () => {
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {currentTourStep.icon}
              <Badge variant="secondary">{currentStep + 1} / {tourSteps.length}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentTourStep.title}</h3>
            <p className="text-gray-600">{currentTourStep.content}</p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-1"
            >
              <span>Προηγούμενο</span>
            </Button>

            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextStep}
              className="flex items-center space-x-1"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Τέλος</span>
                </>
              ) : (
                <>
                  <span>Επόμενο</span>
                  <Play className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-gray-500 hover:text-gray-700"
            >
              Παράλειψη tour
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}