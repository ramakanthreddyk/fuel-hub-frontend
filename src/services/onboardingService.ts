/**
 * @file onboardingService.ts
 * @description Comprehensive onboarding and user guidance service
 */

import { apiClient } from '../api/client';

export interface OnboardingStatus {
  hasStation: boolean;
  hasPump: boolean;
  hasNozzle: boolean;
  hasFuelPrice: boolean;
  hasReading: boolean;
  completed: boolean;
  completionPercentage: number;
  nextStep: string;
  nextStepRoute: string;
}

export interface DailyReminder {
  id: string;
  type: 'reading_entry' | 'reconciliation' | 'fuel_delivery' | 'maintenance';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  completed: boolean;
  route?: string;
}

export interface SetupGuide {
  step: number;
  title: string;
  description: string;
  route: string;
  completed: boolean;
  required: boolean;
  estimatedTime: string;
  prerequisites?: string[];
}

class OnboardingService {
  /**
   * Get current onboarding status using existing setup-status endpoint
   */
  async getOnboardingStatus(): Promise<OnboardingStatus> {
    try {
      // Use existing setup-status endpoint
      const response = await apiClient.get('/setup-status');
      const setupData = response.data;

      // Calculate completion percentage
      const steps = [setupData.hasStation, setupData.hasPump, setupData.hasNozzle, setupData.hasFuelPrice];
      const completedSteps = steps.filter(Boolean).length;
      const completionPercentage = Math.round((completedSteps / steps.length) * 100);

      // Determine next step
      let nextStep = 'Setup complete!';
      let nextStepRoute = '/dashboard';

      if (!setupData.hasStation) {
        nextStep = 'Create your first station';
        nextStepRoute = '/dashboard/stations/new';
      } else if (!setupData.hasPump) {
        nextStep = 'Add fuel pumps to your station';
        nextStepRoute = '/dashboard/pumps/new';
      } else if (!setupData.hasNozzle) {
        nextStep = 'Configure nozzles for your pumps';
        nextStepRoute = '/dashboard/nozzles/new';
      } else if (!setupData.hasFuelPrice) {
        nextStep = 'Set fuel prices';
        nextStepRoute = '/dashboard/fuel-prices';
      }

      return {
        hasStation: setupData.hasStation,
        hasPump: setupData.hasPump,
        hasNozzle: setupData.hasNozzle,
        hasFuelPrice: setupData.hasFuelPrice,
        hasReading: false, // We'll check this separately if needed
        completed: setupData.completed,
        completionPercentage,
        nextStep,
        nextStepRoute
      };
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      // Return default status if API fails
      return {
        hasStation: false,
        hasPump: false,
        hasNozzle: false,
        hasFuelPrice: false,
        hasReading: false,
        completed: false,
        completionPercentage: 0,
        nextStep: 'Create your first station',
        nextStepRoute: '/dashboard/stations/new'
      };
    }
  }

  /**
   * Get daily reminders and alerts
   */
  async getDailyReminders(): Promise<DailyReminder[]> {
    try {
      // Call the authenticated backend endpoint
      const response = await apiClient.get('/onboarding/reminders');

      // Handle the backend response format: { success: true, data: [...] }
      const reminders = response.data?.data || response.data || [];

      // Ensure we return an array
      return Array.isArray(reminders) ? reminders : [];
    } catch (error) {
      console.error('Error fetching daily reminders:', error);
      // Return empty array if not authenticated or error occurs
      return [];
    }
  }

  /**
   * Mark a reminder as completed
   */
  async completeReminder(reminderId: string): Promise<void> {
    try {
      await apiClient.post(`/onboarding/reminders/${reminderId}/complete`);
    } catch (error) {
      console.error('Error completing reminder:', error);
      throw error;
    }
  }

  /**
   * Get setup guide steps
   */
  async getSetupGuide(): Promise<SetupGuide[]> {
    try {
      const response = await apiClient.get('/onboarding/setup-guide');
      return response.data;
    } catch (error) {
      console.error('Error fetching setup guide:', error);
      // Return default setup guide
      return [
        {
          step: 1,
          title: 'Create Your First Station',
          description: 'Set up your fuel station with basic information like name and address.',
          route: '/dashboard/stations/new',
          completed: false,
          required: true,
          estimatedTime: '2 minutes'
        },
        {
          step: 2,
          title: 'Add Fuel Pumps',
          description: 'Configure the fuel pumps at your station.',
          route: '/dashboard/pumps/new',
          completed: false,
          required: true,
          estimatedTime: '3 minutes',
          prerequisites: ['station']
        },
        {
          step: 3,
          title: 'Setup Nozzles',
          description: 'Configure nozzles for different fuel types on your pumps.',
          route: '/dashboard/nozzles/new',
          completed: false,
          required: true,
          estimatedTime: '5 minutes',
          prerequisites: ['station', 'pump']
        },
        {
          step: 4,
          title: 'Set Fuel Prices',
          description: 'Configure pricing for different fuel types.',
          route: '/dashboard/fuel-prices',
          completed: false,
          required: true,
          estimatedTime: '2 minutes',
          prerequisites: ['nozzle']
        },
        {
          step: 5,
          title: 'Record First Reading',
          description: 'Enter your first nozzle reading to start tracking sales.',
          route: '/dashboard/readings/new',
          completed: false,
          required: false,
          estimatedTime: '1 minute',
          prerequisites: ['fuel-price']
        }
      ];
    }
  }

  /**
   * Mark a setup step as completed
   */
  async completeSetupStep(step: number): Promise<void> {
    try {
      await apiClient.post(`/onboarding/setup-guide/${step}/complete`);
    } catch (error) {
      console.error('Error completing setup step:', error);
      throw error;
    }
  }

  /**
   * Skip onboarding (for experienced users)
   */
  async skipOnboarding(): Promise<void> {
    try {
      await apiClient.post('/onboarding/skip');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      throw error;
    }
  }

  /**
   * Reset onboarding (for re-doing the setup)
   */
  async resetOnboarding(): Promise<void> {
    try {
      await apiClient.post('/onboarding/reset');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  }

  /**
   * Get user preferences for notifications
   */
  async getNotificationPreferences(): Promise<{
    dailyReminders: boolean;
    setupGuidance: boolean;
    readingAlerts: boolean;
    reconciliationReminders: boolean;
  }> {
    try {
      const response = await apiClient.get('/onboarding/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return {
        dailyReminders: true,
        setupGuidance: true,
        readingAlerts: true,
        reconciliationReminders: true
      };
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: {
    dailyReminders?: boolean;
    setupGuidance?: boolean;
    readingAlerts?: boolean;
    reconciliationReminders?: boolean;
  }): Promise<void> {
    try {
      await apiClient.put('/onboarding/preferences', preferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Get contextual help for current page
   */
  async getContextualHelp(route: string): Promise<{
    title: string;
    content: string;
    tips: string[];
    relatedLinks: { title: string; route: string }[];
  } | null> {
    try {
      const response = await apiClient.get(`/onboarding/help?route=${encodeURIComponent(route)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contextual help:', error);
      return null;
    }
  }

  /**
   * Track user interaction for analytics
   */
  async trackInteraction(action: string, context?: any): Promise<void> {
    try {
      await apiClient.post('/onboarding/track', {
        action,
        context,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Don't throw error for tracking failures
      console.warn('Error tracking interaction:', error);
    }
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService;
