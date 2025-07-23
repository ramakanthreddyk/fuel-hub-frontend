
import { apiClient } from '../client';

export interface Creditor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  currentBalance: number;
  totalSales: number;
  lastPurchase?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  creditorId: string;
  creditorName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  notes?: string;
}

export const creditorsService = {
  getCreditors: async (): Promise<Creditor[]> => {
    const response = await apiClient.get('/creditors');
    return response.data;
  },

  getCreditor: async (id: string): Promise<Creditor> => {
    const response = await apiClient.get(`/creditors/${id}`);
    return response.data;
  },

  createCreditor: async (data: Omit<Creditor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Creditor> => {
    const response = await apiClient.post('/creditors', data);
    return response.data;
  },

  updateCreditor: async (id: string, data: Partial<Creditor>): Promise<Creditor> => {
    const response = await apiClient.put(`/creditors/${id}`, data);
    return response.data;
  },

  deleteCreditor: async (id: string): Promise<void> => {
    await apiClient.delete(`/creditors/${id}`);
  },

  getPayments: async (creditorId?: string): Promise<Payment[]> => {
    const params = creditorId ? { creditorId } : {};
    const response = await apiClient.get('/creditors/payments', { params });
    return response.data;
  },

  createPayment: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await apiClient.post('/creditors/payments', data);
    return response.data;
  },

  getTopCreditors: async (limit: number = 10): Promise<Creditor[]> => {
    const response = await apiClient.get('/creditors/top', { params: { limit } });
    return response.data;
  }
};
