/**
 * Unified Reports API
 * 
 * This file combines functionality from reports.ts and reports.service.ts
 * to provide a single, consistent interface for reports functionality.
 */

import { apiClient, extractApiData, extractApiArray } from './client';
import API_CONFIG from './core/config';
import type { 
  SalesReportFilters, 
  SalesReportData, 
  ExportRequest,
  ScheduleReportRequest,
  SalesReportExportFilters,
  ExportResponse,
  ApiResponse 
} from './api-contract';
import type { SalesReportSummary } from './sales-report-types';

// Report types
export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'readings' | 'custom';
  format: 'pdf' | 'csv' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  downloadUrl?: string;
}

export interface GenerateReportRequest {
  name: string;
  type: 'sales' | 'inventory' | 'readings' | 'custom';
  format: 'pdf' | 'csv' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

export const reportsApi = {
  // Get sales report data
  getSalesReport: async (filters: SalesReportFilters): Promise<{
    data: SalesReportData[];
    summary: SalesReportSummary;
  }> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          params.append(key, value);
        }
      });
      
      const response = await apiClient.get(`${API_CONFIG.endpoints.reports.sales}?${params.toString()}`);
      return extractApiData<{
        data: SalesReportData[];
        summary: SalesReportSummary;
      }>(response);
    } catch (error) {
      console.error('[REPORTS-API] Error fetching sales report:', error);
      return { 
        data: [], 
        summary: { 
          totalVolume: 0, 
          totalRevenue: 0, 
          salesCount: 0,
          averageTicketSize: 0,
          cashSales: 0,
          creditSales: 0,
          cardSales: 0,
          upiSales: 0,
          growthPercentage: 0,
          byFuelType: [],
          byPaymentMethod: [],
          fuelTypeBreakdown: [],
          paymentMethodBreakdown: []
        } 
      };
    }
  },

  // Generate a report and return a blob for download
  generateReport: async (data: GenerateReportRequest): Promise<Blob | null> => {
    try {
      console.log('[REPORTS-API] Generating report with data:', data);

      // Map report type to endpoint
      let endpoint = '';
      switch (data.type) {
        case 'sales':
          endpoint = API_CONFIG.endpoints.reports.sales;
          break;
        case 'inventory':
          endpoint = API_CONFIG.endpoints.reports.inventory;
          break;
        case 'readings':
          endpoint = `${API_CONFIG.endpoints.reports.base}/readings`;
          break;
        default:
          endpoint = API_CONFIG.endpoints.reports.sales;
      }

      // Prepare request body
      const requestBody = {
        format: data.format,
        dateFrom: data.dateRange.start.split('T')[0],
        dateTo: data.dateRange.end.split('T')[0],
        stationId: data.filters?.stationId !== 'all' ? data.filters?.stationId : undefined,
        name: data.name
      };

      // Make POST request
      const response = await apiClient.post(endpoint, requestBody, {
        responseType: 'blob',
      });

      return response.data as Blob;
    } catch (error) {
      console.error('[REPORTS-API] Error generating report:', error);
      throw error;
    }
  },

  // Export a report in a specific format
  exportReport: async (request: ExportRequest): Promise<Blob | null> => {
    try {
      const response = await apiClient.post(API_CONFIG.endpoints.reports.export, request, {
        responseType: 'blob',
      });
      return response.data as Blob;
    } catch (error) {
      console.error('[REPORTS-API] Error exporting report:', error);
      return null;
    }
  },

  // Schedule a report
  scheduleReport: async (request: ScheduleReportRequest): Promise<void> => {
    try {
      await apiClient.post(API_CONFIG.endpoints.reports.schedule, request);
    } catch (error) {
      console.error('[REPORTS-API] Error scheduling report:', error);
      throw error;
    }
  },

  // Get report history
  getReportHistory: async (): Promise<ExportResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<{ reports: ExportResponse[] }>>(API_CONFIG.endpoints.reports.history);
      return response.data.data.reports;
    } catch (error) {
      console.error('[REPORTS-API] Error fetching report history:', error);
      return [];
    }
  },

  // Download a report by ID
  downloadReport: async (reportId: string): Promise<Blob | null> => {
    try {
      const response = await apiClient.get(API_CONFIG.endpoints.reports.download(reportId), {
        responseType: 'blob'
      });
      return response.data as Blob;
    } catch (error) {
      console.error(`[REPORTS-API] Error downloading report ${reportId}:`, error);
      return null;
    }
  },

  // Get all reports (for listing)
  getReports: async (): Promise<Report[]> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.endpoints.reports.base}/list`);
      return extractApiArray<Report>(response, 'reports');
    } catch (error) {
      console.error('[REPORTS-API] Error fetching reports:', error);
      return [];
    }
  },

  // Get a report by ID
  getReport: async (id: string): Promise<Report | null> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.endpoints.reports.base}/${id}`);
      return extractApiData<Report>(response);
    } catch (error) {
      console.error(`[REPORTS-API] Error fetching report ${id}:`, error);
      return null;
    }
  }
};

export default reportsApi;