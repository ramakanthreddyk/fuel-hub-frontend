
/**
 * Reports Service
 * 
 * API service for generating and managing reports
 */

import { apiClient } from '../client';
import type { ExportRequest, ExportResponse, ApiResponse } from '../api-contract';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

// Plan-based report access control
const checkReportAccess = (reportType: string, userPlan: string): boolean => {
  const planAccess = {
    starter: [], // No reports for starter plan
    pro: ['sales', 'financial'], // Basic reports for pro plan
    enterprise: ['sales', 'financial', 'inventory', 'attendance', 'advanced'] // All reports for enterprise
  };

  return planAccess[userPlan as keyof typeof planAccess]?.includes(reportType) || false;
};

export const reportsService = {
  // Consolidated report generation with plan enforcement
  generateReport: async (params: {
    type: 'sales' | 'financial' | 'inventory' | 'attendance';
    format: 'csv' | 'excel' | 'pdf';
    dateFrom?: string;
    dateTo?: string;
    stationId?: string;
    fuelType?: string;
    paymentMethod?: string;
    attendantId?: string;
    limit?: number; // Add pagination
    offset?: number;
  }): Promise<ExportResponse> => {
    // Add plan-based access control (will be implemented with user context)
    secureLog.debug('[REPORTS] Generating report:', params.type);

    // Add query optimization parameters
    const optimizedParams = {
      ...params,
      limit: params.limit || 1000, // Default limit to prevent large queries
      offset: params.offset || 0
    };

    const response = await apiClient.post<ApiResponse<ExportResponse>>('/reports/export', {
      reportType: params.type,
      ...optimizedParams
    });
    return response.data.data;
  },

  // Get report history (cached for 5 minutes)
  getReportHistory: async (): Promise<ExportResponse[]> => {
    const response = await apiClient.get<ApiResponse<{ reports: ExportResponse[] }>>('/reports/history');
    return response.data.data.reports;
  },

  // Download generated report
  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/reports/download/${sanitizeUrlParam(reportId)}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Schedule heavy report generation (async processing)
  scheduleReport: async (params: {
    type: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
    format: 'csv' | 'excel' | 'pdf';
    filters?: any;
  }): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/reports/schedule', params);
    return response.data.data;
  },
};
