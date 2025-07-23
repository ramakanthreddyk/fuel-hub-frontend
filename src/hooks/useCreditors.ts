
/**
 * @file hooks/useCreditors.ts
 * @description Hooks for creditors management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditorsService } from '@/api/services/creditorsService';
import type { Creditor, Payment } from '@/api/api-contract';

export const useCreditors = () => {
  return useQuery({
    queryKey: ['creditors'],
    queryFn: creditorsService.getCreditors,
  });
};

export const useCreditor = (id: string) => {
  return useQuery({
    queryKey: ['creditor', id],
    queryFn: () => creditorsService.getCreditor(id),
    enabled: !!id,
  });
};

export const useCreateCreditor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: creditorsService.createCreditor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    },
  });
};

export const useUpdateCreditor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Creditor> }) =>
      creditorsService.updateCreditor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    },
  });
};

export const useDeleteCreditor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: creditorsService.deleteCreditor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    },
  });
};

export const usePayments = (creditorId: string) => {
  return useQuery({
    queryKey: ['payments', creditorId],
    queryFn: () => creditorsService.getPayments(creditorId),
    enabled: !!creditorId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ creditorId, data }: { creditorId: string; data: Partial<Payment> }) =>
      creditorsService.createPayment(creditorId, data),
    onSuccess: (_, { creditorId }) => {
      queryClient.invalidateQueries({ queryKey: ['payments', creditorId] });
      queryClient.invalidateQueries({ queryKey: ['creditor', creditorId] });
    },
  });
};
