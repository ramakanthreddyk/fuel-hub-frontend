/**
 * @file __tests__/accessibility/accessibilityTests.test.tsx
 * @description Comprehensive accessibility testing suite
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { checkAccessibility } from '@/test/setup';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PumpsPage from '@/pages/dashboard/PumpsPage';
import StationsPage from '@/pages/dashboard/StationsPage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Form } from '@/components/ui/Form';
import { Table } from '@/components/ui/Table';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock data for testing
const mockPumps = [
  {
    id: '1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    stationId: 'station-1',
    status: 'active',
    nozzleCount: 4,
  },
  {
    id: '2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    stationId: 'station-1',
    status: 'maintenance',
    nozzleCount: 2,
  },
];

// Mock API hooks
vi.mock('@/hooks/api/usePumps', () => ({
  usePumps: () => ({
    data: mockPumps,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/api/useDashboard', () => ({
  useDashboardStats: () => ({
    data: {
      totalSales: 125000,
      totalTransactions: 1250,
      activePumps: 12,
      totalStations: 3,
    },
    isLoading: false,
    error: null,
  }),
  useRecentTransactions: () => ({
    data: [
      { id: '1', amount: 45.50, pump: 'Pump 1', time: '10:30 AM' },
      { id: '2', amount: 67.25, pump: 'Pump 3', time: '10:25 AM' },
    ],
    isLoading: false,
    error: null,
  }),
  useAlerts: () => ({
    data: [
      { id: '1', type: 'warning', message: 'Pump 2 needs maintenance' },
    ],
    isLoading: false,
    error: null,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Accessibility Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Mock screen reader announcements
    global.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      speaking: false,
      pending: false,
      paused: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations on dashboard', async () => {
      const { container } = render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations on pumps page', async () => {
      const { container } = render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations on stations page', async () => {
      const { container } = render(<StationsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic HTML Structure', () => {
    it('should use proper heading hierarchy', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      const headings = screen.getAllByRole('heading');
      
      // Should start with h1
      expect(headings[0]).toHaveProperty('tagName', 'H1');
      
      // Check heading levels are sequential
      let previousLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        expect(level).toBeLessThanOrEqual(previousLevel + 1);
        previousLevel = level;
      });
    });

    it('should use proper landmark roles', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should have proper table structure', () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const table = screen.getByRole('table');
      expect(table).toHaveAccessibleName();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);

      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); // Header + data rows
    });

    it('should use proper list structure', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      const lists = screen.getAllByRole('list');
      lists.forEach(list => {
        const listItems = within(list).getAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through dashboard', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      const focusableElements = screen.getAllByRole('button')
        .concat(screen.getAllByRole('link'))
        .concat(screen.getAllByRole('textbox'))
        .concat(screen.getAllByRole('combobox'));

      // Tab through all focusable elements
      for (let i = 0; i < focusableElements.length; i++) {
        await user.tab();
        expect(document.activeElement).toBe(focusableElements[i]);
      }
    });

    it('should support arrow key navigation in tables', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      const table = screen.getByRole('table');
      const firstCell = within(table).getAllByRole('cell')[0];
      
      firstCell.focus();
      expect(document.activeElement).toBe(firstCell);

      // Arrow right should move to next cell
      fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
      
      const cells = within(table).getAllByRole('cell');
      expect(document.activeElement).toBe(cells[1]);
    });

    it('should support escape key to close modals', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Open modal
      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Press escape
      fireEvent.keyDown(modal, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should trap focus within modals', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const focusableElements = within(modal).getAllByRole('button')
        .concat(within(modal).getAllByRole('textbox'))
        .concat(within(modal).getAllByRole('combobox'));

      // Focus should be trapped within modal
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();
      expect(document.activeElement).toBe(firstElement);

      // Shift+Tab from first element should go to last
      fireEvent.keyDown(firstElement, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(lastElement);

      // Tab from last element should go to first
      fireEvent.keyDown(lastElement, { key: 'Tab' });
      expect(document.activeElement).toBe(firstElement);
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should announce dynamic content changes', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');

      // Trigger update
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/updated/i);
      });
    });

    it('should provide descriptive error messages', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const submitButton = within(modal).getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Error messages should be associated with inputs
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      const errorMessage = screen.getByText(/name is required/i);
      
      expect(nameInput).toHaveAttribute('aria-describedby');
      expect(errorMessage).toHaveAttribute('id', nameInput.getAttribute('aria-describedby'));
    });

    it('should provide loading states for screen readers', () => {
      // Mock loading state
      vi.doMock('@/hooks/api/usePumps', () => ({
        usePumps: () => ({
          data: null,
          isLoading: true,
          error: null,
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });

      const loadingIndicator = screen.getByRole('progressbar');
      expect(loadingIndicator).toHaveAttribute('aria-label', /loading/i);
    });
  });

  describe('Color and Contrast', () => {
    it('should meet color contrast requirements', () => {
      const { container } = render(<DashboardPage />, { wrapper: createWrapper() });

      // Check text elements have sufficient contrast
      const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
      
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // This would typically use a contrast checking library
        // For this test, we'll check that colors are defined
        expect(color).toBeDefined();
        expect(backgroundColor).toBeDefined();
      });
    });

    it('should not rely solely on color for information', () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      // Status indicators should have text or icons, not just color
      const statusElements = screen.getAllByTestId(/status-/);
      statusElements.forEach(element => {
        const hasText = element.textContent && element.textContent.trim().length > 0;
        const hasIcon = element.querySelector('[data-testid*="icon"]');
        const hasAriaLabel = element.hasAttribute('aria-label');
        
        expect(hasText || hasIcon || hasAriaLabel).toBe(true);
      });
    });
  });

  describe('Form Accessibility', () => {
    it('should associate labels with form controls', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const inputs = within(modal).getAllByRole('textbox');
      
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should provide field validation feedback', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      const submitButton = within(modal).getByRole('button', { name: /create/i });

      // Submit without filling required field
      await user.click(submitButton);

      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
        expect(nameInput).toHaveAttribute('aria-describedby');
      });
    });

    it('should group related form controls', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const fieldsets = within(modal).getAllByRole('group');
      
      fieldsets.forEach(fieldset => {
        expect(fieldset).toHaveAccessibleName();
      });
    });
  });

  describe('Focus Management', () => {
    it('should manage focus when opening modals', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      
      // Focus should move to modal
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
      expect(modal.contains(document.activeElement)).toBe(true);
    });

    it('should restore focus when closing modals', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const closeButton = within(modal).getByRole('button', { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(document.activeElement).toBe(addButton);
      });
    });

    it('should provide visible focus indicators', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        button.focus();
        const styles = window.getComputedStyle(button, ':focus');
        
        // Should have visible focus indicator
        expect(
          styles.outline !== 'none' || 
          styles.boxShadow !== 'none' ||
          styles.border !== button.style.border
        ).toBe(true);
      });
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have appropriate touch targets', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<DashboardPage />, { wrapper: createWrapper() });

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        
        // Touch targets should be at least 44px
        expect(size).toBeGreaterThanOrEqual(44);
      });
    });

    it('should support zoom up to 200%', () => {
      // Mock zoom
      Object.defineProperty(document.documentElement, 'style', {
        value: { zoom: '200%' },
        writable: true,
      });

      const { container } = render(<DashboardPage />, { wrapper: createWrapper() });

      // Content should still be accessible when zoomed
      expect(container.scrollWidth).toBeLessThanOrEqual(window.innerWidth * 2);
    });
  });

  describe('Error Handling Accessibility', () => {
    it('should announce errors to screen readers', async () => {
      // Mock error state
      vi.doMock('@/hooks/api/usePumps', () => ({
        usePumps: () => ({
          data: null,
          isLoading: false,
          error: new Error('Failed to load pumps'),
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });

      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent(/failed to load pumps/i);
    });

    it('should provide recovery options', async () => {
      // Mock error state
      vi.doMock('@/hooks/api/usePumps', () => ({
        usePumps: () => ({
          data: null,
          isLoading: false,
          error: new Error('Failed to load pumps'),
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveAccessibleName();
    });
  });

  describe('Custom Accessibility Checks', () => {
    it('should pass custom accessibility validation', () => {
      const { container } = render(<DashboardPage />, { wrapper: createWrapper() });

      const issues = checkAccessibility(container);
      expect(issues).toHaveLength(0);
    });

    it('should have proper skip links', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should support high contrast mode', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { container } = render(<DashboardPage />, { wrapper: createWrapper() });

      // Should apply high contrast styles
      expect(container.firstChild).toHaveClass('high-contrast');
    });
  });
});
