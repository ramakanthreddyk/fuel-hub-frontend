
import { apiClient, extractApiData, extractApiArray } from '../client';
import type { NozzleReading, CashReport, ApiResponse } from '../api-contract';

export interface CreateAttendantReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export interface CreateCashReportRequest {
  stationId: string;
  reportDate: string;
  openingCash: number;
  closingCash: number;
  totalSales: number;
  expenses?: number;
  notes?: string;
}

export const attendantReadingsService = {
  getReadings: async (filters?: any): Promise<NozzleReading[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.stationId) params.append('stationId', filters.stationId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/nozzle-readings?${params.toString()}`);
      return extractApiArray<NozzleReading>(response, 'readings');
    } catch (error) {
      console.error('[ATTENDANT-READINGS] Error fetching readings:', error);
      return [];
    }
  },

  createReading: async (data: CreateAttendantReadingRequest): Promise<NozzleReading> => {
    try {
      console.log('[ATTENDANT-READINGS] Creating reading:', data);
      const response = await apiClient.post('/nozzle-readings', data);
      return extractApiData<NozzleReading>(response);
    } catch (error) {
      console.error('[ATTENDANT-READINGS] Error creating reading:', error);
      throw error;
    }
  },

  getCashReports: async (filters?: any): Promise<CashReport[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.stationId) params.append('stationId', filters.stationId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/cash-reports?${params.toString()}`);
      return extractApiArray<CashReport>(response, 'reports');
    } catch (error) {
      console.error('[ATTENDANT-READINGS] Error fetching cash reports:', error);
      return [];
    }
  },

  submitCashReport: async (data: CreateCashReportRequest): Promise<CashReport> => {
    try {
      console.log('[ATTENDANT-READINGS] Submitting cash report:', data);
      const response = await apiClient.post('/cash-reports', data);
      return extractApiData<CashReport>(response);
    } catch (error) {
      console.error('[ATTENDANT-READINGS] Error submitting cash report:', error);
      throw error;
    }
  },
};
