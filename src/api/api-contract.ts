
// API Contract Types - Temporary stub to fix build errors
export interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
  pumpCount?: number;
  nozzleCount?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface Pump {
  id: string;
  name: string;
  serialNumber?: string;
  status: string;
  stationId: string;
  nozzleCount: number;
}

export interface CreatePumpRequest {
  name: string;
  serialNumber?: string;
  stationId: string;
}

export interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: string;
  status: 'active' | 'maintenance' | 'inactive';
  pumpId: string;
}

export interface CreateNozzleRequest {
  nozzleNumber: number;
  fuelType: string;
  pumpId: string;
}

export interface UpdateNozzleRequest {
  nozzleNumber?: number;
  fuelType?: string;
  status?: string;
}

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

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
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

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  averageTicket: number;
}

export interface PaymentMethodBreakdown {
  cash: number;
  card: number;
  credit: number;
}

export interface FuelTypeBreakdown {
  petrol: number;
  diesel: number;
  premium: number;
}

export interface TopCreditor {
  id: string;
  name: string;
  outstandingAmount: number;
}

export interface DailySalesTrend {
  date: string;
  sales: number;
}

export interface StationMetric {
  stationId: string;
  stationName: string;
  totalSales: number;
  activePumps: number;
  totalPumps: number;
}

export interface Creditor {
  id: string;
  name: string;
  outstandingAmount: number;
}

export interface CreateCreditorRequest {
  name: string;
  contactInfo: string;
}

export interface CreditPayment {
  id: string;
  amount: number;
  date: string;
}

export interface CreatePaymentRequest {
  amount: number;
  creditorId: string;
}

export interface SystemAlert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
}

export interface AttendantStation {
  id: string;
  name: string;
  address: string;
}

export interface AttendantPump {
  id: string;
  name: string;
  status: string;
}

export interface AttendantNozzle {
  id: string;
  nozzleNumber: number;
  fuelType: string;
  status: string;
}

export interface CashReport {
  id: string;
  amount: number;
  date: string;
}

export interface CreateCashReportRequest {
  amount: number;
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
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

export interface CreatePlanRequest {
  name: string;
  features: string[];
  price: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface CreateSuperAdminRequest {
  email: string;
  password: string;
  name: string;
}

export interface SuperAdminSummary {
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface AlertsParams {
  type?: string;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface FuelInventory {
  id: string;
  fuelType: string;
  currentStock: number;
  minimumLevel: number;
}

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
}

export interface FuelPriceValidation {
  isValid: boolean;
  message: string;
}

export interface StationComparison {
  stationId: string;
  name: string;
  sales: number;
  growth: number;
}

export interface HourlySales {
  hour: number;
  sales: number;
}

export interface PeakHour {
  hour: number;
  sales: number;
}

export interface FuelPerformance {
  fuelType: string;
  volume: number;
  revenue: number;
}

export interface StationRanking {
  stationId: string;
  name: string;
  rank: number;
  sales: number;
}

export interface SuperAdminAnalytics {
  totalRevenue: number;
  totalStations: number;
  totalPumps: number;
  activeTenants: number;
}
