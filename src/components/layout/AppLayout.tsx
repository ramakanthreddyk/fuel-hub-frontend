import { AlertNotifications } from '@/components/alerts/AlertNotifications';
import { Toaster } from '@/components/ui/toaster';
import { GlobalLoader } from '@/components/ui/GlobalLoader';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      {children}
      <AlertNotifications />
      <GlobalLoader />
      <Toaster />
    </>
  );
}