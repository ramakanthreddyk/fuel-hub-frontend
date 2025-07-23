export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'owner' | 'manager' | 'attendant' | 'superadmin';
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  stationId?: string;
  stationName?: string;
  status?: 'active' | 'inactive';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'maintenance';
  latitude?: number;
  longitude?: number;
}

export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: 'petrol' | 'diesel';
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel';
  capacity: number;
  currentVolume: number;
  lastUpdated: string;
}

export interface Expense {
  id: string;
  stationId: string;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  expenseType: string;
}

export interface Reading {
  id: string;
  stationId: string;
  pumpId: string;
  fuelType: 'petrol' | 'diesel';
  startReading: number;
  endReading: number;
  readingDate: string;
  createdAt: string;
  updatedAt: string;
  liters?: number;
  amount?: number;
}

export interface Pump {
  id: string;
  stationId: string;
  name: string;
  fuelType: 'petrol' | 'diesel';
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  stationId: string;
  pumpId: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalVolume: number;
  totalSales: number;
  cashSales: number;
  creditSales: number;
  upiSales: number;
  cardSales: number;
  dailyAverage: number;
  monthlyAverage: number;
  reconciliationStatus: 'pending' | 'completed';
}

export interface PaymentMethodBreakdownItem {
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  amount: number;
  percentage: number;
}

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

export interface StationRankingItem {
  stationId: string;
  stationName: string;
  revenue: number;
  volume: number;
  growth: number;
  efficiency: number;
}

export interface StationMetrics {
  id: string;
  name: string;
  todaySales: number;
  monthlySales: number;
  activePumps: number;
  totalPumps: number;
  status: string;
  lastActivity: string;
  efficiency: number;
  salesGrowth: number;
}

export interface Report {
  id: string;
  title: string;
  reportType: string;
  format: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledReport extends Report {
  frequency: string;
  recipients: string[];
  filters: Record<string, any>;
  nextRun: string;
  lastRun: string;
  status: 'active' | 'inactive';
}

export interface ReportExportRequest {
  reportType: string;
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

// Add missing types for reconciliation
export interface ReconciliationSummary {
  totalSales: number;
  totalCash: number;
  totalCredit: number;
  totalExpenses: number;
  netCash: number;
  discrepancy: number;
  reconciliationDate: string;
}

// Add missing types for Payment
export interface Payment {
  id: string;
  creditorId: string;
  creditorName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  notes?: string;
}

// Add missing types for Schedule Report
export interface ScheduleReportRequest {
  reportType: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
}
