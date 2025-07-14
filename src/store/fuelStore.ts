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
        // Clear pump and nozzle when changing station
        selectedPumpId: null,
        selectedNozzleId: null
      }),
      
      selectPump: (pumpId) => set({ 
        selectedPumpId: pumpId,
        // Clear nozzle when changing pump
        selectedNozzleId: null
      }),
      
      selectNozzle: (nozzleId) => set({ selectedNozzleId: nozzleId }),
      
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