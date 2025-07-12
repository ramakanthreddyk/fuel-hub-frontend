
import { QueryClient } from '@tanstack/react-query';

export const invalidateDashboardQueries = (queryClient: QueryClient) => {
  const queriesToInvalidate = [
    'sales-summary',
    'payment-method-breakdown', 
    'fuel-type-breakdown',
    'daily-sales-trend',
    'station-metrics',
    'top-creditors',
    'readings',
    'sales',
    'cash-reports',
    'attendant-readings'
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
