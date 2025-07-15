/**
 * @file useNozzleDetails.ts
 * @description Hook to fetch nozzle details including pump and station
 */
import { useState, useEffect } from 'react';
import { useNozzle } from './useNozzles';
import { usePumps } from './usePumps';
import { useStations } from './useStations';
import { useFuelStore } from '@/store/fuelStore';

/**
 * Hook to fetch nozzle details including pump and station
 * @param nozzleId Nozzle ID
 * @returns Object with nozzle, pump, and station details
 */
export const useNozzleDetails = (nozzleId?: string) => {
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

  const { selectNozzle, selectPump, selectStation } = useFuelStore();
  
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
      
      // Update the store
      if (nozzle) selectNozzle(nozzle.id);
      if (pump) selectPump(pump.id);
      if (station) selectStation(station.id);
      
      // Update the details
      setDetails({
        nozzle,
        pump,
        station,
        isLoading: false,
        error: nozzleError
      });
      
      console.log('[NOZZLE-DETAILS] Details loaded:', { nozzle, pump, station });
    } else {
      setDetails(prev => ({
        ...prev,
        isLoading,
        error: nozzleError
      }));
    }
  }, [nozzle, pumps, stations, isLoadingNozzle, isLoadingPumps, isLoadingStations, nozzleError, selectNozzle, selectPump, selectStation]);

  return details;
};