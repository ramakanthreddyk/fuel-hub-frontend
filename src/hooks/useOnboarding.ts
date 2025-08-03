/**
 * @file useOnboarding.ts
 * @description React hooks for onboarding and user guidance
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import onboardingService, { OnboardingStatus, DailyReminder, SetupGuide } from '../services/onboardingService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing onboarding status
 */
export function useOnboardingStatus() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['onboarding', 'status'],
    queryFn: () => onboardingService.getOnboardingStatus(),
    staleTime: 30 * 1000, // 30 seconds - shorter for better responsiveness
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refetch every minute
    enabled: isAuthenticated && !!user && user.role !== 'superadmin', // Exclude SuperAdmin users
  });
}

/**
 * Hook for managing daily reminders
 */
export function useDailyReminders() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  const reminders = useQuery({
    queryKey: ['onboarding', 'reminders'],
    queryFn: () => onboardingService.getDailyReminders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    enabled: isAuthenticated && !!user && user.role !== 'superadmin', // Exclude SuperAdmin users
  });

  const completeReminder = useMutation({
    mutationFn: (reminderId: string) => onboardingService.completeReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'reminders'] });
      toast.success('Reminder completed!');
    },
    onError: (error) => {
      toast.error('Failed to complete reminder');
      console.error('Error completing reminder:', error);
    },
  });

  return {
    ...reminders,
    completeReminder: completeReminder.mutate,
    isCompleting: completeReminder.isPending,
  };
}

/**
 * Hook for managing setup guide
 */
export function useSetupGuide() {
  const queryClient = useQueryClient();

  const setupGuide = useQuery({
    queryKey: ['onboarding', 'setup-guide'],
    queryFn: () => onboardingService.getSetupGuide(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const completeStep = useMutation({
    mutationFn: (step: number) => onboardingService.completeSetupStep(step),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      toast.success('Setup step completed!');
    },
    onError: (error) => {
      toast.error('Failed to complete setup step');
      console.error('Error completing setup step:', error);
    },
  });

  const skipOnboarding = useMutation({
    mutationFn: () => onboardingService.skipOnboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      toast.success('Onboarding skipped');
    },
    onError: (error) => {
      toast.error('Failed to skip onboarding');
      console.error('Error skipping onboarding:', error);
    },
  });

  const resetOnboarding = useMutation({
    mutationFn: () => onboardingService.resetOnboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      toast.success('Onboarding reset');
    },
    onError: (error) => {
      toast.error('Failed to reset onboarding');
      console.error('Error resetting onboarding:', error);
    },
  });

  return {
    ...setupGuide,
    completeStep: completeStep.mutate,
    skipOnboarding: skipOnboarding.mutate,
    resetOnboarding: resetOnboarding.mutate,
    isCompleting: completeStep.isPending,
    isSkipping: skipOnboarding.isPending,
    isResetting: resetOnboarding.isPending,
  };
}

/**
 * Hook for notification preferences
 */
export function useNotificationPreferences() {
  const queryClient = useQueryClient();

  const preferences = useQuery({
    queryKey: ['onboarding', 'preferences'],
    queryFn: () => onboardingService.getNotificationPreferences(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const updatePreferences = useMutation({
    mutationFn: (newPreferences: any) => onboardingService.updateNotificationPreferences(newPreferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'preferences'] });
      toast.success('Preferences updated');
    },
    onError: (error) => {
      toast.error('Failed to update preferences');
      console.error('Error updating preferences:', error);
    },
  });

  return {
    ...preferences,
    updatePreferences: updatePreferences.mutate,
    isUpdating: updatePreferences.isPending,
  };
}

/**
 * Hook for contextual help based on current route
 */
export function useContextualHelp() {
  const location = useLocation();

  return useQuery({
    queryKey: ['onboarding', 'help', location.pathname],
    queryFn: () => onboardingService.getContextualHelp(location.pathname),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!location.pathname,
  });
}

/**
 * Hook for tracking user interactions
 */
export function useOnboardingTracking() {
  const trackInteraction = useMutation({
    mutationFn: ({ action, context }: { action: string; context?: any }) => 
      onboardingService.trackInteraction(action, context),
    // Don't show errors for tracking failures
    onError: () => {},
  });

  return {
    track: trackInteraction.mutate,
    isTracking: trackInteraction.isPending,
  };
}

/**
 * Combined hook for complete onboarding experience
 */
export function useOnboardingExperience() {
  const status = useOnboardingStatus();
  const reminders = useDailyReminders();
  const setupGuide = useSetupGuide();
  const preferences = useNotificationPreferences();
  const contextualHelp = useContextualHelp();
  const tracking = useOnboardingTracking();

  // Calculate overall progress
  const overallProgress = status.data?.completionPercentage || 0;
  
  // Get urgent reminders
  const urgentReminders = reminders.data?.filter(r => 
    !r.completed && (r.priority === 'urgent' || r.priority === 'high')
  ) || [];

  // Get next recommended action
  const nextAction = status.data?.nextStep || 'Complete your setup';
  const nextActionRoute = status.data?.nextStepRoute || '/dashboard';

  // Check if user needs guidance
  const needsGuidance = !status.data?.completed && overallProgress < 100;

  return {
    // Status
    status: status.data,
    isLoadingStatus: status.isLoading,
    
    // Reminders
    reminders: reminders.data || [],
    urgentReminders,
    completeReminder: reminders.completeReminder,
    isLoadingReminders: reminders.isLoading,
    
    // Setup Guide
    setupSteps: setupGuide.data || [],
    completeStep: setupGuide.completeStep,
    skipOnboarding: setupGuide.skipOnboarding,
    resetOnboarding: setupGuide.resetOnboarding,
    isLoadingSetup: setupGuide.isLoading,
    
    // Preferences
    preferences: preferences.data,
    updatePreferences: preferences.updatePreferences,
    isLoadingPreferences: preferences.isLoading,
    
    // Help
    contextualHelp: contextualHelp.data,
    isLoadingHelp: contextualHelp.isLoading,
    
    // Tracking
    track: tracking.track,
    
    // Computed values
    overallProgress,
    nextAction,
    nextActionRoute,
    needsGuidance,
    
    // Loading states
    isLoading: status.isLoading || reminders.isLoading || setupGuide.isLoading,
  };
}

export default useOnboardingExperience;
