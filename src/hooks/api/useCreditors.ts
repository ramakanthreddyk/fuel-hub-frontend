/**
 * @file hooks/api/useCreditors.ts
 * @description React Query hooks for creditors API
 */
import { useQuery } from '@tanstack/react-query';
import { creditorsService } from '@/api/services/creditors.service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch creditors for a station
 * @param stationId Station ID (optional)
 * @returns Query result with creditors
 */
export const useCreditors = (stationId?: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['creditors', stationId],
    queryFn: () => creditorsService.getCreditors(stationId),
    staleTime: 60000, // 1 minute
    onError: (error: any) => {
      console.error('[CREDITORS-HOOK] Failed to fetch creditors:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch creditors. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to fetch a creditor by ID
 * @param id Creditor ID
 * @returns Query result with creditor details
 */
export const useCreditor = (id?: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['creditor', id],
    queryFn: () => creditorsService.getCreditor(id || ''),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    onError: (error: any) => {
      console.error('[CREDITORS-HOOK] Failed to fetch creditor:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch creditor details. Please try again.',
        variant: 'destructive',
      });
    },
  });
};