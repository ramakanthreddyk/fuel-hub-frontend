
import { useQuery } from '@tanstack/react-query';
import { useErrorHandler } from '../useErrorHandler';

// Mock interface for today's sales data
interface TodaysSalesData {
  totalAmount: number;
  totalVolume: number;
  totalEntries: number;
  paymentBreakdown: {
    cash: number;
    card: number;
    upi: number;
    credit: number;
  };
  fuelBreakdown: {
    petrol: { amount: number; volume: number };
    diesel: { amount: number; volume: number };
    premium: { amount: number; volume: number };
  };
}

export const useTodaysSales = () => {
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['todays-sales'],
    queryFn: async (): Promise<TodaysSalesData> => {
      // Mock data for demonstration
      return {
        totalAmount: 125000,
        totalVolume: 1500,
        totalEntries: 45,
        paymentBreakdown: {
          cash: 45000,
          card: 35000,
          upi: 30000,
          credit: 15000
        },
        fuelBreakdown: {
          petrol: { amount: 60000, volume: 800 },
          diesel: { amount: 50000, volume: 600 },
          premium: { amount: 15000, volume: 100 }
        }
      };
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch today\'s sales data.');
    },
  });
};
