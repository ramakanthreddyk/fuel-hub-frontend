import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Station {
  id: string;
  name: string;
  address?: string;
  status: string;
  todaySales: number;
  todayVolume: number;
  todayTransactions: number;
  monthlySales: number;
  activePumps: number;
  totalPumps: number;
  lastActivity: string | null;
  fuelTypes: string[];
  nozzlesActive: number;
}

interface Pump {
  id: string;
  name: string;
  stationId: string;
  status: string;
}

interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: string;
  pumpId: string;
}

interface UnifiedStore {
  // Selections
  selectedStationId: string | null;
  selectedPumpId: string | null;
  selectedNozzleId: string | null;
  
  // Data
  stations: Record<string, Station>;
  pumps: Record<string, Pump[]>;
  nozzles: Record<string, Nozzle[]>;
  fuelPrices: Record<string, any[]>;
  
  // Actions
  selectStation: (id: string | null) => void;
  selectPump: (id: string | null) => void;
  selectNozzle: (id: string | null) => void;
  resetSelections: () => void;
  
  // Data setters
  setStations: (stations: any[]) => void;
  updateStationFromSales: (salesData: any) => void;
  updateStationFromMetrics: (metricsData: any[]) => void;
  setPumps: (stationId: string, pumps: Pump[]) => void;
  setNozzles: (pumpId: string, nozzles: Nozzle[]) => void;
  setFuelPrices: (stationId: string, prices: any[]) => void;
  
  // Getters
  getStation: (id: string) => Station | null;
  getStationsList: () => Station[];
  getPumps: (stationId: string) => Pump[];
  getNozzles: (pumpId: string) => Nozzle[];
}

export const useUnifiedStore = create<UnifiedStore>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedStationId: null,
      selectedPumpId: null,
      selectedNozzleId: null,
      stations: {},
      pumps: {},
      nozzles: {},
      fuelPrices: {},
      
      // Selection actions
      selectStation: (id) => set({ selectedStationId: id }),
      selectPump: (id) => set({ selectedPumpId: id }),
      selectNozzle: (id) => set({ selectedNozzleId: id }),
      resetSelections: () => set({
        selectedStationId: null,
        selectedPumpId: null,
        selectedNozzleId: null
      }),
      
      // Data setters
      setStations: (stationsArray) => set((state) => {
        const stations = { ...state.stations };
        stationsArray.forEach((station: any) => {
          stations[station.id] = {
            ...stations[station.id],
            id: station.id,
            name: station.name,
            address: station.address,
            status: station.status || 'active',
            todaySales: stations[station.id]?.todaySales ?? 0,
            todayVolume: stations[station.id]?.todayVolume ?? 0,
            todayTransactions: stations[station.id]?.todayTransactions ?? 0,
            monthlySales: stations[station.id]?.monthlySales ?? 0,
            activePumps: stations[station.id]?.activePumps ?? 0,
            totalPumps: stations[station.id]?.totalPumps ?? 0,
            lastActivity: stations[station.id]?.lastActivity ?? null,
            fuelTypes: stations[station.id]?.fuelTypes ?? [],
            nozzlesActive: stations[station.id]?.nozzlesActive ?? 0,
          };
        });
        return { stations };
      }),
      
      updateStationFromSales: (salesData) => {
        if (!salesData?.salesByStation) return;
        
        set((state) => {
          const stations = { ...state.stations };
          
          salesData.salesByStation.forEach((station: any) => {
            const id = station.stationId || station.station_id;
            if (!id) return;
            
            stations[id] = {
              ...stations[id],
              id,
              name: station.stationName || station.station_name,
              todaySales: station.totalAmount || station.total_amount || 0,
              todayVolume: station.totalVolume || station.total_volume || 0,
              todayTransactions: station.entriesCount || station.entries_count || 0,
              fuelTypes: station.fuelTypes || station.fuel_types || [],
              nozzlesActive: station.nozzlesActive || station.nozzles_active || 0,
              lastActivity: station.lastActivity || station.last_activity,
            };
          });
          
          return { stations };
        });
      },
      
      updateStationFromMetrics: (metricsData) => {
        if (!Array.isArray(metricsData)) return;
        
        set((state) => {
          const stations = { ...state.stations };
          
          metricsData.forEach((metric: any) => {
            const id = metric.id;
            if (!id) return;
            
            stations[id] = {
              ...stations[id],
              id,
              name: metric.name,
              status: metric.status || 'active',
              monthlySales: metric.monthlySales || 0,
              activePumps: metric.activePumps || 0,
              totalPumps: metric.totalPumps || 0,
              lastActivity: metric.lastActivity,
              todaySales: stations[id]?.todaySales ?? metric.todaySales ?? 0,
              todayVolume: stations[id]?.todayVolume ?? 0,
              todayTransactions: stations[id]?.todayTransactions ?? 0,
              fuelTypes: stations[id]?.fuelTypes ?? [],
              nozzlesActive: stations[id]?.nozzlesActive ?? 0,
            };
          });
          
          return { stations };
        });
      },
      
      setPumps: (stationId, pumpsArray) => set((state) => ({
        pumps: { ...state.pumps, [stationId]: pumpsArray }
      })),
      
      setNozzles: (pumpId, nozzlesArray) => set((state) => ({
        nozzles: { ...state.nozzles, [pumpId]: nozzlesArray }
      })),
      
      setFuelPrices: (stationId, prices) => set((state) => ({
        fuelPrices: { ...state.fuelPrices, [stationId]: prices }
      })),
      
      // Getters
      getStation: (id) => get().stations[id] || null,
      getStationsList: () => Object.values(get().stations),
      getPumps: (stationId) => get().pumps[stationId] || [],
      getNozzles: (pumpId) => get().nozzles[pumpId] || [],
    }),
    {
      name: 'fuelsync-unified-store',
    }
  )
);