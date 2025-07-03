/**
 * @file hooks/api/useCreditors.ts
 * @description React Query hooks for creditors API
 */
import { useQuery } from '@tanstack/react-query';
import { creditorService } from '@/api/services/creditorService';

/**
 * Hook to fetch creditors for a station
 * @param stationId Station ID
 * @returns Query result with creditors
 */
export const useCreditors = (stationId?: string) => {
  return useQuery({
    queryKey: ['creditors', stationId],
    queryFn: () => creditorService.getCreditors(stationId || ''),
    enabled: !!stationId,
    staleTime: 60000 // 1 minute
  });
};

/**
 * Hook to fetch a creditor by ID
 * @param id Creditor ID
 * @returns Query result with creditor details
 */
export const useCreditor = (id?: string) => {
  return useQuery({
    queryKey: ['creditor', id],
    queryFn: () => creditorService.getCreditor(id || ''),
    enabled: !!id,
    staleTime: 60000 // 1 minute
  });
};