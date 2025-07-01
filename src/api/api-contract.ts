
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
  pumps?: Pump[];
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status?: 'active' | 'inactive' | 'maintenance'; // Made optional with default 'active'
}

// Pump Types
export interface Pump {
  id: string;
  label: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  stationId: string;
  nozzleCount?: number;
  nozzles?: Nozzle[];
}

export interface CreatePumpRequest {
  label: string;
  serialNumber: string;
  status?: 'active' | 'inactive' | 'maintenance'; // Made optional with default 'active'
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
  status?: 'active' | 'inactive' | 'maintenance'; // Made optional with default 'active'
}

export interface UpdateNozzleRequest {
  status?: "active" | "inactive" | "maintenance";
  nozzleNumber?: number;
  fuelType?: 'petrol' | 'diesel' | 'premium';
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
  // Additional fields from backend
  volume?: number;
  amount?: number;
  pricePerLitre?: number;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt?: string; // Made optional, defaults to current time
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
  stationName?: string;
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom?: string; // Made optional, defaults to current date
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
  dateFrom?: string; // Alternative naming
  dateTo?: string; // Alternative naming
}

// Creditor Types
export interface Creditor {
  id: string;
  partyName: string;
  name?: string; // Alias for partyName
  contactPerson?: string;
  phoneNumber?: string;
  creditLimit?: number;
  outstandingAmount: number;
  currentOutstanding?: number; // Alias for outstandingAmount
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
  paymentDate?: string; // Made optional, defaults to current date
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
  reportedByName?: string; // Additional field for user display name
  cashAmount: number;
  reportDate: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
  createdAt: string;
  status?: 'submitted' | 'approved' | 'rejected'; // Additional status field
}

export interface CreateCashReportRequest {
  stationId: string;
  cashAmount: number;
  reportDate?: string; // Made optional, defaults to current date
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
  stationName?: string; // Additional field for station name
  nozzleId?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  isActive?: boolean; // Additional field for alert status
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
  priority?: 'low' | 'medium' | 'high' | 'critical';
  type?: 'warning' | 'error' | 'info';
}

// Fuel Price Validation
export interface FuelPriceValidation {
  stationId: string;
  stationName?: string; // Additional field
  missingFuelTypes: ('petrol' | 'diesel' | 'premium')[];
  outdatedPrices: FuelPrice[];
  hasActivePrices: boolean;
  lastUpdated?: string; // Additional field
}

// Dashboard Types
export interface SalesSummary {
  totalRevenue: number;
  totalSales?: number; // Alias for totalRevenue
  totalVolume: number;
  salesCount: number;
  transactionCount?: number; // Alias for salesCount
  averageTicketSize: number;
  cashSales: number;
  creditSales: number;
  growthPercentage: number;
  totalProfit?: number;
  profitMargin?: number;
  period?: string; // Additional field to indicate the period
  previousPeriodRevenue?: number; // For growth calculation
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
  averagePrice?: number; // Additional field
}

export interface TopCreditor {
  id: string;
  name: string;
  partyName?: string; // Alias for name
  outstandingAmount: number;
  creditLimit: number;
  utilizationPercentage: number;
  lastPaymentDate?: string; // Additional field
}

export interface DailySalesTrend {
  date: string;
  revenue: number;
  amount?: number; // Alias for revenue
  volume: number;
  salesCount: number;
  dayOfWeek?: string; // Additional field
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
  lastActivity?: string; // Additional field
  efficiency?: number; // Additional field (sales per pump)
}

// Reports Types
export interface SalesReportFilters extends SalesFilters {
  startDate?: string;
  endDate?: string;
  fuelType?: string;
  groupBy?: 'day' | 'week' | 'month'; // Additional grouping option
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
  attendantName?: string; // Additional field
  pumpLabel?: string; // Additional field
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalVolume: number;
  averagePrice: number;
  salesCount: number;
  paymentMethodBreakdown: Record<string, number>;
  fuelTypeBreakdown: Record<string, { volume: number; revenue: number }>;
  period?: string; // Additional field
  generatedAt?: string; // Additional field
}

export interface SalesReportExportFilters {
  stationId?: string;
  dateFrom: string;
  dateTo: string;
  fuelType?: string;
  paymentMethod?: string;
  format: 'csv' | 'excel' | 'pdf';
  includeDetails?: boolean; // Additional option
}

export interface ExportReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  type?: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
  includeCharts?: boolean; // Additional option
}

export interface ScheduleReportRequest {
  reportType: 'sales' | 'inventory' | 'reconciliation';
  type?: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
  schedule: 'daily' | 'weekly' | 'monthly';
  frequency?: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  startDate?: string; // When to start the scheduled reports
}

// Analytics Types
export interface StationComparison {
  stationId: string;
  stationName: string;
  revenue: number;
  volume: number;
  salesCount: number;
  averageTicketSize: number;
  efficiency?: number; // Additional field
}

export interface StationComparisonParams {
  stationIds: string[];
  period?: string;
  dateFrom?: string; // Additional filter
  dateTo?: string; // Additional filter
}

export interface HourlySales {
  hour: number;
  revenue: number;
  volume: number;
  salesCount: number;
  averageTicketSize?: number; // Additional field
}

export interface PeakHour {
  hour: number;
  timeRange?: string;
  averageRevenue: number;
  avgSales?: number;
  averageVolume: number;
  averageSalesCount: number;
  dayOfWeek?: string; // Additional field
}

export interface FuelPerformance {
  fuelType: string;
  volume: number;
  revenue: number;
  margin: number;
  salesCount: number;
  averagePrice?: number; // Additional field
  marketShare?: number; // Additional field (percentage of total volume)
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
  region?: string; // Additional field for geographical grouping
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
    growth?: number; // Additional field
  }>;
  systemHealth?: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  }; // Additional system metrics
}

// Inventory Types
export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  currentVolume: number;
  lastUpdated: string;
  minimumLevel?: number; // Additional field for inventory alerts
  maximumCapacity?: number; // Additional field
  status?: 'normal' | 'low' | 'critical' | 'overstocked'; // Additional status field
}

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
  status?: 'normal' | 'low' | 'critical' | 'overstocked'; // Additional filter
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
  status?: 'pending' | 'delivered' | 'confirmed'; // Additional status field
  receivedBy?: string; // Who received the delivery
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  quantity: number;
  volume?: number;
  deliveryDate?: string; // Made optional, defaults to current date
  supplierName: string;
  deliveredBy?: string;
  invoiceNumber: string;
  pricePerLiter: number;
  receivedBy?: string; // Additional field
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
  reconciliationBy?: string; // Who performed the reconciliation
  approvedBy?: string; // Who approved the reconciliation
  approvedAt?: string; // When it was approved
}

export interface CreateReconciliationRequest {
  stationId: string;
  reconciliationDate?: string; // Made optional, defaults to current date
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
  users?: User[];
  stations?: Station[];
  lastActivity?: string; // Additional field
  billingStatus?: 'current' | 'overdue' | 'suspended'; // Additional field
}

export interface CreateTenantRequest {
  name: string;
  planId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  adminName?: string; // Alternative naming
  adminEmail?: string; // Alternative naming
  adminPassword?: string; // Alternative naming
}

export interface UpdateTenantStatusRequest {
  status: 'active' | 'suspended' | 'cancelled';
  reason?: string; // Additional field for status change reason
}

export interface TenantDetailsResponse {
  tenant: Tenant;
  users: User[];
  stations: Station[];
  summary: {
    totalRevenue: number;
    totalSales: number;
    activeUsers: number;
    activeStations: number;
  }; // Additional summary stats
}

// Plan Management Types (SuperAdmin)
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceMonthly?: number; // Alias for price
  priceYearly?: number;
  maxStations: number;
  maxUsers: number;
  maxPumpsPerStation?: number;
  maxNozzlesPerPump?: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  tenantCount?: number; // How many tenants are using this plan
  isPopular?: boolean; // Marketing flag
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
  isActive?: boolean; // Made optional, defaults to true
}

// SuperAdmin User Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin';
  createdAt: string;
  lastLogin?: string;
  isActive?: boolean; // Additional field
  permissions?: string[]; // Additional field for granular permissions
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  permissions?: string[]; // Additional field
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
  systemMetrics?: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeConnections: number;
  }; // Additional system health metrics
}
