import { ReactNode } from 'react';
import { Metadata } from 'next';
import { AttendantSidebar } from '@/components/attendant/AttendantSidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleRedirect } from '@/components/auth/RoleRedirect';

export const metadata: Metadata = {
  title: 'Attendant Dashboard - FuelSync',
  description: 'Attendant portal for FuelSync',
};

interface AttendantLayoutProps {
  children: ReactNode;
}

export default function AttendantLayout({ children }: AttendantLayoutProps) {
  return (
    <AuthGuard>
      <RoleRedirect allowedRoles={['attendant']} redirectPath="/dashboard">
        <div className="flex min-h-screen">
          {/* Sidebar - hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="h-full">
              <AttendantSidebar />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </div>
      </RoleRedirect>
    </AuthGuard>
  );
}
