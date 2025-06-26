
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Creditor, 
  CreateCreditorRequest, 
  CreditPayment, 
  CreatePaymentRequest,
  ApiResponse 
} from './api-contract';

export const creditorsApi = {
  // Get all creditors
  getCreditors: async (): Promise<Creditor[]> => {
    const response = await apiClient.get('/creditors');
    return extractApiArray<Creditor>(response, 'creditors');
  },

  // Create new creditor
  createCreditor: async (data: CreateCreditorRequest): Promise<Creditor> => {
    const response = await apiClient.post('/creditors', data);
    return extractApiData<Creditor>(response);
  },

  // Get creditor by ID
  getCreditor: async (id: string): Promise<Creditor> => {
    const response = await apiClient.get(`/creditors/${id}`);
    return extractApiData<Creditor>(response);
  },

  // Get payments for a creditor
  getPayments: async (creditorId: string): Promise<CreditPayment[]> => {
    const response = await apiClient.get(`/credit-payments?creditorId=${creditorId}`);
    return extractApiArray<CreditPayment>(response);
  },

  // Create new payment
  createPayment: async (data: CreatePaymentRequest): Promise<CreditPayment> => {
    const response = await apiClient.post('/credit-payments', data);
    return extractApiData<CreditPayment>(response);
  }
};

// Export types for backward compatibility
export type { 
  Creditor, 
  CreateCreditorRequest, 
  CreditPayment, 
  CreatePaymentRequest 
};
