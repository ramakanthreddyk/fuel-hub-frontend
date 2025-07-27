import { create } from 'zustand';
import { TodaysSalesSummary } from '@/api/api-contract';

interface DashboardState {
  // Today's sales data by date
  todaysSalesData: Record<string, TodaysSalesSummary>;
  
  // Current selected date
  selectedDate: string | null;
  
  // Loading states
  loadingStates: Record<string, boolean>;
  
  // Error states
  errorStates: Record<string, string | null>;
  
  // Actions
  setTodaysSales: (date: string, data: TodaysSalesSummary) => void;
  getTodaysSales: (date: string) => TodaysSalesSummary | null;
  setSelectedDate: (date: string | null) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  clearError: (key: string) => void;
  clearAllData: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  todaysSalesData: {},
  selectedDate: null,
  loadingStates: {},
  errorStates: {},
  
  setTodaysSales: (date, data) => {
    set((state) => ({
      todaysSalesData: {
        ...state.todaysSalesData,
        [date]: data
      }
    }));
  },
  
  getTodaysSales: (date) => {
    const state = get();
    return state.todaysSalesData[date] || null;
  },
  
  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },
  
  setLoading: (key, loading) => {
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading
      }
    }));
  },
  
  setError: (key, error) => {
    set((state) => ({
      errorStates: {
        ...state.errorStates,
        [key]: error
      }
    }));
  },
  
  clearError: (key) => {
    set((state) => ({
      errorStates: {
        ...state.errorStates,
        [key]: null
      }
    }));
  },
  
  clearAllData: () => {
    set({
      todaysSalesData: {},
      selectedDate: null,
      loadingStates: {},
      errorStates: {}
    });
  }
}));