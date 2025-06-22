
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
import LoginPage from "./pages/LoginPage";
import StationsPage from "./pages/dashboard/StationsPage";
import PumpsPage from "./pages/dashboard/PumpsPage";
import NozzlesPage from "./pages/dashboard/NozzlesPage";
import ReadingsPage from "./pages/dashboard/ReadingsPage";
import CreditorsPage from "./pages/dashboard/CreditorsPage";
import FuelPricesPage from "./pages/dashboard/FuelPricesPage";
import UsersPage from "./pages/dashboard/UsersPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SuperAdminTenantsPage from "./pages/superadmin/TenantsPage";
import SuperAdminUsersPage from "./pages/superadmin/UsersPage";
import NewReadingPage from "./pages/dashboard/NewReadingPage";

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
                <Route path="tenants" element={<SuperAdminTenantsPage />} />
                <Route path="users" element={<SuperAdminUsersPage />} />
              </Route>

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <RequireAuth allowedRoles={['owner', 'manager', 'attendant']}>
                  <DashboardLayout />
                </RequireAuth>
              }>
                <Route index element={<StationsPage />} />
                <Route path="stations" element={<StationsPage />} />
                <Route path="stations/:stationId/pumps" element={<PumpsPage />} />
                <Route path="stations/:stationId/pumps/:pumpId/nozzles" element={<NozzlesPage />} />
                <Route path="readings" element={<ReadingsPage />} />
                <Route path="readings/new" element={<NewReadingPage />} />
                <Route path="creditors" element={<CreditorsPage />} />
                <Route path="fuel-prices" element={<FuelPricesPage />} />
                <Route path="users" element={
                  <RequireAuth allowedRoles={['owner', 'manager']}>
                    <UsersPage />
                  </RequireAuth>
                } />
                <Route path="settings" element={<SettingsPage />} />
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
