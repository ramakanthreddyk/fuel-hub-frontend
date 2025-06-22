
import { apiClient } from './client';

export interface ReconciliationRecord {
  id: string;
  stationId: string;
  date: string;
  totalExpected: number;
  cashReceived: number;
  reconciliationNotes?: string;
  managerConfirmation: boolean;
  createdAt: string;
  station?: {
    name: string;
  };
}

export interface CreateReconciliationRequest {
  stationId: string;
  date: string;
  totalExpected: number;
  cashReceived: number;
  reconciliationNotes?: string;
  managerConfirmation: boolean;
}

export interface DailyReadingSummary {
  nozzleId: string;
  nozzleNumber: number;
  previousReading: number;
  currentReading: number;
  deltaVolume: number;
  pricePerLitre: number;
  saleValue: number;
  paymentMethod: string;
  cashDeclared: number;
  fuelType: string;
}

export const reconciliationApi = {
  // Get daily readings summary for reconciliation
  getDailyReadingsSummary: async (stationId: string, date: string): Promise<DailyReadingSummary[]> => {
    const response = await apiClient.get(`/reconciliation/daily-summary?stationId=${stationId}&date=${date}`);
    return response.data;
  },

  // Create new reconciliation record
  createReconciliation: async (data: CreateReconciliationRequest): Promise<ReconciliationRecord> => {
    const response = await apiClient.post('/reconciliation', data);
    return response.data;
  },

  // Get reconciliation history
  getReconciliationHistory: async (stationId?: string): Promise<ReconciliationRecord[]> => {
    const params = stationId ? { stationId } : {};
    const response = await apiClient.get('/reconciliation', { params });
    return response.data;
  }
};
