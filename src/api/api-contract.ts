/**
 * FuelSync Hub - API Contract
 * 
 * This file contains ALL TypeScript interfaces for the FuelSync Hub API.
 * Updated to match OpenAPI specification v3.0.0
 * Last Updated: 2025-07-04 (OpenAPI alignment + Build Error Fixes)
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

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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
  tenantId?: string;
  tenantName?: string;
  stationId?: string;
  stationName?: string;
  createdAt: string;
  updatedAt?: string;
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
  expiresIn?: number;
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
  isActive?: boolean;
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
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  managerId?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  updatedAt?: string;
  // Metrics
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
  lastActivity?: string;
  efficiency?: number;
  // Relationships
  pumps?: Pump[];
  users?: User[];
}

export interface CreateStationRequest {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  managerId?: string;
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  managerId?: string;
}

// =============================================================================
// PUMP & NOZZLE TYPES
// =============================================================================

export interface Pump {
  id: string;
  stationId: string;
  name: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  nozzleCount: number;
}

export interface CreatePumpRequest {
  stationId: string;
  name: string;
  serialNumber: string;
}

export interface UpdatePumpRequest {
  name?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  status: 'active' | 'inactive' | 'maintenance';
  pumpId: string;
  pumpName?: string;
  serialNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  status?: 'active' | 'inactive' | 'maintenance';
  serialNumber?: string;
}

export interface UpdateNozzleRequest {
  nozzleNumber?: number;
  fuelType?: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  status?: 'active' | 'inactive' | 'maintenance';
  serialNumber?: string;
}

// =============================================================================
// READINGS & SALES TYPES
// =============================================================================

export interface NozzleReading {
  id: string;
  nozzleId: string;
  nozzleNumber?: number;
  pumpName?: string;
  stationName?: string;
  reading: number;
  previousReading?: number;
  volume?: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  creditorName?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  // Calculated fields
  amount?: number;
  pricePerLitre?: number;
  fuelType?: string;
  stationId?: string;
  attendantId?: string;
  attendantName?: string;
  recordedBy?: string; // alias for attendantName
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  notes?: string;
}

export interface ReadingValidation {
  canCreate: boolean;
  reason?: string;
  previousReading?: number;
  minimumReading?: number;
  maximumReading?: number;
}

export interface Sale {
  id: string;
  nozzleId: string;
  nozzleName?: string;
  stationId: string;
  stationName?: string;
  pumpId?: string;
  pumpName?: string;
  volume: number;
  fuelType: string;
  fuelPrice: number;
  amount: number;
  paymentMethod: string;
  creditorId?: string;
  creditorName?: string;
  status: 'posted' | 'draft' | 'cancelled';
  recordedAt: string;
  createdAt: string;
  updatedAt?: string;
  attendantId?: string;
  attendantName?: string;
  notes?: string;
}

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  fuelType?: string;
  attendantId?: string;
  status?: string;
}

// =============================================================================
// FUEL PRICE TYPES
// =============================================================================

export interface FuelPrice {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  price: number;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  price: number;
  validFrom?: string;
  validTo?: string;
}

export interface UpdateFuelPriceRequest {
  price?: number;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
}

export interface FuelPriceValidation {
  stationId: string;
  missingPrices: Array<{
    fuelType: string;
    message: string;
  }>;
  hasValidPrices: boolean;
  lastUpdated?: string;
}

// =============================================================================
// CREDITOR TYPES
// =============================================================================

export interface Creditor {
  id: string;
  partyName: string;
  name: string; // Alias for partyName
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  outstandingAmount: number;
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  lastPaymentDate?: string;
  lastPurchaseDate?: string;
}

export interface CreateCreditorRequest {
  partyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
}

export interface UpdateCreditorRequest {
  partyName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CreditPayment {
  id: string;
  creditorId: string;
  creditorName?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';
  reference?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  recordedBy?: string;
}

export interface CreateCreditPaymentRequest {
  creditorId: string;
  amount: number;
  paymentDate?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';
  reference?: string;
  referenceNumber?: string;
  notes?: string;
}

// Alias for CreateCreditPaymentRequest
export interface CreatePaymentRequest extends CreateCreditPaymentRequest {}

// =============================================================================
// DASHBOARD & ANALYTICS TYPES
// =============================================================================

export interface DashboardMetrics {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  cashSales: number;
  creditSales: number;
  cardSales?: number;
  upiSales?: number;
  growthPercentage: number;
  totalProfit?: number;
  profitMargin?: number;
  period?: string;
  previousPeriodRevenue?: number;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  amount: number;
  percentage: number;
}

export interface FuelTypeAnalytics {
  fuelType: string;
  volume: number;
  amount: number;
}

export interface StationPerformance {
  stationId: string;
  stationName: string;
  revenue: number;
  volume: number;
  salesCount: number;
  efficiency: number;
  activePumps: number;
  totalPumps: number;
  lastActivity: string;
}

export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  cashSales: number;
  creditSales: number;
  cardSales?: number;
  upiSales?: number;
  growthPercentage: number;
  totalProfit?: number;
  profitMargin?: number;
  period?: string;
  previousPeriodRevenue?: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  amount: number;
}

export interface TopCreditor {
  id: string;
  partyName: string;
  outstandingAmount: number;
  creditLimit?: number;
}

export interface DailySalesTrend {
  date: string;
  amount: number;
  volume: number;
  dayOfWeek?: string;
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
// ATTENDANT SPECIFIC TYPES
// =============================================================================

export interface AttendantStation {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  assignedAt: string;
  permissions?: string[];
}

export interface AttendantPump {
  id: string;
  name: string;
  stationId: string;
  stationName?: string;
  status: 'active' | 'inactive' | 'maintenance';
  nozzleCount: number;
}

export interface AttendantNozzle {
  id: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  status: 'active' | 'inactive' | 'maintenance';
  pumpId: string;
  pumpName?: string;
}

export interface CashReport {
  id: string;
  stationId: string;
  stationName?: string;
  attendantId: string;
  attendantName?: string;
  cashAmount: number;
  reportDate: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCashReportRequest {
  stationId: string;
  cashAmount: number;
  reportDate?: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical'; // Alias for priority
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  pumpId?: string;
  nozzleId?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  isActive: boolean;
  read: boolean; // For UI state
  expiresAt?: string;
}

export interface SystemAlert extends Alert {
  // System alerts are the same as Alert
}

export interface AlertsParams {
  stationId?: string;
  unreadOnly?: boolean;
  type?: string;
  priority?: string;
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
// SUPERADMIN TYPES
// =============================================================================

export interface Tenant {
  id: string;
  name: string;
  planId: string;
  planName: string;
  status: 'active' | 'suspended' | 'cancelled' | 'trial';
  createdAt: string;
  updatedAt?: string;
  userCount: number;
  stationCount: number;
  lastActivity?: string;
  billingStatus?: 'current' | 'overdue' | 'suspended';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  ownerName?: string;
  ownerEmail?: string;
  // Extended properties for detailed views
  users?: User[];
  stations?: Station[];
}

export interface TenantDetailsResponse extends Tenant {
  users: User[];
  stations: Station[];
}

export interface CreateTenantRequest {
  name: string;
  planId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  trialDays?: number;
}

export interface UpdateTenantRequest {
  name?: string;
  planId?: string;
  status?: 'active' | 'suspended' | 'cancelled' | 'trial';
}

export interface UpdateTenantStatusRequest {
  status: 'active' | 'suspended' | 'cancelled' | 'trial';
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceMonthly?: number;
  priceYearly?: number;
  maxStations: number;
  maxUsers: number;
  maxPumpsPerStation?: number;
  maxNozzlesPerPump?: number;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  createdAt: string;
  updatedAt?: string;
  tenantCount?: number;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  priceMonthly?: number;
  priceYearly?: number;
  maxStations: number;
  maxUsers: number;
  maxPumpsPerStation?: number;
  maxNozzlesPerPump?: number;
  features: string[];
  isPopular?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin';
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  permissions?: string[];
}

export interface SuperAdminAnalytics {
  overview: {
    totalTenants: number;
    totalRevenue: number;
    totalStations: number;
    growth: number;
  };
  tenantMetrics: {
    activeTenants: number;
    trialTenants: number;
    suspendedTenants: number;
    monthlyGrowth: number;
  };
  revenueMetrics: {
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
    churnRate: number;
    averageRevenuePerTenant: number;
  };
  usageMetrics: {
    totalUsers: number;
    totalStations: number;
    totalTransactions: number;
    averageStationsPerTenant: number;
  };
  // Extended properties for components
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  salesVolume?: number;
  monthlyGrowth?: Array<{
    month: string;
    tenants: number;
    revenue: number;
  }>;
  topTenants?: Array<{
    id: string;
    name: string;
    stationsCount: number;
    revenue: number;
  }>;
  // Additional properties needed by components
  tenantCount: number;
  activeTenantCount: number;
  totalUsers: number;
  signupsThisMonth: number;
  tenantsByPlan: Array<{
    planName: string;
    count: number;
    percentage: number;
  }>;
  recentTenants: Tenant[];
}

export interface SuperAdminSummary {
  totalTenants: number;
  totalStations: number;
  activeTenants: number;
  activeTenantCount: number; // Alias for activeTenants
  tenantCount: number; // Alias for totalTenants
  totalRevenue: number;
  monthlyGrowth: number;
  adminCount: number;
  planCount: number;
  totalUsers: number;
  signupsThisMonth: number;
  recentTenants: Tenant[];
  alerts: Alert[];
  tenantsByPlan: Array<{
    planName: string;
    count: number;
    percentage: number;
  }>;
}

// =============================================================================
// ANALYTICS TYPES
// =============================================================================

export interface StationComparison {
  stationId: string;
  stationName: string;
  currentPeriod: {
    revenue: number;
    volume: number;
    salesCount: number;
  };
  previousPeriod: {
    revenue: number;
    volume: number;
    salesCount: number;
  };
  growth: {
    revenue: number;
    volume: number;
    salesCount: number;
  };
}

export interface StationComparisonParams {
  stationIds: string[];
  period?: string;
}

export interface HourlySales {
  hour: number;
  revenue: number;
  volume: number;
  salesCount: number;
  sales: number; // Alias for revenue
  date: string;
}

export interface PeakHour {
  hour: number;
  averageRevenue: number;
  averageVolume: number;
  averageSalesCount: number;
  dayOfWeek?: string;
  timeRange: string; // e.g., "9:00 AM - 10:00 AM"
  avgSales: number; // Alias for averageRevenue
}

export interface FuelPerformance {
  fuelType: string;
  revenue: number;
  volume: number;
  salesCount: number;
  averagePrice: number;
  growth: number;
  margin: number; // Profit margin percentage
}

export interface StationRanking {
  rank: number;
  stationId: string;
  stationName: string;
  id: string; // Alias for stationId
  name: string; // Alias for stationName
  revenue: number;
  volume: number;
  efficiency: number;
  score: number;
  sales: number; // Alias for revenue
  growth: number; // Growth percentage
}

// =============================================================================
// INVENTORY & DELIVERY TYPES
// =============================================================================

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  currentStock: number;
  currentVolume: number; // Alias for currentStock
  minimumLevel: number;
  maximumLevel: number;
  lastUpdated: string;
  status: 'normal' | 'low' | 'critical' | 'overstocked';
}

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
}

export interface FuelDelivery {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  quantity: number;
  volume: number; // Alias for quantity
  pricePerLitre: number;
  totalAmount: number;
  deliveryDate: string;
  supplierName?: string;
  deliveredBy?: string; // Person who delivered
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium' | 'cng' | 'lpg';
  quantity: number;
  pricePerLitre: number;
  deliveryDate?: string;
  supplierName?: string;
  invoiceNumber?: string;
  deliveredBy?: string;
  notes?: string;
}

// =============================================================================
// RECONCILIATION TYPES
// =============================================================================

export interface ReconciliationRecord {
  id: string;
  stationId: string;
  stationName?: string;
  date: string;
  openingReading: number;
  closingReading: number;
  totalSales: number;
  expectedSales: number;
  variance: number;
  status: 'matched' | 'variance' | 'pending';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReconciliationRequest {
  stationId: string;
  date: string;
  reconciliationDate?: string; // Alias for date
  openingReading: number;
  closingReading: number;
  declaredCash?: number;
  notes?: string;
}

export interface DailyReadingSummary {
  nozzleId: string;
  nozzleName?: string;
  nozzleNumber?: number; // Alias for display
  fuelType: string;
  openingReading: number;
  closingReading: number;
  previousReading: number; // Alias for openingReading
  currentReading: number; // Alias for closingReading
  totalVolume: number;
  deltaVolume: number; // Alias for totalVolume
  salesCount: number;
  revenue: number;
  pricePerLitre: number;
  saleValue: number; // Alias for revenue
  paymentMethod?: string;
  cashDeclared?: number;
}

// =============================================================================
// REPORTS TYPES
// =============================================================================

export interface SalesReportFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  fuelType?: string;
  attendantId?: string;
}

export interface SalesReportData {
  id: string;
  date: string;
  stationName: string;
  nozzleName: string;
  nozzleNumber?: string; // Alias for nozzleName
  fuelType: string;
  volume: number;
  amount: number;
  paymentMethod: string;
  attendantName?: string;
  attendant?: string; // Alias for attendantName
  pricePerLitre?: number;
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  byPaymentMethod: PaymentMethodBreakdown[];
  byFuelType: FuelTypeBreakdown[];
  paymentMethodBreakdown: PaymentMethodBreakdown[]; // Alias
  fuelTypeBreakdown: FuelTypeBreakdown[]; // Alias
}

export interface SalesReportExportFilters extends SalesReportFilters {
  format: 'csv' | 'excel' | 'pdf';
}

export interface ExportRequest {
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  filters?: Record<string, any>;
  includeFields?: string[];
  reportType?: string; // Added for compatibility
}

export interface ExportReportRequest extends ExportRequest {
  type: 'sales' | 'inventory' | 'financial' | 'attendance';
}

export interface ScheduleReportRequest {
  type: 'sales' | 'inventory' | 'financial' | 'attendance';
  format: 'csv' | 'excel' | 'pdf';
  frequency: 'daily' | 'weekly' | 'monthly';
  filters: Record<string, any>;
  recipients: string[];
  reportType?: string; // Added for compatibility
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}

// =============================================================================
// SEARCH & FILTER TYPES
// =============================================================================

export interface SearchParams {
  q?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

export interface BulkOperationRequest {
  operation: 'update' | 'delete' | 'activate' | 'deactivate';
  ids: string[];
  data?: Record<string, any>;
}

export interface BulkOperationResponse {
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
}
