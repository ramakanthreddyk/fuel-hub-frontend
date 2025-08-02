/**
 * @file SmartDashboard.tsx
 * @description Intelligent dashboard that adapts to user role and device
 */
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ImprovedDashboard } from './ImprovedDashboard';
import { AttendantDashboard } from './AttendantDashboard';

export function SmartDashboard() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'attendant') {
    return <AttendantDashboard />;
  }

  // For owners, managers, and superadmins
  return <ImprovedDashboard />;
}
