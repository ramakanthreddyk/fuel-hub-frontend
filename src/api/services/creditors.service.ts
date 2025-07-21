/**
 * Creditors Service
 * 
 * API service for managing creditors and credit payments
 */

import apiClient from '../core/apiClient';
import API_CONFIG from '../core/config';
import type { 
  Creditor, 
  CreateCreditorRequest, 
  UpdateCreditorRequest,
  CreditPayment,
  CreateCreditPaymentRequest,
  ApiResponse 
} from '../api-contract';

export const creditorsService = {
  // Get all creditors
  getCreditors: async (stationId?: string | object): Promise<Creditor[]> => {
    try {
      // Ensure stationId is a string, not an object
      let url;
      if (stationId && typeof stationId === 'string') {
        url = API_CONFIG.endpoints.creditors.byStation(stationId);
      } else {
        url = API_CONFIG.endpoints.creditors.base;
      }
      
      console.log('[CREDITORS-SERVICE] Fetching creditors with URL:', url);
      const response = await apiClient.get(url);
      
      // Extract creditors from response
      let creditors = [];
      if (response.data?.data?.creditors) {
        creditors = response.data.data.creditors;
      } else if (response.data?.creditors) {
        creditors = response.data.creditors;
      } else if (Array.isArray(response.data)) {
        creditors = response.data;
      }
      
      return creditors;
    } catch (error) {
      console.error('[CREDITORS-SERVICE] Error fetching creditors:', error);
      return [];
    }
  },

  // Get creditor by ID
  getCreditor: async (id: string): Promise<Creditor> => {
    try {
      const response = await apiClient.get(API_CONFIG.endpoints.creditors.byId(id));
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`[CREDITORS-SERVICE] Error fetching creditor ${id}:`, error);
      throw error;
    }
  },

  // Create creditor
  createCreditor: async (data: CreateCreditorRequest): Promise<Creditor> => {
    try {
      const response = await apiClient.post(API_CONFIG.endpoints.creditors.base, data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('[CREDITORS-SERVICE] Error creating creditor:', error);
      throw error;
    }
  },

  // Update creditor
  updateCreditor: async (id: string, data: UpdateCreditorRequest): Promise<Creditor> => {
    try {
      const response = await apiClient.put(API_CONFIG.endpoints.creditors.byId(id), data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`[CREDITORS-SERVICE] Error updating creditor ${id}:`, error);
      throw error;
    }
  },

  // Delete creditor
  deleteCreditor: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_CONFIG.endpoints.creditors.byId(id));
    } catch (error) {
      console.error(`[CREDITORS-SERVICE] Error deleting creditor ${id}:`, error);
      throw error;
    }
  },

  // Get credit payments for a creditor
  getCreditPayments: async (creditorId: string): Promise<CreditPayment[]> => {
    try {
      const response = await apiClient.get(API_CONFIG.endpoints.creditors.payments(creditorId));
      return response.data?.data?.payments || response.data?.payments || [];
    } catch (error) {
      console.error(`[CREDITORS-SERVICE] Error fetching payments for creditor ${creditorId}:`, error);
      return [];
    }
  },

  // Create credit payment
  createCreditPayment: async (data: CreateCreditPaymentRequest): Promise<CreditPayment> => {
    try {
      const response = await apiClient.post(API_CONFIG.endpoints.creditPayments.base, data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('[CREDITORS-SERVICE] Error creating payment:', error);
      throw error;
    }
  },

  // Get outstanding balance for creditor
  getOutstandingBalance: async (creditorId: string): Promise<{ balance: number; lastUpdated: string }> => {
    try {
      const response = await apiClient.get(API_CONFIG.endpoints.creditors.balance(creditorId));
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`[CREDITORS-SERVICE] Error fetching balance for creditor ${creditorId}:`, error);
      throw error;
    }
  },

  // Create credit payment (alias for createCreditPayment)
  createPayment: async (data: CreateCreditPaymentRequest): Promise<CreditPayment> => {
    return creditorsService.createCreditPayment(data);
  },

  // Get credit payments for a creditor
  getPayments: async (creditorId: string): Promise<CreditPayment[]> => {
    try {
      const response = await apiClient.get(API_CONFIG.endpoints.creditPayments.base, {
        params: { creditorId },
      });
      return response.data?.data?.payments || response.data?.payments || [];
    } catch (error) {
      console.error(`[CREDITORS-SERVICE] Error fetching payments for creditor ${creditorId}:`, error);
      return [];
    }
  },
};