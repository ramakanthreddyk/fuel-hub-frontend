
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditorsService } from '@/api/services';
import type { 
  Creditor, 
  CreateCreditorRequest, 
  UpdateCreditorRequest, 
  CreditPayment, 
  CreateCreditPaymentRequest 
} from '@/api/api-contract';
import { toast } from 'sonner';

// Get all creditors
export const useCreditors = () => {
  return useQuery({
    queryKey: ['creditors'],
    queryFn: creditorsService.getCreditors,
  });
};

// Get creditor by ID
export const useCreditor = (creditorId: string) => {
  return useQuery({
    queryKey: ['creditors', creditorId],
    queryFn: () => creditorsService.getCreditor(creditorId),
    enabled: !!creditorId,
  });
};

// Get credit payments for a creditor
export const useCreditPayments = (creditorId: string) => {
  return useQuery({
    queryKey: ['creditors', creditorId, 'payments'],
    queryFn: () => creditorsService.getCreditPayments(creditorId),
    enabled: !!creditorId,
  });
};

// Alias for useCreditPayments
export const usePayments = (creditorId: string) => {
  return useCreditPayments(creditorId);
};

// Create creditor mutation
export const useCreateCreditor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCreditorRequest) => 
      creditorsService.createCreditor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast.success('Creditor created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create creditor');
    },
  });
};

// Update creditor mutation
export const useUpdateCreditor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ creditorId, data }: { creditorId: string; data: UpdateCreditorRequest }) =>
      creditorsService.updateCreditor(creditorId, data),
    onSuccess: (_, { creditorId }) => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['creditors', creditorId] });
      toast.success('Creditor updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update creditor');
    },
  });
};

// Delete creditor mutation
export const useDeleteCreditor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (creditorId: string) => 
      creditorsService.deleteCreditor(creditorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast.success('Creditor deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete creditor');
    },
  });
};

// Create credit payment mutation
export const useCreateCreditPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCreditPaymentRequest) =>
      creditorsService.createCreditPayment(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['creditors', data.creditorId, 'payments'] });
      toast.success('Payment recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to record payment');
    },
  });
};

// Alias for useCreateCreditPayment 
export const useCreatePayment = () => {
  return useCreateCreditPayment();
};

// Get top creditors (for dashboard)
export const useTopCreditors = () => {
  return useQuery({
    queryKey: ['creditors', 'top'],
    queryFn: creditorsService.getTopCreditors,
  });
};
