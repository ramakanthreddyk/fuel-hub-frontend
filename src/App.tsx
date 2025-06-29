
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Dashboard Pages  
import SummaryPage from '@/pages/dashboard/SummaryPage';
import StationsPage from '@/pages/dashboard/StationsPage';
import PumpsPage from '@/pages/dashboard/PumpsPage';
import NozzlesPage from '@/pages/dashboard/NozzlesPage';
import ReadingsPage from '@/pages/dashboard/ReadingsPage';
import NewReadingPage from '@/pages/dashboard/NewReadingPage';
import FuelPricesPage from '@/pages/dashboard/FuelPricesPage';
import CreditorsPage from '@/pages/dashboard/CreditorsPage';
import CreditorPaymentsPage from '@/pages/dashboard/CreditorPaymentsPage';
import SalesPage from '@/pages/dashboard/SalesPage';
import ReportsPage from '@/pages/dashboard/ReportsPage';
import UsersPage from '@/pages/dashboard/UsersPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import AlertsPage from '@/pages/dashboard/AlertsPage';
import ReconciliationPage from '@/pages/dashboard/ReconciliationPage';
import InventoryPage from '@/pages/dashboard/InventoryPage';
import FuelDeliveriesPage from '@/pages/dashboard/FuelDeliveriesPage';

// SuperAdmin Pages
import OverviewPage from '@/pages/superadmin/OverviewPage';
import TenantsPage from '@/pages/superadmin/TenantsPage';
import TenantDetailsPage from '@/pages/superadmin/TenantDetailsPage';
import CreateTenantPage from '@/pages/superadmin/CreateTenantPage';
import TenantSettingsPage from '@/pages/superadmin/TenantSettingsPage';
import PlansPage from '@/pages/superadmin/PlansPage';
import AnalyticsPage from '@/pages/superadmin/AnalyticsPage';
import SuperAdminUsersPage from '@/pages/superadmin/UsersPage';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Dashboard Layout Component
const ProtectedDashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth allowedRoles={['owner', 'manager', 'attendant']}>
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </RequireAuth>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* SuperAdmin Routes */}
            <Route path="/superadmin/overview" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <OverviewPage />
              </RequireAuth>
            } />
            <Route path="/superadmin/tenants" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <TenantsPage />
              </RequireAuth>
            } />
            <Route path="/superadmin/tenants/:tenantId" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <TenantDetailsPage />
              </RequireAuth>
            } />
            <Route path="/superadmin/tenants/:tenantId/settings" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <TenantSettingsPage />
              </RequireAuth>
            } />
            <Route path="/superadmin/tenants/create" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <CreateTenantPage />
              </RequireAuth>
            } />
            <Route path="/superadmin/plans" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <PlansPage />
              </RequireAuth>
            } />
            <Route path="/superadmin/analytics" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <AnalyticsPage />
              </RequireAuth>
            } />
            <Route path="/superadmin/users" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <SuperAdminUsersPage />
              </RequireAuth>
            } />
            <Route path="/superadmin" element={<Navigate to="/superadmin/overview" replace />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedDashboardLayout>
                <SummaryPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/stations" element={
              <ProtectedDashboardLayout>
                <StationsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/pumps" element={
              <ProtectedDashboardLayout>
                <PumpsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/nozzles" element={
              <ProtectedDashboardLayout>
                <NozzlesPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/readings" element={
              <ProtectedDashboardLayout>
                <ReadingsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/readings/new" element={
              <ProtectedDashboardLayout>
                <NewReadingPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/fuel-prices" element={
              <ProtectedDashboardLayout>
                <FuelPricesPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/creditors" element={
              <ProtectedDashboardLayout>
                <CreditorsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/creditors/:creditorId/payments" element={
              <ProtectedDashboardLayout>
                <CreditorPaymentsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/sales" element={
              <ProtectedDashboardLayout>
                <SalesPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/reports" element={
              <ProtectedDashboardLayout>
                <ReportsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/users" element={
              <ProtectedDashboardLayout>
                <UsersPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedDashboardLayout>
                <SettingsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/alerts" element={
              <ProtectedDashboardLayout>
                <AlertsPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/reconciliation" element={
              <ProtectedDashboardLayout>
                <ReconciliationPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/inventory" element={
              <ProtectedDashboardLayout>
                <InventoryPage />
              </ProtectedDashboardLayout>
            } />
            <Route path="/dashboard/fuel-deliveries" element={
              <ProtectedDashboardLayout>
                <FuelDeliveriesPage />
              </ProtectedDashboardLayout>
            } />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
