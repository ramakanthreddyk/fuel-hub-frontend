
/**
 * Creditors Hook
 * 
 * React Query hooks for creditor management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditorsService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import type { CreateCreditorRequest, UpdateCreditorRequest, CreateCreditPaymentRequest } from '@/api/api-contract';

export const useCreditors = () => {
  return useQuery({
    queryKey: ['creditors'],
    queryFn: () => creditorsService.getCreditors(),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCreditorRequest) => creditorsService.createCreditor(data),
    onSuccess: (newCreditor) => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast({
        title: "Success",
        description: `Creditor "${newCreditor.partyName}" created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create creditor",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCreditor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCreditorRequest }) => 
      creditorsService.updateCreditor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast({
        title: "Success",
        description: "Creditor updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update creditor",
        variant: "destructive",
      });
    },
  });
};

export const useCreditPayments = (creditorId: string) => {
  return useQuery({
    queryKey: ['credit-payments', creditorId],
    queryFn: () => creditorsService.getCreditPayments(creditorId),
    enabled: !!creditorId,
  });
};

export const useCreateCreditPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCreditPaymentRequest) => creditorsService.createCreditPayment(data),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['credit-payments', payment.creditorId] });
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['creditor', payment.creditorId] });
      toast({
        title: "Success",
        description: `Payment of ₹${payment.amount} recorded successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive",
      });
    },
  });
};

export const useOutstandingBalance = (creditorId: string) => {
  return useQuery({
    queryKey: ['outstanding-balance', creditorId],
    queryFn: () => creditorsService.getOutstandingBalance(creditorId),
    enabled: !!creditorId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
