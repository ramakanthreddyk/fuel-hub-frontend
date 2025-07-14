import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadingsState {
  // Last created reading info
  lastCreatedReading: {
    id: string | null;
    nozzleId: string | null;
    nozzleNumber: number | null;
    reading: number | null;
    fuelType: string | null;
    timestamp: string | null;
  };
  
  // Actions
  setLastCreatedReading: (reading: {
    id: string;
    nozzleId: string;
    nozzleNumber?: number | null;
    reading: number;
    fuelType?: string | null;
    timestamp?: string | null;
  }) => void;
  
  // Reset state
  resetLastCreatedReading: () => void;
}

export const useReadingsStore = create<ReadingsState>()(
  persist(
    (set) => ({
      // Initial state
      lastCreatedReading: {
        id: null,
        nozzleId: null,
        nozzleNumber: null,
        reading: null,
        fuelType: null,
        timestamp: null
      },
      
      // Actions
      setLastCreatedReading: (reading) => set({
        lastCreatedReading: {
          id: reading.id,
          nozzleId: reading.nozzleId,
          nozzleNumber: reading.nozzleNumber || null,
          reading: reading.reading,
          fuelType: reading.fuelType || null,
          timestamp: reading.timestamp || new Date().toISOString()
        }
      }),
      
      // Reset state
      resetLastCreatedReading: () => set({
        lastCreatedReading: {
          id: null,
          nozzleId: null,
          nozzleNumber: null,
          reading: null,
          fuelType: null,
          timestamp: null
        }
      }),
    }),
    {
      name: 'readings-store', // unique name for localStorage
    }
  )
);