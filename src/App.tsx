/**
 * @file App.tsx
 * @description Main application component with role-based routing
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Import pages
import ModernLandingPage from './pages/ModernLandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Import modern layout components
import { SmartLayout } from './components/layout/ModernLayout';

// Import test utility for debugging
import './utils/testNozzleHierarchy';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout';
import { AttendantLayout } from './components/layout/AttendantLayout';

// Import dashboard pages
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
import SalesPage from './pages/dashboard/SalesPage';
import SalesOverviewPage from './pages/dashboard/SalesOverviewPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import InventoryPage from './pages/dashboard/InventoryPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import UsersPage from './pages/dashboard/UsersPage';
import ReconciliationPage from './pages/dashboard/ReconciliationPage';
import ReconciliationDetailPage from './pages/dashboard/ReconciliationDetailPage';
import ReadingsPage from './pages/dashboard/ReadingsPage';
import SimpleReadingPage from './pages/dashboard/SimpleReadingPage';
import ReadingDetailPage from './pages/dashboard/ReadingDetailPage';
import FuelPricesPage from './pages/dashboard/FuelPricesPage';
import FuelInventoryPage from './pages/dashboard/FuelInventoryPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import CreditorsPage from './pages/dashboard/CreditorsPage';
import NewCreditorPage from './pages/dashboard/NewCreditorPage';
import CreditorDetailPage from './pages/dashboard/CreditorDetailPage';
import NewCreditorPaymentPage from './pages/dashboard/NewCreditorPaymentPage';
import CashReportPage from './pages/dashboard/CashReportPage';
import SimpleCashReportSubmission from './pages/dashboard/SimpleCashReportSubmission';
import TestCashReportPage from './pages/dashboard/TestCashReportPage';
import CashReportsListPage from './pages/dashboard/CashReportsListPage';
import { QuickReadingButton } from './components/readings/QuickReadingButton';
import { CashReportTest } from './components/test/CashReportTest';

// Attendant Pages
import AttendantDashboard from './pages/attendant/AttendantDashboard';
import SimpleReadingEntry from './pages/attendant/SimpleReadingEntry';
import SimpleCashReport from './pages/attendant/SimpleCashReport';

// SuperAdmin Pages
import SuperAdminOverviewPage from './pages/superadmin/OverviewPage';
import SuperAdminTenantsPage from './pages/superadmin/TenantsPage';
import TenantDetailsPage from './pages/superadmin/TenantDetailsPage';
import TenantSettingsPage from './pages/superadmin/TenantSettingsPage';
import SuperAdminUsersPage from './pages/superadmin/UsersPage';
import SuperAdminPlansPage from './pages/superadmin/PlansPage';
import SuperAdminAnalyticsPage from './pages/superadmin/AnalyticsPage';
import SuperAdminSettingsPage from './pages/superadmin/SettingsPage';

// Reset Password
import ResetPasswordPage from './pages/dashboard/ResetPasswordPage';

// Notifications
import { DailyReminderToast } from './components/notifications/DailyReminderToast';

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Something went wrong</h3>
              <p className="mt-1 text-sm text-gray-500">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe component wrapper
function SafeComponent({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

// Router component that handles authentication logic
function AppRouter() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  console.log('[APP-ROUTER] Auth state:', {
    isAuthenticated,
    user: user?.email,
    role: user?.role,
    isLoading,
    hasToken: !!localStorage.getItem('fuelsync_token'),
    hasStoredUser: !!localStorage.getItem('fuelsync_user')
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing FuelSync...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show all routes
  if (isAuthenticated && user) {
    return (
      <Routes>
        {/* SuperAdmin Routes */}
        <Route path="/superadmin" element={<SuperAdminLayout />}>
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

        {/* Attendant Routes */}
        <Route path="/attendant" element={<AttendantLayout />}>
          <Route index element={<AttendantDashboard />} />
          <Route path="dashboard" element={<AttendantDashboard />} />
          <Route path="readings" element={<SimpleReadingEntry />} />
          <Route path="cash-reports" element={<SimpleCashReport />} />
        </Route>

        {/* Dashboard Routes for Owner/Manager */}
        <Route path="/dashboard/*" element={
          <SmartLayout>
            <Routes>
              <Route index element={<SafeComponent><DashboardPage /></SafeComponent>} />
              <Route path="stations" element={<SafeComponent><StationsPage /></SafeComponent>} />
              <Route path="stations/new" element={<SafeComponent><NewStationPage /></SafeComponent>} />
              <Route path="stations/:stationId" element={<SafeComponent><StationDetailPage /></SafeComponent>} />
              <Route path="stations/:stationId/edit" element={<SafeComponent><EditStationPage /></SafeComponent>} />
              <Route path="stations/:stationId/settings" element={<SafeComponent><StationSettingsPage /></SafeComponent>} />
              <Route path="stations/:stationId/pumps" element={<SafeComponent><PumpsPage /></SafeComponent>} />
              <Route path="pumps" element={<SafeComponent><PumpsPage /></SafeComponent>} />
              <Route path="pumps/new" element={<SafeComponent><CreatePumpPage /></SafeComponent>} />
              <Route path="pumps/:pumpId" element={<SafeComponent><PumpDetailPage /></SafeComponent>} />
              <Route path="pumps/:pumpId/edit" element={<SafeComponent><EditPumpPage /></SafeComponent>} />
              <Route path="pumps/:pumpId/nozzles" element={<SafeComponent><NozzlesPage /></SafeComponent>} />
              <Route path="nozzles" element={<SafeComponent><NozzlesPage /></SafeComponent>} />
              <Route path="nozzles/new" element={<SafeComponent><CreateNozzlePage /></SafeComponent>} />
              <Route path="nozzles/:nozzleId/edit" element={<SafeComponent><EditNozzlePage /></SafeComponent>} />
              <Route path="readings" element={<SafeComponent><ReadingsPage /></SafeComponent>} />
              <Route path="readings/new" element={<SafeComponent><SimpleReadingPage /></SafeComponent>} />
              <Route path="readings/:readingId" element={<SafeComponent><ReadingDetailPage /></SafeComponent>} />
              <Route path="fuel-prices" element={<SafeComponent><FuelPricesPage /></SafeComponent>} />
              <Route path="fuel-inventory" element={<SafeComponent><FuelInventoryPage /></SafeComponent>} />
              <Route path="sales" element={<SafeComponent><SalesPage /></SafeComponent>} />
              <Route path="sales/overview" element={<SafeComponent><SalesOverviewPage /></SafeComponent>} />
              <Route path="reports" element={<SafeComponent><ReportsPage /></SafeComponent>} />
              <Route path="analytics" element={<SafeComponent><AnalyticsPage /></SafeComponent>} />
              <Route path="inventory" element={<SafeComponent><InventoryPage /></SafeComponent>} />
              <Route path="creditors" element={<SafeComponent><CreditorsPage /></SafeComponent>} />
              <Route path="creditors/new" element={<SafeComponent><NewCreditorPage /></SafeComponent>} />
              <Route path="creditors/:creditorId" element={<SafeComponent><CreditorDetailPage /></SafeComponent>} />
              <Route path="creditors/:creditorId/payments/new" element={<SafeComponent><NewCreditorPaymentPage /></SafeComponent>} />
              <Route path="cash-reports" element={<SafeComponent><CashReportsListPage /></SafeComponent>} />
              <Route path="cash-reports/new" element={<SafeComponent><CashReportPage /></SafeComponent>} />
              <Route path="cash-reports/simple" element={<SafeComponent><SimpleCashReportSubmission /></SafeComponent>} />
              <Route path="cash-reports/test" element={<SafeComponent><TestCashReportPage /></SafeComponent>} />
              <Route path="users" element={<SafeComponent><UsersPage /></SafeComponent>} />
              <Route path="reconciliation" element={<SafeComponent><ReconciliationPage /></SafeComponent>} />
              <Route path="reconciliation/:reconciliationId" element={<SafeComponent><ReconciliationDetailPage /></SafeComponent>} />
              <Route path="settings" element={<SafeComponent><SettingsPage /></SafeComponent>} />
              <Route path="reset-password" element={<SafeComponent><ResetPasswordPage /></SafeComponent>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </SmartLayout>
        } />

        {/* Role-based default redirects */}
        <Route path="/" element={
          user?.role === 'superadmin' ? <Navigate to="/superadmin/overview" replace /> :
          user?.role === 'attendant' ? <Navigate to="/attendant/dashboard" replace /> :
          <Navigate to="/dashboard" replace />
        } />
        <Route path="*" element={
          user?.role === 'superadmin' ? <Navigate to="/superadmin/overview" replace /> :
          user?.role === 'attendant' ? <Navigate to="/attendant/dashboard" replace /> :
          <Navigate to="/dashboard" replace />
        } />
      </Routes>
    );
  }

  // If not authenticated, show public routes
  return (
    <Routes>
      <Route path="/" element={<ModernLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <AppRouter />
            <DailyReminderToast enabled={true} showOnMount={true} />
            <Toaster
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
              toastOptions={{
                duration: 4000,
                style: {
                  fontSize: '14px',
                },
              }}
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
