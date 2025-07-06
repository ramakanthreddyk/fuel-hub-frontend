
import { Outlet } from 'react-router-dom';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Header } from './Header';

/**
 * SuperAdmin layout component that provides consistent structure
 * for all superadmin pages with sidebar navigation and header.
 */
export function SuperAdminLayout() {
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
