
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import { RequireAuth } from '@/components/auth/RequireAuth'
import StationsPage from './pages/dashboard/StationsPage'
import PumpsPage from './pages/dashboard/PumpsPage'
import NozzlesPage from './pages/dashboard/NozzlesPage'
import ReadingsPage from './pages/dashboard/ReadingsPage'
import NewReadingPage from './pages/dashboard/NewReadingPage'
import SalesPage from './pages/dashboard/SalesPage'
import InventoryPage from './pages/dashboard/InventoryPage'
import FuelDeliveriesPage from './pages/dashboard/FuelDeliveriesPage'
import FuelPricesPage from './pages/dashboard/FuelPricesPage'
import ReconciliationPage from './pages/dashboard/ReconciliationPage'
import CreditorsPage from './pages/dashboard/CreditorsPage'
import AlertsPage from './pages/dashboard/AlertsPage'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorProvider } from '@/contexts/ErrorContext';

// Import SuperAdmin pages
import OverviewPage from './pages/superadmin/OverviewPage'
import TenantsPage from './pages/superadmin/TenantsPage'
import TenantDetailsPage from './pages/superadmin/TenantDetailsPage'
import CreateTenantPage from './pages/superadmin/CreateTenantPage'
import PlansPage from './pages/superadmin/PlansPage'
import AnalyticsPage from './pages/superadmin/AnalyticsPage'
import SuperAdminUsersPage from './pages/superadmin/UsersPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50">
                <Toaster />
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />

                  <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <DashboardLayout />
                      </RequireAuth>
                    }
                  >
                    <Route index element={<StationsPage />} />
                    <Route path="stations" element={<StationsPage />} />
                    <Route path="stations/:stationId/pumps" element={<PumpsPage />} />
                    <Route path="stations/:stationId/pumps/:pumpId/nozzles" element={<NozzlesPage />} />
                    <Route path="stations/:stationId/pumps/:pumpId/nozzles/:nozzleId/readings" element={<ReadingsPage />} />
                    <Route path="readings/new" element={<NewReadingPage />} />
                    <Route path="stations/:stationId/sales" element={<SalesPage />} />
                    <Route path="fuel-inventory" element={<InventoryPage />} />
                    <Route path="fuel-deliveries" element={<FuelDeliveriesPage />} />
                    <Route path="fuel-prices" element={<FuelPricesPage />} />
                    <Route path="reconciliation" element={<ReconciliationPage />} />
                    <Route path="creditors" element={<CreditorsPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                  </Route>

                  {/* SuperAdmin Routes */}
                  <Route
                    path="/superadmin"
                    element={
                      <RequireAuth allowedRoles={['superadmin']}>
                        <DashboardLayout />
                      </RequireAuth>
                    }
                  >
                    <Route index element={<OverviewPage />} />
                    <Route path="overview" element={<OverviewPage />} />
                    <Route path="tenants" element={<TenantsPage />} />
                    <Route path="tenants/:tenantId" element={<TenantDetailsPage />} />
                    <Route path="tenants/create" element={<CreateTenantPage />} />
                    <Route path="plans" element={<PlansPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="users" element={<SuperAdminUsersPage />} />
                  </Route>

                  <Route path="*" element={<LoginPage />} />
                </Routes>
              </div>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
