
/**
 * @file api/services/creditorsService.ts
 * @description Service for creditor-related API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

export interface Creditor {
  id: string;
  partyName: string;
  name: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  outstandingAmount: number;
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  lastPaymentDate?: string;
  lastPurchaseDate?: string;
}

export const creditorsService = {
  getCreditors: async (): Promise<Creditor[]> => {
    try {
      const response = await apiClient.get('/creditors');
      return extractArray<Creditor>(response, 'creditors');
    } catch (error) {
      console.error('Error fetching creditors:', error);
      return [];
    }
  }
};

export default creditorsService;
