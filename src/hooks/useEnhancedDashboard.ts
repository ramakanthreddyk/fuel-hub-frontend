
/**
 * Enhanced Dashboard Hook
 * 
 * Comprehensive hook for all dashboard data
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService, alertsService } from '@/api/services';

export const useEnhancedDashboard = (params?: {
  range?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const range = params?.range || 'daily';

  // Sales summary
  const salesSummary = useQuery({
    queryKey: ['dashboard-sales-summary', params],
    queryFn: () => dashboardService.getSalesSummary({ range, ...params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Payment methods breakdown
  const paymentMethods = useQuery({
    queryKey: ['dashboard-payment-methods', params?.stationId],
    queryFn: () => dashboardService.getPaymentMethods(params?.stationId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fuel type analytics
  const fuelAnalytics = useQuery({
    queryKey: ['dashboard-fuel-analytics', params],
    queryFn: () => dashboardService.getFuelTypeAnalytics(params),
    staleTime: 10 * 60 * 1000,
  });

  // Station performance
  const stationPerformance = useQuery({
    queryKey: ['dashboard-station-performance', params],
    queryFn: () => dashboardService.getStationPerformance(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Top stations
  const topStations = useQuery({
    queryKey: ['dashboard-top-stations'],
    queryFn: () => dashboardService.getTopStations(5),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Recent activities
  const recentActivities = useQuery({
    queryKey: ['dashboard-recent-activities'],
    queryFn: () => dashboardService.getRecentActivities(10),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Alerts summary
  const alertsSummary = useQuery({
    queryKey: ['dashboard-alerts-summary'],
    queryFn: () => dashboardService.getAlertsSummary(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  return {
    salesSummary,
    paymentMethods,
    fuelAnalytics,
    stationPerformance,
    topStations,
    recentActivities,
    alertsSummary,
    isLoading: salesSummary.isLoading || paymentMethods.isLoading,
    error: salesSummary.error || paymentMethods.error
  };
};

export const useAlerts = (filters?: {
  type?: string;
  priority?: string;
  stationId?: string;
  acknowledged?: boolean;
}) => {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertsService.getAlerts(filters),
    staleTime: 30 * 1000, // 30 seconds for real-time alerts
  });
};

export const useUnreadAlertsCount = () => {
  return useQuery({
    queryKey: ['unread-alerts-count'],
    queryFn: () => alertsService.getUnreadCount(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Poll every minute
  });
};
