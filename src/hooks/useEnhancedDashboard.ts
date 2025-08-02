
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

  // Sales summary - reduced cache time for real-time updates
  const salesSummary = useQuery({
    queryKey: ['dashboard-sales-summary', params],
    queryFn: () => dashboardService.getSalesSummary({ range, ...params }),
    staleTime: 30 * 1000, // 30 seconds for real-time updates
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });

  // Payment methods breakdown
  const paymentMethods = useQuery({
    queryKey: ['dashboard-payment-methods', params?.stationId],
    queryFn: () => dashboardService.getPaymentMethods(params?.stationId),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
  });

  // Fuel type analytics
  const fuelAnalytics = useQuery({
    queryKey: ['dashboard-fuel-analytics', params],
    queryFn: () => dashboardService.getFuelTypeAnalytics(params),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
  });

  // Station performance
  const stationPerformance = useQuery({
    queryKey: ['dashboard-station-performance', params],
    queryFn: () => dashboardService.getStationPerformance(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 3 * 60 * 1000, // Auto-refresh every 3 minutes
  });

  // Top stations
  const topStations = useQuery({
    queryKey: ['dashboard-top-stations'],
    queryFn: () => dashboardService.getTopStations(5),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  // Recent activities - most important for real-time updates
  const recentActivities = useQuery({
    queryKey: ['dashboard-recent-activities'],
    queryFn: () => dashboardService.getRecentActivities(10),
    staleTime: 15 * 1000, // 15 seconds for real-time updates
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });

  // Alerts summary
  const alertsSummary = useQuery({
    queryKey: ['dashboard-alerts-summary'],
    queryFn: () => dashboardService.getAlertsSummary(),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Auto-refresh every minute
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
