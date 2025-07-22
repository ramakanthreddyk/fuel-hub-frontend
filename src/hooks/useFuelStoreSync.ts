/**
 * @file hooks/useFuelStoreSync.ts
 * @description Hook to synchronize API data with fuelStore
 */
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFuelStore } from '@/store/fuelStore';

/**
 * Hook to synchronize API data with fuelStore
 * This ensures that when navigating between pages, the store has the latest data
 */
export const useFuelStoreSync = () => {
  const queryClient = useQueryClient();
  const { 
    nozzlesStale, 
    pumpsStale, 
    stationsStale,
    selectedPumpId,
    selectedStationId,
    invalidateNozzles: markNozzlesStale,
    invalidatePumps: markPumpsStale,
    invalidateStations: markStationsStale
  } = useFuelStore();

  // Memoized refresh functions to prevent infinite loops
  const refreshNozzles = useCallback((pumpId?: string) => {
    if (pumpId) {
      queryClient.invalidateQueries({ queryKey: ['nozzles', pumpId] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['nozzles', 'all'] });
    }
  }, [queryClient]);

  const refreshPumps = useCallback((stationId?: string) => {
    if (stationId) {
      queryClient.invalidateQueries({ queryKey: ['pumps', stationId] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
    }
  }, [queryClient]);

  const refreshStations = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['stations'] });
  }, [queryClient]);

  // Effect to refresh stale data
  useEffect(() => {
    // If nozzles are stale and we have a selected pump, refresh them
    if (nozzlesStale && selectedPumpId) {
      console.log('[FUEL-STORE-SYNC] Nozzles stale, refreshing for pump:', selectedPumpId);
      refreshNozzles(selectedPumpId);
    }

    // If nozzles are stale and we don't have a selected pump, refresh all nozzles
    if (nozzlesStale && !selectedPumpId) {
      console.log('[FUEL-STORE-SYNC] Nozzles stale, refreshing all');
      refreshNozzles();
    }

    // If pumps are stale and we have a selected station, refresh them
    if (pumpsStale && selectedStationId) {
      console.log('[FUEL-STORE-SYNC] Pumps stale, refreshing for station:', selectedStationId);
      refreshPumps(selectedStationId);
    }

    // If pumps are stale and we don't have a selected station, refresh all pumps
    if (pumpsStale && !selectedStationId) {
      console.log('[FUEL-STORE-SYNC] Pumps stale, refreshing all');
      refreshPumps();
    }

    // If stations are stale, refresh them
    if (stationsStale) {
      console.log('[FUEL-STORE-SYNC] Stations stale, refreshing');
      refreshStations();
    }
  }, [
    nozzlesStale, 
    pumpsStale, 
    stationsStale, 
    selectedPumpId, 
    selectedStationId, 
    refreshNozzles,
    refreshPumps,
    refreshStations
  ]);

  // Create memoized functions for external use
  const memoizedRefreshNozzles = useCallback((pumpId?: string) => {
    // Only mark as stale, don't invalidate queries directly to avoid infinite loops
    markNozzlesStale(pumpId);
  }, [markNozzlesStale]);
  
  const memoizedRefreshPumps = useCallback((stationId?: string) => {
    // Only mark as stale, don't invalidate queries directly to avoid infinite loops
    markPumpsStale(stationId);
  }, [markPumpsStale]);
  
  const memoizedRefreshStations = useCallback(() => {
    // Only mark as stale, don't invalidate queries directly to avoid infinite loops
    markStationsStale();
  }, [markStationsStale]);
  
  // Return methods to manually trigger refreshes
  return {
    refreshNozzles: memoizedRefreshNozzles,
    refreshPumps: memoizedRefreshPumps,
    refreshStations: memoizedRefreshStations
  };
};