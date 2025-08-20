import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Creditor, 
  CreateCreditorRequest, 
  UpdateCreditorRequest,
  CreditPayment, 
  CreatePaymentRequest,
  ApiResponse 
} from './api-contract';

export const creditorsApi = {
  // Get all creditors
  getCreditors: async (): Promise<Creditor[]> => {
    try {
      const response = await apiClient.get('/creditors');
      return extractApiArray<Creditor>(response, 'creditors');
    } catch (error) {
      console.error('Error fetching creditors:', error);
      return [];
    }
  },
  // Create new creditor
  createCreditor: async (data: CreateCreditorRequest): Promise<Creditor> => {
    try {
      // Validate creditLimit is a number and not too large
      if (data.creditLimit !== undefined) {
        // Ensure creditLimit is a number and within PostgreSQL numeric range
        const creditLimit = Number(data.creditLimit);
        if (isNaN(creditLimit)) {
          throw new Error('Credit limit must be a valid number');
        }
        // PostgreSQL numeric(10,2) has a max of 99,999,999.99
        if (creditLimit > 9999999) {
          throw new Error('Credit limit cannot exceed 9,999,999');
        }
        // Update the data with the validated number
        data.creditLimit = creditLimit;
      }
      const response = await apiClient.post('/creditors', data);
      return extractApiData<Creditor>(response);
    } catch (error: any) {
      console.error('[CREDITORS-API] Error creating creditor:', error);
      throw error;
    }
  },

  // Get creditor by ID
  getCreditor: async (id: string): Promise<Creditor> => {
    try {
      const response = await apiClient.get(`/creditors/${id}`);
      return extractApiData<Creditor>(response);
    } catch (error) {
      console.error('Error fetching creditor:', error);
      throw error;
    }
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
  },
  // Update creditor
  updateCreditor: async (id: string, data: UpdateCreditorRequest): Promise<Creditor> => {
    try {
      const response = await apiClient.put(`/creditors/${id}`, data);
      return extractApiData<Creditor>(response);
    } catch (error) {
      console.error('Error updating creditor:', error);
      throw error;
    }
  },
  // Delete creditor
  deleteCreditor: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/creditors/${id}`);
    } catch (error) {
      console.error('Error deleting creditor:', error);
      throw error;
    }
  }


}
