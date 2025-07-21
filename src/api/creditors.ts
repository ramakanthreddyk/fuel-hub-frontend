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
  getCreditors: async (stationId?: string | object): Promise<Creditor[]> => {
    // Ensure stationId is a string if provided
    let url = '/creditors';
    if (stationId) {
      if (typeof stationId === 'string' && stationId.trim() !== '') {
        url = `/creditors?stationId=${stationId}`;
      } else {
        console.warn('[CREDITORS-API] Invalid stationId type:', typeof stationId);
      }
    }
    
    try {
      console.log('[CREDITORS-API] Fetching creditors with URL:', url);
      const response = await apiClient.get(url);
      return extractApiArray<Creditor>(response, 'creditors');
    } catch (error) {
      console.error('[CREDITORS-API] Error fetching creditors:', error);
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