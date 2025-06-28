
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { stationsApi } from '@/api/stations';
import { pumpsApi } from '@/api/pumps';
import { nozzlesApi } from '@/api/nozzles';
import { Station, Pump, Nozzle } from '@/api/api-contract';
import { useAuth } from './AuthContext';

interface DataMappingContextType {
  // Mapping functions
  getStationName: (stationId: string) => string;
  getPumpLabel: (pumpId: string) => string;
  getNozzleNumber: (nozzleId: string) => number;
  getNozzleFuelType: (nozzleId: string) => string;
  getStationByNozzleId: (nozzleId: string) => string;
  
  // Data access
  stations: Station[];
  pumps: Pump[];
  nozzles: Nozzle[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Force refresh only when CRUD operations happen
  refreshData: () => Promise<void>;
  invalidateStations: () => void;
  invalidatePumps: (stationId: string) => void;
  invalidateNozzles: (pumpId: string) => void;
}

const DataMappingContext = createContext<DataMappingContextType | undefined>(undefined);

interface DataMappingProviderProps {
  children: ReactNode;
}

export function DataMappingProvider({ children }: DataMappingProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [nozzles, setNozzles] = useState<Nozzle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchAllData = async () => {
    if (!isAuthenticated || !user) {
      console.log('[DATA-MAPPING] User not authenticated, skipping data fetch');
      return;
    }

    // Don't refetch if data is already loaded for this user session
    if (dataLoaded) {
      console.log('[DATA-MAPPING] Data already loaded, skipping fetch');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[DATA-MAPPING] Fetching reference data for user session...');
      
      // Fetch stations first
      const stationsData = await stationsApi.getStations();
      setStations(stationsData);
      console.log('[DATA-MAPPING] Cached stations:', stationsData.length);
      
      // Fetch pumps for all stations
      const allPumps: Pump[] = [];
      for (const station of stationsData) {
        try {
          const stationPumps = await pumpsApi.getPumps(station.id);
          allPumps.push(...stationPumps);
        } catch (error) {
          console.warn(`[DATA-MAPPING] Failed to fetch pumps for station ${station.id}:`, error);
        }
      }
      setPumps(allPumps);
      console.log('[DATA-MAPPING] Cached pumps:', allPumps.length);
      
      // Fetch nozzles for all pumps
      const allNozzles: Nozzle[] = [];
      for (const pump of allPumps) {
        try {
          const pumpNozzles = await nozzlesApi.getNozzles(pump.id);
          allNozzles.push(...pumpNozzles);
        } catch (error) {
          console.warn(`[DATA-MAPPING] Failed to fetch nozzles for pump ${pump.id}:`, error);
        }
      }
      setNozzles(allNozzles);
      console.log('[DATA-MAPPING] Cached nozzles:', allNozzles.length);
      
      setDataLoaded(true);
      console.log('[DATA-MAPPING] ✅ All reference data cached for user session');
    } catch (error: any) {
      console.error('[DATA-MAPPING] Error fetching reference data:', error);
      setError(error.message || 'Failed to load reference data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data only once per authenticated session
  useEffect(() => {
    if (isAuthenticated && user && !dataLoaded) {
      fetchAllData();
    }
    
    // Reset data when user logs out
    if (!isAuthenticated) {
      setStations([]);
      setPumps([]);
      setNozzles([]);
      setDataLoaded(false);
      setError(null);
    }
  }, [isAuthenticated, user, dataLoaded]);

  // Mapping functions with cached data
  const getStationName = (stationId: string): string => {
    const station = stations.find(s => s.id === stationId);
    return station?.name || 'Unknown Station';
  };

  const getPumpLabel = (pumpId: string): string => {
    const pump = pumps.find(p => p.id === pumpId);
    return pump?.label || 'Unknown Pump';
  };

  const getNozzleNumber = (nozzleId: string): number => {
    const nozzle = nozzles.find(n => n.id === nozzleId);
    return nozzle?.nozzleNumber || 0;
  };

  const getNozzleFuelType = (nozzleId: string): string => {
    const nozzle = nozzles.find(n => n.id === nozzleId);
    return nozzle?.fuelType || 'unknown';
  };

  const getStationByNozzleId = (nozzleId: string): string => {
    const nozzle = nozzles.find(n => n.id === nozzleId);
    if (!nozzle) return 'Unknown Station';
    
    const pump = pumps.find(p => p.id === nozzle.pumpId);
    if (!pump) return 'Unknown Station';
    
    return getStationName(pump.stationId);
  };

  // Selective invalidation for CRUD operations
  const invalidateStations = () => {
    console.log('[DATA-MAPPING] Invalidating stations cache');
    setDataLoaded(false);
  };

  const invalidatePumps = (stationId: string) => {
    console.log('[DATA-MAPPING] Invalidating pumps cache for station:', stationId);
    setDataLoaded(false);
  };

  const invalidateNozzles = (pumpId: string) => {
    console.log('[DATA-MAPPING] Invalidating nozzles cache for pump:', pumpId);
    setDataLoaded(false);
  };

  const contextValue: DataMappingContextType = {
    getStationName,
    getPumpLabel,
    getNozzleNumber,
    getNozzleFuelType,
    getStationByNozzleId,
    stations,
    pumps,
    nozzles,
    isLoading,
    error,
    refreshData: fetchAllData,
    invalidateStations,
    invalidatePumps,
    invalidateNozzles,
  };

  return (
    <DataMappingContext.Provider value={contextValue}>
      {children}
    </DataMappingContext.Provider>
  );
}

export function useDataMapping() {
  const context = useContext(DataMappingContext);
  if (context === undefined) {
    throw new Error('useDataMapping must be used within a DataMappingProvider');
  }
  return context;
}
