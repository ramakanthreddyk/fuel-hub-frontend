
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import LoginPage from "./pages/LoginPage";
import StationsPage from "./pages/dashboard/StationsPage";
import PumpsPage from "./pages/dashboard/PumpsPage";
import NozzlesPage from "./pages/dashboard/NozzlesPage";
import ReadingsPage from "./pages/dashboard/ReadingsPage";
import SalesPage from "./pages/dashboard/SalesPage";
import CreditorsPage from "./pages/dashboard/CreditorsPage";
import CreditorPaymentsPage from "./pages/dashboard/CreditorPaymentsPage";
import FuelPricesPage from "./pages/dashboard/FuelPricesPage";
import FuelDeliveriesPage from "./pages/dashboard/FuelDeliveriesPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import UsersPage from "./pages/dashboard/UsersPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import SuperAdminTenantsPage from "./pages/superadmin/TenantsPage";
import TenantDetailsPage from "./pages/superadmin/TenantDetailsPage";
import SuperAdminUsersPage from "./pages/superadmin/UsersPage";
import NewReadingPage from "./pages/dashboard/NewReadingPage";
import ReconciliationPage from "./pages/dashboard/ReconciliationPage";
import SummaryPage from "./pages/dashboard/SummaryPage";
import SuperAdminOverviewPage from "./pages/superadmin/OverviewPage";
import CreateTenantPage from "./pages/superadmin/CreateTenantPage";
import PlansPage from "./pages/superadmin/PlansPage";
import AnalyticsPage from "./pages/superadmin/AnalyticsPage";

// Create QueryClient instance outside of component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* SuperAdmin Routes */}
              <Route path="/superadmin" element={
                <RequireAuth allowedRoles={['superadmin']}>
                  <DashboardLayout />
                </RequireAuth>
              }>
                <Route index element={<SuperAdminOverviewPage />} />
                <Route path="overview" element={<SuperAdminOverviewPage />} />
                <Route path="tenants" element={<SuperAdminTenantsPage />} />
                <Route path="tenants/new" element={<CreateTenantPage />} />
                <Route path="tenants/:tenantId" element={<TenantDetailsPage />} />
                <Route path="users" element={<SuperAdminUsersPage />} />
                <Route path="plans" element={<PlansPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
              </Route>

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <RequireAuth allowedRoles={['owner', 'manager', 'attendant']}>
                  <DashboardLayout />
                </RequireAuth>
              }>
                <Route index element={<StationsPage />} />
                <Route path="summary" element={<SummaryPage />} />
                <Route path="stations" element={<StationsPage />} />
                <Route path="stations/:stationId/pumps" element={<PumpsPage />} />
                <Route path="stations/:stationId/pumps/:pumpId/nozzles" element={<NozzlesPage />} />
                <Route path="readings" element={<ReadingsPage />} />
                <Route path="readings/new" element={<NewReadingPage />} />
                <Route path="reconciliation" element={
                  <RequireAuth allowedRoles={['owner', 'manager']}>
                    <ReconciliationPage />
                  </RequireAuth>
                } />
                <Route path="sales" element={<SalesPage />} />
                <Route path="creditors" element={<CreditorsPage />} />
                <Route path="creditors/:id/payments" element={<CreditorPaymentsPage />} />
                <Route path="fuel-prices" element={<FuelPricesPage />} />
                <Route path="fuel-deliveries" element={<FuelDeliveriesPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="users" element={
                  <RequireAuth allowedRoles={['owner', 'manager']}>
                    <UsersPage />
                  </RequireAuth>
                } />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="reports" element={<ReportsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
