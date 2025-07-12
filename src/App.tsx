
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import HomePage from './pages/HomePage';
import StationsPage from './pages/dashboard/StationsPage';
import PumpsPage from './pages/dashboard/PumpsPage';
import NozzlesPage from './pages/dashboard/NozzlesPage';
import DashboardPage from './pages/dashboard/DashboardPage';
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
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

// App content that needs router context
function AppContent() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
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
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
