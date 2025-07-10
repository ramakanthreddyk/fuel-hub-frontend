
import { ReactNode } from 'react';

interface AttendantLayoutProps {
  children: ReactNode;
}

export default function AttendantLayout({ children }: AttendantLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
