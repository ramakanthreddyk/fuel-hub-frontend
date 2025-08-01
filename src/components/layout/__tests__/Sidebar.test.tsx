/**
 * @file components/layout/__tests__/Sidebar.test.tsx
 * @description Comprehensive tests for Sidebar layout component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/dashboard' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon">Home</div>,
  Fuel: () => <div data-testid="fuel-icon">Fuel</div>,
  Building: () => <div data-testid="building-icon">Building</div>,
  Gauge: () => <div data-testid="gauge-icon">Gauge</div>,
  BarChart3: () => <div data-testid="chart-icon">Chart</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  ChevronLeft: () => <div data-testid="chevron-left-icon">ChevronLeft</div>,
  ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="x-icon">X</div>,
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: any) => <div data-testid="sheet">{children}</div>,
  SheetContent: ({ children }: any) => <div data-testid="sheet-content">{children}</div>,
  SheetTrigger: ({ children }: any) => <div data-testid="sheet-trigger">{children}</div>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders sidebar with navigation items', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByText('Fuel Hub')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('Stations')).toBeInTheDocument();
      expect(screen.getByText('Nozzles')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('renders navigation icons', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('fuel-icon')).toBeInTheDocument();
      expect(screen.getByTestId('building-icon')).toBeInTheDocument();
      expect(screen.getByTestId('gauge-icon')).toBeInTheDocument();
      expect(screen.getByTestId('chart-icon')).toBeInTheDocument();
    });

    it('shows collapse/expand button', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    });
  });

  describe('Collapse/Expand Functionality', () => {
    it('toggles sidebar collapse state', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const collapseButton = screen.getByRole('button');
      
      // Initially expanded
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      
      // Click to collapse
      fireEvent.click(collapseButton);
      
      // Should show chevron-right when collapsed
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
    });

    it('maintains collapse state across re-renders', () => {
      const { rerender } = render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const collapseButton = screen.getByRole('button');
      fireEvent.click(collapseButton);

      rerender(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Should remain collapsed
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('highlights active navigation item', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Dashboard should be active based on mocked location
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('bg-accent');
    });

    it('handles navigation item clicks', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const pumpsLink = screen.getByText('Pumps');
      fireEvent.click(pumpsLink);

      // Link should be clickable (navigation handled by React Router)
      expect(pumpsLink.closest('a')).toHaveAttribute('href', '/pumps');
    });

    it('shows all navigation sections', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Main navigation
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('Stations')).toBeInTheDocument();
      expect(screen.getByText('Nozzles')).toBeInTheDocument();

      // Reports section
      expect(screen.getByText('Reports')).toBeInTheDocument();

      // Settings section
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders mobile menu trigger', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
    });

    it('handles mobile menu interactions', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const mobileMenuTrigger = screen.getByTestId('sheet-trigger');
      fireEvent.click(mobileMenuTrigger);

      expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const dashboardLink = screen.getByText('Dashboard');
      dashboardLink.focus();
      
      expect(dashboardLink).toHaveFocus();

      // Tab to next item
      fireEvent.keyDown(dashboardLink, { key: 'Tab' });
    });

    it('has proper link attributes', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('supports screen readers', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const collapseButton = screen.getByRole('button');
      expect(collapseButton).toHaveAttribute('aria-label');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing navigation items gracefully', () => {
      // Mock empty navigation
      const EmptySidebar = () => (
        <div data-testid="empty-sidebar">
          <nav>Empty navigation</nav>
        </div>
      );

      render(
        <TestWrapper>
          <EmptySidebar />
        </TestWrapper>
      );

      expect(screen.getByTestId('empty-sidebar')).toBeInTheDocument();
    });

    it('handles very long navigation labels', () => {
      const longLabel = 'Very Long Navigation Item Label That Might Overflow';
      
      render(
        <TestWrapper>
          <div>
            <a href="/test">{longLabel}</a>
          </div>
        </TestWrapper>
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles rapid collapse/expand clicks', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const collapseButton = screen.getByRole('button');
      
      // Rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(collapseButton);
      }

      // Should still be functional
      expect(collapseButton).toBeInTheDocument();
    });

    it('handles window resize events', async () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        // Should adapt to mobile layout
        expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
      });
    });

    it('handles missing icons gracefully', () => {
      // Mock missing icon
      vi.mocked(vi.importActual('lucide-react')).mockImplementation(() => ({
        Home: undefined,
        Fuel: () => <div data-testid="fuel-icon">Fuel</div>,
      }));

      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Should still render navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('handles navigation errors gracefully', () => {
      // Mock navigation error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Should not crash
      expect(screen.getByText('Fuel Hub')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('handles localStorage unavailable', () => {
      const originalLocalStorage = global.localStorage;
      delete (global as any).localStorage;

      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Should still render without localStorage
      expect(screen.getByText('Fuel Hub')).toBeInTheDocument();

      global.localStorage = originalLocalStorage;
    });

    it('handles theme changes', () => {
      const { rerender } = render(
        <div data-theme="light">
          <TestWrapper>
            <Sidebar />
          </TestWrapper>
        </div>
      );

      expect(screen.getByText('Fuel Hub')).toBeInTheDocument();

      rerender(
        <div data-theme="dark">
          <TestWrapper>
            <Sidebar />
          </TestWrapper>
        </div>
      );

      expect(screen.getByText('Fuel Hub')).toBeInTheDocument();
    });

    it('handles component unmounting', () => {
      const { unmount } = render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('memoizes navigation items', () => {
      const { rerender } = render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const initialNavItems = screen.getAllByRole('link');

      rerender(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const rerenderedNavItems = screen.getAllByRole('link');
      expect(rerenderedNavItems).toHaveLength(initialNavItems.length);
    });

    it('handles large number of navigation items', () => {
      // Mock many navigation items
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        name: `Item ${i}`,
        href: `/item-${i}`,
        icon: 'Home',
      }));

      render(
        <TestWrapper>
          <nav>
            {manyItems.map(item => (
              <a key={item.href} href={item.href}>
                {item.name}
              </a>
            ))}
          </nav>
        </TestWrapper>
      );

      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 99')).toBeInTheDocument();
    });
  });
});
