
/**
 * @file unified-reports.ts
 * @description Unified reports API functions
 */
import { contractClient } from './contract-client';
import { secureLog } from '@/utils/security';
import { 
  SalesReportFilters, 
  SalesReportData, 
  SalesReportSummary,
  ExportRequest,
  ExportResponse
} from './api-contract';

/**
 * Get sales report data
 */
export const getSalesReport = async (filters: SalesReportFilters) => {
  try {
    const response = await contractClient.get<{
      data: SalesReportData[];
      summary: SalesReportSummary;
    }>('/reports/sales', filters);
    
    return response;
  } catch (error) {
    secureLog.error('Error fetching sales report:', error);
    throw error;
  }
};

/**
 * Get sales report summary
 */
export const getSalesReportSummary = async (filters: SalesReportFilters): Promise<SalesReportSummary> => {
  try {
    const response = await contractClient.get<any>('/reports/sales/summary', filters);
    
    // Transform the response to match the interface
    return {
      totalRevenue: response.totalRevenue || 0,
      totalVolume: response.totalVolume || 0,
      salesCount: response.salesCount || 0,
      averageTicketSize: response.averageTicketSize || 0,
      byPaymentMethod: response.byPaymentMethod || [],
      byFuelType: response.byFuelType || [],
      paymentMethodBreakdown: response.paymentMethodBreakdown || [],
      fuelTypeBreakdown: response.fuelTypeBreakdown || [],
      fuelTypeBreakdown2: response.fuelTypeBreakdown2 || {},
      paymentMethodBreakdown2: response.paymentMethodBreakdown2 || {},
    };
  } catch (error) {
    secureLog.error('Error fetching sales report summary:', error);
    throw error;
  }
};

/**
 * Export sales report
 */
export const exportSalesReport = async (filters: SalesReportFilters & { format: 'csv' | 'excel' | 'pdf' }): Promise<ExportResponse> => {
  try {
    return contractClient.post<ExportResponse>('/reports/sales/export', filters);
  } catch (error) {
    secureLog.error('Error exporting sales report:', error);
    throw error;
  }
};

/**
 * Export report
 */
export const exportReport = async (request: ExportRequest): Promise<ExportResponse> => {
  try {
    return contractClient.post<ExportResponse>('/reports/export', request);
  } catch (error) {
    secureLog.error('Error exporting report:', error);
    throw error;
  }
};
