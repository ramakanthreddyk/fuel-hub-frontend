
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset, Sidebar } from '@/components/ui/sidebar';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Header } from './Header';
import { useState } from 'react';

/**
 * SuperAdmin layout component that provides consistent structure
 * for all superadmin pages with sidebar navigation and header.
 */
export function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <SuperAdminSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <Header onMobileMenuClick={() => setMobileOpen(!mobileOpen)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
        
        {/* Mobile sidebar */}
        <div className="lg:hidden">
          <Sidebar>
            <div className={`fixed inset-0 z-50 bg-black/50 ${mobileOpen ? 'block' : 'hidden'}`} onClick={() => setMobileOpen(false)} />
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="h-full overflow-y-auto">
                <SuperAdminSidebar />
              </div>
            </div>
          </Sidebar>
        </div>
      </div>
    </SidebarProvider>
  );
}
