
import { apiClient, extractApiData, extractApiArray } from './client';

export interface DashboardMetrics {
  totalStations: number;
  activePumps: number;
  todaysSales: number;
  totalRevenue: number;
  fuelInventory: number;
  activeAlerts: number;
  averagePrice: number;
  salesGrowth: number;
}

export interface SalesTrend {
  date: string;
  sales: number;
  revenue: number;
}

export interface FuelBreakdown {
  fuelType: string;
  volume: number;
  revenue: number;
  percentage: number;
}

export interface TopCreditor {
  id: string;
  name: string;
  totalDebt: number;
  lastPayment: string;
  status: 'active' | 'overdue' | 'settled';
}

export interface RecentSale {
  id: string;
  stationName: string;
  fuelType: string;
  quantity: number;
  amount: number;
  timestamp: string;
  attendant: string;
}

export class DashboardApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'DashboardApiError';
  }
}

/**
 * Fetch dashboard metrics
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const response = await apiClient.get('/dashboard/metrics');
    return extractApiData<DashboardMetrics>(response);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard metrics';
    throw new DashboardApiError(errorMessage, error.response?.status);
  }
};

/**
 * Fetch sales trend data
 */
export const getSalesTrend = async (days: number = 7): Promise<SalesTrend[]> => {
  try {
    const response = await apiClient.get(`/dashboard/sales-trend?days=${days}`);
    return extractApiArray<SalesTrend>(response);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch sales trend';
    throw new DashboardApiError(errorMessage, error.response?.status);
  }
};

/**
 * Fetch fuel breakdown data
 */
export const getFuelBreakdown = async (): Promise<FuelBreakdown[]> => {
  try {
    const response = await apiClient.get('/dashboard/fuel-breakdown');
    return extractApiArray<FuelBreakdown>(response);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch fuel breakdown';
    throw new DashboardApiError(errorMessage, error.response?.status);
  }
};

/**
 * Fetch top creditors
 */
export const getTopCreditors = async (limit: number = 5): Promise<TopCreditor[]> => {
  try {
    const response = await apiClient.get(`/dashboard/top-creditors?limit=${limit}`);
    return extractApiArray<TopCreditor>(response);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch top creditors';
    throw new DashboardApiError(errorMessage, error.response?.status);
  }
};

/**
 * Fetch recent sales
 */
export const getRecentSales = async (limit: number = 10): Promise<RecentSale[]> => {
  try {
    const response = await apiClient.get(`/dashboard/recent-sales?limit=${limit}`);
    return extractApiArray<RecentSale>(response);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch recent sales';
    throw new DashboardApiError(errorMessage, error.response?.status);
  }
};
