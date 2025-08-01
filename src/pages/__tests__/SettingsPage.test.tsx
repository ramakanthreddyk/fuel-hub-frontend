/**
 * @file pages/__tests__/SettingsPage.test.tsx
 * @description Tests for the Settings page component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '../dashboard/SettingsPage';

// Mock settings data
const mockSettings = {
  general: {
    companyName: 'Fuel Hub Inc.',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceAlerts: true,
    lowInventoryAlerts: true,
    salesReports: true,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: [],
  },
  api: {
    rateLimit: 1000,
    timeout: 30,
    retryAttempts: 3,
    enableLogging: true,
  },
};

// Mock API hooks
vi.mock('@/hooks/api/useSettings', () => ({
  useSettings: () => ({
    data: mockSettings,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useUpdateSettings: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/api/useUsers', () => ({
  useUsers: () => ({
    data: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'manager' },
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

describe('SettingsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when rendering', () => {
    it('should display the page title', () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
    });

    it('should display settings tabs', () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('tab', { name: /general/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /notifications/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /security/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /api/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /users/i })).toBeInTheDocument();
    });

    it('should show general settings by default', () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByDisplayValue('Fuel Hub Inc.')).toBeInTheDocument();
      expect(screen.getByDisplayValue('America/New_York')).toBeInTheDocument();
      expect(screen.getByDisplayValue('USD')).toBeInTheDocument();
    });
  });

  describe('general settings tab', () => {
    it('should display all general settings fields', () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/timezone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date format/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time format/i)).toBeInTheDocument();
    });

    it('should update company name', async () => {
      const mockUpdate = vi.fn();
      vi.doMock('@/hooks/api/useSettings', () => ({
        useUpdateSettings: () => ({
          mutate: mockUpdate,
          isLoading: false,
          error: null,
        }),
      }));

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const companyNameInput = screen.getByLabelText(/company name/i);
      await user.clear(companyNameInput);
      await user.type(companyNameInput, 'New Company Name');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);
      
      expect(mockUpdate).toHaveBeenCalledWith({
        general: {
          ...mockSettings.general,
          companyName: 'New Company Name',
        },
      });
    });

    it('should update timezone', async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const timezoneSelect = screen.getByLabelText(/timezone/i);
      await user.selectOptions(timezoneSelect, 'America/Los_Angeles');
      
      expect(timezoneSelect).toHaveValue('America/Los_Angeles');
    });

    it('should validate required fields', async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const companyNameInput = screen.getByLabelText(/company name/i);
      await user.clear(companyNameInput);
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);
      
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
    });
  });

  describe('notifications tab', () => {
    beforeEach(async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      const notificationsTab = screen.getByRole('tab', { name: /notifications/i });
      await user.click(notificationsTab);
    });

    it('should display notification settings', () => {
      expect(screen.getByLabelText(/email notifications/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sms notifications/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/push notifications/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/maintenance alerts/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/low inventory alerts/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sales reports/i)).toBeInTheDocument();
    });

    it('should toggle notification settings', async () => {
      const emailToggle = screen.getByLabelText(/email notifications/i);
      expect(emailToggle).toBeChecked();
      
      await user.click(emailToggle);
      expect(emailToggle).not.toBeChecked();
    });

    it('should save notification preferences', async () => {
      const mockUpdate = vi.fn();
      vi.doMock('@/hooks/api/useSettings', () => ({
        useUpdateSettings: () => ({
          mutate: mockUpdate,
          isLoading: false,
          error: null,
        }),
      }));

      const smsToggle = screen.getByLabelText(/sms notifications/i);
      await user.click(smsToggle);
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);
      
      expect(mockUpdate).toHaveBeenCalledWith({
        notifications: {
          ...mockSettings.notifications,
          smsNotifications: true,
        },
      });
    });
  });

  describe('security tab', () => {
    beforeEach(async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      const securityTab = screen.getByRole('tab', { name: /security/i });
      await user.click(securityTab);
    });

    it('should display security settings', () => {
      expect(screen.getByLabelText(/two-factor authentication/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/session timeout/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password expiry/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/login attempts/i)).toBeInTheDocument();
    });

    it('should enable two-factor authentication', async () => {
      const twoFactorToggle = screen.getByLabelText(/two-factor authentication/i);
      expect(twoFactorToggle).not.toBeChecked();
      
      await user.click(twoFactorToggle);
      
      expect(screen.getByRole('dialog', { name: /enable 2fa/i })).toBeInTheDocument();
    });

    it('should update session timeout', async () => {
      const sessionTimeoutInput = screen.getByLabelText(/session timeout/i);
      await user.clear(sessionTimeoutInput);
      await user.type(sessionTimeoutInput, '60');
      
      expect(sessionTimeoutInput).toHaveValue(60);
    });

    it('should validate security settings', async () => {
      const loginAttemptsInput = screen.getByLabelText(/login attempts/i);
      await user.clear(loginAttemptsInput);
      await user.type(loginAttemptsInput, '0');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);
      
      expect(screen.getByText(/must be at least 1/i)).toBeInTheDocument();
    });
  });

  describe('api tab', () => {
    beforeEach(async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      const apiTab = screen.getByRole('tab', { name: /api/i });
      await user.click(apiTab);
    });

    it('should display API settings', () => {
      expect(screen.getByLabelText(/rate limit/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/timeout/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/retry attempts/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/enable logging/i)).toBeInTheDocument();
    });

    it('should update rate limit', async () => {
      const rateLimitInput = screen.getByLabelText(/rate limit/i);
      await user.clear(rateLimitInput);
      await user.type(rateLimitInput, '2000');
      
      expect(rateLimitInput).toHaveValue(2000);
    });

    it('should test API connection', async () => {
      const testButton = screen.getByRole('button', { name: /test connection/i });
      await user.click(testButton);
      
      await waitFor(() => {
        expect(screen.getByText(/connection successful/i)).toBeInTheDocument();
      });
    });
  });

  describe('users tab', () => {
    beforeEach(async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      const usersTab = screen.getByRole('tab', { name: /users/i });
      await user.click(usersTab);
    });

    it('should display users list', () => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('manager')).toBeInTheDocument();
    });

    it('should add new user', async () => {
      const addUserButton = screen.getByRole('button', { name: /add user/i });
      await user.click(addUserButton);
      
      expect(screen.getByRole('dialog', { name: /add user/i })).toBeInTheDocument();
    });

    it('should edit user', async () => {
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);
      
      expect(screen.getByRole('dialog', { name: /edit user/i })).toBeInTheDocument();
    });

    it('should delete user with confirmation', async () => {
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);
      
      expect(screen.getByRole('dialog', { name: /confirm delete/i })).toBeInTheDocument();
    });
  });

  describe('when handling errors', () => {
    it('should display error message when loading fails', () => {
      vi.doMock('@/hooks/api/useSettings', () => ({
        useSettings: () => ({
          data: null,
          isLoading: false,
          error: new Error('Failed to load settings'),
        }),
      }));

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/failed to load settings/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle save errors', async () => {
      vi.doMock('@/hooks/api/useSettings', () => ({
        useUpdateSettings: () => ({
          mutate: vi.fn(),
          isLoading: false,
          error: new Error('Failed to save settings'),
        }),
      }));

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);
      
      expect(screen.getByText(/failed to save settings/i)).toBeInTheDocument();
    });
  });

  describe('when loading', () => {
    it('should show loading state', () => {
      vi.doMock('@/hooks/api/useSettings', () => ({
        useSettings: () => ({
          data: null,
          isLoading: true,
          error: null,
        }),
      }));

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/loading settings/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show saving state', async () => {
      vi.doMock('@/hooks/api/useSettings', () => ({
        useUpdateSettings: () => ({
          mutate: vi.fn(),
          isLoading: true,
          error: null,
        }),
      }));

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const saveButton = screen.getByRole('button', { name: /saving/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have proper tab structure', () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(5);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('aria-selected');
      });
    });

    it('should support keyboard navigation', async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const firstTab = screen.getByRole('tab', { name: /general/i });
      firstTab.focus();
      
      expect(document.activeElement).toBe(firstTab);
      
      // Arrow key navigation
      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
      
      const secondTab = screen.getByRole('tab', { name: /notifications/i });
      expect(document.activeElement).toBe(secondTab);
    });

    it('should have proper form labels', () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAccessibleName();
      });
    });

    it('should announce tab changes', async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      
      const notificationsTab = screen.getByRole('tab', { name: /notifications/i });
      await user.click(notificationsTab);
      
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/notifications settings/i);
      });
    });
  });

  describe('responsive behavior', () => {
    it('should stack tabs vertically on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveClass('mobile-tabs');
    });

    it('should use accordion layout on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByTestId('settings-accordion')).toBeInTheDocument();
    });
  });

  describe('data persistence', () => {
    it('should save changes automatically', async () => {
      const mockUpdate = vi.fn();
      vi.doMock('@/hooks/api/useSettings', () => ({
        useUpdateSettings: () => ({
          mutate: mockUpdate,
          isLoading: false,
          error: null,
        }),
      }));

      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const companyNameInput = screen.getByLabelText(/company name/i);
      await user.type(companyNameInput, ' Updated');
      
      // Wait for auto-save
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('should show unsaved changes warning', async () => {
      render(<SettingsPage />, { wrapper: createWrapper() });
      
      const companyNameInput = screen.getByLabelText(/company name/i);
      await user.type(companyNameInput, ' Modified');
      
      expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    });
  });
});
