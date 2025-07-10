/**
 * @file api/services/attendantService.ts
 * @description Service for attendant-specific API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { Station } from './stationsService';
import { Pump } from './pumpsService';
import { Nozzle } from './nozzlesService';
import { Creditor } from './creditorsService';

// Types
export interface CreditEntry {
  creditorId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  litres?: number;
  amount?: number;
}

export interface CashReport {
  id?: string;
  stationId: string;
  reportDate: string;
  cashAmount: number;
  cardAmount?: number;
  upiAmount?: number;
  shift?: 'morning' | 'afternoon' | 'night';
  creditEntries?: CreditEntry[];
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendantAlert {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Service for attendant API
 */
export const attendantService = {
  /**
   * Get fuel inventory
   * Uses the correct endpoint: /fuel-inventory
   */
  getFuelInventory: async (stationId?: string) => {
    try {
      console.log('[ATTENDANT-API] Fetching fuel inventory');
      let url = 'fuel-inventory';
      if (stationId) url += `?stationId=${stationId}`;
      
      const response = await apiClient.get(url);
      return extractData(response);
    } catch (error) {
      console.error('[ATTENDANT-API] Error fetching fuel inventory:', error);
      return [];
    }
  },

  /**
   * Get fuel inventory summary
   * Uses the correct endpoint: /fuel-inventory/summary
   */
  getFuelInventorySummary: async () => {
    try {
      console.log('[ATTENDANT-API] Fetching fuel inventory summary');
      const response = await apiClient.get('fuel-inventory/summary');
      return extractData(response);
    } catch (error) {
      console.error('[ATTENDANT-API] Error fetching fuel inventory summary:', error);
      return [];
    }
  },
  /**
   * Get health check status
   */
  getHealthCheck: async () => {
    try {
      const response = await apiClient.get('attendant/health-check');
      return extractData(response);
    } catch (error) {
      console.error('[ATTENDANT-API] Health check failed:', error);
      throw error;
    }
  },

  /**
   * Get stations assigned to the attendant
   */
  getStations: async (): Promise<Station[]> => {
    try {
      console.log('[ATTENDANT-API] Fetching assigned stations');
      const response = await apiClient.get('attendant/stations');
      return extractArray<Station>(response, 'stations');
    } catch (error) {
      console.error('[ATTENDANT-API] Error fetching stations:', error);
      return [];
    }
  },

  /**
   * Get pumps for a station
   */
  getPumps: async (stationId: string): Promise<Pump[]> => {
    try {
      console.log(`[ATTENDANT-API] Fetching pumps for station: ${stationId}`);
      const response = await apiClient.get(`attendant/pumps?stationId=${stationId}`);
      return extractArray<Pump>(response, 'pumps');
    } catch (error) {
      console.error(`[ATTENDANT-API] Error fetching pumps for station ${stationId}:`, error);
      return [];
    }
  },

  /**
   * Get nozzles for a pump
   */
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    try {
      console.log(`[ATTENDANT-API] Fetching nozzles for pump: ${pumpId}`);
      const response = await apiClient.get(`attendant/nozzles?pumpId=${pumpId}`);
      return extractArray<Nozzle>(response, 'nozzles');
    } catch (error) {
      console.error(`[ATTENDANT-API] Error fetching nozzles for pump ${pumpId}:`, error);
      return [];
    }
  },

  /**
   * Get creditors
   */
  getCreditors: async (): Promise<Creditor[]> => {
    try {
      console.log('[ATTENDANT-API] Fetching creditors');
      const response = await apiClient.get('attendant/creditors');
      return extractArray<Creditor>(response, 'creditors');
    } catch (error) {
      console.error('[ATTENDANT-API] Error fetching creditors:', error);
      return [];
    }
  },

  /**
   * Submit daily cash report
   * @param report Cash report data
   * @returns Created cash report
   */
  submitCashReport: async (report: CashReport): Promise<CashReport> => {
    try {
      console.log('[ATTENDANT-API] Submitting cash report:', report);
      const response = await apiClient.post('attendant/cash-report', report);
      return extractData<CashReport>(response);
    } catch (error) {
      console.error('[ATTENDANT-API] Error submitting cash report:', error);
      throw error;
    }
  },
  
  /**
   * Get cash reports
   * @returns List of cash reports
   */
  getCashReports: async (): Promise<CashReport[]> => {
    try {
      console.log('[ATTENDANT-API] Fetching cash reports');
      const response = await apiClient.get('attendant/cash-reports');
      return extractArray<CashReport>(response, 'reports');
    } catch (error) {
      console.error('[ATTENDANT-API] Error fetching cash reports:', error);
      return [];
    }
  },

  /**
   * Get alerts
   */
  getAlerts: async (stationId?: string, unreadOnly?: boolean): Promise<AttendantAlert[]> => {
    try {
      console.log('[ATTENDANT-API] Fetching alerts');
      let url = 'attendant/alerts';
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      if (unreadOnly) params.append('unreadOnly', 'true');
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await apiClient.get(url);
      return extractArray<AttendantAlert>(response, 'alerts');
    } catch (error) {
      console.error('[ATTENDANT-API] Error fetching alerts:', error);
      return [];
    }
  },

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert: async (alertId: string): Promise<boolean> => {
    try {
      console.log(`[ATTENDANT-API] Acknowledging alert: ${alertId}`);
      const response = await apiClient.put(`attendant/alerts/${alertId}/acknowledge`, {});
      return response.status === 200;
    } catch (error) {
      console.error(`[ATTENDANT-API] Error acknowledging alert ${alertId}:`, error);
      return false;
    }
  }
};

export default attendantService;
