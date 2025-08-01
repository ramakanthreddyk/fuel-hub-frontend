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
    setLatestReading
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
    
    // Invalidate related queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['readings'] }),
      queryClient.invalidateQueries({ queryKey: ['nozzle-readings'] }),
      queryClient.invalidateQueries({ queryKey: ['sales'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['latest-reading'] }),
      queryClient.invalidateQueries({ queryKey: ['latest-reading', newReading.nozzleId] }),
      queryClient.invalidateQueries({ queryKey: ['can-create-reading'] }),
      queryClient.invalidateQueries({ queryKey: ['can-create-reading', newReading.nozzleId] }),
      queryClient.invalidateQueries({ queryKey: ['nozzles'] }),
    ]);
    
    // Invalidate store cache
    invalidateSalesSummary();
    invalidateStationMetrics();
    
    showSuccess('Reading Recorded', 'Sale auto-generated and data updated');
  }, [queryClient, setLastCreatedReading, setLatestReading, invalidateSalesSummary, invalidateStationMetrics, showSuccess]);

  /**
   * Sync after nozzle CRUD operations
   */
  const syncAfterNozzleCRUD = useCallback(async (operation: 'create' | 'update' | 'delete', nozzle?: any) => {
    console.log('[STORE-SYNC] Syncing after nozzle', operation, nozzle);
    
    // Invalidate queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['nozzles'] }),
      queryClient.invalidateQueries({ queryKey: ['pumps'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['setup-status'] }),
      queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
    ]);
    
    // Invalidate store cache
    invalidateNozzles();
    invalidatePumps();
    
    const actionText = operation === 'create' ? 'created' : operation === 'update' ? 'updated' : 'deleted';
    showSuccess(`Nozzle ${actionText}`, 'Data refreshed successfully');
  }, [queryClient, invalidateNozzles, invalidatePumps, showSuccess]);

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
    
    const actionText = operation === 'create' ? 'created' : operation === 'update' ? 'updated' : 'deleted';
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
    
    const actionText = operation === 'create' ? 'created' : operation === 'update' ? 'updated' : 'deleted';
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
