
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { stationsApi } from '@/api/stations';
import { pumpsApi } from '@/api/pumps';
import { nozzlesApi } from '@/api/nozzles';
import { Station, Pump, Nozzle } from '@/api/api-contract';

interface DataMappingContextType {
  // Mapping functions
  getStationName: (stationId: string) => string;
  getPumpLabel: (pumpId: string) => string;
  getNozzleNumber: (nozzleId: string) => number;
  getNozzleFuelType: (nozzleId: string) => string;
  getStationByNozzleId: (nozzleId: string) => string;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Force refresh
  refreshData: () => Promise<void>;
}

const DataMappingContext = createContext<DataMappingContextType | undefined>(undefined);

interface DataMappingProviderProps {
  children: ReactNode;
}

export function DataMappingProvider({ children }: DataMappingProviderProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [nozzles, setNozzles] = useState<Nozzle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[DATA-MAPPING] Fetching all reference data...');
      
      // Fetch stations first
      const stationsData = await stationsApi.getStations();
      setStations(stationsData);
      console.log('[DATA-MAPPING] Loaded stations:', stationsData.length);
      
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
      console.log('[DATA-MAPPING] Loaded pumps:', allPumps.length);
      
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
      console.log('[DATA-MAPPING] Loaded nozzles:', allNozzles.length);
      
      console.log('[DATA-MAPPING] All reference data loaded successfully');
    } catch (error: any) {
      console.error('[DATA-MAPPING] Error fetching reference data:', error);
      setError(error.message || 'Failed to load reference data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Mapping functions
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

  const contextValue: DataMappingContextType = {
    getStationName,
    getPumpLabel,
    getNozzleNumber,
    getNozzleFuelType,
    getStationByNozzleId,
    isLoading,
    error,
    refreshData: fetchAllData,
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
