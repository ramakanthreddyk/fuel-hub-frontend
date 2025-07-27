/**
 * API Contract - Single Source of Truth
 * This file defines all API request/response types that both frontend and backend must follow
 */

// ============================================================================
// STANDARD API RESPONSE WRAPPER
// ============================================================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ============================================================================
// TODAY'S SALES SUMMARY - /todays-sales/summary
// ============================================================================
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
  nozzleEntries: NozzleEntry[];
  salesByFuel: FuelSalesBreakdown[];
  salesByStation: StationSalesBreakdown[];
  creditSales: CreditSale[];
}

export interface NozzleEntry {
  nozzle_id: string;
  nozzle_number: number;
  fuel_type: string;
  pump_id: string;
  pump_name: string;
  station_id: string;
  station_name: string;
  entries_count: number;
  total_volume: number;
  total_amount: number;
  last_entry_time: string;
  average_ticket_size: number;
}

export interface FuelSalesBreakdown {
  fuel_type: string;
  total_volume: number;
  total_amount: number;
  entries_count: number;
  average_price: number;
  stations_count: number;
}

export interface StationSalesBreakdown {
  station_id: string;
  station_name: string;
  total_volume: number;
  total_amount: number;
  entries_count: number;
  fuel_types: string[];
  nozzles_active: number;
  last_activity: string | null;
}

export interface CreditSale {
  id: string;
  amount: number;
  creditor_name: string;
  fuel_type: string;
  volume: number;
  date: string;
}

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

// /dashboard/sales-summary
export interface DashboardSalesSummary {
  totalAmount: number;
  totalVolume: number;
  totalTransactions: number;
  period: string;
}

// /dashboard/sales-trend
export interface SalesTrendData {
  date: string;
  amount: number;
  volume: number;
}

// /dashboard/payment-methods
export interface PaymentMethodData {
  paymentMethod: string;
  amount: number;
  percentage: number;
}

// /dashboard/fuel-breakdown
export interface FuelBreakdownData {
  fuelType: string;
  amount: number;
  volume: number;
  percentage: number;
}

// ============================================================================
// STATIONS - /stations
// ============================================================================
export interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
  // When includeMetrics=true
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
  pumps?: Pump[];
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

// /stations/{id}/performance
export interface StationPerformance {
  stationId: string;
  stationName: string;
  currentPeriodSales: number;
  previousPeriodSales: number;
  growthPercentage: number;
  totalVolume: number;
  averageTicketSize: number;
}

// ============================================================================
// PUMPS & NOZZLES
// ============================================================================
export interface Pump {
  id: string;
  name: string;
  serialNumber?: string;
  status: 'active' | 'inactive' | 'maintenance';
  stationId: string;
  nozzleCount: number;
  nozzles?: Nozzle[];
}

export interface CreatePumpRequest {
  name: string;
  serialNumber?: string;
  stationId: string;
}

export interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'maintenance' | 'inactive';
  pumpId: string;
}

export interface CreateNozzleRequest {
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  pumpId: string;
}

export interface UpdateNozzleRequest {
  nozzleNumber?: number;
  fuelType?: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'maintenance' | 'inactive';
}

// ============================================================================
// SALES REPORTS - /reports/sales
// ============================================================================
export interface SalesReportParams {
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  nozzleId?: string;
  stationId?: string;
}

export interface SalesReport {
  data: SaleTransaction[];
  summary: {
    totalRecords: number;
    totalSales: number;
    totalProfit: number;
  };
}

export interface SaleTransaction {
  id: string;
  station_name: string;
  fuel_type: string;
  volume: string;
  fuel_price: string;
  cost_price: string;
  amount: string;
  profit: string;
  payment_method: string;
  creditor_name: string | null;
  recorded_at: string;
}

// ============================================================================
// FUEL PRICES
// ============================================================================
export interface FuelPrice {
  id: string;
  fuelType: string;
  price: number;
  validFrom: string;
  stationId: string;
}

export interface CreateFuelPriceRequest {
  fuelType: string;
  price: number;
  validFrom: string;
  stationId: string;
}

// ============================================================================
// READINGS
// ============================================================================
export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  timestamp: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
}

// ============================================================================
// USERS & AUTH
// ============================================================================
export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  tenantId?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ============================================================================
// CREDITORS
// ============================================================================
export interface Creditor {
  id: string;
  name: string;
  phone?: string;
  outstandingAmount: number;
  createdAt: string;
}

export interface CreateCreditorRequest {
  name: string;
  phone?: string;
}

export interface CreditPayment {
  id: string;
  amount: number;
  date: string;
  creditorId: string;
}

export interface CreatePaymentRequest {
  amount: number;
  creditorId: string;
}

// ============================================================================
// RECONCILIATION
// ============================================================================
export interface ReconciliationRecord {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  totalSales: number;
  expectedSales: number;
  variance: number;
  finalized: boolean;
  createdAt: string;
}

// ============================================================================
// ALERTS & NOTIFICATIONS
// ============================================================================
export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
}

// ============================================================================
// MULTI-TENANT (SUPER ADMIN)
// ============================================================================
export interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface CreateTenantRequest {
  name: string;
  planId: string;
  contactEmail: string;
}

export interface Plan {
  id: string;
  name: string;
  features: string[];
  price: number;
}

// ============================================================================
// ATTENDANT INTERFACES
// ============================================================================
export interface CashReport {
  id: string;
  amount: number;
  date: string;
  attendantId: string;
  stationId: string;
  notes?: string;
}

export interface CreateCashReportRequest {
  amount: number;
  notes?: string;
}

// ============================================================================
// TYPE GUARDS & UTILITIES
// ============================================================================
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return obj && typeof obj.success === 'boolean' && obj.data !== undefined;
}

export function isTodaysSalesSummary(obj: any): obj is TodaysSalesSummary {
  return obj && 
    typeof obj.date === 'string' &&
    typeof obj.totalAmount === 'number' &&
    typeof obj.totalVolume === 'number' &&
    typeof obj.totalEntries === 'number';
}

// ============================================================================
// QUERY PARAMETER TYPES
// ============================================================================
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface StationFilterParams {
  stationId?: string;
  includeMetrics?: boolean;
}

// ============================================================================
// ERROR TYPES
// ============================================================================
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}