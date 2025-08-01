/**
 * @file components/layout/__tests__/Header.test.tsx
 * @description Tests for Header component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

// Mock the auth context
const mockAuthContext = {
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: 'https://example.com/avatar.jpg',
  },
  logout: vi.fn(),
  isAuthenticated: true,
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock the notifications hook
vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: [
      {
        id: '1',
        title: 'System Alert',
        message: 'Pump 3 requires maintenance',
        type: 'warning',
        timestamp: '2024-01-01T10:00:00Z',
        read: false,
      },
      {
        id: '2',
        title: 'Sales Update',
        message: 'Daily sales target achieved',
        type: 'success',
        timestamp: '2024-01-01T09:00:00Z',
        read: true,
      },
    ],
    unreadCount: 1,
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  }),
}));

// Mock the theme hook
const mockTheme = {
  theme: 'light',
  setTheme: vi.fn(),
  toggleTheme: vi.fn(),
};

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockTheme,
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

describe('Header', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header with user information', () => {
    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
  });

  it('should display FuelSync logo and title', () => {
    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByTestId('fuelsync-logo')).toBeInTheDocument();
    expect(screen.getByText('FuelSync Hub')).toBeInTheDocument();
  });

  it('should show notifications bell with unread count', () => {
    render(<Header />, { wrapper: createWrapper() });

    const notificationBell = screen.getByTestId('notification-bell');
    expect(notificationBell).toBeInTheDocument();
    
    const unreadBadge = screen.getByTestId('unread-count-badge');
    expect(unreadBadge).toHaveTextContent('1');
  });

  it('should open notifications dropdown on bell click', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const notificationBell = screen.getByTestId('notification-bell');
    await user.click(notificationBell);

    await waitFor(() => {
      expect(screen.getByTestId('notifications-dropdown')).toBeInTheDocument();
    });

    expect(screen.getByText('System Alert')).toBeInTheDocument();
    expect(screen.getByText('Pump 3 requires maintenance')).toBeInTheDocument();
    expect(screen.getByText('Sales Update')).toBeInTheDocument();
  });

  it('should mark notification as read when clicked', async () => {
    const mockMarkAsRead = vi.fn();
    vi.mocked(await import('@/hooks/useNotifications')).useNotifications.mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'System Alert',
          message: 'Pump 3 requires maintenance',
          type: 'warning',
          timestamp: '2024-01-01T10:00:00Z',
          read: false,
        },
      ],
      unreadCount: 1,
      markAsRead: mockMarkAsRead,
      markAllAsRead: vi.fn(),
    });

    render(<Header />, { wrapper: createWrapper() });

    const notificationBell = screen.getByTestId('notification-bell');
    await user.click(notificationBell);

    const notification = screen.getByTestId('notification-1');
    await user.click(notification);

    expect(mockMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('should show user dropdown menu on avatar click', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const userAvatar = screen.getByTestId('user-avatar');
    await user.click(userAvatar);

    await waitFor(() => {
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should handle logout when logout button is clicked', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const userAvatar = screen.getByTestId('user-avatar');
    await user.click(userAvatar);

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    expect(mockAuthContext.logout).toHaveBeenCalledTimes(1);
  });

  it('should toggle theme when theme button is clicked', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const themeToggle = screen.getByTestId('theme-toggle');
    await user.click(themeToggle);

    expect(mockTheme.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should show correct theme icon', () => {
    render(<Header />, { wrapper: createWrapper() });

    // Light theme should show moon icon
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('should show sun icon in dark theme', () => {
    mockTheme.theme = 'dark';
    
    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('should display search functionality', () => {
    render(<Header />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('should handle search input', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'pump maintenance');

    expect(searchInput).toHaveValue('pump maintenance');
  });

  it('should show search suggestions', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'pump');

    await waitFor(() => {
      expect(screen.getByTestId('search-suggestions')).toBeInTheDocument();
    });

    expect(screen.getByText('Pump Management')).toBeInTheDocument();
    expect(screen.getByText('Pump Maintenance')).toBeInTheDocument();
  });

  it('should handle keyboard navigation in search', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'pump');

    // Press arrow down to navigate suggestions
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });

    const firstSuggestion = screen.getByTestId('search-suggestion-0');
    expect(firstSuggestion).toHaveClass('highlighted');
  });

  it('should close dropdowns when clicking outside', async () => {
    render(<Header />, { wrapper: createWrapper() });

    // Open notifications dropdown
    const notificationBell = screen.getByTestId('notification-bell');
    await user.click(notificationBell);

    expect(screen.getByTestId('notifications-dropdown')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByTestId('notifications-dropdown')).not.toBeInTheDocument();
    });
  });

  it('should show mobile menu button on small screens', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
  });

  it('should toggle mobile menu', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<Header />, { wrapper: createWrapper() });

    const mobileMenuButton = screen.getByTestId('mobile-menu-button');
    await user.click(mobileMenuButton);

    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<Header />, { wrapper: createWrapper() });

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Check navigation
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check buttons have proper labels
    const notificationButton = screen.getByTestId('notification-bell');
    expect(notificationButton).toHaveAttribute('aria-label', 'Notifications');

    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('should handle keyboard navigation', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const notificationBell = screen.getByTestId('notification-bell');
    
    // Focus and activate with keyboard
    notificationBell.focus();
    fireEvent.keyDown(notificationBell, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('notifications-dropdown')).toBeInTheDocument();
    });
  });

  it('should show breadcrumb navigation', () => {
    render(<Header showBreadcrumb />, { wrapper: createWrapper() });

    expect(screen.getByTestId('breadcrumb-nav')).toBeInTheDocument();
  });

  it('should handle real-time notification updates', async () => {
    const { rerender } = render(<Header />, { wrapper: createWrapper() });

    // Initial unread count
    expect(screen.getByTestId('unread-count-badge')).toHaveTextContent('1');

    // Update notifications
    vi.mocked(await import('@/hooks/useNotifications')).useNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 3,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
    });

    rerender(<Header />);

    expect(screen.getByTestId('unread-count-badge')).toHaveTextContent('3');
  });

  it('should hide unread badge when no unread notifications', () => {
    vi.mocked(await import('@/hooks/useNotifications')).useNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
    });

    render(<Header />, { wrapper: createWrapper() });

    expect(screen.queryByTestId('unread-count-badge')).not.toBeInTheDocument();
  });

  it('should show user role badge', () => {
    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByTestId('role-badge')).toHaveClass('bg-purple-100');
  });

  it('should handle different user roles', () => {
    mockAuthContext.user.role = 'attendant';
    
    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByText('Attendant')).toBeInTheDocument();
    expect(screen.getByTestId('role-badge')).toHaveClass('bg-blue-100');
  });

  it('should show loading state when user is not loaded', () => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    
    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByTestId('header-loading')).toBeInTheDocument();
  });
});
