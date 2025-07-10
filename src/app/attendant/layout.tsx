import { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'Attendant Dashboard - FuelSync',
  description: 'Attendant dashboard for FuelSync',
};

export default function AttendantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['attendant']}>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </AuthGuard>
  );
}