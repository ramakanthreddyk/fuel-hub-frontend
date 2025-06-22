
import { apiClient } from './client';

export interface SalesSummary {
  totalSales: number;
  totalVolume: number;
  transactionCount: number;
  period: string;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  amount: number;
  percentage: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  amount: number;
}

export interface TopCreditor {
  id: string;
  partyName: string;
  outstandingAmount: number;
  creditLimit?: number;
}

export interface DailySalesTrend {
  date: string;
  amount: number;
  volume: number;
}

export const dashboardApi = {
  // Get monthly sales summary
  getSalesSummary: async (range: string = 'monthly'): Promise<SalesSummary> => {
    const response = await apiClient.get(`/dashboard/sales-summary?range=${range}`);
    return response.data;
  },

  // Get payment method breakdown
  getPaymentMethodBreakdown: async (): Promise<PaymentMethodBreakdown[]> => {
    const response = await apiClient.get('/dashboard/payment-methods');
    return response.data;
  },

  // Get fuel type breakdown
  getFuelTypeBreakdown: async (): Promise<FuelTypeBreakdown[]> => {
    const response = await apiClient.get('/dashboard/fuel-breakdown');
    return response.data;
  },

  // Get top creditors by outstanding amount
  getTopCreditors: async (limit: number = 5): Promise<TopCreditor[]> => {
    const response = await apiClient.get(`/dashboard/top-creditors?limit=${limit}`);
    return response.data;
  },

  // Get daily sales trend
  getDailySalesTrend: async (days: number = 7): Promise<DailySalesTrend[]> => {
    const response = await apiClient.get(`/dashboard/sales-trend?days=${days}`);
    return response.data;
  }
};
