import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { Loader2 } from 'lucide-react';

interface AdvancedAnalyticsContainerProps {
  stationId: string;
}

export function AdvancedAnalyticsContainer({ stationId }: AdvancedAnalyticsContainerProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'advanced', stationId],
    queryFn: async () => {
      try {
        // Fetch hourly sales data
        const hourlySalesResponse = await apiClient.get(`/analytics/hourly-sales?stationId=${stationId}`);
        const hourlySales = hourlySalesResponse.data.data || [];
        
        // Fetch fuel performance data
        const fuelPerformanceResponse = await apiClient.get(`/analytics/fuel-performance?stationId=${stationId}`);
        const fuelPerformance = fuelPerformanceResponse.data.data || [];
        
        return {
          hourlySales,
          fuelPerformance
        };
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Return empty arrays to prevent errors
        return {
          hourlySales: [],
          fuelPerformance: []
        };
      }
    },
    enabled: !!stationId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading analytics data. Please try again.
      </div>
    );
  }

  // Ensure we have data with the expected structure
  const safeData = {
    hourlySales: data?.hourlySales || [],
    fuelPerformance: data?.fuelPerformance || []
  };

  return <AdvancedAnalytics data={safeData} />;
}