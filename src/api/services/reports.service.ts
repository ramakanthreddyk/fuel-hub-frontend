
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
  },

  getReports: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<{ reports: any[] }>>('/reports/history');
    return response.data.data.reports;
  },

  getReport: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/reports/${id}`);
    return response.data.data;
  },

  generateReport: async (data: any): Promise<Blob> => {
    const response = await apiClient.post<Blob>('/reports/generate', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportReport: async (data: any): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/reports/export', data);
    return response.data.data;
  },

  scheduleReport: async (data: any): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/reports/schedule', data);
    return response.data.data;
  },
};
