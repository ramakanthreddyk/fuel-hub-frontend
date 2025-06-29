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
  role: 'superadmin' | 'owner' | 'manager' | 'attendant';
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
  newPassword?: string;
  token?: string;
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  role?: 'superadmin';
}

// Station Types
export interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  // Metrics (optional when includeMetrics=true)
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
  metrics?: {
    totalSales: number;
    activePumps: number;
    totalPumps: number;
    totalVolume?: number;
    transactionCount?: number;
  };
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
}

// Pump Types
export interface Pump {
  id: string;
  label: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  stationId: string;
  nozzleCount?: number;
}

export interface CreatePumpRequest {
  label: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  stationId: string;
}

// Nozzle Types
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
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom: string;
  createdAt: string;
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
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
  paymentMethod?: string;
}

// Creditor Types
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
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  reference?: string;
  referenceNumber?: string;
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
  severity?: 'low' | 'medium' | 'high' | 'critical'; // Alias for priority
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  nozzleId?: string;
  createdAt: string;
  read: boolean;
  isRead?: boolean; // Alias for read
  isActive?: boolean; // Default true for active alerts
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
  paymentMethod?: string; // Alias for method
  amount: number;
  percentage: number;
  count: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  revenue: number;
  amount?: number; // Alias for revenue
  percentage: number;
}

export interface TopCreditor {
  id: string;
  name: string;
  partyName?: string; // Alias for name
  outstandingAmount: number;
  creditLimit: number;
  utilizationPercentage: number;
}

export interface DailySalesTrend {
  date: string;
  revenue: number;
  amount?: number; // Alias for revenue
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
  status: "active" | "inactive" | "maintenance";
}

// Reports Types
export interface SalesReportFilters extends SalesFilters {
  startDate?: string;
  endDate?: string;
  fuelType?: string;
}

export interface SalesReportData {
  id: string;
  date: string;
  stationName: string;
  nozzleNumber: number;
  fuelType: string;
  volume: number;
  pricePerLiter: number;
  pricePerLitre?: number;
  totalAmount: number;
  amount?: number;
  paymentMethod: string;
  creditorName?: string;
  attendant?: string;
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
  type?: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
}

export interface ScheduleReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  type?: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  schedule: 'daily' | 'weekly' | 'monthly';
  frequency?: 'daily' | 'weekly' | 'monthly';
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
  timeRange?: string;
  averageRevenue: number;
  avgSales?: number;
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
  id?: string;
  stationName: string;
  name?: string;
  revenue: number;
  sales?: number;
  volume: number;
  salesCount: number;
  score: number;
  growth?: number;
  efficiency?: number;
}

export interface SuperAdminAnalytics {
  totalTenants: number;
  activeTenants: number;
  totalStations: number;
  totalRevenue: number;
  salesVolume?: number;
  revenueGrowth: number;
  monthlyGrowth?: any[];
  topTenants?: Array<{
    id: string;
    name: string;
    revenue: number;
    stationsCount: number;
  }>;
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
  volume?: number;
  deliveryDate: string;
  supplierName: string;
  deliveredBy?: string;
  invoiceNumber: string;
  pricePerLiter: number;
  totalAmount: number;
  createdAt: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  quantity: number;
  volume?: number;
  deliveryDate: string;
  supplierName: string;
  deliveredBy?: string;
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
  date?: string;
  declaredCash: number;
  totalExpected?: number;
  cashReceived?: number;
  reconciliationNotes?: string;
  managerConfirmation?: boolean;
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
  maxStations: number;
  maxUsers: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  maxStations: number;
  maxUsers: number;
  features: string[];
}

// SuperAdmin User Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin';
  createdAt: string;
  lastLogin?: string;
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
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
    status?: string;
  }>;
  tenantsByPlan: Array<{
    planName: string;
    count: number;
    percentage?: number;
  }>;
}
