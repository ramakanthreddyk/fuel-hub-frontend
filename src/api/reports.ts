
import { apiClient } from './client';

export interface SalesReportFilters {
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  nozzleId?: string;
  stationId?: string;
}

export interface SalesReportData {
  id: string;
  date: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  volume: number;
  pricePerLitre: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  attendant: string;
  stationName: string;
  nozzleNumber: number;
}

export interface SalesReportSummary {
  totalVolume: number;
  totalRevenue: number;
  fuelTypeBreakdown: {
    petrol: { volume: number; revenue: number };
    diesel: { volume: number; revenue: number };
    premium: { volume: number; revenue: number };
  };
  paymentMethodBreakdown: {
    cash: number;
    card: number;
    upi: number;
    credit: number;
  };
}

export interface ExportReportRequest {
  type: string;
  format: string;
  stationId?: string;
  dateRange?: { from: Date; to: Date };
}

export interface ScheduleReportRequest {
  type: string;
  stationId?: string;
  frequency: string;
}

export const reportsApi = {
  getSalesReport: async (filters: SalesReportFilters): Promise<{
    data: SalesReportData[];
    summary: SalesReportSummary;
  }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await apiClient.get(`/reports/sales?${params.toString()}`);
    return response.data;
  },

  exportSalesCSV: async (filters: SalesReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await apiClient.get(`/reports/sales/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportReport: async (request: ExportReportRequest): Promise<Blob> => {
    const response = await apiClient.post('/reports/export', request, {
      responseType: 'blob',
    });
    return response.data;
  },

  scheduleReport: async (request: ScheduleReportRequest): Promise<void> => {
    await apiClient.post('/reports/schedule', request);
  },
};
