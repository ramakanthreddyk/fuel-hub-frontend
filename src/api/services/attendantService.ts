/**
 * @file api/services/attendantService.ts
 * @description Service for attendant-specific API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import { Station } from './stationsService';
import { Pump } from './pumpsService';
// import { Nozzle } from './nozzlesService';
// If Nozzle type is needed, import from a shared types file or define locally.
import { Creditor } from './creditorsService';

// Types
export interface Nozzle {
  id: string;
  name: string;
  pumpId: string;
  fuelType: string;
  status?: string;
}
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
      secureLog.debug('[ATTENDANT-API] Fetching fuel inventory', { stationId: stationId ? sanitizeUrlParam(stationId) : undefined });
      let url = 'fuel-inventory';
      if (stationId) url += `?stationId=${sanitizeUrlParam(stationId)}`;
      const response = await apiClient.get(url);
      return extractData(response);
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching fuel inventory', { error });
      return [];
    }
  },

  /**
   * Get fuel inventory summary
   * Uses the correct endpoint: /fuel-inventory/summary
   */
  getFuelInventorySummary: async () => {
    try {
      secureLog.debug('[ATTENDANT-API] Fetching fuel inventory summary');
      const response = await apiClient.get('fuel-inventory/summary');
      return extractData(response);
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching fuel inventory summary:', error);
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
      secureLog.error('[ATTENDANT-API] Health check failed:', error);
      throw error;
    }
  },

  /**
   * Get stations assigned to the attendant
   */
  getStations: async (): Promise<Station[]> => {
    try {
      secureLog.debug('[ATTENDANT-API] Fetching assigned stations');
      const response = await apiClient.get('attendant/stations');
      return extractArray<Station>(response, 'stations');
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching stations:', error);
      return [];
    }
  },

  /**
   * Get pumps for a station
   */
  getPumps: async (stationId: string): Promise<Pump[]> => {
    try {
      const sanitizedStationId = sanitizeUrlParam(stationId);
      secureLog.debug('[ATTENDANT-API] Fetching pumps for station', { stationId: sanitizedStationId });
      const response = await apiClient.get(`attendant/pumps?stationId=${sanitizedStationId}`);
      return extractArray<Pump>(response, 'pumps');
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching pumps for station', { stationId, error });
      return [];
    }
  },

  /**
   * Get nozzles for a pump
   */
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    try {
      const sanitizedPumpId = sanitizeUrlParam(pumpId);
      secureLog.debug('[ATTENDANT-API] Fetching nozzles for pump', { pumpId: sanitizedPumpId });
      const response = await apiClient.get(`attendant/nozzles?pumpId=${sanitizedPumpId}`);
      return extractArray<Nozzle>(response, 'nozzles');
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching nozzles for pump', { pumpId, error });
      return [];
    }
  },

  /**
   * Get creditors
   */
  getCreditors: async (): Promise<Creditor[]> => {
    try {
      secureLog.debug('[ATTENDANT-API] Fetching creditors');
      const response = await apiClient.get('attendant/creditors');
      return extractArray<Creditor>(response, 'creditors');
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching creditors:', error);
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
      secureLog.debug('[ATTENDANT-API] Submitting cash report:', report);
      const response = await apiClient.post('attendant/cash-report', report);
      return extractData<CashReport>(response);
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error submitting cash report:', error);
      throw error;
    }
  },
  
  /**
   * Get cash reports
   * @returns List of cash reports
   */
  getCashReports: async (): Promise<CashReport[]> => {
    try {
      secureLog.debug('[ATTENDANT-API] Fetching cash reports');
      const response = await apiClient.get('attendant/cash-reports');
      return extractArray<CashReport>(response, 'reports');
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching cash reports:', error);
      return [];
    }
  },

  /**
   * Get alerts
   */
  getAlerts: async (stationId?: string, unreadOnly?: boolean): Promise<AttendantAlert[]> => {
    try {
      secureLog.debug('[ATTENDANT-API] Fetching alerts');
      let url = 'attendant/alerts';
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', sanitizeUrlParam(stationId));
      if (unreadOnly) params.append('unreadOnly', 'true');
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await apiClient.get(url);
      return extractArray<AttendantAlert>(response, 'alerts');
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error fetching alerts:', error);
      return [];
    }
  },

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert: async (alertId: string): Promise<boolean> => {
    try {
      const sanitizedAlertId = sanitizeUrlParam(alertId);
      secureLog.debug('[ATTENDANT-API] Acknowledging alert', { alertId: sanitizedAlertId });
      const response = await apiClient.put(`attendant/alerts/${sanitizedAlertId}/acknowledge`, {});
      return response.status === 200;
    } catch (error) {
      secureLog.error('[ATTENDANT-API] Error acknowledging alert', { alertId, error });
      return false;
    }
  }
};

export default attendantService;
