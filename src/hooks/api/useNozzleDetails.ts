/**
 * @file useNozzleDetails.ts
 * @description Hook to fetch nozzle details including pump and station
 */
import { useState, useEffect } from 'react';
import { useNozzle } from './useNozzles';
import { usePumps } from './usePumps';
import { useStations } from './useStations';
import { useFuelStore } from '@/store/fuelStore';
import { useDataStore } from '@/store/dataStore';

/**
 * Hook to fetch nozzle details including pump and station
 * @param nozzleId Nozzle ID
 * @param updateStore Whether to update the store with the fetched details (default: true)
 * @returns Object with nozzle, pump, and station details
 */
export const useNozzleDetails = (nozzleId?: string, updateStore: boolean = true) => {
  const [details, setDetails] = useState<{
    nozzle: any;
    pump: any;
    station: any;
    isLoading: boolean;
    error: any;
  }>({
    nozzle: null,
    pump: null,
    station: null,
    isLoading: true,
    error: null
  });

  const { updateSelections } = useFuelStore();
  const { nozzles: storedNozzles, pumps: storedPumps, stations: storedStations } = useDataStore();
  
  // Fetch nozzle data
  const { data: nozzle, isLoading: isLoadingNozzle, error: nozzleError } = useNozzle(nozzleId || '');
  
  // Fetch all pumps and stations
  const { data: pumps = [], isLoading: isLoadingPumps } = usePumps();
  const { data: stations = [], isLoading: isLoadingStations } = useStations();

  useEffect(() => {
    const isLoading = isLoadingNozzle || isLoadingPumps || isLoadingStations;
    
    if (!isLoading && nozzle) {
      // Find the pump for this nozzle
      const pump = pumps.find(p => p.id === nozzle.pumpId);
      
      // Find the station for this pump
      const station = pump ? stations.find(s => s.id === pump.stationId) : null;
      
      // Update the store with all values at once (if enabled)
      if (updateStore) {
        updateSelections({
          nozzleId: nozzle?.id,
          pumpId: pump?.id,
          stationId: station?.id
        });
      }
      
      // Update the details
      setDetails({
        nozzle,
        pump,
        station,
        isLoading: false,
        error: nozzleError
      });
      
      // Details loaded successfully
    } else {
      setDetails(prev => ({
        ...prev,
        isLoading,
        error: nozzleError
      }));
    }
  }, [nozzle, pumps, stations, isLoadingNozzle, isLoadingPumps, isLoadingStations, nozzleError, updateSelections, updateStore]);

  return details;
};