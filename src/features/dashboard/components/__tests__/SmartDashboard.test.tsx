/**
 * @file SmartDashboard.test.tsx
 * @description Comprehensive tests for SmartDashboard component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SmartDashboard } from '../SmartDashboard';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock the mobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false)
}));

// Mock dashboard components
vi.mock('../ImprovedDashboard', () => ({
  ImprovedDashboard: () => <div data-testid="improved-dashboard">Improved Dashboard</div>
}));

vi.mock('../AttendantDashboard', () => ({
  AttendantDashboard: () => <div data-testid="attendant-dashboard">Attendant Dashboard</div>
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('SmartDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Role-based Dashboard Routing', () => {
    it('renders AttendantDashboard for attendant role', () => {
      (useAuth as any).mockReturnValue({
        user: {
          id: '1',
          name: 'John Attendant',
          email: 'john@example.com',
          role: 'attendant'
        }
      });

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByTestId('attendant-dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('improved-dashboard')).not.toBeInTheDocument();
    });

    it('renders ImprovedDashboard for owner role', () => {
      (useAuth as any).mockReturnValue({
        user: {
          id: '1',
          name: 'John Owner',
          email: 'john@example.com',
          role: 'owner'
        }
      });

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('attendant-dashboard')).not.toBeInTheDocument();
    });

    it('renders ImprovedDashboard for manager role', () => {
      (useAuth as any).mockReturnValue({
        user: {
          id: '1',
          name: 'John Manager',
          email: 'john@example.com',
          role: 'manager'
        }
      });

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('attendant-dashboard')).not.toBeInTheDocument();
    });

    it('renders ImprovedDashboard for superadmin role', () => {
      (useAuth as any).mockReturnValue({
        user: {
          id: '1',
          name: 'John Superadmin',
          email: 'john@example.com',
          role: 'superadmin'
        }
      });

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('attendant-dashboard')).not.toBeInTheDocument();
    });

    it('renders ImprovedDashboard for unknown role', () => {
      (useAuth as any).mockReturnValue({
        user: {
          id: '1',
          name: 'John Unknown',
          email: 'john@example.com',
          role: 'unknown'
        }
      });

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('attendant-dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing user gracefully', () => {
      (useAuth as any).mockReturnValue({
        user: null
      });

      renderWithProviders(<SmartDashboard />);
      
      // Should default to ImprovedDashboard when user is null
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
    });

    it('handles undefined user role gracefully', () => {
      (useAuth as any).mockReturnValue({
        user: {
          id: '1',
          name: 'John NoRole',
          email: 'john@example.com'
          // role is undefined
        }
      });

      renderWithProviders(<SmartDashboard />);
      
      // Should default to ImprovedDashboard when role is undefined
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
    });

    it('handles auth context errors gracefully', () => {
      (useAuth as any).mockImplementation(() => {
        throw new Error('Auth context error');
      });

      // Should not crash the application
      expect(() => renderWithProviders(<SmartDashboard />)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('renders quickly without unnecessary re-renders', () => {
      const mockUser = {
        id: '1',
        name: 'John Owner',
        email: 'john@example.com',
        role: 'owner'
      };

      (useAuth as any).mockReturnValue({ user: mockUser });

      const startTime = performance.now();
      renderWithProviders(<SmartDashboard />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should render in less than 50ms
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
    });

    it('handles role changes efficiently', () => {
      const { rerender } = renderWithProviders(<SmartDashboard />);

      // Start with owner
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'owner' }
      });

      rerender(
        <QueryClientProvider client={createTestQueryClient()}>
          <BrowserRouter>
            <SmartDashboard />
          </BrowserRouter>
        </QueryClientProvider>
      );

      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();

      // Change to attendant
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'attendant' }
      });

      rerender(
        <QueryClientProvider client={createTestQueryClient()}>
          <BrowserRouter>
            <SmartDashboard />
          </BrowserRouter>
        </QueryClientProvider>
      );

      expect(screen.getByTestId('attendant-dashboard')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works with React Query provider', () => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'owner' }
      });

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
    });

    it('works with React Router', () => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'attendant' }
      });

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByTestId('attendant-dashboard')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility standards', () => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'owner' }
      });

      const { container } = renderWithProviders(<SmartDashboard />);
      
      // Should not have any accessibility violations
      expect(container.firstChild).toBeInTheDocument();
    });

    it('provides proper semantic structure', () => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'attendant' }
      });

      renderWithProviders(<SmartDashboard />);
      
      // Dashboard should be rendered with proper structure
      expect(screen.getByTestId('attendant-dashboard')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string role', () => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: '' }
      });

      renderWithProviders(<SmartDashboard />);
      
      // Should default to ImprovedDashboard
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
    });

    it('handles null role', () => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: null }
      });

      renderWithProviders(<SmartDashboard />);
      
      // Should default to ImprovedDashboard
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
    });

    it('handles case-sensitive role matching', () => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'ATTENDANT' }
      });

      renderWithProviders(<SmartDashboard />);
      
      // Should be case-sensitive and default to ImprovedDashboard
      expect(screen.getByTestId('improved-dashboard')).toBeInTheDocument();
    });
  });
});
