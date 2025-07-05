
/**
 * Attendant Service - Contract Aligned
 * 
 * Implements Attendant endpoints exactly as defined in OpenAPI spec
 */

import { contractClient } from '../contract-client';
import type { 
  AttendantStation,
  Pump,
  Nozzle,
  Creditor,
  CashReport,
  CreateCashReportRequest,
  SystemAlert
} from '../api-contract';

export class AttendantService {
  /**
   * Get assigned stations
   * GET /attendant/stations
   */
  async getAssignedStations(): Promise<AttendantStation[]> {
    return contractClient.getArray<AttendantStation>('/attendant/stations', 'stations');
  }

  /**
   * Get assigned pumps
   * GET /attendant/pumps
   */
  async getAssignedPumps(stationId?: string): Promise<Pump[]> {
    const params = stationId ? { stationId } : undefined;
    return contractClient.getArray<Pump>('/attendant/pumps', 'pumps', params);
  }

  /**
   * Get assigned nozzles
   * GET /attendant/nozzles
   */
  async getAssignedNozzles(pumpId?: string): Promise<Nozzle[]> {
    const params = pumpId ? { pumpId } : undefined;
    return contractClient.getArray<Nozzle>('/attendant/nozzles', 'nozzles', params);
  }

  /**
   * Get assigned creditors
   * GET /attendant/creditors
   */
  async getAssignedCreditors(stationId?: string): Promise<Creditor[]> {
    const params = stationId ? { stationId } : undefined;
    return contractClient.getArray<Creditor>('/attendant/creditors', 'creditors', params);
  }

  /**
   * Submit cash report
   * POST /attendant/cash-report
   */
  async createCashReport(data: CreateCashReportRequest): Promise<CashReport> {
    return contractClient.post<CashReport>('/attendant/cash-report', data);
  }

  /**
   * Get cash reports
   * GET /attendant/cash-reports
   */
  async getCashReports(filters?: {
    stationId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<CashReport[]> {
    return contractClient.getArray<CashReport>('/attendant/cash-reports', 'reports', filters);
  }

  /**
   * Get system alerts
   * GET /attendant/alerts
   */
  async getAlerts(): Promise<SystemAlert[]> {
    return contractClient.getArray<SystemAlert>('/attendant/alerts', 'alerts');
  }

  /**
   * Acknowledge alert
   * PUT /attendant/alerts/{alertId}/acknowledge
   */
  async acknowledgeAlert(alertId: string): Promise<void> {
    return contractClient.put<void>(`/attendant/alerts/${alertId}/acknowledge`);
  }
}

export const attendantService = new AttendantService();
