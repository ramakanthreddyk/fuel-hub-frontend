import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Station {
  id: string;
  name: string;
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
}

interface FuelStore {
  // Selected items
  selectedStationId: string | null;
  selectedPumpId: string | null;
  selectedNozzleId: string | null;
  
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
}

export const useFuelStore = create<FuelStore>()(
  persist(
    (set) => ({
      // Initial state
      selectedStationId: null,
      selectedPumpId: null,
      selectedNozzleId: null,
      
      // Actions
      selectStation: (stationId) => set({ 
        selectedStationId: stationId,
        // Don't clear pump and nozzle when changing station
        // This allows for proper navigation in nested routes
      }),
      
      selectPump: (pumpId) => set({ 
        selectedPumpId: pumpId,
        // Don't clear nozzle when changing pump
        // This allows for proper navigation in nested routes
      }),
      
      selectNozzle: (nozzleId) => set({ selectedNozzleId: nozzleId }),
      
      // Update all selections at once
      updateSelections: ({ stationId, pumpId, nozzleId }) => set({
        ...(stationId !== undefined && { selectedStationId: stationId }),
        ...(pumpId !== undefined && { selectedPumpId: pumpId }),
        ...(nozzleId !== undefined && { selectedNozzleId: nozzleId })
      }),
      
      // Reset all selections
      resetSelections: () => set({
        selectedStationId: null,
        selectedPumpId: null,
        selectedNozzleId: null
      }),
    }),
    {
      name: 'fuel-store', // unique name for localStorage
    }
  )
);