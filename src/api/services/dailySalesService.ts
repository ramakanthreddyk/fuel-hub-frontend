/**
 * @file api/services/dailySalesService.ts
 * @description Service for daily sales reports and summaries
 */
import apiClient, { extractData } from '../core/apiClient';

export interface NozzleSales {
  nozzleId: string;
  nozzleNumber: number;
  fuelType: string;
  totalVolume: number;
  totalSales: number;
  readingsCount: number;
}

export interface PumpSales {
  pumpId: string;
  pumpName: string;
  nozzles: NozzleSales[];
  totalVolume: number;
  totalSales: number;
}

export interface StationSales {
  stationId: string;
  stationName: string;
  pumps: PumpSales[];
  totalVolume: number;
  totalSales: number;
}

export interface DailySalesReport {
  date: string;
  stations: StationSales[];
  grandTotalVolume: number;
  grandTotalSales: number;
}

export const dailySalesService = {
  /**
   * Get daily sales summary for a specific date
   */
  getDailySales: async (date: string): Promise<DailySalesReport> => {
    try {
      const response = await apiClient.get(`/reports/daily-sales?date=${date}`);
      return extractData<DailySalesReport>(response);
    } catch (error) {
      console.error('[DAILY-SALES-API] Error fetching daily sales:', error);
      throw error;
    }
  },

  /**
   * Get sales summary for a date range
   */
  getSalesRange: async (startDate: string, endDate: string): Promise<DailySalesReport[]> => {
    try {
      const response = await apiClient.get(`/reports/sales-range?startDate=${startDate}&endDate=${endDate}`);
      return extractData<DailySalesReport[]>(response);
    } catch (error) {
      console.error('[DAILY-SALES-API] Error fetching sales range:', error);
      throw error;
    }
  }
};