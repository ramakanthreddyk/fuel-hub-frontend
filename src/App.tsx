import { AuthProvider } from '@/contexts/AuthContext'
import { QueryClient } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import LoginPage from './pages/LoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import { RequireAuth } from '@/components/auth/RequireAuth'
import StationsPage from './pages/dashboard/StationsPage'
import PumpsPage from './pages/dashboard/PumpsPage'
import NozzlesPage from './pages/dashboard/NozzlesPage'
import ReadingsPage from './pages/dashboard/ReadingsPage'
import SalesPage from './pages/dashboard/SalesPage'
import FuelInventoryPage from './pages/dashboard/FuelInventoryPage'
import FuelDeliveriesPage from './pages/dashboard/FuelDeliveriesPage'
import FuelPricesPage from './pages/dashboard/FuelPricesPage'
import ReconciliationPage from './pages/dashboard/ReconciliationPage'
import CreditorsPage from './pages/dashboard/CreditorsPage'
import AlertsPage from './pages/dashboard/AlertsPage'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorProvider } from '@/contexts/ErrorContext';

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <QueryClient>
          <AuthProvider>
            <Router>
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
                    <Route path="stations/:stationId/sales" element={<SalesPage />} />
                    <Route path="fuel-inventory" element={<FuelInventoryPage />} />
                    <Route path="fuel-deliveries" element={<FuelDeliveriesPage />} />
                    <Route path="fuel-prices" element={<FuelPricesPage />} />
                    <Route path="reconciliation" element={<ReconciliationPage />} />
                    <Route path="creditors" element={<CreditorsPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                  </Route>

                  <Route path="*" element={<LoginPage />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </QueryClient>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
