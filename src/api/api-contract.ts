
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

// Standard payment method type for consistency across interfaces
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check' | 'cheque';

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
  serialNumber?: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
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
  pumpId: string;
  pumpName?: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  lastReading?: number;
  createdAt: string;
  stationId?: string;
  stationName?: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
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
  paymentMethod: PaymentMethod;
  creditorId?: string;
  nozzleNumber?: number;
  previousReading?: number;
  volume?: number;
  amount?: number;
  pricePerLitre?: number;
  fuelType?: string;
  stationName?: string;
  stationId?: string;
  pumpId?: string;
  pumpName?: string;
  attendantName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: PaymentMethod;
  creditorId?: string;
}

export interface ReadingValidation {
  canCreate: boolean;
  reason?: string;
  previousReading?: number;
  minimumReading?: number;
  maximumReading?: number;
  missingPrice?: boolean;
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
  readingId?: string;
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
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom: string;
  createdAt: string;
  station?: {
    name?: string;
  };
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom?: string;
}

export interface UpdateFuelPriceRequest {
  price?: number;
  validFrom?: string;
  effectiveTo?: string;
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
// INVENTORY & DELIVERY TYPES
// =============================================================================

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  capacity?: number;
  minimumLevel?: number;
  status?: 'normal' | 'low' | 'critical';
  currentVolume: number;
  lastUpdated: string;
}

export interface FuelDelivery {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  volume: number;
  deliveryDate: string;
  supplier?: string;
  createdAt: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  volume: number;
  deliveryDate: string;
  supplier?: string;
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
  stationId?: string; // Added for station association
  stationName?: string; // Added for station name
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
  stationId?: string; // Added for station association
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
  stationId?: string; // Added for station association
}

export interface CreditPayment {
  id: string;
  creditorId: string;
  creditorName?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
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
  paymentMethod: PaymentMethod;
  reference?: string;
  referenceNumber?: string;
  notes?: string;
}

// Alias for CreateCreditPaymentRequest
export interface CreatePaymentRequest extends CreateCreditPaymentRequest {}

// =============================================================================
// DASHBOARD & ANALYTICS TYPES
// =============================================================================

// Analytics Types
export interface StationComparison {
  id: string;
  stationId: string;
  name?: string;
  stationName: string;
  sales: number;
  volume: number;
  transactions: number;
  growth: number;
  // Required nested objects
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
  // Additional fields from backend
  period?: string;
  salesGrowth?: number;
  volumeGrowth?: number;
  transactionsGrowth?: number;
  previousSales?: number;
  previousVolume?: number;
  previousTransactions?: number;
  // Aliases for compatibility
  totalSales?: number;
  totalVolume?: number;
  transactionCount?: number;
  revenue?: number;
}

export interface HourlySales {
  hour: number;
  date: string;
  sales: number;
  revenue: number;
  volume: number;
  transactions: number;
  salesCount: number;
}

export interface PeakHour {
  hour: number;
  timeRange: string;
  avgSales: number;
  averageRevenue: number;
  avgVolume: number;
  averageVolume: number;
  averageSalesCount: number;
  dayOfWeek?: string;
}

export interface FuelPerformance {
  fuelType: string;
  volume: number;
  sales: number;
  revenue: number;
  margin: number;
  growth: number;
  salesCount: number;
  averagePrice: number;
  // Aliases for compatibility
  totalSalesVolume?: number;
  totalSalesAmount?: number;
}

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
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  pumpId: string;
  pumpName?: string;
  lastReading?: number;
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
  cardAmount?: number;
  upiAmount?: number;
  creditAmount?: number;
  creditorId?: string;
  reportDate?: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'inventory' | 'credit' | 'maintenance' | 'sales' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  isRead: boolean;
  read?: boolean; // Alias for isRead
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  category?: string;
  source?: string;
  metadata?: Record<string, any>;
  // Aliases for compatibility
  alertType?: string; // Alias for type
  alertSeverity?: string; // Alias for severity
}

export interface SystemAlert extends Alert {
  // System alerts are the same as Alert
  acknowledged?: boolean;
}

export interface AlertsParams {
  stationId?: string;
  unreadOnly?: boolean;
  type?: string;
  priority?: string;
}

export interface CreateAlertRequest {
  stationId?: string;
  alertType: string;
  message: string;
  severity?: 'info' | 'warning' | 'critical';
}

export interface AlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unacknowledged: number;
  resolved?: number;
  dismissed?: number;
  new?: number;
  acknowledged?: number;
  // By type
  inventory?: number;
  credit?: number;
  maintenance?: number;
  sales?: number;
  system?: number;
  // By time period
  today?: number;
  thisWeek?: number;
  thisMonth?: number;
}

// =============================================================================
// RECONCILIATION TYPES
// =============================================================================

export interface ReconciliationRecord {
  id: string;
  stationId: string;
  date: string;
  openingReading: number;
  closingReading: number;
  variance: number;
  reconciliationNotes?: string;
  managerConfirmation: boolean;
  createdAt: string;
  station?: {
    name?: string;
  };
}

export interface CreateReconciliationRequest {
  stationId: string;
  date: string;
  reconciliationNotes?: string;
  managerConfirmation: boolean;
}

export interface DailyReadingSummary {
  nozzleId: string;
  nozzleNumber: number;
  previousReading: number;
  currentReading: number;
  deltaVolume: number;
  pricePerLitre: number;
  saleValue: number;
  paymentMethod?: string;
  cashDeclared?: number;
  fuelType: string;
  nozzleName?: string;
  openingReading?: number; // Alias for previousReading
  closingReading?: number; // Alias for currentReading
  totalVolume?: number; // Alias for deltaVolume
  revenue?: number; // Alias for saleValue
  salesCount?: number;
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
  growth: number;
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
  score?: number;
  sales: number; // Alias for revenue
  growth: number; // Growth percentage
  // Additional fields from backend
  totalSales?: number; // Alias for revenue/sales
  totalVolume?: number; // Alias for volume
  totalProfit?: number;
  transactionCount?: number;
}

// =============================================================================
// INVENTORY & DELIVERY TYPES
// =============================================================================

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  capacity?: number;
  currentVolume: number;
  lastUpdated: string;
}

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
}

export interface FuelDelivery {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  volume: number;
  deliveryDate: string;
  supplier?: string;
  createdAt: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  volume: number;
  deliveryDate: string;
  supplier?: string;
}

// =============================================================================
// REPORTS TYPES
// =============================================================================

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
  nozzleName?: string;
  nozzleNumber: number;
  fuelType: string;
  volume: number;
  amount: number;
  paymentMethod: string;
  attendantName?: string;
  attendant?: string; // Alias for attendantName
  pricePerLitre: number;
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  byPaymentMethod?: PaymentMethodBreakdown[];
  byFuelType?: FuelTypeBreakdown[];
  paymentMethodBreakdown?: PaymentMethodBreakdown[]; // Alias
  fuelTypeBreakdown?: FuelTypeBreakdown[]; // Alias
  fuelTypeBreakdown2?: {
    petrol?: { volume: number; revenue: number };
    diesel?: { volume: number; revenue: number };
    premium?: { volume: number; revenue: number };
  };
  paymentMethodBreakdown2?: {
    cash?: number;
    card?: number;
    upi?: number;
    credit?: number;
  };
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
