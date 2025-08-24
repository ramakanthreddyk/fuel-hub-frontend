
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { StationComparison } from '@/api/api-contract';
import { useErrorHandler } from './useErrorHandler';
import { useAuth } from '@/contexts/AuthContext';

interface StationComparisonParams {
  stationIds: string[];
  period?: string;
}

export const useStationComparison = (opts: StationComparisonParams) => {
  const { handleError } = useErrorHandler();
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'station-comparison', opts.stationIds, opts.period],
    queryFn: async () => {
      try {
        if (!opts.stationIds || opts.stationIds.length === 0) {
          return [];
        }
        const result = await analyticsApi.getStationComparison(opts);
        return result || [];
      } catch (error: any) {
        console.error('Error fetching station comparison:', error);
        
        // Check if this is a plan restriction
        const errorMessage = error?.response?.data?.message || error?.message || '';
        const isPlanRestriction = error?.response?.status === 401 && 
          (errorMessage.includes('plan') || errorMessage.includes('upgrade') || errorMessage.includes('feature'));
        
        if (isPlanRestriction) {
          console.warn('Station comparison requires plan upgrade');
          return [];
        }
        
        handleError(error, 'Failed to fetch station comparison.');
        return []; // Return empty array to prevent map errors
      }
    },
    enabled: opts.stationIds && opts.stationIds.length > 0 && (user?.role === 'owner' || user?.role === 'manager'),
  });
};

export const useHourlySales = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  const { handleError } = useErrorHandler();
  const { user } = useAuth();
  
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
    queryFn: async () => {
      try {
        return await analyticsApi.getHourlySales(stationId, effectiveDateRange);
      } catch (error: any) {
        console.error('Error fetching hourly sales:', error);
        
        // Check if this is a plan restriction
        const errorMessage = error?.response?.data?.message || error?.message || '';
        const isPlanRestriction = error?.response?.status === 401 && 
          (errorMessage.includes('plan') || errorMessage.includes('upgrade') || errorMessage.includes('feature'));
        
        if (isPlanRestriction) {
          console.warn('Hourly sales requires Enterprise plan');
          return [];
        }
        
        handleError(error, 'Failed to fetch hourly sales.');
        throw error;
      }
    },
  enabled: !!user && !!stationId && (user.role === 'owner' || user.role === 'manager'), // Only run the query if stationId is provided and user has permission
  });
};

export const usePeakHours = (stationId?: string) => {
  const { handleError } = useErrorHandler();
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'peak-hours', stationId],
    queryFn: async () => {
      try {
        return await analyticsApi.getPeakHours(stationId);
      } catch (error: any) {
        console.error('Error fetching peak hours:', error);
        
        // Check if this is a plan restriction
        const errorMessage = error?.response?.data?.message || error?.message || '';
        const isPlanRestriction = error?.response?.status === 401 && 
          (errorMessage.includes('plan') || errorMessage.includes('upgrade') || errorMessage.includes('feature'));
        
        if (isPlanRestriction) {
          console.warn('Peak hours analytics requires plan upgrade');
          return [];
        }
        
        handleError(error, 'Failed to fetch peak hours.');
        return []; // Return empty array to prevent errors
      }
    },
  enabled: !!user && !!stationId && (user.role === 'owner' || user.role === 'manager'), // Only enable for owner/manager with stationId
  });
};

export const useFuelPerformance = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  const { handleError } = useErrorHandler();
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'fuel-performance', stationId, dateRange],
    queryFn: async () => {
      try {
        return await analyticsApi.getFuelPerformance(stationId, dateRange);
      } catch (error: any) {
        console.error('Error fetching fuel performance:', error);
        
        // Check if this is a plan restriction
        const errorMessage = error?.response?.data?.message || error?.message || '';
        const isPlanRestriction = error?.response?.status === 401 && 
          (errorMessage.includes('plan') || errorMessage.includes('upgrade') || errorMessage.includes('feature'));
        
        if (isPlanRestriction) {
          console.warn('Fuel performance analytics requires plan upgrade');
          return [];
        }
        
        handleError(error, 'Failed to fetch fuel performance.');
        return []; // Return empty array to prevent errors
      }
    },
  enabled: !!user && (user.role === 'owner' || user.role === 'manager'), // Only enable for owner/manager
  });
};

export const useStationRanking = (period: string) => {
  const { handleError } = useErrorHandler();
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'station-ranking', period],
    queryFn: async () => {
      try {
        const result = await analyticsApi.getStationRanking(period);
        return result || [];
      } catch (error: any) {
        console.error('Error fetching station ranking:', error);
        
        // Check if this is a plan restriction
        const errorMessage = error?.response?.data?.message || error?.message || '';
        const isPlanRestriction = error?.response?.status === 401 && 
          (errorMessage.includes('plan') || errorMessage.includes('upgrade') || errorMessage.includes('feature'));
        
        if (isPlanRestriction) {
          // Return empty data with a plan upgrade message instead of throwing
          console.warn('Station ranking requires plan upgrade');
          return [];
        }
        
        handleError(error, 'Failed to fetch station ranking.');
        return []; // Return empty array to prevent map errors
      }
    },
  enabled: !!user && (user.role === 'owner' || user.role === 'manager'), // Only enable for owner/manager
  });
};

export const useSuperAdminAnalytics = () => {
  const { handleError } = useErrorHandler();
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'superadmin'],
    queryFn: async () => {
      try {
        return await analyticsApi.getSuperAdminAnalytics();
      } catch (error) {
        handleError(error, 'Failed to fetch super admin analytics.');
        throw error;
      }
    },
    enabled: user?.role === 'superadmin', // Only enable for superadmin users
  });
};
