// Common status type for stations, pumps, nozzles, attendants
export type EntityStatus = "active" | "inactive" | "maintenance";
// Backward compatibility
export type StationStatus = EntityStatus;
// User type (frontend mirror of backend ExtendedUser)
export interface User {
  id: string;
  userId: string;
  email: string;
  name?: string;
  planName?: string;
  tenantId?: string | null;
  role: string;
}
// Error and validation responses
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Alert actions
export interface MarkAlertReadRequest {
  alertId: string;
}

export interface MarkAlertReadResponse {
  success: boolean;
  alertId: string;
  readAt: string;
}

export interface DismissAlertRequest {
  alertId: string;
}

export interface DismissAlertResponse {
  success: boolean;
  alertId: string;
  dismissedAt: string;
}

// Onboarding
export interface OnboardingStatus {
  completed: boolean;
  currentStep: string;
  steps: string[];
}

export interface OnboardingReminder {
  id: string;
  message: string;
  completed: boolean;
}

export interface CompleteReminderRequest {
  reminderId: string;
}

export interface CompleteReminderResponse {
  success: boolean;
  reminderId: string;
  completedAt: string;
}

// Reconciliation diff
export interface ReconciliationDiff {
  id: string;
  stationId: string;
  date: string;
  type: string;
  description: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface ReconciliationDiffSummary {
  total: number;
  unresolved: number;
  byType: Record<string, number>;
}
export interface UpdateTenantRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  planId?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
export interface SalesReportFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
  fuelType?: string;
  paymentMethod?: string;
  attendantId?: string;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SalesReportData {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: string;
  volume: number;
  amount: number;
  paymentMethod: string;
  date: string;
  attendantId?: string;
  attendantName?: string;
}

export interface ExportRequest {
  reportType: string;
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
}

export interface ExportResponse {
  success: boolean;
  url: string;
  message?: string;
}
export interface CreateCreditorRequest {
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit: number;
  paymentTerms?: string;
  notes?: string;
}

export interface UpdateCreditorRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
}
export interface HourlySales {
  hour: string;
  sales: number;
  volume: number;
}

export interface PeakHour {
  hour: string;
  sales: number;
  volume: number;
}

export interface FuelPerformance {
  fuelType: string;
  sales: number;
  volume: number;
}

export interface StationRanking {
  stationId: string;
  stationName: string;
  rank: number;
  sales: number;
  volume: number;
}

export interface Alert {
  id: string;
  stationId?: string;
  alertType: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
  error?: string;
}

export interface Station {
  id: string;
  name: string;
  ownerId: string;
  tenantId: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  contactNumber: string;
  email: string;
  status: EntityStatus;
  pumps: Pump[];
  nozzles: Nozzle[];
  createdAt: string;
  updatedAt: string;
}

export interface Pump {
  id: string;
  stationId: string;
  name: string;
  status: EntityStatus;
  nozzles: Nozzle[];
  createdAt: string;
  updatedAt: string;
}

export interface Nozzle {
  id: string;
  pumpId: string;
  stationId: string;
  name: string;
  fuelType: string;
  status: EntityStatus;
  currentReading: number;
  lastReading: number;
  createdAt: string;
  updatedAt: string;
}

export interface Fuel {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Creditor {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  nozzleId: string;
  nozzleName: string;
  stationId: string;
  stationName: string;
  pumpId: string;
  pumpName: string;
  volume: number;
  fuelType: string;
  fuelPrice: number;
  amount: number;
  paymentMethod: string;
  creditorId?: string;
  creditorName?: string;
  date: string;
  time: string;
  attendantId: string;
  attendantName: string;
  shiftId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shift {
  id: string;
  stationId: string;
  attendantId: string;
  startTime: string;
  endTime?: string;
  startReading: number;
  endReading?: number;
  totalSales?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  stationId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  stationId: string;
  fuelType: string;
  openingStock: number;
  receivedStock: number;
  closingStock: number;
  sales: number;
  wastage?: number;
  price: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  growthPercentage: number;
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

export interface TopCreditor {
  id: string;
  name: string;
  currentBalance: number;
}

export interface DailySalesTrend {
  date: string;
  amount: number;
  volume: number;
}

export interface StationMetric {
  id: string;
  name: string;
  status: StationStatus;
  activePumps: number;
  totalPumps: number;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
}

export interface TodaysSalesSummary {
  totalAmount: number;
  totalVolume: number;
  totalEntries: number;
  paymentBreakdown: {
    cash: number;
    card: number;
    upi: number;
    credit: number;
  };
  salesByFuel: {
    fuel_type: string;
    total_amount: number;
    total_volume: number;
  }[];
  salesByStation: {
    station_id: string;
    total_amount: number;
    total_volume: number;
  }[];
}

export interface PaymentMethodData {
  paymentMethod: string;
  totalAmount: number;
  transactionCount: number;
}

export interface SalesTrendData {
  date: string;
  totalAmount: number;
}

export interface FuelSalesData {
  fuelType: string;
  totalVolume: number;
  totalAmount: number;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
}

export interface AlertsParams {
  page?: number;
  limit?: number;
  type?: string;
  unreadOnly?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface FuelPrice {
  id: string;
  fuelType: string;
  price: number;
  effectiveDate: string;
  stationId?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFuelPriceRequest {
  fuelType: string;
  price: number;
  effectiveDate: string;
  stationId?: string;
}

export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  previousReading?: number;
  difference?: number;
  recordedAt: string;
  recordedBy: string;
  stationId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
}

export interface CashReport {
  id: string;
  tenantId: string;
  stationId: string;
  stationName?: string;
  userId: string;
  userName?: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  creditAmount: number;
  totalAmount: number;
  notes?: string;
  status: 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCashReportRequest {
  stationId: string;
  cashAmount: number;
  cardAmount?: number;
  upiAmount?: number;
  creditAmount?: number;
  creditorId?: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
  date?: string;
  reportDate?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  planId?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  plan?: {
    id: string;
    name: string;
    maxStations: number;
    priceMonthly: number;
  };
  usage?: {
    currentStations: number;
    totalUsers: number;
    userBreakdown: {
      owners: number;
      managers: number;
      attendants: number;
    };
    reports: {
      today: number;
      thisMonth: number;
    };
  };
  lastActivity?: string;
  planLimits?: {
    tierName: string;
    reportsEnabled: boolean;
    maxRecords: number;
    maxDaily: number;
    formats: string[];
    features: string[];
  };
}

export interface CreateTenantRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  planId: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxStations: number;
  maxUsers: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  features: string[];
  maxStations: number;
  maxUsers: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: 'superadmin' | 'owner' | 'manager' | 'attendant';
  stationId?: string;
}

export interface CreditPayment {
  id: string;
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  paymentDate: string;
  reference: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  paymentDate: string;
  reference: string;
  notes?: string;
}

export interface ReconciliationRecord {
  id: string;
  stationId: string;
  date: string;
  expectedSales: number;
  actualSales: number;
  difference: number;
  status: 'pending' | 'resolved' | 'discrepancy';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StationComparison {
  stationId: string;
  stationName: string;
  sales: number;
  volume: number;
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

export interface SuperAdminSummary {
  totalTenants: number;
  totalStations: number;
  totalRevenue: number;
  activeUsers: number;
  activeTenants: number;
  activeTenantCount: number;
  tenantCount: number;
  monthlyGrowth: number;
  adminCount: number;
  planCount: number;
  totalUsers: number;
  signupsThisMonth: number;
  recentTenants: any[];
  alerts: any[];
  tenantsByPlan: any[];
}

// Attendant-specific types
export interface AttendantStation {
  id: string;
  name: string;
  address: string;
  status: EntityStatus;
}

export interface AttendantPump {
  id: string;
  stationId: string;
  name: string;
  status: EntityStatus;
}

export interface AttendantNozzle {
  id: string;
  pumpId: string;
  stationId: string;
  name: string;
  fuelType: string;
  status: EntityStatus;
}

export interface AlertSummary {
  total: number;
  unread: number;
  byType: {
    info: number;
    warning: number;
    error: number;
    success: number;
  };
}

export interface SuperAdminAnalytics {
  tenantCount: number;
  activeTenantCount: number;
  totalUsers: number;
  totalStations: number;
  activeStations: number;
  signupsThisMonth: number;
  tenantsByPlan: any[];
  recentTenants: any[];
  growthRate: number;
  overview: {
    totalTenants: number;
    totalRevenue: number;
    totalStations: number;
    growth: number;
  };
  trends: any[];
  topTenants: any[];
}

export interface SalesReportSummary {
  totalAmount: number;
  totalVolume: number;
  salesCount: number;
  averagePerSale: number;
  growthPercentage: number;
  periodStart: string;
  periodEnd: string;
}
