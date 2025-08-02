/**
 * @file useStoreSync.ts
 * @description Hook for syncing data between API and stores after CRUD operations
 */
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFuelStore } from '@/store/fuelStore';
import { useDataStore } from '@/store/dataStore';
import { useReadingsStore } from '@/store/readingsStore';
import { useToastNotifications } from './useToastNotifications';

export const useStoreSync = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useToastNotifications();
  
  // Store actions
  const { 
    setStations, 
    setPumps, 
    setNozzles, 
    setAllNozzles,
    invalidateNozzles,
    invalidatePumps,
    invalidateStations,
    invalidateSalesSummary,
    invalidateStationMetrics
  } = useFuelStore();
  
  const {
    setStations: setDataStoreStations,
    setPumps: setDataStorePumps,
    setNozzles: setDataStoreNozzles,
    setLatestReading,
    clearAllLatestReadings
  } = useDataStore();
  
  const { setLastCreatedReading } = useReadingsStore();

  /**
   * Sync after reading creation
   */
  const syncAfterReadingCreate = useCallback(async (newReading: any) => {
    console.log('[STORE-SYNC] Syncing after reading creation:', newReading);
    
    // Update readings store
    if (newReading) {
      setLastCreatedReading({
        id: newReading.id,
        nozzleId: newReading.nozzleId,
        nozzleNumber: newReading.nozzleNumber,
        reading: newReading.reading,
        fuelType: newReading.fuelType,
        timestamp: newReading.recordedAt || newReading.createdAt
      });
      
      // Update latest reading in data store
      setLatestReading(newReading.nozzleId, {
        id: newReading.id,
        reading: newReading.reading,
        recordedAt: newReading.recordedAt || newReading.createdAt
      });
    }
    
    // Comprehensive query invalidation for dashboard updates
    await Promise.all([
      // Reading-related queries
      queryClient.invalidateQueries({ queryKey: ['readings'] }),
      queryClient.invalidateQueries({ queryKey: ['nozzle-readings'] }),
      queryClient.invalidateQueries({ queryKey: ['attendant-readings'] }),
      queryClient.invalidateQueries({ queryKey: ['contract-readings'] }),
      queryClient.invalidateQueries({ queryKey: ['latest-reading'] }),
      queryClient.invalidateQueries({ queryKey: ['latest-reading', newReading?.nozzleId] }),
      queryClient.invalidateQueries({ queryKey: ['can-create-reading'] }),
      queryClient.invalidateQueries({ queryKey: ['can-create-reading', newReading?.nozzleId] }),

      // Sales-related queries
      queryClient.invalidateQueries({ queryKey: ['sales'] }),
      queryClient.invalidateQueries({ queryKey: ['todays-sales'] }),
      queryClient.invalidateQueries({ queryKey: ['sales-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-sales-summary'] }),

      // Dashboard component queries
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-sales-trend'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-fuel-breakdown'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-payment-methods'] }),
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] }),
      queryClient.invalidateQueries({ queryKey: ['fuel-breakdown'] }),
      queryClient.invalidateQueries({ queryKey: ['sales-trend'] }),
      queryClient.invalidateQueries({ queryKey: ['top-creditors'] }),
      queryClient.invalidateQueries({ queryKey: ['station-metrics'] }),

      // Enhanced dashboard queries
      queryClient.invalidateQueries({ queryKey: ['dashboard-sales-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-payment-methods'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-fuel-analytics'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-station-performance'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-recent-activities'] }),

      // Station/Pump/Nozzle queries
      queryClient.invalidateQueries({ queryKey: ['nozzles'] }),
      queryClient.invalidateQueries({ queryKey: ['pumps'] }),
      queryClient.invalidateQueries({ queryKey: ['stations'] }),

      // Cash reports
      queryClient.invalidateQueries({ queryKey: ['cash-reports'] }),
    ]);
    
    // Invalidate store cache
    invalidateSalesSummary();
    invalidateStationMetrics();
    
    // Toast notification is handled by the calling hook to avoid duplicates
  }, [queryClient, setLastCreatedReading, setLatestReading, invalidateSalesSummary, invalidateStationMetrics]);

  /**
   * Sync after nozzle CRUD operations
   */
  const syncAfterNozzleCRUD = useCallback(async (operation: 'create' | 'update' | 'delete', nozzle?: any) => {
    console.log('[STORE-SYNC] Syncing after nozzle', operation, nozzle);

    // For create operations, we need to be more aggressive with cache invalidation
    if (operation === 'create') {
      console.log('[STORE-SYNC] New nozzle created, clearing all nozzle caches');

      // Clear all nozzle-related queries immediately
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['nozzles'] }),
        queryClient.invalidateQueries({ queryKey: ['pumps'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['setup-status'] }),
        queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
        queryClient.invalidateQueries({ queryKey: ['readings'] }),
      ]);

      // Force clear store caches
      invalidateNozzles();
      invalidatePumps();

      // Clear dataStore nozzles cache for the specific pump and all pumps
      if (nozzle?.pumpId) {
        setDataStoreNozzles(nozzle.pumpId, []);
        console.log('[STORE-SYNC] Cleared dataStore nozzles cache for pump:', nozzle.pumpId);
      }

      // Clear ALL nozzle-related caches to prevent cross-contamination
      console.log('[STORE-SYNC] Clearing ALL nozzle and reading caches to prevent data mixing');
      clearAllLatestReadings(); // Clear dataStore latest readings cache
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['latest-reading'] }),
        queryClient.invalidateQueries({ queryKey: ['readings'] }),
        queryClient.removeQueries({ queryKey: ['latest-reading'] }),
        queryClient.removeQueries({ queryKey: ['readings'] }),
        // Invalidate dashboard queries for real-time updates
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-sales-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-recent-activities'] }),
        queryClient.invalidateQueries({ queryKey: ['sales-summary'] }),
      ]);

      // Wait a bit for backend to be consistent
      await new Promise(resolve => setTimeout(resolve, 500));

      // Force refetch nozzles for the specific pump
      if (nozzle?.pumpId) {
        console.log('[STORE-SYNC] Force refetching nozzles for pump:', nozzle.pumpId);
        await queryClient.refetchQueries({ queryKey: ['nozzles', nozzle.pumpId] });
        await queryClient.refetchQueries({ queryKey: ['nozzles', 'all'] });
      }
    } else {
      // For update/delete, use normal invalidation
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['nozzles'] }),
        queryClient.invalidateQueries({ queryKey: ['pumps'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['setup-status'] }),
        queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
        // Invalidate dashboard queries for real-time updates
        queryClient.invalidateQueries({ queryKey: ['dashboard-sales-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-recent-activities'] }),
        queryClient.invalidateQueries({ queryKey: ['sales-summary'] }),
      ]);

      // Invalidate store cache
      invalidateNozzles();
      invalidatePumps();
    }

    let actionText = 'deleted';
    if (operation === 'create') {
      actionText = 'created';
    } else if (operation === 'update') {
      actionText = 'updated';
    }
    showSuccess(`Nozzle ${actionText}`, 'Data refreshed successfully');
  }, [queryClient, invalidateNozzles, invalidatePumps, showSuccess, setDataStoreNozzles, clearAllLatestReadings]);

  /**
   * Sync after pump CRUD operations
   */
  const syncAfterPumpCRUD = useCallback(async (operation: 'create' | 'update' | 'delete', pump?: any) => {
    console.log('[STORE-SYNC] Syncing after pump', operation, pump);
    
    // Invalidate queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['pumps'] }),
      queryClient.invalidateQueries({ queryKey: ['nozzles'] }),
      queryClient.invalidateQueries({ queryKey: ['stations'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['setup-status'] }),
      queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
    ]);
    
    // Invalidate store cache
    invalidatePumps();
    invalidateNozzles();
    invalidateStations();
    
    let actionText = 'deleted';
    if (operation === 'create') {
      actionText = 'created';
    } else if (operation === 'update') {
      actionText = 'updated';
    }
    showSuccess(`Pump ${actionText}`, 'Data refreshed successfully');
  }, [queryClient, invalidatePumps, invalidateNozzles, invalidateStations, showSuccess]);

  /**
   * Sync after station CRUD operations
   */
  const syncAfterStationCRUD = useCallback(async (operation: 'create' | 'update' | 'delete', station?: any) => {
    console.log('[STORE-SYNC] Syncing after station', operation, station);
    
    // Invalidate queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['stations'] }),
      queryClient.invalidateQueries({ queryKey: ['pumps'] }),
      queryClient.invalidateQueries({ queryKey: ['nozzles'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]);
    
    // Invalidate store cache
    invalidateStations();
    invalidatePumps();
    invalidateNozzles();
    invalidateStationMetrics();
    
    let actionText = 'deleted';
    if (operation === 'create') {
      actionText = 'created';
    } else if (operation === 'update') {
      actionText = 'updated';
    }
    showSuccess(`Station ${actionText}`, 'Data refreshed successfully');
  }, [queryClient, invalidateStations, invalidatePumps, invalidateNozzles, invalidateStationMetrics, showSuccess]);

  /**
   * Sync after cash report operations
   */
  const syncAfterCashReport = useCallback(async (operation: 'create' | 'update', report?: any) => {
    console.log('[STORE-SYNC] Syncing after cash report', operation, report);
    
    // Invalidate queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['cash-reports'] }),
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['sales'] }),
    ]);
    
    // Invalidate store cache
    invalidateSalesSummary();
    invalidateStationMetrics();
    
    const actionText = operation === 'create' ? 'submitted' : 'updated';
    showSuccess(`Cash Report ${actionText}`, 'Reconciliation data updated');
  }, [queryClient, invalidateSalesSummary, invalidateStationMetrics, showSuccess]);

  /**
   * Force refresh all data
   */
  const forceRefreshAll = useCallback(async () => {
    console.log('[STORE-SYNC] Force refreshing all data');
    
    // Invalidate all queries
    await queryClient.invalidateQueries();
    
    // Invalidate all store cache
    invalidateStations();
    invalidatePumps();
    invalidateNozzles();
    invalidateSalesSummary();
    invalidateStationMetrics();
    
    showSuccess('Data Refreshed', 'All data has been updated');
  }, [queryClient, invalidateStations, invalidatePumps, invalidateNozzles, invalidateSalesSummary, invalidateStationMetrics, showSuccess]);

  return {
    syncAfterReadingCreate,
    syncAfterNozzleCRUD,
    syncAfterPumpCRUD,
    syncAfterStationCRUD,
    syncAfterCashReport,
    forceRefreshAll,
  };
};
