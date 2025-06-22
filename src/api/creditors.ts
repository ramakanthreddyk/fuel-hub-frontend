
import { apiClient } from './client';

export interface Creditor {
  id: string;
  name: string;
  contactNumber?: string;
  address?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  partyName: string;
  creditLimit?: number;
  currentOutstanding?: number;
}

export interface CreateCreditorRequest {
  partyName: string;
  creditLimit?: number;
}

export interface CreditPayment {
  id: string;
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check';
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check';
  referenceNumber?: string;
  notes?: string;
}

export const creditorsApi = {
  // Get all creditors
  getCreditors: async (): Promise<Creditor[]> => {
    const response = await apiClient.get('/creditors');
    return response.data;
  },

  // Create new creditor
  createCreditor: async (data: CreateCreditorRequest): Promise<Creditor> => {
    const response = await apiClient.post('/creditors', data);
    return response.data;
  },

  // Get creditor by ID
  getCreditor: async (id: string): Promise<Creditor> => {
    const response = await apiClient.get(`/creditors/${id}`);
    return response.data;
  },

  // Get payments for a creditor
  getPayments: async (creditorId: string): Promise<CreditPayment[]> => {
    const response = await apiClient.get(`/credit-payments?creditorId=${creditorId}`);
    return response.data;
  },

  // Create new payment
  createPayment: async (data: CreatePaymentRequest): Promise<CreditPayment> => {
    const response = await apiClient.post('/credit-payments', data);
    return response.data;
  }
};
