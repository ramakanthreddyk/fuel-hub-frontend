
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditorService } from '@/api/services/creditorService';
import { CreateCreditPaymentRequest, TopCreditor, CreateCreditorRequest } from '@/api/api-contract';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch creditors
 */
export const useCreditors = (stationId?: string) => {
  return useQuery({
    queryKey: ['creditors', stationId],
    queryFn: () => creditorService.getCreditors(stationId),
    staleTime: 60000 // 1 minute
  });
};

/**
 * Hook to fetch a creditor by ID
 */
export const useCreditor = (id?: string) => {
  return useQuery({
    queryKey: ['creditor', id],
    queryFn: () => creditorService.getCreditor(id || ''),
    enabled: !!id,
    staleTime: 60000 // 1 minute
  });
};

/**
 * Hook to fetch top creditors by outstanding amount
 */
export const useTopCreditors = () => {
  return useQuery({
    queryKey: ['top-creditors'],
    queryFn: async (): Promise<TopCreditor[]> => {
      const creditors = await creditorService.getCreditors();
      return creditors
        .sort((a, b) => (b.outstandingAmount || 0) - (a.outstandingAmount || 0))
        .slice(0, 10)
        .map(creditor => ({
          id: creditor.id,
          partyName: creditor.partyName,
          name: creditor.name || creditor.partyName,
          outstandingAmount: creditor.outstandingAmount || 0,
          creditLimit: creditor.creditLimit,
          lastPurchaseDate: creditor.lastPurchaseDate
        }));
    },
    staleTime: 60000 // 1 minute
  });
};

/**
 * Hook to create a new creditor payment
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCreditPaymentRequest) => creditorService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['top-creditors'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record payment",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to create a new creditor
 */
export const useCreateCreditor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCreditorRequest) => creditorService.createCreditor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['top-creditors'] });
      toast({
        title: "Success",
        description: "Creditor created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create creditor",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to fetch payment history for a creditor
 */
export const usePayments = (creditorId?: string) => {
  return useQuery({
    queryKey: ['payments', creditorId],
    queryFn: () => creditorService.getPayments(creditorId || ''),
    enabled: !!creditorId,
    staleTime: 60000 // 1 minute
  });
};

/**
 * Alias for useCreatePayment to maintain backward compatibility
 */
export const useCreateCreditorPayment = useCreatePayment;

/**
 * Hook to fetch credit payments (alias for usePayments)
 */
export const useCreditPayments = usePayments;
