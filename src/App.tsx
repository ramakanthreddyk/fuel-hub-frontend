
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Setup Pages
import SetupWizardPage from '@/pages/setup/SetupWizardPage';

// Dashboard Pages  
import SummaryPage from '@/pages/dashboard/SummaryPage';
import StationsPage from '@/pages/dashboard/StationsPage';
import StationDetailsPage from '@/pages/dashboard/StationDetailsPage';
import PumpsPage from '@/pages/dashboard/PumpsPage';
import CreatePumpPage from '@/pages/dashboard/CreatePumpPage';
import NozzlesPage from '@/pages/dashboard/NozzlesPage';
import CreateNozzlePage from '@/pages/dashboard/CreateNozzlePage';
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
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fuelsync-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Setup Wizard Route */}
            <Route path="/setup" element={
              <RequireAuth allowedRoles={['owner', 'manager', 'attendant']}>
                <SetupWizardPage />
              </RequireAuth>
            } />

            {/* SuperAdmin Routes with Layout */}
            <Route path="/superadmin" element={
              <RequireAuth allowedRoles={['superadmin']}>
                <SuperAdminLayout />
              </RequireAuth>
            }>
              <Route index element={<Navigate to="/superadmin/overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="tenants" element={<TenantsPage />} />
              <Route path="tenants/:tenantId" element={<TenantDetailsPage />} />
              <Route path="tenants/:tenantId/settings" element={<TenantSettingsPage />} />
              <Route path="tenants/create" element={<CreateTenantPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="users" element={<SuperAdminUsersPage />} />
            </Route>

            {/* Dashboard Routes with Layout */}
            <Route path="/dashboard" element={
              <RequireAuth allowedRoles={['owner', 'manager', 'attendant']}>
                <DashboardLayout />
              </RequireAuth>
            }>
              <Route index element={<SummaryPage />} />
              <Route path="stations" element={<StationsPage />} />
              <Route path="stations/:stationId" element={<StationDetailsPage />} />
              <Route path="pumps" element={<PumpsPage />} />
              <Route path="pumps/create" element={<CreatePumpPage />} />
              <Route path="nozzles" element={<NozzlesPage />} />
              <Route path="nozzles/create" element={<CreateNozzlePage />} />
              <Route path="readings" element={<ReadingsPage />} />
              <Route path="readings/new" element={<NewReadingPage />} />
              <Route path="fuel-prices" element={<FuelPricesPage />} />
              <Route path="creditors" element={<CreditorsPage />} />
              <Route path="creditors/:creditorId/payments" element={<CreditorPaymentsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="reconciliation" element={<ReconciliationPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="fuel-deliveries" element={<FuelDeliveriesPage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
