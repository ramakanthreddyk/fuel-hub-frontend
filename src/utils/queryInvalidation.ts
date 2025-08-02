
import { QueryClient } from '@tanstack/react-query';

export const invalidateDashboardQueries = (queryClient: QueryClient) => {
  const queriesToInvalidate = [
    // Sales and summary queries
    'sales-summary',
    'dashboard-sales-summary',
    'todays-sales',
    'sales',

    // Payment and fuel breakdown
    'payment-method-breakdown',
    'payment-methods',
    'dashboard-payment-methods',
    'fuel-type-breakdown',
    'fuel-breakdown',
    'dashboard-fuel-breakdown',

    // Trends and analytics
    'daily-sales-trend',
    'sales-trend',
    'dashboard-sales-trend',
    'dashboard-fuel-analytics',
    'dashboard-station-performance',

    // Station and metrics
    'station-metrics',
    'top-creditors',
    'dashboard-recent-activities',

    // Readings
    'readings',
    'nozzle-readings',
    'attendant-readings',
    'contract-readings',
    'latest-reading',

    // Reports
    'cash-reports'
  ];

  queriesToInvalidate.forEach(queryKey => {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  });
};

export const invalidateStationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['stations'] });
  queryClient.invalidateQueries({ queryKey: ['station-metrics'] });
  queryClient.invalidateQueries({ queryKey: ['pumps'] });
  queryClient.invalidateQueries({ queryKey: ['nozzles'] });
};

export const invalidateSalesQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['sales'] });
  queryClient.invalidateQueries({ queryKey: ['sales-summary'] });
  queryClient.invalidateQueries({ queryKey: ['payment-method-breakdown'] });
  queryClient.invalidateQueries({ queryKey: ['fuel-type-breakdown'] });
  queryClient.invalidateQueries({ queryKey: ['daily-sales-trend'] });
  queryClient.invalidateQueries({ queryKey: ['station-metrics'] });
};

export const invalidateReadingQueries = (queryClient: QueryClient) => {
  // Reading queries
  queryClient.invalidateQueries({ queryKey: ['readings'] });
  queryClient.invalidateQueries({ queryKey: ['nozzle-readings'] });
  queryClient.invalidateQueries({ queryKey: ['attendant-readings'] });
  queryClient.invalidateQueries({ queryKey: ['contract-readings'] });
  queryClient.invalidateQueries({ queryKey: ['latest-reading'] });
  queryClient.invalidateQueries({ queryKey: ['can-create-reading'] });

  // Sales and dashboard queries
  queryClient.invalidateQueries({ queryKey: ['sales'] });
  queryClient.invalidateQueries({ queryKey: ['todays-sales'] });
  queryClient.invalidateQueries({ queryKey: ['sales-summary'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard-sales-summary'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard-sales-trend'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard-fuel-breakdown'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard-payment-methods'] });

  // Station and equipment queries
  queryClient.invalidateQueries({ queryKey: ['station-metrics'] });
  queryClient.invalidateQueries({ queryKey: ['nozzles'] });
  queryClient.invalidateQueries({ queryKey: ['pumps'] });

  // Reports
  queryClient.invalidateQueries({ queryKey: ['cash-reports'] });
};

/**
 * Force refresh all dashboard and reading-related data
 * Use this when you need to ensure all data is up-to-date
 */
export const forceRefreshAllDashboardData = (queryClient: QueryClient) => {
  // Invalidate all dashboard queries
  invalidateDashboardQueries(queryClient);

  // Invalidate all reading queries
  invalidateReadingQueries(queryClient);

  // Invalidate station queries
  invalidateStationQueries(queryClient);

  // Also invalidate any remaining queries that might affect dashboard
  queryClient.invalidateQueries({ queryKey: ['onboarding'] });
  queryClient.invalidateQueries({ queryKey: ['setup-status'] });
  queryClient.invalidateQueries({ queryKey: ['alerts'] });
};
