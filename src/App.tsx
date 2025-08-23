/**
 * @file App.tsx
 * @description Main application component with role-based routing and lazy loading
 */
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { secureLog } from '@/utils/security';

// Import context providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import test utility for debugging
import './utils/testNozzleHierarchy';

// Notifications
import { DailyReminderToast } from './components/notifications/DailyReminderToast';

// Core layouts and pages (non-feature specific)
const ModernLandingPage = React.lazy(() => import('./pages/ModernLandingPage'));

// Layout Components
const SmartLayout = React.lazy(() => import('./components/layout/ModernLayout').then(module => ({ default: module.SmartLayout })));
const SuperAdminLayout = React.lazy(() => import('./components/layout/SuperAdminLayout'));
const AttendantLayout = React.lazy(() => import('./components/layout/AttendantLayout'));

// Feature-based lazy imports
// Auth Feature
const LoginPage = React.lazy(() => import('./features/auth/pages/LoginPage'));

// Dashboard Feature
const DashboardPage = React.lazy(() => import('./features/dashboard/pages/DashboardPage'));
const AnalyticsPage = React.lazy(() => import('./features/dashboard/pages/AnalyticsPage'));
const SummaryPage = React.lazy(() => import('./features/dashboard/pages/SummaryPage'));

// Stations Feature
const StationsPage = React.lazy(() => import('./features/stations/pages/StationsPage'));

// Pumps Feature  
const PumpsPage = React.lazy(() => import('./features/pumps/pages/PumpsPage'));

// Nozzles Feature
const NozzlesPage = React.lazy(() => import('./features/nozzles/pages/NozzlesPage'));

// Readings Feature
const ReadingsPage = React.lazy(() => import('./features/readings/pages/ReadingsPage'));

// Users Feature
const UsersPage = React.lazy(() => import('./features/users/pages/UsersPage'));

// Settings Feature
const SettingsPage = React.lazy(() => import('./features/settings/pages/SettingsPage'));

// Fuel Prices Feature
const FuelPricesPage = React.lazy(() => import('./features/fuel-prices/pages/FuelPricesPage'));

// Legacy imports for pages not yet moved (keeping these for now)
const StationDetailPage = React.lazy(() => import('./pages/dashboard/StationDetailPage'));
const NewStationPage = React.lazy(() => import('./pages/dashboard/NewStationPage'));
const EditStationPage = React.lazy(() => import('./pages/dashboard/EditStationPage'));
const StationSettingsPage = React.lazy(() => import('./pages/dashboard/StationSettingsPage'));
const PumpDetailPage = React.lazy(() => import('./pages/dashboard/PumpDetailPage'));
const CreatePumpPage = React.lazy(() => import('./pages/dashboard/CreatePumpPage'));
const EditPumpPage = React.lazy(() => import('./pages/dashboard/EditPumpPage'));
const CreateNozzlePage = React.lazy(() => import('./pages/dashboard/CreateNozzlePage'));
const EditNozzlePage = React.lazy(() => import('./pages/dashboard/EditNozzlePage'));
const SalesPage = React.lazy(() => import('./pages/dashboard/SalesPage'));
const SalesOverviewPage = React.lazy(() => import('./pages/dashboard/SalesOverviewPage'));
const ReportsPage = React.lazy(() => import('./pages/dashboard/ReportsPage'));
const InventoryPage = React.lazy(() => import('./pages/dashboard/InventoryPage'));
const ReconciliationPage = React.lazy(() => import('./pages/dashboard/ReconciliationPage'));
const ReconciliationDetailPage = React.lazy(() => import('./pages/dashboard/ReconciliationDetailPage'));
const SimpleReadingPage = React.lazy(() => import('./pages/dashboard/SimpleReadingPage'));
const ReadingDetailPage = React.lazy(() => import('./pages/dashboard/ReadingDetailPage'));
const FuelInventoryPage = React.lazy(() => import('./pages/dashboard/FuelInventoryPage'));
const CreditorsPage = React.lazy(() => import('./pages/dashboard/CreditorsPage'));
const NewCreditorPage = React.lazy(() => import('./pages/dashboard/NewCreditorPage'));
const CreditorDetailPage = React.lazy(() => import('./pages/dashboard/CreditorDetailPage'));
const NewCreditorPaymentPage = React.lazy(() => import('./pages/dashboard/NewCreditorPaymentPage'));
const CashReportPage = React.lazy(() => import('./pages/dashboard/CashReportPage'));
const SimpleCashReportSubmission = React.lazy(() => import('./pages/dashboard/SimpleCashReportSubmission'));
const TestCashReportPage = React.lazy(() => import('./pages/dashboard/TestCashReportPage'));
const CashReportsListPage = React.lazy(() => import('./pages/dashboard/CashReportsListPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/dashboard/ResetPasswordPage'));

// Attendant Pages
const AttendantDashboard = React.lazy(() => import('./pages/attendant/AttendantDashboard'));
const SimpleReadingEntry = React.lazy(() => import('./pages/attendant/SimpleReadingEntry'));
const SimpleCashReport = React.lazy(() => import('./pages/attendant/SimpleCashReport'));
const AttendantAlertsPage = React.lazy(() => import('./pages/attendant/AttendantAlertsPage'));
const AttendantInventoryPage = React.lazy(() => import('./pages/attendant/AttendantInventoryPage'));

// SuperAdmin Pages
const SuperAdminOverviewPage = React.lazy(() => import('./pages/superadmin/OverviewPage'));
const SuperAdminTenantsPage = React.lazy(() => import('./pages/superadmin/TenantsPage'));
const TenantDetailsPage = React.lazy(() => import('./pages/superadmin/TenantDetailsPage'));
const TenantSettingsPage = React.lazy(() => import('./pages/superadmin/TenantSettingsPage'));
const SuperAdminUsersPage = React.lazy(() => import('./pages/superadmin/UsersPage'));
const SuperAdminPlansPage = React.lazy(() => import('./pages/superadmin/PlansPage'));
const SuperAdminAnalyticsPage = React.lazy(() => import('./pages/superadmin/AnalyticsPage'));
const SuperAdminSettingsPage = React.lazy(() => import('./pages/superadmin/SettingsPage'));

// Types for user roles
type UserRole = 'superadmin' | 'owner' | 'manager' | 'attendant';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Enhanced Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode }, 
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    secureLog.error('Component Error:', error, errorInfo);
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

// Safe component wrapper with suspense
const SafeComponent = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Role-based redirect helper
const getRoleBasedRedirect = (role?: UserRole): string => {
  switch (role) {
    case 'superadmin':
      return '/superadmin/overview';
    case 'attendant':
      return '/attendant/dashboard';
    case 'owner':
    case 'manager':
    default:
      return '/dashboard';
  }
};

// Router component that handles authentication logic
const AppRouter = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  secureLog.debug('Auth state initialized');

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

  // If user is authenticated, show authenticated routes
  if (isAuthenticated && user) {
    return (
      <Routes>
        {/* SuperAdmin Routes */}
        <Route path="/superadmin" element={
          <SafeComponent>
            <SuperAdminLayout />
          </SafeComponent>
        }>
          <Route index element={<Navigate to="/superadmin/overview" replace />} />
          <Route path="overview" element={
            <SafeComponent>
              <SuperAdminOverviewPage />
            </SafeComponent>
          } />
          <Route path="tenants" element={
            <SafeComponent>
              <SuperAdminTenantsPage />
            </SafeComponent>
          } />
          <Route path="tenants/:tenantId" element={
            <SafeComponent>
              <TenantDetailsPage />
            </SafeComponent>
          } />
          <Route path="tenants/:tenantId/settings" element={
            <SafeComponent>
              <TenantSettingsPage />
            </SafeComponent>
          } />
          <Route path="users" element={
            <SafeComponent>
              <SuperAdminUsersPage />
            </SafeComponent>
          } />
          <Route path="plans" element={
            <SafeComponent>
              <SuperAdminPlansPage />
            </SafeComponent>
          } />
          <Route path="analytics" element={
            <SafeComponent>
              <SuperAdminAnalyticsPage />
            </SafeComponent>
          } />
          <Route path="settings" element={
            <SafeComponent>
              <SuperAdminSettingsPage />
            </SafeComponent>
          } />
        </Route>

        {/* Attendant Routes */}
        <Route path="/attendant" element={
          <SafeComponent>
            <AttendantLayout />
          </SafeComponent>
        }>
          <Route index element={<Navigate to="/attendant/dashboard" replace />} />
          <Route path="dashboard" element={
            <SafeComponent>
              <AttendantDashboard />
            </SafeComponent>
          } />
          <Route path="readings" element={
            <SafeComponent>
              <SimpleReadingEntry />
            </SafeComponent>
          } />
          <Route path="cash-reports" element={
            <SafeComponent>
              <SimpleCashReport />
            </SafeComponent>
          } />
          <Route path="alerts" element={
            <SafeComponent>
              <AttendantAlertsPage />
            </SafeComponent>
          } />
          <Route path="inventory" element={
            <SafeComponent>
              <AttendantInventoryPage />
            </SafeComponent>
          } />
        </Route>

        {/* Dashboard Routes for Owner/Manager */}
        <Route path="/dashboard/*" element={
          <SafeComponent>
            <SmartLayout>
              <Routes>
                <Route index element={
                  <SafeComponent>
                    <DashboardPage />
                  </SafeComponent>
                } />
                <Route path="stations" element={
                  <SafeComponent>
                    <StationsPage />
                  </SafeComponent>
                } />
                <Route path="stations/new" element={
                  <SafeComponent>
                    <NewStationPage />
                  </SafeComponent>
                } />
                <Route path="stations/:stationId" element={
                  <SafeComponent>
                    <StationDetailPage />
                  </SafeComponent>
                } />
                <Route path="stations/:stationId/edit" element={
                  <SafeComponent>
                    <EditStationPage />
                  </SafeComponent>
                } />
                <Route path="stations/:stationId/settings" element={
                  <SafeComponent>
                    <StationSettingsPage />
                  </SafeComponent>
                } />
                <Route path="stations/:stationId/pumps" element={
                  <SafeComponent>
                    <PumpsPage />
                  </SafeComponent>
                } />
                <Route path="pumps" element={
                  <SafeComponent>
                    <PumpsPage />
                  </SafeComponent>
                } />
                <Route path="pumps/new" element={
                  <SafeComponent>
                    <CreatePumpPage />
                  </SafeComponent>
                } />
                <Route path="pumps/:pumpId" element={
                  <SafeComponent>
                    <PumpDetailPage />
                  </SafeComponent>
                } />
                <Route path="pumps/:pumpId/edit" element={
                  <SafeComponent>
                    <EditPumpPage />
                  </SafeComponent>
                } />
                <Route path="pumps/:pumpId/nozzles" element={
                  <SafeComponent>
                    <NozzlesPage />
                  </SafeComponent>
                } />
                <Route path="nozzles" element={
                  <SafeComponent>
                    <NozzlesPage />
                  </SafeComponent>
                } />
                <Route path="nozzles/new" element={
                  <SafeComponent>
                    <CreateNozzlePage />
                  </SafeComponent>
                } />
                <Route path="nozzles/:nozzleId/edit" element={
                  <SafeComponent>
                    <EditNozzlePage />
                  </SafeComponent>
                } />
                <Route path="readings" element={
                  <SafeComponent>
                    <ReadingsPage />
                  </SafeComponent>
                } />
                <Route path="readings/new" element={
                  <SafeComponent>
                    <SimpleReadingPage />
                  </SafeComponent>
                } />
                <Route path="readings/:readingId" element={
                  <SafeComponent>
                    <ReadingDetailPage />
                  </SafeComponent>
                } />
                <Route path="fuel-prices" element={
                  <SafeComponent>
                    <FuelPricesPage />
                  </SafeComponent>
                } />
                <Route path="fuel-inventory" element={
                  <SafeComponent>
                    <FuelInventoryPage />
                  </SafeComponent>
                } />
                <Route path="sales" element={
                  <SafeComponent>
                    <SalesPage />
                  </SafeComponent>
                } />
                <Route path="sales/overview" element={
                  <SafeComponent>
                    <SalesOverviewPage />
                  </SafeComponent>
                } />
                <Route path="reports" element={
                  <SafeComponent>
                    <ReportsPage />
                  </SafeComponent>
                } />
                <Route path="analytics" element={
                  <SafeComponent>
                    <AnalyticsPage />
                  </SafeComponent>
                } />
                <Route path="inventory" element={
                  <SafeComponent>
                    <InventoryPage />
                  </SafeComponent>
                } />
                <Route path="creditors" element={
                  <SafeComponent>
                    <CreditorsPage />
                  </SafeComponent>
                } />
                <Route path="creditors/new" element={
                  <SafeComponent>
                    <NewCreditorPage />
                  </SafeComponent>
                } />
                <Route path="creditors/:creditorId" element={
                  <SafeComponent>
                    <CreditorDetailPage />
                  </SafeComponent>
                } />
                <Route path="creditors/:creditorId/payments/new" element={
                  <SafeComponent>
                    <NewCreditorPaymentPage />
                  </SafeComponent>
                } />
                <Route path="cash-reports" element={
                  <SafeComponent>
                    <CashReportsListPage />
                  </SafeComponent>
                } />
                <Route path="cash-reports/new" element={
                  <SafeComponent>
                    <CashReportPage />
                  </SafeComponent>
                } />
                <Route path="cash-reports/simple" element={
                  <SafeComponent>
                    <SimpleCashReportSubmission />
                  </SafeComponent>
                } />
                <Route path="cash-reports/test" element={
                  <SafeComponent>
                    <TestCashReportPage />
                  </SafeComponent>
                } />
                <Route path="users" element={
                  <SafeComponent>
                    <UsersPage />
                  </SafeComponent>
                } />
                <Route path="reconciliation" element={
                  <SafeComponent>
                    <ReconciliationPage />
                  </SafeComponent>
                } />
                <Route path="reconciliation/:reconciliationId" element={
                  <SafeComponent>
                    <ReconciliationDetailPage />
                  </SafeComponent>
                } />
                <Route path="settings" element={
                  <SafeComponent>
                    <SettingsPage />
                  </SafeComponent>
                } />
                <Route path="reset-password" element={
                  <SafeComponent>
                    <ResetPasswordPage />
                  </SafeComponent>
                } />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </SmartLayout>
          </SafeComponent>
        } />

        {/* Role-based default redirects */}
        <Route path="/" element={<Navigate to={getRoleBasedRedirect(user?.role as UserRole)} replace />} />
        <Route path="*" element={<Navigate to={getRoleBasedRedirect(user?.role as UserRole)} replace />} />
      </Routes>
    );
  }

  // If not authenticated, show public routes
  return (
    <Routes>
      <Route path="/" element={
        <SafeComponent>
          <ModernLandingPage />
        </SafeComponent>
      } />
      <Route path="/login" element={
        <SafeComponent>
          <LoginPage />
        </SafeComponent>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App component with proper provider wrapping
const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <Suspense fallback={<LoadingSpinner />}>
              <AppRouter />
            </Suspense>
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
};

export default App;
