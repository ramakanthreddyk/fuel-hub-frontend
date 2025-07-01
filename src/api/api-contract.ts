
/**
 * FuelSync Hub - API Contract
 * 
 * This file contains ALL TypeScript interfaces for the FuelSync Hub API.
 * It serves as the single source of truth for frontend-backend communication.
 * 
 * IMPORTANT: This file should be generated from docs/openapi-spec.yaml
 * Manual changes should be minimal and documented.
 * 
 * Generated from OpenAPI Specification v3.0.0
 * Last Updated: 2024-01-01 (Contract alignment)
 */

// =============================================================================
// CORE API TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// =============================================================================
// AUTHENTICATION & USER TYPES
// =============================================================================

export type UserRole = "superadmin" | "owner" | "manager" | "attendant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;      // Required for non-superadmin users
  tenantName?: string;    // Display name only
  stationId?: string;     // For attendants assigned to specific stations
  stationName?: string;   // Display name only
  createdAt: string;
  isActive?: boolean;
  permissions?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'attendant';
  stationId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "manager" | "attendant";
  stationId?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// =============================================================================
// STATION MANAGEMENT TYPES
// =============================================================================

export interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  // Optional metrics (when includeMetrics=true)
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
  lastActivity?: string;
  efficiency?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status?: 'active' | 'inactive' | 'maintenance'; // Optional, defaults to 'active'
}

// =============================================================================
// PUMP & NOZZLE TYPES
// =============================================================================

export interface Pump {
  id: string;
  label: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  stationId: string;
  nozzleCount?: number;
  createdAt: string;
}

export interface CreatePumpRequest {
  label: string;
  serialNumber: string;
  status?: 'active' | 'inactive' | 'maintenance'; // Optional, defaults to 'active'
  stationId: string;
}

export interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  pumpId: string;
  createdAt: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance'; // Optional, defaults to 'active'
}

// =============================================================================
// READINGS & SALES TYPES
// =============================================================================

export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  createdAt: string;
  // Calculated fields
  volume?: number;
  amount?: number;
  pricePerLitre?: number;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt?: string; // Optional, defaults to current time
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export interface Sale {
  id: string;
  nozzleId: string;
  stationId: string;
  volume: number;
  fuelType: string;
  fuelPrice: number;
  amount: number;
  paymentMethod: string;
  creditorId?: string;
  status: 'posted' | 'draft';
  recordedAt: string;
  createdAt: string;
}

// =============================================================================
// FUEL PRICE TYPES
// =============================================================================

export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom: string;
  createdAt: string;
  stationName?: string;
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom?: string; // Optional, defaults to current date
}

// =============================================================================
// CREDITOR TYPES
// =============================================================================

export interface Creditor {
  id: string;
  partyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  creditLimit?: number;
  outstandingAmount: number;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateCreditorRequest {
  partyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
}

export interface CreditPayment {
  id: string;
  creditorId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  reference?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentDate?: string; // Optional, defaults to current date
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  reference?: string;
  referenceNumber?: string;
  notes?: string;
}

// =============================================================================
// ATTENDANT TYPES
// =============================================================================

export interface AttendantStation {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  assignedAt: string;
}

export interface CashReport {
  id: string;
  stationId: string;
  reportedBy: string;
  reportedByName?: string;
  cashAmount: number;
  reportDate: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
  createdAt: string;
  status?: 'submitted' | 'approved' | 'rejected';
}

export interface CreateCashReportRequest {
  stationId: string;
  cashAmount: number;
  reportDate?: string; // Optional, defaults to current date
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
}

// =============================================================================
// ALERT TYPES
// =============================================================================

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  isActive?: boolean;
}

// =============================================================================
// DASHBOARD TYPES
// =============================================================================

export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  cashSales: number;
  creditSales: number;
  growthPercentage: number;
  totalProfit?: number;
  profitMargin?: number;
  period?: string;
  previousPeriodRevenue?: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  revenue: number;
  percentage: number;
  averagePrice?: number;
}

export interface StationMetric {
  id: string;
  name: string;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
  activePumps: number;
  totalPumps: number;
  status: "active" | "inactive" | "maintenance";
  lastActivity?: string;
  efficiency?: number;
}

// =============================================================================
// SUPERADMIN TYPES
// =============================================================================

export interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'cancelled';
  planId: string;
  planName: string;
  createdAt: string;
  userCount: number;
  stationCount: number;
  lastActivity?: string;
  billingStatus?: 'current' | 'overdue' | 'suspended';
}

export interface CreateTenantRequest {
  name: string;
  planId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceYearly?: number;
  maxStations: number;
  maxUsers: number;
  maxPumpsPerStation?: number;
  maxNozzlesPerPump?: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  tenantCount?: number;
  isPopular?: boolean;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  priceYearly?: number;
  maxStations: number;
  maxUsers: number;
  maxPumpsPerStation?: number;
  maxNozzlesPerPump?: number;
  features: string[];
  isActive?: boolean; // Optional, defaults to true
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin';
  createdAt: string;
  lastLogin?: string;
  isActive?: boolean;
  permissions?: string[];
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  permissions?: string[];
}

export interface SuperAdminSummary {
  totalTenants: number;
  activeTenants: number;
  totalStations: number;
  totalRevenue: number;
  revenueGrowth: number;
  topPerformingTenants: Array<{
    tenantId: string;
    tenantName: string;
    revenue: number;
    stationCount: number;
    growth?: number;
  }>;
  systemHealth?: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

// =============================================================================
// INVENTORY TYPES
// =============================================================================

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  currentVolume: number;
  lastUpdated: string;
  minimumLevel?: number;
  maximumCapacity?: number;
  status?: 'normal' | 'low' | 'critical' | 'overstocked';
}

export interface FuelDelivery {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  quantity: number;
  deliveryDate: string;
  supplierName: string;
  invoiceNumber: string;
  pricePerLiter: number;
  totalAmount: number;
  createdAt: string;
  status?: 'pending' | 'delivered' | 'confirmed';
  receivedBy?: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  quantity: number;
  deliveryDate?: string; // Optional, defaults to current date
  supplierName: string;
  invoiceNumber: string;
  pricePerLiter: number;
  receivedBy?: string;
}

// =============================================================================
// RECONCILIATION TYPES
// =============================================================================

export interface ReconciliationRecord {
  id: string;
  stationId: string;
  stationName: string;
  reconciliationDate: string;
  totalSales: number;
  totalCash: number;
  totalCredit: number;
  declaredCash: number;
  variance: number;
  status: 'balanced' | 'variance' | 'pending';
  notes?: string;
  createdAt: string;
  reconciliationBy?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface CreateReconciliationRequest {
  stationId: string;
  reconciliationDate?: string; // Optional, defaults to current date
  declaredCash: number;
  notes?: string;
}

// =============================================================================
// FILTER & QUERY TYPES
// =============================================================================

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  fuelType?: string;
}

export interface AlertsParams {
  stationId?: string;
  unreadOnly?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  type?: 'warning' | 'error' | 'info';
}

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
  status?: 'normal' | 'low' | 'critical' | 'overstocked';
}

// =============================================================================
// REPORT TYPES
// =============================================================================

export interface SalesReportData {
  id: string;
  date: string;
  stationName: string;
  nozzleNumber: number;
  fuelType: string;
  volume: number;
  pricePerLitre: number;
  totalAmount: number;
  paymentMethod: string;
  creditorName?: string;
  attendantName?: string;
}

export interface ExportReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
  includeCharts?: boolean;
}

// =============================================================================
// TYPE ALIASES FOR BACKWARD COMPATIBILITY
// =============================================================================

export type AuthResponse = LoginResponse;
export type Alert = SystemAlert;
export type TopCreditor = Creditor;
export type DailySalesTrend = { date: string; revenue: number; volume: number; salesCount: number };
export type StationComparison = StationMetric;
