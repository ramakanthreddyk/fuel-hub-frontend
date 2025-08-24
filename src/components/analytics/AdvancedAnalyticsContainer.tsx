import React from 'react';
import { useHourlySales, useFuelPerformance } from '@/hooks/useAnalytics';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { useAuth } from '@/contexts/AuthContext';

interface AdvancedAnalyticsContainerProps {
  stationId: string;
}

export function AdvancedAnalyticsContainer({ stationId }: AdvancedAnalyticsContainerProps) {
  const { user } = useAuth();
  
  // Use the proper hooks with role-based restrictions
  const { data: hourlySales = [], isLoading: hourlySalesLoading } = useHourlySales(stationId);
  const { data: fuelPerformance = [], isLoading: fuelPerformanceLoading } = useFuelPerformance(stationId);
  
  const isLoading = hourlySalesLoading || fuelPerformanceLoading;
  
  // Check if user has permission to view analytics
  const hasAnalyticsPermission = user?.role === 'owner' || user?.role === 'manager';
  
  if (!hasAnalyticsPermission) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>Analytics features require owner or manager permissions.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <FuelLoader size="md" text="Loading analytics..." />
      </div>
    );
  }

  // Prepare data structure for the AdvancedAnalytics component
  const safeData = {
    hourlySales: (hourlySales || []).map((item: any) => ({
      hour: typeof item.hour === 'string' ? parseInt(item.hour, 10) : item.hour || 0,
      sales: item.sales || 0,
      volume: item.volume || 0,
      transactions: item.transactions || 0 // Default to 0 if not available
    })),
    fuelPerformance: (fuelPerformance || []).map((item: any) => ({
      fuelType: item.fuelType || 'Unknown',
      sales: item.sales || 0,
      volume: item.volume || 0,
      margin: item.margin || 0,
      growth: item.growth || 0 // Default to 0 if not available
    }))
  };

  return <AdvancedAnalytics data={safeData} />;
}