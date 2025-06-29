
/**
 * Manager Service - Contract Aligned
 * 
 * Implements Manager-specific endpoints from OpenAPI spec
 */

import { contractClient } from '../contract-client';
import type { 
  User,
  Station,
  Pump,
  Nozzle,
  CreateNozzleRequest,
  NozzleReading,
  CreateReadingRequest,
  FuelPrice,
  SalesSummary,
  PaymentMethodBreakdown,
  SystemAlert
} from '../api-contract';

export class ManagerService {
  // User Management (Limited - View only)
  /**
   * Get all users in tenant
   * GET /users
   */
  async getUsers(): Promise<User[]> {
    return contractClient.getArray<User>('/users', 'users');
  }

  /**
   * Get user details
   * GET /users/{id}
   */
  async getUser(id: string): Promise<User> {
    return contractClient.get<User>(`/users/${id}`);
  }

  // Station Management (View and limited updates)
  /**
   * Get stations with metrics
   * GET /stations
   */
  async getStations(includeMetrics = false): Promise<Station[]> {
    return contractClient.getArray<Station>('/stations', 'stations', { includeMetrics });
  }

  /**
   * Get station details
   * GET /stations/{id}
   */
  async getStation(id: string): Promise<Station> {
    return contractClient.get<Station>(`/stations/${id}`);
  }

  // Pump Management
  /**
   * Get pumps for station
   * GET /pumps
   */
  async getPumps(stationId: string): Promise<Pump[]> {
    return contractClient.getArray<Pump>('/pumps', 'pumps', { stationId });
  }

  // Nozzle Management
  /**
   * Get nozzles for pump
   * GET /nozzles
   */
  async getNozzles(pumpId: string): Promise<Nozzle[]> {
    return contractClient.getArray<Nozzle>('/nozzles', 'nozzles', { pumpId });
  }

  /**
   * Create new nozzle
   * POST /nozzles
   */
  async createNozzle(data: CreateNozzleRequest): Promise<Nozzle> {
    return contractClient.post<Nozzle>('/nozzles', data);
  }

  /**
   * Update nozzle
   * PUT /nozzles/{id}
   */
  async updateNozzle(id: string, data: Partial<CreateNozzleRequest>): Promise<Nozzle> {
    return contractClient.put<Nozzle>(`/nozzles/${id}`, data);
  }

  // Reading Management
  /**
   * Create nozzle reading
   * POST /nozzle-readings
   */
  async createReading(data: CreateReadingRequest): Promise<NozzleReading> {
    return contractClient.post<NozzleReading>('/nozzle-readings', data);
  }

  /**
   * Check if reading can be created
   * GET /nozzle-readings/can-create/{nozzleId}
   */
  async canCreateReading(nozzleId: string): Promise<{
    canCreate: boolean;
    missingPrice: boolean;
    reason?: string;
  }> {
    return contractClient.get(`/nozzle-readings/can-create/${nozzleId}`);
  }

  // Fuel Price Management (View only)
  /**
   * Get fuel prices
   * GET /fuel-prices
   */
  async getFuelPrices(): Promise<FuelPrice[]> {
    return contractClient.getArray<FuelPrice>('/fuel-prices', 'prices');
  }

  // Dashboard Analytics
  /**
   * Get sales summary
   * GET /dashboard/sales-summary
   */
  async getSalesSummary(params?: {
    range?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    stationId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<SalesSummary> {
    return contractClient.get<SalesSummary>('/dashboard/sales-summary', params);
  }

  /**
   * Get payment method breakdown
   * GET /dashboard/payment-methods
   */
  async getPaymentMethods(): Promise<PaymentMethodBreakdown[]> {
    return contractClient.getArray<PaymentMethodBreakdown>('/dashboard/payment-methods');
  }

  // Alert Management
  /**
   * Get system alerts
   * GET /alerts
   */
  async getAlerts(params?: {
    stationId?: string;
    unreadOnly?: boolean;
  }): Promise<SystemAlert[]> {
    return contractClient.getArray<SystemAlert>('/alerts', 'alerts', params);
  }

  /**
   * Create system alert
   * POST /alerts
   */
  async createAlert(data: {
    type: 'warning' | 'error' | 'info';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    stationId?: string;
    nozzleId?: string;
  }): Promise<SystemAlert> {
    return contractClient.post<SystemAlert>('/alerts', data);
  }

  /**
   * Get alert summary
   * GET /alerts/summary
   */
  async getAlertSummary(): Promise<{
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    unacknowledged: number;
  }> {
    return contractClient.get('/alerts/summary');
  }
}

export const managerService = new ManagerService();
