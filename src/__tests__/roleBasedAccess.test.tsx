/**
 * @file __tests__/roleBasedAccess.test.tsx
 * @description Comprehensive tests for role-based access control system
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { PermissionGate, ViewGate, CreateGate, RoleGate, PlanGate } from '@/components/auth/PermissionGate';

// Mock the auth context
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'owner' as const,
  tenantId: 'tenant-1',
  planName: 'Premium'
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    isLoading: false
  })
}));

// Test component that uses the hook
function TestComponent() {
  const { 
    hasAccess, 
    canView, 
    canCreate, 
    canEdit, 
    canDelete, 
    planTier, 
    role,
    getUpgradeMessage,
    getRestrictedFeatures
  } = useRoleBasedAccess();

  return (
    <div>
      <div data-testid="plan-tier">{planTier}</div>
      <div data-testid="role">{role}</div>
      <div data-testid="can-view-reports">{canView('reports').toString()}</div>
      <div data-testid="can-create-stations">{canCreate('stations').toString()}</div>
      <div data-testid="can-edit-users">{canEdit('users').toString()}</div>
      <div data-testid="can-delete-stations">{canDelete('stations').toString()}</div>
      <div data-testid="has-analytics-access">{hasAccess('analytics', 'view').toString()}</div>
      <div data-testid="upgrade-message">{getUpgradeMessage('analytics') || 'none'}</div>
      <div data-testid="restricted-features">{getRestrictedFeatures().join(',')}</div>
    </div>
  );
}

describe('Role-Based Access Control', () => {
  beforeEach(() => {
    // Reset mock user to default
    mockUser.role = 'owner';
    mockUser.planName = 'Premium';
  });

  describe('useRoleBasedAccess Hook', () => {
    it('should return correct permissions for Pro plan owner', () => {
      render(<TestComponent />);
      
      expect(screen.getByTestId('plan-tier')).toHaveTextContent('pro');
      expect(screen.getByTestId('role')).toHaveTextContent('owner');
      expect(screen.getByTestId('can-view-reports')).toHaveTextContent('true');
      expect(screen.getByTestId('can-create-stations')).toHaveTextContent('true');
      expect(screen.getByTestId('can-edit-users')).toHaveTextContent('true');
      expect(screen.getByTestId('can-delete-stations')).toHaveTextContent('true');
      expect(screen.getByTestId('has-analytics-access')).toHaveTextContent('true');
    });

    it('should restrict features for starter plan', () => {
      mockUser.planName = 'Regular';
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('plan-tier')).toHaveTextContent('starter');
      expect(screen.getByTestId('can-view-reports')).toHaveTextContent('false');
      expect(screen.getByTestId('has-analytics-access')).toHaveTextContent('false');
      expect(screen.getByTestId('can-delete-stations')).toHaveTextContent('false');
    });

    it('should restrict features for attendant role', () => {
      mockUser.role = 'attendant';
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('can-create-stations')).toHaveTextContent('false');
      expect(screen.getByTestId('can-edit-users')).toHaveTextContent('false');
      expect(screen.getByTestId('can-view-reports')).toHaveTextContent('false');
    });

    it('should provide upgrade messages for restricted features', () => {
      mockUser.planName = 'Regular';
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('upgrade-message')).toHaveTextContent('Upgrade to Pro or Enterprise to access this feature');
    });

    it('should list restricted features correctly', () => {
      mockUser.role = 'attendant';
      mockUser.planName = 'Regular';
      
      render(<TestComponent />);
      
      const restrictedFeatures = screen.getByTestId('restricted-features').textContent;
      expect(restrictedFeatures).toContain('reports');
      expect(restrictedFeatures).toContain('analytics');
      expect(restrictedFeatures).toContain('users');
    });
  });

  describe('PermissionGate Component', () => {
    it('should render children when permission is granted', () => {
      render(
        <PermissionGate feature="stations" action="view">
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGate>
      );
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should render fallback when permission is denied', () => {
      mockUser.role = 'attendant';
      
      render(
        <PermissionGate 
          feature="users" 
          action="view"
          fallback={<div data-testid="fallback">Access Denied</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGate>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('should show upgrade prompt when enabled', () => {
      mockUser.planName = 'Regular';
      
      render(
        <PermissionGate 
          feature="reports" 
          action="view"
          showUpgradePrompt={true}
        >
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGate>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByText(/Upgrade to Pro or Enterprise/)).toBeInTheDocument();
    });
  });

  describe('Convenience Gate Components', () => {
    it('ViewGate should work correctly', () => {
      render(
        <ViewGate feature="stations">
          <div data-testid="view-content">View Content</div>
        </ViewGate>
      );
      
      expect(screen.getByTestId('view-content')).toBeInTheDocument();
    });

    it('CreateGate should work correctly', () => {
      render(
        <CreateGate feature="stations">
          <div data-testid="create-content">Create Content</div>
        </CreateGate>
      );
      
      expect(screen.getByTestId('create-content')).toBeInTheDocument();
    });

    it('CreateGate should deny access for attendant', () => {
      mockUser.role = 'attendant';
      
      render(
        <CreateGate 
          feature="stations"
          fallback={<div data-testid="create-denied">Create Denied</div>}
        >
          <div data-testid="create-content">Create Content</div>
        </CreateGate>
      );
      
      expect(screen.queryByTestId('create-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('create-denied')).toBeInTheDocument();
    });
  });

  describe('RoleGate Component', () => {
    it('should render children for allowed roles', () => {
      render(
        <RoleGate allowedRoles={['owner', 'manager']}>
          <div data-testid="role-content">Role Content</div>
        </RoleGate>
      );
      
      expect(screen.getByTestId('role-content')).toBeInTheDocument();
    });

    it('should render fallback for disallowed roles', () => {
      mockUser.role = 'attendant';
      
      render(
        <RoleGate 
          allowedRoles={['owner', 'manager']}
          fallback={<div data-testid="role-denied">Role Denied</div>}
        >
          <div data-testid="role-content">Role Content</div>
        </RoleGate>
      );
      
      expect(screen.queryByTestId('role-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('role-denied')).toBeInTheDocument();
    });
  });

  describe('PlanGate Component', () => {
    it('should render children for sufficient plan', () => {
      render(
        <PlanGate requiredPlan="pro">
          <div data-testid="plan-content">Plan Content</div>
        </PlanGate>
      );
      
      expect(screen.getByTestId('plan-content')).toBeInTheDocument();
    });

    it('should render fallback for insufficient plan', () => {
      mockUser.planName = 'Regular'; // starter plan
      
      render(
        <PlanGate 
          requiredPlan="pro"
          fallback={<div data-testid="plan-denied">Plan Denied</div>}
        >
          <div data-testid="plan-content">Plan Content</div>
        </PlanGate>
      );
      
      expect(screen.queryByTestId('plan-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('plan-denied')).toBeInTheDocument();
    });

    it('should show upgrade prompt for insufficient plan', () => {
      mockUser.planName = 'Regular';
      
      render(
        <PlanGate 
          requiredPlan="pro"
          showUpgradePrompt={true}
        >
          <div data-testid="plan-content">Plan Content</div>
        </PlanGate>
      );
      
      expect(screen.queryByTestId('plan-content')).not.toBeInTheDocument();
      expect(screen.getByText(/requires pro plan or higher/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing user gracefully', () => {
      vi.mocked(require('@/contexts/AuthContext').useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      
      render(
        <PermissionGate 
          feature="stations" 
          fallback={<div data-testid="no-user">No User</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGate>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-user')).toBeInTheDocument();
    });

    it('should handle unknown plan names', () => {
      mockUser.planName = 'Unknown Plan';
      
      render(<TestComponent />);
      
      // Should default to starter plan
      expect(screen.getByTestId('plan-tier')).toHaveTextContent('starter');
    });

    it('should handle superadmin role correctly', () => {
      mockUser.role = 'superadmin';
      mockUser.planName = 'Regular';
      
      render(<TestComponent />);
      
      // Superadmin should have access to everything regardless of plan
      expect(screen.getByTestId('can-view-reports')).toHaveTextContent('true');
      expect(screen.getByTestId('has-analytics-access')).toHaveTextContent('true');
      expect(screen.getByTestId('can-delete-stations')).toHaveTextContent('true');
    });
  });
});
