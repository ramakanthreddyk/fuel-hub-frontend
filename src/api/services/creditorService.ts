/**
 * @file api/services/creditorService.ts
 * @description Service for creditor API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import { 
  Creditor, 
  CreateCreditorRequest, 
  CreditPayment, 
  CreateCreditPaymentRequest 
} from '../api-contract';

/**
 * Service for creditor API
 */
export const creditorService = {
  /**
   * Get creditors for a station
   * @param stationId Station ID (optional)
   * @returns List of creditors
   */
  getCreditors: async (stationId?: string): Promise<Creditor[]> => {
    try {
      secureLog.debug('[CREDITOR-API] Fetching creditors for station:', stationId);
      const params = stationId ? { stationId } : {};
      const response = await apiClient.get(`creditors`, { params });
      return extractArray<Creditor>(response, 'creditors');
    } catch (error) {
      secureLog.error('[CREDITOR-API] Error fetching creditors:', error);
      return [];
    }
  },
  
  /**
   * Get a creditor by ID
   * @param id Creditor ID
   * @returns Creditor details
   */
  getCreditor: async (id: string): Promise<Creditor | null> => {
    try {
      secureLog.debug('[CREDITOR-API] Fetching creditor details for ID:', id);
      const response = await apiClient.get(`creditors/${sanitizeUrlParam(id)}`);
      return extractData<Creditor>(response);
    } catch (error) {
      secureLog.error(`[CREDITOR-API] Error fetching creditor ${id}:`, error);
      return null;
    }
  },

  /**
   * Create a new creditor
   * @param data Creditor creation data
   * @returns Created creditor
   */
  createCreditor: async (data: CreateCreditorRequest): Promise<Creditor> => {
    try {
      secureLog.debug('[CREDITOR-API] Creating creditor:', data);
      const response = await apiClient.post('creditors', data);
      return extractData<Creditor>(response);
    } catch (error) {
      secureLog.error('[CREDITOR-API] Error creating creditor:', error);
      throw error;
    }
  },

  /**
   * Create a payment for a creditor
   * @param data Payment creation data
   * @returns Created payment
   */
  createPayment: async (data: CreateCreditPaymentRequest): Promise<CreditPayment> => {
    try {
      secureLog.debug('[CREDITOR-API] Creating payment:', data);
      const response = await apiClient.post('credit-payments', data);
      return extractData<CreditPayment>(response);
    } catch (error) {
      secureLog.error('[CREDITOR-API] Error creating payment:', error);
      throw error;
    }
  },

  /**
   * Get payments for a creditor
   * @param creditorId Creditor ID
   * @returns List of payments
   */
  getPayments: async (creditorId: string): Promise<CreditPayment[]> => {
    try {
      secureLog.debug('[CREDITOR-API] Fetching payments for creditor:', creditorId);
      const response = await apiClient.get(`credit-payments`, { 
        params: { creditorId } 
      });
      return extractArray<CreditPayment>(response);
    } catch (error) {
      secureLog.error('[CREDITOR-API] Error fetching payments:', error);
      return [];
    }
  }
};

export default creditorService;