
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

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
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
  // For hierarchical display
  pumps?: Pump[];
  users?: User[];
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
  // For hierarchical display
  nozzles?: Nozzle[];
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

export interface UpdateNozzleRequest {
  nozzleNumber?: number;
  fuelType?: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance';
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
  stationName?: string;
  // Include nested objects if present
  nozzle?: any;
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

export interface FuelPriceValidation {
  stationId: string;
  missingPrices: Array<{
    fuelType: string;
    message: string;
  }>;
  hasValidPrices: boolean;
  lastUpdated?: string;
  // For legacy compatibility
  missingFuelTypes?: string[];
  hasActivePrices?: boolean;
}

// =============================================================================
// CREDITOR TYPES
// =============================================================================

export interface Creditor {
  id: string;
  partyName: string;
  name?: string; // Alias for partyName for backward compatibility
  contactPerson?: string;
  phoneNumber?: string;
  creditLimit?: number;
  outstandingAmount: number;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  lastPaymentDate?: string;
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

export interface AttendantPump {
  id: string;
  label: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  stationId: string;
  stationName: string;
  nozzleCount: number;
}

export interface AttendantNozzle {
  id: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  pumpId: string;
  pumpLabel: string;
  stationId: string;
  stationName: string;
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
  severity?: 'low' | 'medium' | 'high' | 'critical'; // Alias for priority
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  isActive?: boolean;
  read?: boolean; // For UI state
}

export interface AlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unacknowledged: number;
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
  revenue?: number; // Alias for totalRevenue
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
  // For hierarchical display - these can be arrays OR numbers for backward compatibility
  users?: User[] | number; 
  stations?: Station[] | number; 
}

export interface CreateTenantRequest {
  name: string;
  planId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
}

export interface UpdateTenantStatusRequest {
  status: 'active' | 'suspended' | 'cancelled';
}

export interface TenantDetailsResponse extends Tenant {
  owner?: User;
  plan?: Plan;
  recentActivity?: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceYearly?: number;
  priceMonthly?: number; // Alias for price
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
  // Additional fields for backward compatibility
  tenantCount?: number; // Alias for totalTenants
  activeTenantCount?: number; // Alias for activeTenants
  totalUsers?: number;
  signupsThisMonth?: number;
  planCount?: number;
  adminCount?: number;
  tenantsByPlan?: Array<{
    planName: string;
    count: number;
    percentage?: number;
  }>;
  recentTenants?: Array<{
    id: string;
    name: string;
    createdAt: string;
    status?: string;
  }>;
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
  volume?: number; // Alias for quantity
  deliveryDate: string;
  supplierName: string;
  invoiceNumber: string;
  pricePerLiter: number;
  totalAmount: number;
  createdAt: string;
  status?: 'pending' | 'delivered' | 'confirmed';
  receivedBy?: string;
  deliveredBy?: string; // For form compatibility
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
  deliveredBy?: string; // For form compatibility
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
  totalExpected?: number; // For form compatibility
}

export interface DailyReadingSummary {
  date: string;
  stationId: string;
  stationName: string;
  totalSales: number;
  totalCash: number;
  totalCredit: number;
  readingCount: number;
  fuelBreakdown: Array<{
    fuelType: string;
    volume: number;
    revenue: number;
  }>;
  // Legacy fields for components
  nozzleId?: string;
  nozzleNumber?: number;
  fuelType?: string;
  previousReading?: number;
  currentReading?: number;
  deltaVolume?: number;
  pricePerLitre?: number;
  saleValue?: number;
  paymentMethod?: string;
  cashDeclared?: number;
}

// =============================================================================
// ANALYTICS & REPORTS TYPES
// =============================================================================

export interface StationComparison {
  stationId: string;
  stationName: string;
  revenue: number;
  volume: number;
  salesCount: number;
  growth: number;
  efficiency: number;
  period: string;
}

export interface StationComparisonParams {
  stationIds: string[];
  period?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface HourlySales {
  hour: number;
  sales: number;
  volume: number;
  count: number;
  date: string;
}

export interface PeakHour {
  hour: number;
  averageSales: number;
  dayOfWeek?: string;
  isWeekend: boolean;
  // Legacy fields
  timeRange?: string;
  avgSales?: number;
}

export interface FuelPerformance {
  fuelType: string;
  totalVolume: number;
  totalRevenue: number;
  averagePrice: number;
  salesCount: number;
  growth: number;
  marketShare: number;
}

export interface StationRanking {
  rank: number;
  stationId: string;
  stationName: string;
  revenue: number;
  growth: number;
  efficiency: number;
  score: number;
  // Legacy fields
  id?: string;
  name?: string;
  sales?: number;
  volume?: number;
}

export interface SuperAdminAnalytics {
  overview: {
    totalTenants: number;
    totalRevenue: number;
    totalStations: number;
    growth: number;
  };
  tenantPerformance: Array<{
    tenantId: string;
    tenantName: string;
    revenue: number;
    growth: number;
    stationCount: number;
    // Add legacy compatibility fields
    id?: string;
    name?: string;
    stationsCount?: number;
  }>;
  revenueByPlan: Array<{
    planName: string;
    revenue: number;
    tenantCount: number;
  }>;
  systemMetrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
  // Legacy fields for components
  totalTenants?: number;
  activeTenants?: number;
  totalStations?: number;
  totalRevenue?: number;
  salesVolume?: number;
  monthlyGrowth?: Array<{
    month: string;
    tenants: number;
  }>;
  topTenants?: Array<{
    tenantId: string;
    tenantName: string;
    revenue: number;
    id?: string;
    name?: string;
    stationsCount?: number;
  }>;
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
  amount?: number; // Alias for totalAmount
  paymentMethod: string;
  creditorName?: string;
  attendantName?: string;
  attendant?: string; // Alias for attendantName
}

export interface SalesReportFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  fuelType?: string;
  groupBy?: string;
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  period: string;
  revenue?: number; // Alias for totalRevenue
  fuelTypeBreakdown?: Array<{
    fuelType: string;
    volume: number;
    revenue: number;
  }>;
  paymentMethodBreakdown?: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
}

export interface SalesReportExportFilters extends SalesReportFilters {
  format: 'csv' | 'excel' | 'pdf';
  includeCharts?: boolean;
}

export interface ExportReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
  includeCharts?: boolean;
}

export interface ScheduleReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  filters: Record<string, any>;
  schedule?: string; // For legacy compatibility
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
// TYPE ALIASES FOR BACKWARD COMPATIBILITY
// =============================================================================

export type AuthResponse = LoginResponse;
export type Alert = SystemAlert;
export type TopCreditor = Creditor;
export type DailySalesTrend = { 
  date: string; 
  revenue: number; 
  volume: number; 
  salesCount: number;
  dayOfWeek?: string;
};
