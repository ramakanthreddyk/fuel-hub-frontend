import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';

interface PaymentMethodData {
  paymentMethod: string;
  amount: number;
  percentage: number;
}

export const useDashboardPaymentMethods = () => {
  const { handleApiError } = useToastNotifications();
  
  const query = useQuery({
    queryKey: ['dashboard-payment-methods'],
    queryFn: async (): Promise<PaymentMethodData[]> => {
      return handleApiResponse(() => 
        apiClient.get('/dashboard/payment-methods')
      );
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleApiError(error, 'Payment Methods');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading payment methods...');
  return query;
};