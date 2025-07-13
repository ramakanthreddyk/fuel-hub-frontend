/**
 * FuelSync Hub - API Contract Updates
 * 
 * This file contains updates to align the frontend API contract with the backend OpenAPI specification.
 * Add these interfaces to api-contract.ts or update existing ones.
 */

// Analytics Types
export interface StationComparison {
  id: string;
  stationName: string;
  sales: number;
  volume: number;
  transactions: number;
  growth: number;
}

export interface HourlySales {
  hour: string;
  sales: number;
  volume: number;
  transactions: number;
}

export interface PeakHour {
  timeRange: string;
  avgSales: number;
  avgVolume: number;
}

export interface FuelPerformance {
  fuelType: string;
  volume: number;
  sales: number;
  margin: number;
  growth: number;
}

// Dashboard Types
export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  totalProfit?: number;
  profitMargin?: number;
  period?: string;
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
  partyName: string;
  outstandingAmount: number;
  creditLimit?: number;
}

export interface DailySalesTrend {
  date: string;
  amount: number;
  volume: number;
}

export interface StationMetric {
  id: string;
  name: string;
  status: string;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
  activePumps: number;
  totalPumps: number;
  lastActivity?: string;
  efficiency?: number;
}

export interface SystemHealth {
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  dbHealthy: boolean;
}

// Reconciliation Types
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
}

// Reports Types
export interface SalesReportData {
  id: string;
  date: string;
  fuelType: string;
  volume: number;
  pricePerLitre: number;
  amount: number;
  paymentMethod: string;
  attendant: string;
  stationName: string;
  nozzleNumber: number;
}

export interface SalesReportSummary {
  totalVolume: number;
  totalRevenue: number;
  fuelTypeBreakdown: {
    petrol?: { volume: number; revenue: number };
    diesel?: { volume: number; revenue: number };
    premium?: { volume: number; revenue: number };
  };
  paymentMethodBreakdown: {
    cash?: number;
    card?: number;
    upi?: number;
    credit?: number;
  };
}

// Fuel Inventory Types
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

// Alert Types
export interface Alert {
  id: string;
  type: 'inventory' | 'credit' | 'maintenance' | 'sales' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface CreateAlertRequest {
  stationId?: string;
  alertType: string;
  message: string;
  severity?: 'info' | 'warning' | 'critical';
}

// Payment Method Standardization
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check' | 'cheque';