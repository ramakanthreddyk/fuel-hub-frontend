
/**
 * @file api/services/creditorsService.ts
 * @description Service for creditors API endpoints
 */
import { apiClient } from '../client';
import { extractApiData, extractApiArray } from '../client';
import type { Creditor, Payment, ApiResponse } from '../api-contract';

export const creditorsService = {
  /**
   * Get all creditors
   */
  getCreditors: async (): Promise<Creditor[]> => {
    try {
      const response = await apiClient.get<ApiResponse<{ creditors: Creditor[] }>>('/creditors');
      return extractApiArray<Creditor>(response, 'creditors');
    } catch (error) {
      console.error('[CREDITORS-SERVICE] Error fetching creditors:', error);
      return [];
    }
  },

  /**
   * Get creditor by ID
   */
  getCreditor: async (id: string): Promise<Creditor | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Creditor>>(`/creditors/${id}`);
      return extractApiData<Creditor>(response);
    } catch (error) {
      console.error('[CREDITORS-SERVICE] Error fetching creditor:', error);
      return null;
    }
  },

  /**
   * Create creditor
   */
  createCreditor: async (data: Partial<Creditor>): Promise<Creditor> => {
    const response = await apiClient.post<ApiResponse<Creditor>>('/creditors', data);
    return extractApiData<Creditor>(response);
  },

  /**
   * Update creditor
   */
  updateCreditor: async (id: string, data: Partial<Creditor>): Promise<Creditor> => {
    const response = await apiClient.put<ApiResponse<Creditor>>(`/creditors/${id}`, data);
    return extractApiData<Creditor>(response);
  },

  /**
   * Delete creditor
   */
  deleteCreditor: async (id: string): Promise<void> => {
    await apiClient.delete(`/creditors/${id}`);
  },

  /**
   * Get payments for creditor
   */
  getPayments: async (creditorId: string): Promise<Payment[]> => {
    try {
      const response = await apiClient.get<ApiResponse<{ payments: Payment[] }>>(`/creditors/${creditorId}/payments`);
      return extractApiArray<Payment>(response, 'payments');
    } catch (error) {
      console.error('[CREDITORS-SERVICE] Error fetching payments:', error);
      return [];
    }
  },

  /**
   * Create payment for creditor
   */
  createPayment: async (creditorId: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(`/creditors/${creditorId}/payments`, data);
    return extractApiData<Payment>(response);
  }
};
