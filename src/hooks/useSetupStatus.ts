
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
      return contractClient.get<SetupStatusDTO>('/setup-status');
    },
    refetchInterval: 5000, // Refetch every 5 seconds to keep status updated
    staleTime: 0, // Always consider data stale for real-time updates
  });
};
