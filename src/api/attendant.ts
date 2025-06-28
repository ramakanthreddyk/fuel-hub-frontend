
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  AttendantStation, 
  AttendantPump, 
  AttendantNozzle, 
  CashReport, 
  CreateCashReportRequest,
  Creditor,
  SystemAlert,
  AlertSummary
} from './api-contract';

const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[ATTENDANT-API] ${message}`, ...args);
  }
};

export const attendantApi = {
  // Get assigned stations for current attendant
  getAssignedStations: async (): Promise<AttendantStation[]> => {
    devLog('Fetching assigned stations for attendant');
    const response = await apiClient.get('/attendant/stations');
    return extractApiArray<AttendantStation>(response, 'stations');
  },

  // Get assigned pumps for current attendant
  getAssignedPumps: async (stationId?: string): Promise<AttendantPump[]> => {
    devLog('Fetching assigned pumps for attendant', { stationId });
    const params = stationId ? `?stationId=${stationId}` : '';
    const response = await apiClient.get(`/attendant/pumps${params}`);
    return extractApiArray<AttendantPump>(response, 'pumps');
  },

  // Get assigned nozzles for current attendant
  getAssignedNozzles: async (pumpId?: string): Promise<AttendantNozzle[]> => {
    devLog('Fetching assigned nozzles for attendant', { pumpId });
    const params = pumpId ? `?pumpId=${pumpId}` : '';
    const response = await apiClient.get(`/attendant/nozzles${params}`);
    return extractApiArray<AttendantNozzle>(response, 'nozzles');
  },

  // Get assigned creditors for current attendant
  getAssignedCreditors: async (stationId?: string): Promise<Creditor[]> => {
    devLog('Fetching assigned creditors for attendant', { stationId });
    const params = stationId ? `?stationId=${stationId}` : '';
    const response = await apiClient.get(`/attendant/creditors${params}`);
    return extractApiArray<Creditor>(response, 'creditors');
  },

  // Submit cash report
  createCashReport: async (data: CreateCashReportRequest): Promise<CashReport> => {
    devLog('Creating cash report', data);
    const response = await apiClient.post('/attendant/cash-reports', data);
    return extractApiData<CashReport>(response);
  },

  // Get cash reports for attendant
  getCashReports: async (stationId?: string, dateFrom?: string, dateTo?: string): Promise<CashReport[]> => {
    devLog('Fetching cash reports', { stationId, dateFrom, dateTo });
    const params = new URLSearchParams();
    if (stationId) params.append('stationId', stationId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const queryString = params.toString();
    const response = await apiClient.get(`/attendant/cash-reports${queryString ? `?${queryString}` : ''}`);
    return extractApiArray<CashReport>(response, 'reports');
  },

  // Get system alerts for attendant
  getAlerts: async (): Promise<SystemAlert[]> => {
    devLog('Fetching system alerts for attendant');
    const response = await apiClient.get('/attendant/alerts');
    return extractApiArray<SystemAlert>(response, 'alerts');
  },

  // Acknowledge alert
  acknowledgeAlert: async (alertId: string): Promise<void> => {
    devLog('Acknowledging alert', alertId);
    await apiClient.put(`/attendant/alerts/${alertId}/acknowledge`);
  }
};

// Export types for backward compatibility
export type { 
  AttendantStation, 
  AttendantPump, 
  AttendantNozzle, 
  CashReport, 
  CreateCashReportRequest,
  SystemAlert,
  AlertSummary
};
