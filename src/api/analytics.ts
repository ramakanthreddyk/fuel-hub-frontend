
import { apiClient } from './client';

export interface SuperAdminAnalytics {
  totalTenants: number;
  activeTenants: number;
  totalStations: number;
  salesVolume: number;
  totalRevenue: number;
  topTenants: {
    id: string;
    name: string;
    revenue: number;
    stationsCount: number;
  }[];
  monthlyGrowth: {
    month: string;
    tenants: number;
    revenue: number;
  }[];
}

export const analyticsApi = {
  getSuperAdminAnalytics: async (): Promise<SuperAdminAnalytics> => {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  }
};
