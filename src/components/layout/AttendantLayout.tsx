
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AttendantSidebar } from '@/components/attendant/AttendantSidebar';

const AttendantLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AttendantSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger />
          </header>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AttendantLayout;
