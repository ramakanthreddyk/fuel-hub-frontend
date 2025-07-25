import { apiClient } from '../client';

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
      // Extract data from nested structure: response.data.data
      return response.data.data || response.data;
    } catch (error) {
      console.error('[TODAYS-SALES] Error:', error);
      // Return empty data structure instead of throwing
      return {
        date: new Date().toISOString().split('T')[0],
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