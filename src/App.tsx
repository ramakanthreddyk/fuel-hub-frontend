
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';

// Layout Components
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import StationsPage from './pages/dashboard/StationsPage';
import CreateStationPage from './pages/dashboard/CreateStationPage';
import PumpsPage from './pages/dashboard/PumpsPage';
import CreatePumpPage from './pages/dashboard/CreatePumpPage';
import FuelPricesPage from './pages/dashboard/FuelPricesPage';
import ReadingsPage from './pages/dashboard/ReadingsPage';
import NewReadingPage from './pages/dashboard/NewReadingPage';
import FuelInventoryPage from './pages/dashboard/FuelInventoryPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import UsersPage from './pages/dashboard/UsersPage';
import SettingsPage from './pages/dashboard/SettingsPage';

// SuperAdmin Pages
import SuperAdminOverviewPage from './pages/superadmin/OverviewPage';
import SuperAdminTenantsPage from './pages/superadmin/TenantsPage';
import SuperAdminUsersPage from './pages/superadmin/UsersPage';
import SuperAdminPlansPage from './pages/superadmin/PlansPage';
import SuperAdminAnalyticsPage from './pages/superadmin/AnalyticsPage';
import TenantSettingsPage from './pages/superadmin/TenantSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('[APP] App component mounting');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fuelsync-ui-theme">
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Root Landing Route */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/admin" element={<LoginPage />} />
                
                {/* Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['owner', 'manager', 'attendant']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="stations" element={<StationsPage />} />
                  <Route path="stations/new" element={<CreateStationPage />} />
                  <Route path="pumps" element={<PumpsPage />} />
                  <Route path="pumps/new" element={<CreatePumpPage />} />
                  <Route path="fuel-prices" element={<FuelPricesPage />} />
                  <Route path="readings" element={<ReadingsPage />} />
                  <Route path="readings/new" element={<NewReadingPage />} />
                  <Route path="fuel-inventory" element={<FuelInventoryPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* SuperAdmin Routes */}
                <Route
                  path="/superadmin"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperAdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/superadmin/overview" replace />} />
                  <Route path="overview" element={<SuperAdminOverviewPage />} />
                  <Route path="tenants" element={<SuperAdminTenantsPage />} />
                  <Route path="tenants/:tenantId/settings" element={<TenantSettingsPage />} />
                  <Route path="users" element={<SuperAdminUsersPage />} />
                  <Route path="plans" element={<SuperAdminPlansPage />} />
                  <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              <Toaster />
            </div>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
