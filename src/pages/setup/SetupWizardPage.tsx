
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertTriangle, Ban, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useSetupStatus } from '@/hooks/useSetupStatus';
import { toast } from '@/hooks/use-toast';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
  disabled: boolean;
  prerequisite?: string;
}

export default function SetupWizardPage() {
  const navigate = useNavigate();
  const { data: setupStatus, isLoading, error, refetch } = useSetupStatus();

  // Don't automatically redirect if setup is complete
  // This allows users to revisit the setup wizard if needed
  useEffect(() => {
    if (setupStatus?.completed) {
      toast({
        title: "Setup Status",
        description: "Your initial setup is complete. You can continue to manage your stations, pumps, and nozzles.",
      });
    }
  }, [setupStatus?.completed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Setup Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Unable to load setup status. Please try again.
            </p>
            <Button onClick={() => refetch()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!setupStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const steps: SetupStep[] = [
    {
      id: 'station',
      title: 'Create Your First Station',
      description: 'Add a fuel station to get started with FuelSync Hub',
      route: '/dashboard/stations',
      completed: setupStatus.hasStation,
      disabled: false,
    },
    {
      id: 'pump',
      title: 'Add Fuel Pumps',
      description: 'Configure pumps for your station to manage fuel dispensing',
      route: '/dashboard/pumps/create',
      completed: setupStatus.hasPump,
      disabled: !setupStatus.hasStation,
      prerequisite: 'Please create a station first',
    },
    {
      id: 'nozzle',
      title: 'Setup Nozzles',
      description: 'Configure nozzles for different fuel types on your pumps',
      route: '/dashboard/nozzles',
      completed: setupStatus.hasNozzle,
      disabled: !setupStatus.hasPump,
      prerequisite: 'Please add a pump first',
    },
    {
      id: 'fuel-price',
      title: 'Set Fuel Prices',
      description: 'Configure pricing for different fuel types to start selling',
      route: '/dashboard/fuel-prices',
      completed: setupStatus.hasFuelPrice,
      disabled: !setupStatus.hasNozzle,
      prerequisite: 'Please setup nozzles first',
    },
  ];

  const getStepIcon = (step: SetupStep) => {
    if (step.completed) {
      return <Check className="h-5 w-5 text-green-600" />;
    }
    if (step.disabled) {
      return <Ban className="h-5 w-5 text-gray-400" />;
    }
    return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  };

  const getStepBadge = (step: SetupStep) => {
    if (step.completed) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>;
    }
    if (step.disabled) {
      return <Badge variant="secondary">Locked</Badge>;
    }
    return <Badge variant="outline" className="border-amber-500 text-amber-600">Pending</Badge>;
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            FuelSync Hub Setup Wizard
          </h1>
          <p className="text-muted-foreground text-lg">
            Follow these 4 simple steps to set up your fuel station management system
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Setup Progress
            </span>
            <span className="text-sm text-muted-foreground">
              {completedSteps} of {steps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`transition-all duration-200 ${
                step.completed 
                  ? 'border-green-200 bg-green-50/50' 
                  : step.disabled 
                    ? 'border-gray-200 bg-gray-50/50' 
                    : 'border-amber-200 bg-amber-50/50 shadow-sm'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {index + 1}. {step.title}
                        </h3>
                        {getStepBadge(step)}
                      </div>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                      {step.disabled && step.prerequisite && (
                        <p className="text-sm text-amber-600 mt-2">
                          ⚠️ {step.prerequisite}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => navigate(step.route)}
                      disabled={step.disabled}
                      variant={step.completed ? "outline" : "default"}
                      size="sm"
                    >
                      {step.completed ? "View" : "Setup"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Complete these steps in order to ensure your fuel station management system works correctly. 
                Each step builds on the previous one.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Help Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Having trouble with setup?</h3>
                <p className="text-sm text-muted-foreground">
                  If you're experiencing issues with the setup process, here are some common solutions:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  <li>Make sure you create a station first before adding pumps</li>
                  <li>Make sure you create pumps before adding nozzles</li>
                  <li>If you can't see your nozzles, try refreshing the page</li>
                  <li>Make sure your pumps are set to "active" status</li>
                </ul>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/dashboard/stations')}>
                  Go to Stations
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/pumps')}>  
                  Go to Pumps
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/nozzles')}>  
                  Go to Nozzles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info (only in development) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(setupStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
