
import { apiClient } from './client';

export interface Creditor {
  id: string;
  name: string;
  contactNumber?: string;
  address?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const creditorsApi = {
  // Get all creditors
  getCreditors: async (): Promise<Creditor[]> => {
    const response = await apiClient.get('/creditors');
    return response.data;
  }
};
