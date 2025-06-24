
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';

export const useStationComparison = (stationIds: string[], period: string) => {
  return useQuery({
    queryKey: ['analytics', 'station-comparison', stationIds, period],
    queryFn: () => analyticsApi.getStationComparison(stationIds, period),
    enabled: stationIds.length > 0,
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
