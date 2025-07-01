
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditorsApi, CreateCreditorRequest, CreatePaymentRequest } from '@/api/creditors';
import { useToast } from '@/hooks/use-toast';

export const useCreditors = () => {
  return useQuery({
    queryKey: ['creditors'],
    queryFn: creditorsApi.getCreditors,
    retry: 1,
    staleTime: 30000,
  });
};

export const useCreditor = (id: string) => {
  return useQuery({
    queryKey: ['creditors', id],
    queryFn: () => creditorsApi.getCreditor(id),
    enabled: !!id,
  });
};

export const useCreateCreditor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCreditorRequest) => creditorsApi.createCreditor(data),
    onSuccess: (newCreditor) => {
      // Invalidate and refetch creditors list
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      
      // Show success message
      toast({
        title: "Success",
        description: `Creditor "${newCreditor.partyName}" created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create creditor:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create creditor",
        variant: "destructive",
      });
    },
  });
};

export const usePayments = (creditorId: string) => {
  return useQuery({
    queryKey: ['payments', creditorId],
    queryFn: () => creditorsApi.getPayments(creditorId),
    enabled: !!creditorId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => creditorsApi.createPayment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments', variables.creditorId] });
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to record payment:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record payment",
        variant: "destructive",
      });
    },
  });
};
