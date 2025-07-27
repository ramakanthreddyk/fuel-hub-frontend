// Base Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

// Auth Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
}

// Station Types
export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  tenantId?: string;
  activePumps?: number;
  totalPumps?: number;
  todaySales?: number;
  monthlySales?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status?: 'active' | 'inactive' | 'maintenance';
}

// Fuel Types
export interface Fuel {
  id: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  stationId?: string;
}

export interface CreateFuelRequest {
  name: string;
  type: string;
  price: number;
  unit: string;
  stationId?: string;
}

export interface UpdateFuelRequest {
  name?: string;
  type?: string;
  price?: number;
  unit?: string;
}

// Pump Types
export interface Pump {
  id: string;
  name: string;
  stationId: string;
  nozzles: Nozzle[];
}

export interface CreatePumpRequest {
  name: string;
  stationId: string;
}

export interface UpdatePumpRequest {
  name?: string;
}

// Nozzle Types
export interface Nozzle {
  id: string;
  number: number;
  fuelType: string;
  pumpId: string;
  lastReading: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface CreateNozzleRequest {
  number: number;
  fuelType: string;
  pumpId: string;
  lastReading: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateNozzleRequest {
  number?: number;
  fuelType?: string;
  lastReading?: number;
  status?: 'active' | 'inactive' | 'maintenance';
}

// Creditor Types
export interface Creditor {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  availableCredit: number;
  tenantId?: string;
}

export interface CreateCreditorRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
}

// Payment Types
export interface PaymentMethodData {
  paymentMethod: string;
  amount: number;
  percentage: string;
}

// Sales Trend Types
export interface SalesTrendData {
  date: string;
  amount: number;
  volume: number;
}

// Dashboard and Analytics Types
export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  growthPercentage: number;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  amount: number;
  percentage: string;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  amount: number;
  percentage: string;
}

export interface DailySalesTrend {
  date: string;
  amount: number;
  volume: number;
}

export interface StationMetric {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  activePumps: number;
  totalPumps: number;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
}

export interface TopCreditor {
  id: string;
  name: string;
  totalCredit: number;
  pendingAmount: number;
  lastPayment: string;
}

// Sales and Reports Types
export interface SalesReportFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  fuelType?: string;
  paymentMethod?: string;
}

export interface SalesReportData {
  date: string;
  stationName: string;
  fuelType: string;
  volume: number;
  amount: number;
  paymentMethod: string;
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalVolume: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface ExportRequest {
  format: 'csv' | 'pdf' | 'excel';
  filters: SalesReportFilters;
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
}

// Alert Types
export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  stationId?: string;
}

export interface AlertsParams {
  type?: string;
  acknowledged?: boolean;
  stationId?: string;
}

export interface AlertSummary {
  total: number;
  unacknowledged: number;
  byType: Record<string, number>;
}

// Inventory Types
export interface FuelInventory {
  id: string;
  stationId: string;
  fuelType: string;
  currentStock: number;
  capacity: number;
  lastUpdated: string;
}

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
}

// Reconciliation Types
export interface ReconciliationSummary {
  totalSales: number;
  totalReadings: number;
  difference: number;
  status: 'pending' | 'completed' | 'discrepancy';
}

export interface CreateReconciliationRequest {
  stationId: string;
  date: string;
  readings: Array<{
    nozzleId: string;
    reading: number;
  }>;
}

export interface DailyReadingSummary {
  date: string;
  totalReadings: number;
  reconciled: boolean;
}

// Analytics Types
export interface StationComparison {
  stationId: string;
  stationName: string;
  sales: number;
  volume: number;
  growth: number;
}

export interface HourlySales {
  hour: number;
  sales: number;
  volume: number;
}

export interface PeakHour {
  hour: number;
  sales: number;
  day: string;
}

export interface FuelPerformance {
  fuelType: string;
  sales: number;
  volume: number;
  margin: number;
}

export interface StationRanking {
  stationId: string;
  stationName: string;
  rank: number;
  sales: number;
  performance: number;
}

export interface SuperAdminAnalytics {
  totalRevenue: number;
  totalTenants: number;
  activeStations: number;
  growthRate: number;
}

// Attendant Types
export interface AttendantStation {
  id: string;
  name: string;
  pumps: AttendantPump[];
}

export interface AttendantPump {
  id: string;
  name: string;
  nozzles: AttendantNozzle[];
}

export interface AttendantNozzle {
  id: string;
  number: number;
  fuelType: string;
  currentReading: number;
  status: 'active' | 'inactive' | 'maintenance';
}

// Superadmin Types
export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  permissions: string[];
}

export interface SuperAdminSummary {
  totalTenants: number;
  totalStations: number;
  totalRevenue: number;
  activeUsers: number;
}

// Tenant Types
export interface TenantDetailsResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  planId: string;
  createdAt: string;
}

export interface UpdateTenantRequest {
  name?: string;
  email?: string;
  phone?: string;
  planId?: string;
}

export interface UpdateTenantStatusRequest {
  status: 'active' | 'inactive' | 'suspended';
  reason?: string;
}

// Creditor Types
export interface UpdateCreditorRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  creditLimit?: number;
}

export interface CreateCreditPaymentRequest {
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  notes?: string;
}

// Validation Types
export interface FuelPriceValidation {
  fuelType: string;
  price: number;
  isValid: boolean;
  message?: string;
}

// Schedule Report Types
export interface ScheduleReportRequest {
  reportType: string;
  schedule: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  filters: SalesReportFilters;
}

export interface SalesReportExportFilters extends SalesReportFilters {
  format: 'csv' | 'pdf' | 'excel';
}

// Sale Types
export interface Sale {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  amount: number;
  volume: number;
  fuelType: string;
  paymentMethod: string;
  attendantId?: string;
  customerId?: string;
  nozzleId?: string;
}

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  fuelType?: string;
  paymentMethod?: string;
}
