
/**
 * Owner Service - Contract Aligned
 * 
 * Implements Owner-specific endpoints from OpenAPI spec
 */

import { contractClient } from '../contract-client';
import type { 
  User,
  CreateUserRequest,
  Station,
  CreateStationRequest,
  Pump,
  CreatePumpRequest,
  FuelPrice,
  CreateFuelPriceRequest,
  Creditor,
  CreateCreditorRequest,
  SalesSummary,
  PaymentMethodBreakdown
} from '../api-contract';

export class OwnerService {
  // User Management (Owner only)
  /**
   * Create new user
   * POST /users
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    return contractClient.post<User>('/users', data);
  }

  /**
   * Get all users in tenant
   * GET /users
   */
  async getUsers(): Promise<User[]> {
    return contractClient.getArray<User>('/users', 'users');
  }

  /**
   * Update user
   * PUT /users/{id}
   */
  async updateUser(id: string, data: Partial<CreateUserRequest>): Promise<User> {
    return contractClient.put<User>(`/users/${id}`, data);
  }

  /**
   * Delete user
   * DELETE /users/{id}
   */
  async deleteUser(id: string): Promise<void> {
    return contractClient.delete<void>(`/users/${id}`);
  }

  /**
   * Reset user password
   * POST /users/{id}/reset-password
   */
  async resetUserPassword(id: string, newPassword: string): Promise<void> {
    return contractClient.post<void>(`/users/${id}/reset-password`, { newPassword });
  }

  // Station Management
  /**
   * Create new station
   * POST /stations
   */
  async createStation(data: CreateStationRequest): Promise<Station> {
    return contractClient.post<Station>('/stations', data);
  }

  /**
   * Update station
   * PUT /stations/{id}
   */
  async updateStation(id: string, data: Partial<CreateStationRequest>): Promise<Station> {
    return contractClient.put<Station>(`/stations/${id}`, data);
  }

  /**
   * Delete station
   * DELETE /stations/{id}
   */
  async deleteStation(id: string): Promise<void> {
    return contractClient.delete<void>(`/stations/${id}`);
  }

  // Pump Management
  /**
   * Create new pump
   * POST /pumps
   */
  async createPump(data: CreatePumpRequest): Promise<Pump> {
    return contractClient.post<Pump>('/pumps', data);
  }

  /**
   * Update pump
   * PUT /pumps/{id}
   */
  async updatePump(id: string, data: Partial<CreatePumpRequest>): Promise<Pump> {
    return contractClient.put<Pump>(`/pumps/${id}`, data);
  }

  /**
   * Delete pump
   * DELETE /pumps/{id}
   */
  async deletePump(id: string): Promise<void> {
    return contractClient.delete<void>(`/pumps/${id}`);
  }

  // Fuel Price Management
  /**
   * Create fuel price
   * POST /fuel-prices
   */
  async createFuelPrice(data: CreateFuelPriceRequest): Promise<FuelPrice> {
    return contractClient.post<FuelPrice>('/fuel-prices', data);
  }

  /**
   * Get fuel prices
   * GET /fuel-prices
   */
  async getFuelPrices(): Promise<FuelPrice[]> {
    return contractClient.getArray<FuelPrice>('/fuel-prices', 'prices');
  }

  /**
   * Validate fuel prices for station
   * GET /fuel-prices/validate/{stationId}
   */
  async validateFuelPrices(stationId: string): Promise<{
    stationId: string;
    missingFuelTypes: string[];
    hasActivePrices: boolean;
  }> {
    return contractClient.get(`/fuel-prices/validate/${stationId}`);
  }

  // Creditor Management
  /**
   * Create creditor
   * POST /creditors
   */
  async createCreditor(data: CreateCreditorRequest): Promise<Creditor> {
    return contractClient.post<Creditor>('/creditors', data);
  }

  /**
   * Get creditors
   * GET /creditors
   */
  async getCreditors(): Promise<Creditor[]> {
    return contractClient.getArray<Creditor>('/creditors', 'creditors');
  }

  /**
   * Update creditor
   * PUT /creditors/{id}
   */
  async updateCreditor(id: string, data: Partial<CreateCreditorRequest>): Promise<Creditor> {
    return contractClient.put<Creditor>(`/creditors/${id}`, data);
  }

  /**
   * Delete creditor
   * DELETE /creditors/{id}
   */
  async deleteCreditor(id: string): Promise<void> {
    return contractClient.delete<void>(`/creditors/${id}`);
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
}

export const ownerService = new OwnerService();
