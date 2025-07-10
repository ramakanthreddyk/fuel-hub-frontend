import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RoleRedirect } from '../auth/RoleRedirect';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleRedirect allowedRoles={['owner', 'manager', 'superadmin']} redirectPath="/attendant">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 transition-colors">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="lg:pl-72">
          <Header onMobileMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden">
            <div className="w-full max-w-full">
              <div className="w-full min-w-0">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleRedirect>
  );
}
