
/**
 * Creditors Service
 * 
 * API service for managing creditors and credit payments
 */

import { apiClient } from '../client';
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
  getCreditors: async (): Promise<Creditor[]> => {
    const response = await apiClient.get<ApiResponse<{ creditors: Creditor[] }>>('/creditors');
    return response.data.data.creditors;
  },

  // Get creditor by ID
  getCreditor: async (id: string): Promise<Creditor> => {
    const response = await apiClient.get<ApiResponse<Creditor>>(`/creditors/${id}`);
    return response.data.data;
  },

  // Create creditor
  createCreditor: async (data: CreateCreditorRequest): Promise<Creditor> => {
    const response = await apiClient.post<ApiResponse<Creditor>>('/creditors', data);
    return response.data.data;
  },

  // Update creditor
  updateCreditor: async (id: string, data: UpdateCreditorRequest): Promise<Creditor> => {
    const response = await apiClient.put<ApiResponse<Creditor>>(`/creditors/${id}`, data);
    return response.data.data;
  },

  // Delete creditor
  deleteCreditor: async (id: string): Promise<void> => {
    await apiClient.delete(`/creditors/${id}`);
  },

  // Get credit payments for a creditor
  getCreditPayments: async (creditorId: string): Promise<CreditPayment[]> => {
    const response = await apiClient.get<ApiResponse<{ payments: CreditPayment[] }>>(`/creditors/${creditorId}/payments`);
    return response.data.data.payments;
  },

  // Create credit payment
  createCreditPayment: async (data: CreateCreditPaymentRequest): Promise<CreditPayment> => {
    const response = await apiClient.post<ApiResponse<CreditPayment>>('/credit-payments', data);
    return response.data.data;
  },

  // Get outstanding balance for creditor
  getOutstandingBalance: async (creditorId: string): Promise<{ balance: number; lastUpdated: string }> => {
    const response = await apiClient.get<ApiResponse<{ balance: number; lastUpdated: string }>>(`/creditors/${creditorId}/balance`);
    return response.data.data;
  },

  // Create credit payment
  createPayment: async (data: CreateCreditPaymentRequest): Promise<CreditPayment> => {
    const response = await apiClient.post<ApiResponse<CreditPayment>>('/credit-payments', data);
    return response.data.data;
  },

  // Get credit payments for a creditor
  getPayments: async (creditorId: string): Promise<CreditPayment[]> => {
    const response = await apiClient.get<ApiResponse<{ payments: CreditPayment[] }>>(`/credit-payments`, {
      params: { creditorId },
    });
    return response.data.data.payments;
  },
};
