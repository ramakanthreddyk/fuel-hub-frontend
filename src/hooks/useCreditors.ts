
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditorsService } from '@/api/services/creditorsService';
import { useToast } from '@/hooks/use-toast';
import type { Creditor, Payment, CreateCreditorRequest, CreatePaymentRequest } from '@/api/api-contract';

export const useCreditors = () => {
  return useQuery({
    queryKey: ['creditors'],
    queryFn: creditorsService.getCreditors,
    staleTime: 300000, // 5 minutes
  });
};

export const useCreditor = (id: string) => {
  return useQuery({
    queryKey: ['creditor', id],
    queryFn: () => creditorsService.getCreditor(id),
    enabled: !!id,
    staleTime: 300000,
  });
};

export const useCreateCreditor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCreditorRequest) => creditorsService.createCreditor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast({
        title: "Success",
        description: "Creditor created successfully",
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Creditor> }) => 
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

export const useDeleteCreditor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => creditorsService.deleteCreditor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast({
        title: "Success",
        description: "Creditor deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete creditor",
        variant: "destructive",
      });
    },
  });
};

export const usePayments = (creditorId: string) => {
  return useQuery({
    queryKey: ['payments', creditorId],
    queryFn: () => creditorsService.getPayments(creditorId),
    enabled: !!creditorId,
    staleTime: 300000,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ creditorId, data }: { creditorId: string; data: CreatePaymentRequest }) => 
      creditorsService.createPayment(creditorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
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

export const useTopCreditors = () => {
  return useQuery({
    queryKey: ['creditors', 'top'],
    queryFn: async () => {
      const creditors = await creditorsService.getCreditors();
      return creditors
        .filter(c => c.outstandingAmount > 0)
        .sort((a, b) => b.outstandingAmount - a.outstandingAmount)
        .slice(0, 10);
    },
    staleTime: 300000,
  });
};
