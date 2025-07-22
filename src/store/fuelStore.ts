import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Station {
  id: string;
  name: string;
  todaySales?: number;
  monthlySales?: number;
  status?: string;
  activePumps?: number;
  totalPumps?: number;
}

interface Pump {
  id: string;
  name: string;
  stationId: string;
}

interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: string;
  pumpId: string;
  readings?: Reading[];
}

interface Reading {
  id: string;
  nozzleId: string;
  value: number;
  timestamp: string;
}

interface FuelStore {
  // Selected items
  selectedStationId: string | null;
  selectedPumpId: string | null;
  selectedNozzleId: string | null;

  // Entity caches
  stations: Station[];
  pumps: Record<string, Pump[]>;
  nozzles: Record<string, Nozzle[]>;
  allNozzles: Nozzle[]; // Cache for all nozzles regardless of pump
  readings: Record<string, Reading[]>; // nozzleId -> readings

  // Cache status flags
  nozzlesStale: boolean;
  pumpsStale: boolean;
  stationsStale: boolean;

  // Dashboard data
  stationMetrics: any[];
  stationMetricsStale: boolean;
  setStationMetrics: (metrics: any[]) => void;
  invalidateStationMetrics: () => void;
  salesSummary: any;
  salesSummaryStale: boolean;
  setSalesSummary: (summary: any) => void;
  invalidateSalesSummary: () => void;

  // Actions
  selectStation: (stationId: string | null) => void;
  selectPump: (pumpId: string | null) => void;
  selectNozzle: (nozzleId: string | null) => void;

  // Update all selections at once
  updateSelections: (selections: {
    stationId?: string | null;
    pumpId?: string | null;
    nozzleId?: string | null;
  }) => void;

  // Reset selections
  resetSelections: () => void;

  // Entity cache setters
  setStations: (stations: Station[]) => void;
  setPumps: (stationId: string, pumps: Pump[]) => void;
  setNozzles: (pumpId: string, nozzles: Nozzle[]) => void;
  setAllNozzles: (nozzles: Nozzle[]) => void;
  setReadings: (nozzleId: string, readings: Reading[]) => void;
  
  // Invalidation methods
  invalidateReadings: (nozzleId: string) => void;
  invalidateNozzles: (pumpId?: string) => void;
  invalidatePumps: (stationId?: string) => void;
  invalidateStations: () => void;
  
  // Get nozzles for a pump (with caching)
  getNozzlesForPump: (pumpId: string) => Nozzle[];
}

export const useFuelStore = create<FuelStore>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedStationId: null,
      selectedPumpId: null,
      selectedNozzleId: null,

      stations: [],
      pumps: {},
      nozzles: {},
      allNozzles: [],
      readings: {},
      
      // Cache status flags
      nozzlesStale: false,
      pumpsStale: false,
      stationsStale: false,

      stationMetrics: [],
      stationMetricsStale: false,
      setStationMetrics: (metrics) => set({ stationMetrics: metrics, stationMetricsStale: false }),
      invalidateStationMetrics: () => set({ stationMetricsStale: true }),
      salesSummary: null,
      salesSummaryStale: false,
      setSalesSummary: (summary) => set({ salesSummary: summary, salesSummaryStale: false }),
      invalidateSalesSummary: () => set({ salesSummaryStale: true }),

      selectStation: (stationId) => set({ selectedStationId: stationId }),
      selectPump: (pumpId) => set({ selectedPumpId: pumpId }),
      selectNozzle: (nozzleId) => set({ selectedNozzleId: nozzleId }),

      updateSelections: ({ stationId, pumpId, nozzleId }) => set({
        ...(stationId !== undefined && { selectedStationId: stationId }),
        ...(pumpId !== undefined && { selectedPumpId: pumpId }),
        ...(nozzleId !== undefined && { selectedNozzleId: nozzleId })
      }),

      resetSelections: () => set({
        selectedStationId: null,
        selectedPumpId: null,
        selectedNozzleId: null
      }),

      setStations: (stations) => set({ stations, stationsStale: false }),
      setPumps: (stationId, pumpsArr) => set((state) => ({ 
        pumps: { ...state.pumps, [stationId]: pumpsArr },
        pumpsStale: false
      })),
      setNozzles: (pumpId, nozzlesArr) => set((state) => ({ 
        nozzles: { ...state.nozzles, [pumpId]: nozzlesArr },
        nozzlesStale: false
      })),
      setAllNozzles: (nozzles) => set({ allNozzles: nozzles, nozzlesStale: false }),
      setReadings: (nozzleId, readingsArr) => set((state) => ({ 
        readings: { ...state.readings, [nozzleId]: readingsArr } 
      })),
      
      // Invalidation methods
      invalidateReadings: (nozzleId) => set((state) => ({ 
        readings: { ...state.readings, [nozzleId]: [] } 
      })),
      invalidateNozzles: (pumpId) => set((state) => {
        // Only mark as stale, don't modify the cache to avoid unnecessary re-renders
        return { nozzlesStale: true };
      }),
      invalidatePumps: (stationId) => set((state) => {
        // Only mark as stale, don't modify the cache to avoid unnecessary re-renders
        return { pumpsStale: true };
      }),
      invalidateStations: () => set({ stationsStale: true }),
      
      // Helper method to get nozzles for a pump with caching
      // This is a pure function that doesn't update state
      getNozzlesForPump: (pumpId) => {
        // Use a try-catch to prevent any errors during render
        try {
          const state = get();
          
          // First check if we have cached nozzles for this pump
          if (state.nozzles[pumpId] && !state.nozzlesStale) {
            return state.nozzles[pumpId];
          }
          
          // If not, check if we have them in allNozzles
          if (state.allNozzles.length > 0 && !state.nozzlesStale) {
            const filteredNozzles = state.allNozzles.filter(n => n.pumpId === pumpId);
            if (filteredNozzles.length > 0) {
              // Return filtered nozzles but don't update state during read operation
              return filteredNozzles;
            }
          }
        } catch (error) {
          console.error('Error in getNozzlesForPump:', error);
        }
        
        // Return empty array if nothing found or on error
        return [];
      }
    }),
    {
      name: 'fuel-store', // unique name for localStorage
    }
  )
);