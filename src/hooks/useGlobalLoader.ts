import { create } from 'zustand';

interface GlobalLoaderState {
  isLoading: boolean;
  message?: string;
  show: (message?: string) => void;
  hide: () => void;
}

export const useGlobalLoader = create<GlobalLoaderState>((set) => ({
  isLoading: false,
  message: undefined,
  show: (message) => set({ isLoading: true, message }),
  hide: () => set({ isLoading: false, message: undefined }),
}));