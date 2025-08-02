import { create } from 'zustand';

interface DataStore {
  // Fuel Prices
  fuelPrices: Record<string, any[]>; // stationId -> prices array
  allFuelPrices: any[]; // global cache for all prices
  setFuelPrices: (stationId: string, prices: any[]) => void;
  setAllFuelPrices: (prices: any[]) => void;
  
  // Stations
  stations: any[];
  setStations: (stations: any[]) => void;
  
  // Pumps
  pumps: Record<string, any[]>; // stationId -> pumps array
  setPumps: (stationId: string, pumps: any[]) => void;
  
  // Nozzles
  nozzles: Record<string, any[]>; // pumpId -> nozzles array
  setNozzles: (pumpId: string, nozzles: any[]) => void;
  
  // Latest Readings
  latestReadings: Record<string, any>; // nozzleId -> reading
  setLatestReading: (nozzleId: string, reading: any) => void;
  clearLatestReading: (nozzleId: string) => void;
  clearAllLatestReadings: () => void;
  
  // Clear specific data
  clearFuelPrices: (stationId?: string) => void;
  clearStations: () => void;
  clearPumps: (stationId?: string) => void;
  clearNozzles: (pumpId?: string) => void;
  clearLatestReadings: (nozzleId?: string) => void;
  
  // Clear all data
  clearAllData: () => void;
}

export const useDataStore = create<DataStore>()((set) => ({
      // Initial state
      fuelPrices: {},
      allFuelPrices: [],
      stations: [],
      pumps: {},
      nozzles: {},
      latestReadings: {},
      
      // Setters
      setFuelPrices: (stationId, prices) => 
        set((state) => ({ 
          fuelPrices: { ...state.fuelPrices, [stationId]: prices } 
        })),
      setAllFuelPrices: (prices) => 
        set(() => ({ allFuelPrices: prices })),
      
      setStations: (stations) => set({ stations }),
      
      setPumps: (stationId, pumps) => 
        set((state) => ({ 
          pumps: { ...state.pumps, [stationId]: pumps } 
        })),
      
      setNozzles: (pumpId, nozzles) =>
        set((state) => ({
          nozzles: { ...state.nozzles, [pumpId]: nozzles }
        })),
      
      setLatestReading: (nozzleId, reading) =>
        set((state) => {
          console.log(`[DATA-STORE] Setting latest reading for nozzle ${nozzleId}:`, reading);
          return {
            latestReadings: { ...state.latestReadings, [nozzleId]: reading }
          };
        }),

      clearLatestReading: (nozzleId) =>
        set((state) => {
          console.log('[DATA-STORE] Clearing latest reading cache for nozzle:', nozzleId);
          const newReadings = { ...state.latestReadings };
          delete newReadings[nozzleId];
          return { latestReadings: newReadings };
        }),

      clearAllLatestReadings: () =>
        set(() => {
          console.log('[DATA-STORE] Clearing all latest readings cache');
          return { latestReadings: {} };
        }),
      
      // Clear functions
      clearFuelPrices: (stationId) => 
        set((state) => ({ 
          fuelPrices: stationId 
            ? { ...state.fuelPrices, [stationId]: undefined } 
            : {} 
        })),
      
      clearStations: () => set({ stations: [] }),
      
      clearPumps: (stationId) => 
        set((state) => ({ 
          pumps: stationId 
            ? { ...state.pumps, [stationId]: undefined } 
            : {} 
        })),
      
      clearNozzles: (pumpId) => 
        set((state) => ({ 
          nozzles: pumpId 
            ? { ...state.nozzles, [pumpId]: undefined } 
            : {} 
        })),
      
      clearLatestReadings: (nozzleId) => 
        set((state) => ({ 
          latestReadings: nozzleId 
            ? { ...state.latestReadings, [nozzleId]: undefined } 
            : {} 
        })),
      
      // Clear all data
      clearAllData: () => set({
        fuelPrices: {},
        stations: [],
        pumps: {},
        nozzles: {},
        latestReadings: {}
      }),
    }));