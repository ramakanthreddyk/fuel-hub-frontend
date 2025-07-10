/**
 * @file App.tsx
 * @description Main application component with updated routes
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary';
import { Toaster } from './components/ui/toaster';

// Layout Components
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout';
import { ProtectedRoute as AuthProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AttendantDashboardPage from './pages/dashboard/AttendantDashboardPage';
import StationsPage from './pages/dashboard/StationsPage';
import StationDetailPage from './pages/dashboard/StationDetailPage';
import NewStationPage from './pages/dashboard/NewStationPage';
import EditStationPage from './pages/dashboard/EditStationPage';
import StationSettingsPage from './pages/dashboard/StationSettingsPage';
import PumpsPage from './pages/dashboard/PumpsPage';
import PumpDetailPage from './pages/dashboard/PumpDetailPage';
import CreatePumpPage from './pages/dashboard/CreatePumpPage';
import EditPumpPage from './pages/dashboard/EditPumpPage';
import NozzlesPage from './pages/dashboard/NozzlesPage';
import CreateNozzlePage from './pages/dashboard/CreateNozzlePage';
import EditNozzlePage from './pages/dashboard/EditNozzlePage';
import FuelPricesPage from './pages/dashboard/FuelPricesPage';
import ReadingsPage from './pages/dashboard/ReadingsPage';
import NewReadingPage from './pages/dashboard/NewReadingPage';
import ReadingDetailPage from './pages/dashboard/ReadingDetailPage';
import EditReadingPage from './pages/dashboard/EditReadingPage';
import FuelInventoryPage from './pages/dashboard/FuelInventoryPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import StationComparisonPage from './pages/dashboard/StationComparisonPage';
import StationRankingPage from './pages/dashboard/StationRankingPage';
import UpdateInventoryPage from './pages/dashboard/UpdateInventoryPage';
import ReportExportPage from './pages/dashboard/ReportExportPage';
import ResetPasswordPage from './pages/dashboard/ResetPasswordPage';
import ReconciliationPage from './pages/dashboard/ReconciliationPage';
import ReconciliationDetailPage from './pages/dashboard/ReconciliationDetailPage';
import UsersPage from './pages/dashboard/UsersPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import CashReportPage from './pages/dashboard/CashReportPage';
import CashReportsListPage from './pages/dashboard/CashReportsListPage';
import AttendancePage from './pages/dashboard/AttendancePage';
import SalesOverviewPage from './pages/dashboard/SalesOverviewPage';
import SalesPage from './pages/dashboard/SalesPage';
import DailySalesPage from './pages/dashboard/DailySalesPage';

// SuperAdmin Pages
import SuperAdminOverviewPage from './pages/superadmin/OverviewPage';
import SuperAdminTenantsPage from './pages/superadmin/TenantsPage';
import SuperAdminUsersPage from './pages/superadmin/UsersPage';
import SuperAdminPlansPage from './pages/superadmin/PlansPage';
import SuperAdminAnalyticsPage from './pages/superadmin/AnalyticsPage';
import TenantSettingsPage from './pages/superadmin/TenantSettingsPage';
import TenantDetailsPage from './pages/superadmin/TenantDetailsPage';
import SuperAdminSettingsPage from './pages/superadmin/SettingsPage';

function App() {
  console.log('[APP] App component mounting');

  return (
    <GlobalErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="fuelsync-ui-theme">
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Root Landing Route */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/admin" element={<LoginPage />} />
              
              {/* Dashboard Routes */}
              <Route element={<ProtectedRoute allowedRoles={['owner', 'manager', 'superadmin']} redirectPath="/attendant" />}>
                <Route
                  path="/dashboard"
                  element={<DashboardLayout />}
                >
                <Route index element={<RoleDashboard />} />
                
                {/* Station Routes */}
                <Route path="stations" element={<StationsPage />} />
                <Route path="stations/new" element={<NewStationPage />} />
                <Route path="stations/:stationId/edit" element={<EditStationPage />} />
                <Route path="stations/:stationId/settings" element={<StationSettingsPage />} />
                <Route path="stations/:stationId" element={<StationDetailPage />} />
                <Route path="stations/:stationId/pumps" element={<PumpsPage />} />
                <Route path="stations/:stationId/pumps/:pumpId" element={<PumpDetailPage />} />
                <Route path="stations/:stationId/pumps/:pumpId/edit" element={<EditPumpPage />} />
                <Route path="stations/:stationId/pumps/:pumpId/nozzles" element={<NozzlesPage />} />
                <Route path="stations/:stationId/pumps/:pumpId/nozzles/new" element={<CreateNozzlePage />} />
                <Route path="stations/:stationId/pumps/:pumpId/nozzles/:nozzleId/edit" element={<EditNozzlePage />} />
                <Route path="stations/:stationId/pumps/:pumpId/nozzles/:nozzleId/readings/new" element={<NewReadingPage />} />
                
                {/* Pump Routes */}
                <Route path="pumps" element={<PumpsPage />} />
                <Route path="pumps/new" element={<CreatePumpPage />} />
                <Route path="pumps/:pumpId/edit" element={<EditPumpPage />} />
                <Route path="pumps/:pumpId" element={<PumpDetailPage />} />
                <Route path="pumps/:pumpId/nozzles" element={<NozzlesPage />} />
                <Route path="pumps/:pumpId/nozzles/new" element={<CreateNozzlePage />} />
                <Route path="pumps/:pumpId/nozzles/:nozzleId/edit" element={<EditNozzlePage />} />
                
                {/* Nozzle Routes */}
                <Route path="nozzles" element={<NozzlesPage />} />
                <Route path="nozzles/new" element={<CreateNozzlePage />} />
                <Route path="nozzles/:nozzleId" element={<NozzlesPage />} />
                <Route path="nozzles/:nozzleId/edit" element={<EditNozzlePage />} />
                <Route path="nozzles/:nozzleId/readings/new" element={<NewReadingPage />} />
                
                {/* Reading Routes */}
                <Route path="readings" element={<ReadingsPage />} />
                <Route path="readings/new" element={<NewReadingPage />} />
                <Route path="readings/new/:nozzleId" element={<NewReadingPage />} />
                <Route path="readings/:readingId" element={<ReadingDetailPage />} />
                <Route path="readings/:readingId/edit" element={<EditReadingPage />} />
                
                {/* Cash Report Routes */}
                <Route path="cash-report/new" element={<CashReportPage />} />
                <Route path="cash-reports" element={<CashReportsListPage />} />
                <Route path="cash-reports/:reportId" element={<CashReportPage />} />
                
                {/* Sales Routes */}
                <Route path="sales" element={<SalesPage />} />
                <Route path="sales/overview" element={<SalesOverviewPage />} />
                <Route path="sales/daily" element={<DailySalesPage />} />
                
                {/* Attendance Routes */}
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="attendance/shifts" element={<AttendancePage />} />
                <Route path="attendance/mark" element={<AttendancePage />} />
                
                {/* Other Routes */}
                <Route path="fuel-prices" element={<FuelPricesPage />} />
                <Route path="fuel-inventory" element={<FuelInventoryPage />} />
                <Route path="fuel-inventory/update" element={<UpdateInventoryPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="reports/export" element={<ReportExportPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="stations/comparison" element={<StationComparisonPage />} />
                <Route path="stations/ranking" element={<StationRankingPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="users/reset-password" element={<ResetPasswordPage />} />
                <Route path="reconciliation" element={<ReconciliationPage />} />
                <Route path="reconciliation/:reconciliationId" element={<ReconciliationDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Attendant Routes */}
              <Route element={<ProtectedRoute allowedRoles={['attendant']} redirectPath="/dashboard" />}>
                {/* Handle both /attendant and aspirereach.com/attendant */}
                <Route path="/attendant" element={<AttendantDashboardPage />} />
                <Route path="/attendant/dashboard" element={<AttendantDashboardPage />} />
                <Route path="/attendant/readings" element={<Navigate to="/attendant" replace />} />
                <Route path="/attendant/cash-reports" element={<Navigate to="/attendant" replace />} />
                <Route path="/attendant/alerts" element={<Navigate to="/attendant" replace />} />
                <Route path="/attendant/inventory" element={<Navigate to="/attendant" replace />} />
              </Route>

              {/* SuperAdmin Routes */}
              <Route
                path="/superadmin"
                element={
                  <AuthProtectedRoute allowedRoles={['superadmin']}>
                    <SuperAdminLayout />
                  </AuthProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/superadmin/overview" replace />} />
                <Route path="overview" element={<SuperAdminOverviewPage />} />
                <Route path="tenants" element={<SuperAdminTenantsPage />} />
                <Route path="tenants/:tenantId" element={<TenantDetailsPage />} />
                <Route path="tenants/:tenantId/settings" element={<TenantSettingsPage />} />
                <Route path="users" element={<SuperAdminUsersPage />} />
                <Route path="plans" element={<SuperAdminPlansPage />} />
                <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
                <Route path="settings" element={<SuperAdminSettingsPage />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <Toaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}

// Component to show different dashboard based on user role
function RoleDashboard() {
  try {
    const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
    
    if (user.role === 'attendant') {
      return <Navigate to="/attendant" replace />;
    }
    
    return <DashboardPage />;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return <DashboardPage />;
  }
}

export default App;
