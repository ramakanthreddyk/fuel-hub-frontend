/**
 * @file SmartDashboard.tsx
 * @description Intelligent dashboard that adapts to user role and device
 */
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ImprovedDashboard } from './ImprovedDashboard';
import { AttendantDashboard } from './AttendantDashboard';
import { PlanUsageWidget } from './PlanUsageWidget';
import { CashReportWidget } from './CashReportWidget';

export function SmartDashboard() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'attendant') {
    return <AttendantDashboard />;
  }

  // SuperAdmin users should not access tenant-specific dashboards
  if (user?.role === 'superadmin') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">SuperAdmin Dashboard</h2>
        <p className="text-gray-600 mb-4">Please use the SuperAdmin interface to manage the platform.</p>
        <a href="/superadmin/overview" className="text-blue-600 hover:underline">
          Go to SuperAdmin Dashboard →
        </a>
      </div>
    );
  }

  // For owners and managers only
  return (
    <div className="space-y-4">
      <ImprovedDashboard />
      <div className="flex gap-4 flex-wrap">
        <PlanUsageWidget 
          planName="Premium"
          currentStations={1}
          maxStations={3}
          currentUsers={3}
          maxUsers={10}
          className="max-w-sm"
        />
        <CashReportWidget />
      </div>
    </div>
  );
}
