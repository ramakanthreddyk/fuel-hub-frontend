import { apiClient } from '../client';
import { parseTodaysSalesResponse } from '@/utils/dataParser';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

export interface TodaysSalesNozzleEntry {
  nozzleId: string;
  nozzleNumber: number;
  fuelType: string;
  pumpId: string;
  pumpName: string;
  stationId: string;
  stationName: string;
  entriesCount: number;
  totalVolume: number;
  totalAmount: number;
  lastEntryTime: string | null;
  averageTicketSize: number;
}

export interface TodaysSalesByFuel {
  fuelType: string;
  totalVolume: number;
  totalAmount: number;
  entriesCount: number;
  averagePrice: number;
  stationsCount: number;
}

export interface TodaysSalesByStation {
  stationId: string;
  stationName: string;
  totalVolume: number;
  totalAmount: number;
  entriesCount: number;
  fuelTypes: string[];
  nozzlesActive: number;
  lastActivity: string | null;
}

export interface TodaysCreditSales {
  creditorId: string;
  creditorName: string;
  stationId: string;
  stationName: string;
  totalAmount: number;
  entriesCount: number;
  lastCreditTime: string | null;
}

export interface TodaysSalesSummary {
  date: string;
  totalEntries: number;
  totalVolume: number;
  totalAmount: number;
  paymentBreakdown: {
    cash: number;
    card: number;
    upi: number;
    credit: number;
  };
  nozzleEntries: TodaysSalesNozzleEntry[];
  salesByFuel: TodaysSalesByFuel[];
  salesByStation: TodaysSalesByStation[];
  creditSales: TodaysCreditSales[];
}

export const todaysSalesService = {
  getTodaysSummary: async (date?: string): Promise<TodaysSalesSummary> => {
    try {
      const params = new URLSearchParams();
      if (date) {
        params.append('date', date);
      }

      const response = await apiClient.get(`/todays-sales/summary?${params.toString()}`);

      secureLog.debug('[TODAYS-SALES] Raw response before parsing:', response.data);

      // Parse the complex data format from backend
      const parsedResponse = parseTodaysSalesResponse(response.data);
      const data = parsedResponse.data;

      secureLog.debug('[TODAYS-SALES] Parsed response:', data);

      // If we get a successful response but no data, that's normal (not an error)
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        secureLog.debug('[TODAYS-SALES] No sales data available for the requested date');
        return {
          date: date || new Date().toISOString().split('T')[0],
          totalEntries: 0,
          totalVolume: 0,
          totalAmount: 0,
          paymentBreakdown: { cash: 0, card: 0, upi: 0, credit: 0 },
          nozzleEntries: [],
          salesByFuel: [],
          salesByStation: [],
          creditSales: []
        };
      }

      return data;
    } catch (error: any) {
      secureLog.error('[TODAYS-SALES] Error:', error);

      // Check if this is an authentication error
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        throw error; // Re-throw auth errors
      }

      // For other errors (like 404 - no data), return empty structure
      secureLog.debug('[TODAYS-SALES] Returning empty data structure due to error:', error?.response?.status);
      return {
        date: date || new Date().toISOString().split('T')[0],
        totalEntries: 0,
        totalVolume: 0,
        totalAmount: 0,
        paymentBreakdown: { cash: 0, card: 0, upi: 0, credit: 0 },
        nozzleEntries: [],
        salesByFuel: [],
        salesByStation: [],
        creditSales: []
      };
    }
  }
};