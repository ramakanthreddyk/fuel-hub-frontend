
/**
 * API Contract Types - Auto-generated from OpenAPI Spec
 * 
 * This file contains TypeScript interfaces for all API endpoints
 * defined in the OpenAPI specification (docs/openapi-spec.yaml).
 * 
 * IMPORTANT: Any changes to the backend API must be reflected here.
 * Consider using openapi-typescript-codegen for automatic type generation.
 */

// Common Types
export type UserRole = 'superadmin' | 'owner' | 'manager' | 'attendant';
export type FuelType = 'petrol' | 'diesel' | 'premium';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'credit';
export type Status = 'active' | 'inactive' | 'maintenance';
export type TenantStatus = 'active' | 'suspended' | 'cancelled';

// Standard API Response Wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Auth Endpoints
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId?: string;
    tenantName?: string;
  };
}

// Stations Endpoints
export interface Station {
  id: string;
  name: string;
  address?: string;
  status: Status;
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  metrics?: {
    totalSales: number;
    totalVolume: number;
    transactionCount: number;
  };
}

export interface CreateStationRequest {
  name: string;
  address?: string;
}

// Pumps Endpoints
export interface Pump {
  id: string;
  stationId: string;
  label: string;
  serialNumber?: string;
  status: Status;
  nozzleCount: number;
  createdAt: string;
}

export interface CreatePumpRequest {
  stationId: string;
  label: string;
  serialNumber?: string;
}

// Nozzles Endpoints
export interface Nozzle {
  id: string;
  pumpId: string;
  nozzleNumber: number;
  fuelType: FuelType;
  status: Status;
  createdAt: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: FuelType;
}

export interface UpdateNozzleRequest {
  fuelType?: FuelType;
  status?: Status;
}

// Readings Endpoints
export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: PaymentMethod;
  creditorId?: string;
  createdAt: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: PaymentMethod;
  creditorId?: string;
}

// Sales Endpoints
export interface Sale {
  id: string;
  nozzleId: string;
  stationId: string;
  volume: number;
  fuelType: FuelType;
  fuelPrice: number;
  amount: number;
  paymentMethod: PaymentMethod;
  creditorId?: string;
  status: 'draft' | 'posted';
  recordedAt: string;
  createdAt: string;
  station?: {
    name: string;
  };
  nozzle?: {
    nozzleNumber: number;
    fuelType: string;
  };
}

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
}

// Fuel Prices Endpoints
export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: FuelType;
  price: number;
  validFrom: string;
  createdAt: string;
  station?: {
    name: string;
  };
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: FuelType;
  price: number;
  validFrom?: string;
}

export interface UpdateFuelPriceRequest {
  stationId?: string;
  fuelType?: FuelType;
  price?: number;
  effectiveFrom?: string;
}

// Creditors Endpoints
export interface Creditor {
  id: string;
  name: string;
  contactNumber?: string;
  address?: string;
  status: Status;
  createdAt: string;
  partyName: string;
  creditLimit?: number;
  currentOutstanding?: number;
}

export interface CreateCreditorRequest {
  partyName: string;
  creditLimit?: number;
}

export interface CreditPayment {
  id: string;
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check';
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check';
  referenceNumber?: string;
  notes?: string;
}

// Users Endpoints
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  tenantName?: string;
  stationId?: string;
  stationName?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'attendant';
  stationId?: string;
}

// Tenants Endpoints (SuperAdmin)
export interface Tenant {
  id: string;
  name: string;
  schemaName: string;
  planId: string;
  planName: string;
  status: TenantStatus;
  createdAt: string;
  stationCount?: number;
  userCount?: number;
  users?: User[];
  stations?: Station[];
}

export interface CreateTenantRequest {
  name: string;
  schemaName?: string;
  planId: string;
  adminEmail?: string;
  adminPassword?: string;
}

// Plans Endpoints (SuperAdmin)
export interface Plan {
  id: string;
  name: string;
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}

// Dashboard Endpoints
export interface SalesSummary {
  totalSales: number;
  totalVolume: number;
  transactionCount: number;
  totalProfit: number;
  profitMargin: number;
  period: string;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  amount: number;
  percentage: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  amount: number;
}

// Fuel Inventory Endpoints
export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel';
  currentVolume: number;
  lastUpdated: string;
}

// Fuel Deliveries Endpoints
export interface FuelDelivery {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  deliveryDate: string;
  deliveredBy?: string;
  createdAt: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  deliveryDate: string;
  deliveredBy?: string;
}

// Alerts Endpoints
export interface Alert {
  id: string;
  type: 'inventory' | 'credit' | 'maintenance' | 'sales' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  stationId: string;
  stationName: string;
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Reconciliation Endpoints
export interface ReconciliationRecord {
  id: string;
  stationId: string;
  date: string;
  totalExpected: number;
  cashReceived: number;
  reconciliationNotes?: string;
  managerConfirmation: boolean;
  createdAt: string;
  station?: {
    name: string;
  };
}

export interface CreateReconciliationRequest {
  stationId: string;
  date: string;
  totalExpected: number;
  cashReceived: number;
  reconciliationNotes?: string;
  managerConfirmation: boolean;
}

// Reports Endpoints
export interface SalesReportFilters {
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  nozzleId?: string;
  stationId?: string;
}

export interface SalesReportData {
  id: string;
  date: string;
  fuelType: FuelType;
  volume: number;
  pricePerLitre: number;
  amount: number;
  paymentMethod: PaymentMethod;
  attendant: string;
  stationName: string;
  nozzleNumber: number;
}

/**
 * CONTRACT DRIFT TRACKING
 * 
 * Missing Backend Endpoints (Frontend expects but backend doesn't provide):
 * - None identified yet
 * 
 * Extra Backend Endpoints (Backend provides but frontend doesn't use):
 * - To be identified during implementation
 * 
 * Parameter Mismatches:
 * - To be identified during implementation
 * 
 * Response Format Inconsistencies:
 * - Some endpoints return data directly, others wrap in { data: ... }
 * - This should be standardized across all endpoints
 */
