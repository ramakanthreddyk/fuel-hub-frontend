
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { StationComparisonParams } from '@/api/api-contract';
import { useErrorHandler } from './useErrorHandler';

export const useStationComparison = (opts: StationComparisonParams) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['analytics', 'station-comparison', opts.stationIds, opts.period],
    queryFn: () => analyticsApi.getStationComparison(opts),
    enabled: opts.stationIds.length > 0,
    onError: (error) => {
      handleError(error, 'Failed to fetch station comparison.');
    },
  });
};

export const useHourlySales = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  const { handleError } = useErrorHandler();
  // If dateRange is not provided, create a default one for today
  const effectiveDateRange = dateRange || (() => {
    const today = new Date();
    return {
      from: new Date(today.setHours(0, 0, 0, 0)),
      to: new Date(today.setHours(23, 59, 59, 999))
    };
  })();
  
  return useQuery({
    queryKey: ['analytics', 'hourly-sales', stationId, effectiveDateRange],
    queryFn: () => analyticsApi.getHourlySales(stationId, effectiveDateRange),
    enabled: !!stationId, // Only run the query if stationId is provided
    onError: (error) => {
      handleError(error, 'Failed to fetch hourly sales.');
    },
  });
};

export const usePeakHours = (stationId?: string) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['analytics', 'peak-hours', stationId],
    queryFn: () => analyticsApi.getPeakHours(stationId),
    onError: (error) => {
      handleError(error, 'Failed to fetch peak hours.');
    },
  });
};

export const useFuelPerformance = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['analytics', 'fuel-performance', stationId, dateRange],
    queryFn: () => analyticsApi.getFuelPerformance(stationId, dateRange),
    onError: (error) => {
      handleError(error, 'Failed to fetch fuel performance.');
    },
  });
};

export const useStationRanking = (period: string) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['analytics', 'station-ranking', period],
    queryFn: () => analyticsApi.getStationRanking(period),
    onError: (error) => {
      handleError(error, 'Failed to fetch station ranking.');
    },
  });
};

export const useSuperAdminAnalytics = () => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['analytics', 'superadmin'],
    queryFn: () => analyticsApi.getSuperAdminAnalytics(),
    onError: (error) => {
      handleError(error, 'Failed to fetch super admin analytics.');
    },
  });
};
