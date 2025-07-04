
/**
 * Reports Service
 * 
 * API service for generating and managing reports
 */

import { apiClient } from '../client';
import type { ExportRequest, ExportResponse, ApiResponse } from '../api-contract';

export const reportsService = {
  // Generate sales report
  generateSalesReport: async (params: {
    format: 'csv' | 'excel' | 'pdf';
    dateFrom: string;
    dateTo: string;
    stationId?: string;
    fuelType?: string;
    paymentMethod?: string;
  }): Promise<ExportResponse> => {
    const response = await apiClient.post<ApiResponse<ExportResponse>>('/reports/sales', params);
    return response.data.data;
  },

  // Generate inventory report
  generateInventoryReport: async (params: {
    format: 'csv' | 'excel' | 'pdf';
    stationId?: string;
  }): Promise<ExportResponse> => {
    const response = await apiClient.post<ApiResponse<ExportResponse>>('/reports/inventory', params);
    return response.data.data;
  },

  // Generate financial report
  generateFinancialReport: async (params: {
    format: 'csv' | 'excel' | 'pdf';
    dateFrom: string;
    dateTo: string;
    stationId?: string;
  }): Promise<ExportResponse> => {
    const response = await apiClient.post<ApiResponse<ExportResponse>>('/reports/financial', params);
    return response.data.data;
  },

  // Generate attendance report
  generateAttendanceReport: async (params: {
    format: 'csv' | 'excel' | 'pdf';
    dateFrom: string;
    dateTo: string;
    stationId?: string;
    attendantId?: string;
  }): Promise<ExportResponse> => {
    const response = await apiClient.post<ApiResponse<ExportResponse>>('/reports/attendance', params);
    return response.data.data;
  },

  // Get report history
  getReportHistory: async (): Promise<ExportResponse[]> => {
    const response = await apiClient.get<ApiResponse<{ reports: ExportResponse[] }>>('/reports/history');
    return response.data.data.reports;
  },

  // Download report
  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/reports/download/${reportId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
