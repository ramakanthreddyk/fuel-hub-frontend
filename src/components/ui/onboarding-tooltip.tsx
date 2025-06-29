
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

export interface OnboardingStep {
  /** Step identifier */
  id: string;
  /** Target element selector or ref */
  target: string | React.RefObject<HTMLElement>;
  /** Step title */
  title: string;
  /** Step content */
  content: string;
  /** Step position relative to target */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Custom actions for this step */
  actions?: {
    skip?: boolean;
    next?: string;
    prev?: string;
  };
}

export interface OnboardingTooltipProps {
  /** Onboarding steps */
  steps: OnboardingStep[];
  /** Current step index */
  currentStep: number;
  /** Whether tour is active */
  isActive: boolean;
  /** Step change handler */
  onStepChange: (step: number) => void;
  /** Tour completion handler */
  onComplete: () => void;
  /** Tour skip handler */
  onSkip: () => void;
  /** Custom className */
  className?: string;
}

/**
 * Onboarding tooltip component for guided user experiences
 * 
 * Features:
 * - Step-by-step guidance
 * - Customizable positioning
 * - Skip and navigation controls
 * - Keyboard navigation support
 * - Screen reader friendly
 * - Persistent state management
 */
export function OnboardingTooltip({
  steps,
  currentStep,
  isActive,
  onStepChange,
  onComplete,
  onSkip,
  className
}: OnboardingTooltipProps) {
  const [isOpen, setIsOpen] = React.useState(isActive);
  const currentStepData = steps[currentStep];
  
  React.useEffect(() => {
    setIsOpen(isActive && !!currentStepData);
  }, [isActive, currentStepData]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
    setIsOpen(false);
  };

  if (!currentStepData || !isActive) {
    return null;
  }

  // Get target element
  const getTargetElement = (): HTMLElement | null => {
    if (typeof currentStepData.target === 'string') {
      return document.querySelector(currentStepData.target) as HTMLElement;
    }
    return currentStepData.target.current;
  };

  const targetElement = getTargetElement();
  if (!targetElement) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div 
          className="absolute pointer-events-none"
          style={{
            left: targetElement.offsetLeft,
            top: targetElement.offsetTop,
            width: targetElement.offsetWidth,
            height: targetElement.offsetHeight,
          }}
        />
      </PopoverTrigger>
      <PopoverContent 
        className={cn('w-80 p-0', className)}
        side={currentStepData.placement || 'bottom'}
        align="start"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold text-foreground">
                {currentStepData.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStepData.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="ml-2 h-6 w-6 p-0"
              aria-label="Skip tour"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    index === currentStep 
                      ? 'bg-primary' 
                      : 'bg-muted'
                  )}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-8"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  {currentStepData.actions?.prev || 'Previous'}
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={handleNext}
                className="h-8"
              >
                {currentStep === steps.length - 1 ? 'Finish' : (currentStepData.actions?.next || 'Next')}
                {currentStep < steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 ml-1" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Hook for managing onboarding state
 */
export function useOnboarding(tourId: string, steps: OnboardingStep[]) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  
  // Load saved state
  React.useEffect(() => {
    const saved = localStorage.getItem(`onboarding-${tourId}`);
    if (saved) {
      const { completed } = JSON.parse(saved);
      if (!completed) {
        setIsActive(true);
      }
    } else {
      setIsActive(true);
    }
  }, [tourId]);

  const handleComplete = () => {
    localStorage.setItem(`onboarding-${tourId}`, JSON.stringify({ 
      completed: true,
      completedAt: new Date().toISOString() 
    }));
    setIsActive(false);
  };

  const handleSkip = () => {
    localStorage.setItem(`onboarding-${tourId}`, JSON.stringify({ 
      completed: true,
      skipped: true,
      skippedAt: new Date().toISOString() 
    }));
    setIsActive(false);
  };

  const restart = () => {
    localStorage.removeItem(`onboarding-${tourId}`);
    setCurrentStep(0);
    setIsActive(true);
  };

  return {
    currentStep,
    isActive,
    onStepChange: setCurrentStep,
    onComplete: handleComplete,
    onSkip: handleSkip,
    restart
  };
}
