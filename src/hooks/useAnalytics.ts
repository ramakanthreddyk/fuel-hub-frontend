
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { StationComparisonParams } from '@/api/api-contract';
import { useErrorHandler } from './useErrorHandler';

export const useStationComparison = (opts: StationComparisonParams) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['analytics', 'station-comparison', opts.stationIds, opts.period],
    queryFn: async () => {
      try {
        if (!opts.stationIds || opts.stationIds.length === 0) {
          return [];
        }
        const result = await analyticsApi.getStationComparison(opts);
        return result || [];
      } catch (error) {
        console.error('Error fetching station comparison:', error);
        handleError(error, 'Failed to fetch station comparison.');
        return []; // Return empty array to prevent map errors
      }
    },
    enabled: opts.stationIds && opts.stationIds.length > 0,
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
    queryFn: async () => {
      try {
        const result = await analyticsApi.getStationRanking(period);
        return result || [];
      } catch (error) {
        console.error('Error fetching station ranking:', error);
        handleError(error, 'Failed to fetch station ranking.');
        return []; // Return empty array to prevent map errors
      }
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
