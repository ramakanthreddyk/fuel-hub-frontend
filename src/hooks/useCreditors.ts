/**
 * @file hooks/useCreditors.ts
 * @description React Query hooks for creditor operations
 */
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { creditorService } from '@/api/services/creditorService';
import { CreateCreditorRequest, CreateCreditPaymentRequest } from '@/api/api-contract';
import { dashboardService } from '@/api/services/dashboardService';

/**
 * Hook to create a new creditor
 * @returns Mutation for creating a creditor
 */
export const useCreateCreditor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCreditorRequest) => creditorService.createCreditor(data),
    onSuccess: () => {
      // Invalidate creditors query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    }
  });
};

/**
 * Hook to create a new payment for a creditor
 * @returns Mutation for creating a payment
 */
export const useCreateCreditorPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCreditPaymentRequest) => creditorService.createPayment(data),
    onSuccess: (_, variables) => {
      // Invalidate creditor query to refetch the details
      queryClient.invalidateQueries({ queryKey: ['creditor', variables.creditorId] });
      // Invalidate creditors query to refetch the list with updated balances
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    }
  });
};

/**
 * Hook to get top creditors by outstanding amount
 * @param limit Number of creditors to return (default: 5)
 * @returns Query result with top creditors
 */
export const useTopCreditors = (limit: number = 5) => {
  return useQuery({
    queryKey: ['top-creditors', limit],
    queryFn: async () => {
      try {
        const result = await dashboardService.getTopCreditors(limit);
        console.log('[useTopCreditors] API result:', result);
        return result;
      } catch (error) {
        console.error('[useTopCreditors] Error fetching top creditors:', error);
        return [];
      }
    },
    staleTime: 60000, // 1 minute
    retry: 1
  });
};