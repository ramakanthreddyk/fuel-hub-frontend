/**
 * @file OnboardingDashboard.tsx
 * @description Comprehensive onboarding dashboard with progress tracking and guidance
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Play, 
  SkipForward,
  RefreshCw,
  Bell,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Simple Progress component
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full ${className}`}>
    <div
      className="bg-blue-600 h-full rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSetupStatus } from '@/hooks/useSetupStatus';
import { useQueryClient } from '@tanstack/react-query';

interface OnboardingDashboardProps {
  compact?: boolean;
  showReminders?: boolean;
  className?: string;
}

export function OnboardingDashboard({
  compact = false,
  showReminders = true,
  className = ''
}: OnboardingDashboardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: setupStatus, isLoading, refetch } = useSetupStatus();

  const handleRefresh = async () => {
    console.log('[ONBOARDING] Manual refresh triggered');
    await queryClient.invalidateQueries({ queryKey: ['setup-status'] });
    await refetch();
  };

  // Calculate progress and next steps
  const overallProgress = setupStatus ?
    Math.round(([setupStatus.hasStation, setupStatus.hasPump, setupStatus.hasNozzle, setupStatus.hasFuelPrice].filter(Boolean).length / 4) * 100) : 0;

  const needsGuidance = !setupStatus?.completed;

  let nextAction = 'Setup complete!';
  let nextActionRoute = '/dashboard';

  if (setupStatus && !setupStatus.completed) {
    if (!setupStatus.hasStation) {
      nextAction = 'Create your first station';
      nextActionRoute = '/dashboard/stations/new';
    } else if (!setupStatus.hasPump) {
      nextAction = 'Add fuel pumps to your station';
      nextActionRoute = '/dashboard/pumps/new';
    } else if (!setupStatus.hasNozzle) {
      nextAction = 'Configure nozzles for your pumps';
      nextActionRoute = '/dashboard/nozzles/new';
    } else if (!setupStatus.hasFuelPrice) {
      nextAction = 'Set fuel prices';
      nextActionRoute = '/dashboard/fuel-prices';
    }
  }

  // Mock urgent reminders for now
  const urgentReminders: any[] = [];

  const handleStartNextStep = () => {
    navigate(nextActionRoute);
  };

  const handleSkipOnboarding = () => {
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  const handleCompleteReminder = (reminderId: string) => {
    // For now, just log it
    console.log('Reminder completed:', reminderId);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading onboarding status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Debug information
  console.log('[ONBOARDING-DASHBOARD] Setup status:', setupStatus);
  console.log('[ONBOARDING-DASHBOARD] Overall progress:', overallProgress);
  console.log('[ONBOARDING-DASHBOARD] Needs guidance:', needsGuidance);

  // Smart visibility logic:
  // - Always show if setup is incomplete (needsGuidance = true)
  // - Show if there are urgent reminders
  // - Hide completely if setup is done and no urgent tasks
  const shouldShow = needsGuidance || urgentReminders.length > 0;

  if (!shouldShow) {
    return null;
  }

  if (compact) {
    return (
      <Card className={`border-l-4 ${needsGuidance ? 'border-l-blue-500 bg-blue-50/30' : 'border-l-green-500 bg-green-50/30'} ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {needsGuidance ? (
                  <div className="relative">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{Math.round(overallProgress / 25)}</span>
                    </div>
                  </div>
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {needsGuidance ? nextAction : '🎉 Setup Complete!'}
                </p>
                <p className="text-xs text-gray-500">
                  {needsGuidance ? `${overallProgress}% complete` : 'Ready to manage your fuel station'}
                </p>
              </div>
            </div>
            {needsGuidance && (
              <Button size="sm" onClick={handleStartNextStep} className="bg-blue-600 hover:bg-blue-700">
                Continue
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Progress bar for incomplete setup */}
          {needsGuidance && (
            <div className="mt-3">
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}

          {/* Urgent reminders */}
          {urgentReminders.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-orange-600">
                  <Bell className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">
                    {urgentReminders.length} urgent task{urgentReminders.length > 1 ? 's' : ''}
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('/dashboard')}>
                  View
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Overview */}
      {needsGuidance && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-600" />
                  Setup Progress
                </CardTitle>
                <CardDescription>
                  Complete these steps to get your fuel station management system ready
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRefresh}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleSkipOnboarding}>
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip Setup
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-500">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Next Step</p>
                  <p className="text-sm text-blue-700">{nextAction}</p>
                </div>
                <Button onClick={handleStartNextStep} className="bg-blue-600 hover:bg-blue-700">
                  Start Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simple Setup Steps */}
      {needsGuidance && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Checklist</CardTitle>
            <CardDescription>
              Complete these steps to set up your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg border ${setupStatus?.hasStation ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {setupStatus?.hasStation ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium">1</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Create Your First Station</p>
                    <p className="text-sm text-gray-600">Set up your fuel station with basic information</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={setupStatus?.hasStation ? "outline" : "default"}
                  onClick={() => navigate('/dashboard/stations/new')}
                >
                  {setupStatus?.hasStation ? "Review" : "Start"}
                </Button>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg border ${setupStatus?.hasPump ? 'bg-green-50 border-green-200' : setupStatus?.hasStation ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {setupStatus?.hasPump ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium">2</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Add Fuel Pumps</p>
                    <p className="text-sm text-gray-600">Configure the fuel pumps at your station</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={setupStatus?.hasPump ? "outline" : "default"}
                  onClick={() => navigate('/dashboard/pumps/new')}
                  disabled={!setupStatus?.hasStation}
                >
                  {setupStatus?.hasPump ? "Review" : "Start"}
                </Button>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg border ${setupStatus?.hasNozzle ? 'bg-green-50 border-green-200' : setupStatus?.hasPump ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {setupStatus?.hasNozzle ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium">3</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Setup Nozzles</p>
                    <p className="text-sm text-gray-600">Configure nozzles for different fuel types</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={setupStatus?.hasNozzle ? "outline" : "default"}
                  onClick={() => navigate('/dashboard/nozzles/new')}
                  disabled={!setupStatus?.hasPump}
                >
                  {setupStatus?.hasNozzle ? "Review" : "Start"}
                </Button>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg border ${setupStatus?.hasFuelPrice ? 'bg-green-50 border-green-200' : setupStatus?.hasNozzle ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {setupStatus?.hasFuelPrice ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium">4</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Set Fuel Prices</p>
                    <p className="text-sm text-gray-600">Configure pricing for different fuel types</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={setupStatus?.hasFuelPrice ? "outline" : "default"}
                  onClick={() => navigate('/dashboard/fuel-prices')}
                  disabled={!setupStatus?.hasNozzle}
                >
                  {setupStatus?.hasFuelPrice ? "Review" : "Start"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Reminders - Simplified for now */}
      {showReminders && needsGuidance && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Daily Reminder</p>
                <p className="text-sm text-orange-700">
                  Don't forget to complete your setup and record daily readings once operational.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {!needsGuidance && urgentReminders.length === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Setup Complete! 🎉
                </h3>
                <p className="text-green-700">
                  Your fuel station management system is ready to use. You can now start managing your operations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OnboardingDashboard;
