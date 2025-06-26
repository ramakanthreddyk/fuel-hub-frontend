
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
    const rawCreditors = response.data.creditors || response.data || [];
    return rawCreditors.map((creditor: any) => ({
      id: creditor.id,
      name: creditor.party_name,
      partyName: creditor.party_name,
      contactNumber: creditor.contact_number,
      address: creditor.address,
      status: creditor.status,
      creditLimit: parseFloat(creditor.credit_limit || 0),
      currentOutstanding: 0, // Backend doesn't provide this in list
      createdAt: creditor.created_at
    }));
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
