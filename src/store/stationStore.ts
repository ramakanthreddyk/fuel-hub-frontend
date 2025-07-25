import { create } from 'zustand';
import React from 'react';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { useStationMetrics } from '@/hooks/useDashboard';
import { useUnifiedStore } from './unifiedStore';

// Hook to get unified station data
export const useUnifiedStationData = () => {
  const { data: todaysSales } = useTodaysSales();
  const { data: stationMetrics } = useStationMetrics();
  const { updateStationFromSales, updateStationFromMetrics, getStation, getStationsList } = useUnifiedStore();
  
  // Update store when data changes
  React.useEffect(() => {
    if (todaysSales) {
      updateStationFromSales(todaysSales);
    }
  }, [todaysSales, updateStationFromSales]);
  
  React.useEffect(() => {
    if (stationMetrics) {
      updateStationFromMetrics(stationMetrics);
    }
  }, [stationMetrics, updateStationFromMetrics]);
  
  return {
    stations: getStationsList(),
    getStation,
    isLoading: !todaysSales && !stationMetrics,
  };
};

// Re-export the unified store for backward compatibility
export { useUnifiedStore as useFuelStore };
export { useUnifiedStore as useDataStore };