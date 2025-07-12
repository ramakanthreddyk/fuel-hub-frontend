import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import StationsPage from './pages/StationsPage';
import PumpsPage from './pages/PumpsPage';
import NozzlesPage from './pages/NozzlesPage';
import ReadingsPage from './pages/ReadingsPage';
import SalesPage from './pages/SalesPage';
import FuelPricesPage from './pages/FuelPricesPage';
import CreditorsPage from './pages/CreditorsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminTenantsPage from './pages/admin/AdminTenantsPage';
import AdminPlansPage from './pages/admin/AdminPlansPage';
import ReconciliationPage from './pages/dashboard/ReconciliationPage';
import ReconciliationDailySummaryPage from './pages/dashboard/ReconciliationDailySummaryPage';
import ReconciliationDetailPage from './pages/dashboard/ReconciliationDetailPage';

const queryClient = new QueryClient();

// Protected route component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="stations" />} />
              <Route path="stations" element={<StationsPage />} />
              <Route path="pumps" element={<PumpsPage />} />
              <Route path="nozzles" element={<NozzlesPage />} />
              <Route path="readings" element={<ReadingsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="fuel-prices" element={<FuelPricesPage />} />
              <Route path="creditors" element={<CreditorsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="reconciliation" element={<ReconciliationPage />} />
              <Route path="reconciliation/daily-summary" element={<ReconciliationDailySummaryPage />} />
              <Route path="reconciliation/:id" element={<ReconciliationDetailPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<AdminHomePage />} />
              <Route path="tenants" element={<AdminTenantsPage />} />
              <Route path="plans" element={<AdminPlansPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
