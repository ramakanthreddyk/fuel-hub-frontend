
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

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "manager" | "attendant";
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
  password: string;
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
}

// Station Types
export interface Station {
  id: string;
  name: string;
  address: string;
  status: "active" | "inactive" | "maintenance";
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status: "active" | "inactive" | "maintenance";
}

// Pump Types
export interface Pump {
  id: string;
  label: string;
  serialNumber: string;
  status: "active" | "inactive" | "maintenance";
  stationId: string;
}

export interface CreatePumpRequest {
  label: string;
  serialNumber: string;
  status: "active" | "inactive" | "maintenance";
  stationId: string;
}

// Nozzle Types
export interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: "petrol" | "diesel" | "premium";
  status: "active" | "inactive" | "maintenance";
  pumpId: string;
  createdAt: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: "petrol" | "diesel" | "premium";
}

export interface UpdateNozzleRequest {
  status?: "active" | "inactive" | "maintenance";
}

// Reading Types
export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  createdAt: string;
  nozzleNumber?: number;
  fuelType?: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export interface DailyReadingSummary {
  nozzleId: string;
  nozzleNumber: number;
  fuelType: string;
  previousReading: number;
  currentReading: number;
  deltaVolume: number;
  pricePerLitre: number;
  saleValue: number;
  paymentMethod: string;
  cashDeclared: number;
}

// Fuel Price Types
export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: "petrol" | "diesel" | "premium";
  price: number;
  validFrom: string;
  createdAt: string;
  station?: {
    name: string;
  };
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: "petrol" | "diesel" | "premium";
  price: number;
  validFrom: string;
}

// Sales Types
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
  station?: {
    name: string;
  };
  nozzle?: {
    nozzleNumber: number;
  };
}

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
}

// Creditor Types
export interface Creditor {
  id: string;
  partyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  creditLimit?: number;
  outstandingAmount?: number;
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
  notes?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  reference?: string;
  notes?: string;
}

// Attendant-specific types
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
}

export interface AttendantNozzle {
  id: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  pumpId: string;
  pumpLabel: string;
  stationName: string;
}

export interface CashReport {
  id: string;
  stationId: string;
  reportedBy: string;
  cashAmount: number;
  reportDate: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
  createdAt: string;
}

export interface CreateCashReportRequest {
  stationId: string;
  cashAmount: number;
  reportDate: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
}

// Alert/Warning types
export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  stationId?: string;
  nozzleId?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface AlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unacknowledged: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  stationId?: string;
  createdAt: string;
  read: boolean;
}

export interface AlertsParams {
  stationId?: string;
  unreadOnly?: boolean;
}

// Fuel Price Validation
export interface FuelPriceValidation {
  stationId: string;
  missingFuelTypes: ('petrol' | 'diesel' | 'premium')[];
  outdatedPrices: FuelPrice[];
  hasActivePrices: boolean;
}

// Dashboard Types
export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  cashSales: number;
  creditSales: number;
  growthPercentage: number;
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
}

export interface TopCreditor {
  id: string;
  name: string;
  outstandingAmount: number;
  creditLimit: number;
  utilizationPercentage: number;
}

export interface DailySalesTrend {
  date: string;
  revenue: number;
  volume: number;
  salesCount: number;
}

export interface StationMetric {
  id: string;
  name: string;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
  activePumps: number;
  totalPumps: number;
  status: string;
}

// Reports Types
export interface SalesReportFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
  fuelType?: string;
  paymentMethod?: string;
}

export interface SalesReportData {
  id: string;
  date: string;
  stationName: string;
  nozzleNumber: number;
  fuelType: string;
  volume: number;
  pricePerLiter: number;
  totalAmount: number;
  paymentMethod: string;
  creditorName?: string;
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalVolume: number;
  averagePrice: number;
  salesCount: number;
  paymentMethodBreakdown: Record<string, number>;
  fuelTypeBreakdown: Record<string, { volume: number; revenue: number }>;
}

export interface SalesReportExportFilters {
  stationId?: string;
  dateFrom: string;
  dateTo: string;
  fuelType?: string;
  paymentMethod?: string;
  format: 'csv' | 'excel' | 'pdf';
}

export interface ExportReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
}

export interface ScheduleReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  schedule: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
}

// Analytics Types
export interface StationComparison {
  stationId: string;
  stationName: string;
  revenue: number;
  volume: number;
  salesCount: number;
  averageTicketSize: number;
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
}

export interface PeakHour {
  hour: number;
  averageRevenue: number;
  averageVolume: number;
  averageSalesCount: number;
}

export interface FuelPerformance {
  fuelType: string;
  volume: number;
  revenue: number;
  margin: number;
  salesCount: number;
}

export interface StationRanking {
  rank: number;
  stationId: string;
  stationName: string;
  revenue: number;
  volume: number;
  salesCount: number;
  score: number;
}

export interface SuperAdminAnalytics {
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
  }>;
}

// Inventory Types
export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
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
  stationName: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  quantity: number;
  deliveryDate: string;
  supplierName: string;
  invoiceNumber: string;
  pricePerLiter: number;
  totalAmount: number;
  createdAt: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  quantity: number;
  deliveryDate: string;
  supplierName: string;
  invoiceNumber: string;
  pricePerLiter: number;
}

// Reconciliation Types
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
}

export interface CreateReconciliationRequest {
  stationId: string;
  reconciliationDate: string;
  declaredCash: number;
  notes?: string;
}

// Tenant Management Types (SuperAdmin)
export interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'cancelled';
  planId: string;
  planName: string;
  createdAt: string;
  users: User[];
  stations: Station[];
  userCount: number;
  stationCount: number;
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

export interface TenantDetailsResponse {
  tenant: Tenant;
  users: User[];
  stations: Station[];
}

// Plan Management Types (SuperAdmin)
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxStations: number;
  maxUsers: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  features: string[];
  maxStations: number;
  maxUsers: number;
}

// SuperAdmin User Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin';
  createdAt: string;
  lastLoginAt?: string;
}

export interface SuperAdminSummary {
  tenantCount: number;
  activeTenantCount: number;
  planCount: number;
  adminCount: number;
  totalUsers: number;
  totalStations: number;
  signupsThisMonth: number;
  recentTenants: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
  tenantsByPlan: Array<{
    planName: string;
    count: number;
  }>;
}

/*
BACKEND API REQUIREMENTS - Please implement these endpoints:

1. ATTENDANT ENDPOINTS:
   GET /api/v1/attendant/stations - Get stations assigned to current attendant
   GET /api/v1/attendant/pumps?stationId={id} - Get pumps for assigned stations
   GET /api/v1/attendant/nozzles?pumpId={id} - Get nozzles for assigned pumps
   GET /api/v1/attendant/creditors?stationId={id} - Get creditors for assigned stations
   POST /api/v1/attendant/cash-reports - Submit cash report
   GET /api/v1/attendant/cash-reports - Get cash reports with filters
   GET /api/v1/attendant/alerts - Get system alerts for attendant
   PUT /api/v1/attendant/alerts/{id}/acknowledge - Acknowledge alert

2. FUEL PRICE VALIDATION ENDPOINTS:
   GET /api/v1/fuel-prices/validate/{stationId} - Check missing fuel prices for station
   GET /api/v1/fuel-prices/missing - Get all stations with missing prices
   GET /api/v1/nozzle-readings/can-create/{nozzleId} - Check if reading can be created

3. SYSTEM ALERTS ENDPOINTS:
   GET /api/v1/alerts/summary - Get alert counts by priority
   POST /api/v1/alerts - Create system alert
   
4. ALERT SCENARIOS TO IMPLEMENT:
   - No reading recorded for nozzle in 24+ hours (priority: medium)
   - No fuel price set for active nozzle (priority: high)
   - Creditor exceeding 90% of credit limit (priority: high)
   - Station inactive for 24+ hours (priority: medium)
   - Pump maintenance overdue (priority: low)
   - Large volume discrepancy in readings (priority: critical)
   - Cash report not submitted for shift (priority: medium)

5. VALIDATION RULES:
   - Prevent reading creation if no fuel price exists for nozzle fuel type
   - Prevent sale calculation if fuel price is older than 7 days
   - Warn if creditor approaching credit limit
*/
