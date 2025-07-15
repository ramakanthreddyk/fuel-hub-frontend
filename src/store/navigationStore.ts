import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to get section from path
export const getSectionFromPath = (path: string): string => {
  if (path === '/dashboard' || path === '/dashboard/') {
    return 'dashboard';
  }
  
  // Check for nested routes - station/pump/nozzle hierarchy
  const pathParts = path.split('/');
  
  // Handle nested routes like /dashboard/stations/{id}/pumps/{id}/nozzles
  if (pathParts.length >= 5 && pathParts[2] === 'stations' && pathParts[4] === 'pumps') {
    if (pathParts.length >= 7 && pathParts[6] === 'nozzles') {
      // Check if this is a readings page
      if (pathParts.length >= 9 && pathParts[8] === 'readings') {
        return 'readings'; // For /dashboard/stations/{id}/pumps/{id}/nozzles/{id}/readings/new
      }
      return 'nozzles'; // For /dashboard/stations/{id}/pumps/{id}/nozzles
    }
    return 'pumps'; // For /dashboard/stations/{id}/pumps
  }
  
  // Standard routes
  if (path.startsWith('/dashboard/stations')) {
    return 'stations';
  }
  
  if (path.startsWith('/dashboard/pumps')) {
    return 'pumps';
  }
  
  if (path.startsWith('/dashboard/nozzles')) {
    return 'nozzles';
  }
  
  if (path.startsWith('/dashboard/readings')) {
    return 'readings';
  }
  
  if (path.startsWith('/dashboard/cash-report')) {
    return 'cash-report';
  }
  
  if (path.startsWith('/dashboard/cash-reports')) {
    return 'cash-reports';
  }
  
  if (path.startsWith('/dashboard/fuel-prices')) {
    return 'fuel-prices';
  }
  
  if (path.startsWith('/dashboard/fuel-inventory')) {
    return 'fuel-inventory';
  }
  
  if (path.startsWith('/dashboard/sales')) {
    return 'sales';
  }
  
  // Users section
  if (path.startsWith('/dashboard/users')) {
    return 'users';
  }
  
  if (path.startsWith('/dashboard/reconciliation')) {
    return 'reconciliation';
  }
  
  if (path.startsWith('/dashboard/reports')) {
    return 'reports';
  }
  
  if (path.startsWith('/dashboard/analytics')) {
    return 'analytics';
  }
  
  if (path.startsWith('/dashboard/settings')) {
    return 'settings';
  }
  
  if (path.startsWith('/superadmin')) {
    return 'superadmin';
  }
  
  return 'dashboard';
};

interface NavigationState {
  // Current page title
  pageTitle: string;
  
  // Current active section
  activeSection: string;
  
  // Actions
  setPageTitle: (title: string) => void;
  setActiveSection: (section: string) => void;
  
  // Reset navigation state
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      // Initial state
      pageTitle: 'Dashboard',
      activeSection: 'dashboard',
      
      // Actions
      setPageTitle: (title) => set({ pageTitle: title }),
      setActiveSection: (section) => set({ activeSection: section }),
      
      // Reset navigation state
      resetNavigation: () => set({
        pageTitle: 'Dashboard',
        activeSection: 'dashboard'
      }),
    }),
    {
      name: 'navigation-store', // unique name for localStorage
    }
  )
);