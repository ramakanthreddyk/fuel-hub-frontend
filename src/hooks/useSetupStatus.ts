
import { useQuery } from '@tanstack/react-query';
import { contractClient } from '@/api/contract-client';

export interface SetupStatusDTO {
  hasStation: boolean;
  hasPump: boolean;
  hasNozzle: boolean;
  hasFuelPrice: boolean;
  completed: boolean;
}

export const useSetupStatus = () => {
  return useQuery({
    queryKey: ['setup-status'],
    queryFn: async (): Promise<SetupStatusDTO> => {
      try {
        console.log('[SETUP-STATUS] Fetching setup status...');
        const result = await contractClient.get<SetupStatusDTO>('/setup-status');
        console.log('[SETUP-STATUS] Setup status result:', result);
        return result;
      } catch (error) {
        console.error('[SETUP-STATUS] Error fetching setup status:', error);
        // Return default status on error
        return {
          hasStation: false,
          hasPump: false,
          hasNozzle: false,
          hasFuelPrice: false,
          completed: false
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds (less aggressive)
    staleTime: 10000, // 10 seconds stale time
    retry: 3,
    retryDelay: 1000,
  });
};
