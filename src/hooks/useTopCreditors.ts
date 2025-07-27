
import { useQuery } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';

interface TopCreditor {
  id: string;
  partyName: string;
  outstandingAmount: number;
  creditLimit: number | null;
}

export const useTopCreditors = (limit: number = 5) => {
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['top-creditors', limit],
    queryFn: async (): Promise<TopCreditor[]> => {
      // Mock data for demonstration
      return [
        {
          id: '1',
          partyName: 'ABC Transport Ltd',
          outstandingAmount: 150000,
          creditLimit: 200000
        },
        {
          id: '2',
          partyName: 'XYZ Logistics',
          outstandingAmount: 120000,
          creditLimit: 150000
        },
        {
          id: '3',
          partyName: 'City Taxi Services',
          outstandingAmount: 80000,
          creditLimit: 100000
        }
      ];
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch top creditors.');
    },
  });
};
