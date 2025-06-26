
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { StationComparisonParams } from '@/api/api-contract';

export const useStationComparison = (opts: StationComparisonParams) => {
  return useQuery({
    queryKey: ['analytics', 'station-comparison', opts.stationIds, opts.period],
    queryFn: () => analyticsApi.getStationComparison(opts),
    enabled: opts.stationIds.length > 0,
  });
};

export const useHourlySales = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['analytics', 'hourly-sales', stationId, dateRange],
    queryFn: () => analyticsApi.getHourlySales(stationId, dateRange),
  });
};

export const usePeakHours = (stationId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'peak-hours', stationId],
    queryFn: () => analyticsApi.getPeakHours(stationId),
  });
};

export const useFuelPerformance = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['analytics', 'fuel-performance', stationId, dateRange],
    queryFn: () => analyticsApi.getFuelPerformance(stationId, dateRange),
  });
};

export const useStationRanking = (period: string) => {
  return useQuery({
    queryKey: ['analytics', 'station-ranking', period],
    queryFn: () => analyticsApi.getStationRanking(period),
  });
};

export const useSuperAdminAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'superadmin'],
    queryFn: () => analyticsApi.getSuperAdminAnalytics(),
  });
};
