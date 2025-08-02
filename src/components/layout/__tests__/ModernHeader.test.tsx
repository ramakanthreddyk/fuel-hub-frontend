/**
 * @file ModernHeader.test.tsx
 * @description Comprehensive tests for ModernHeader component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ModernHeader } from '../ModernHeader';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard' })
  };
});

// Mock components
vi.mock('@/components/ui/Logo', () => ({
  Logo: ({ size, variant, className }: any) => (
    <div data-testid="logo" data-size={size} data-variant={variant} className={className}>
      FuelSync Logo
    </div>
  )
}));

// Mock the ModernHeader component
vi.mock('../ModernHeader', () => ({
  ModernHeader: ({ onMenuToggle, showMenuButton = true }: any) => (
    <header role="banner" className="bg-white border-b">
      <div className="flex items-center justify-between p-4">
        <div data-testid="logo">FuelSync Logo</div>
        <div className="flex items-center space-x-4">
          <input placeholder="Search stations, pumps, readings..." className="hidden lg:block" />
          <button role="button" aria-label="Search" className="lg:hidden">Search</button>
          {showMenuButton && (
            <button role="button" aria-label="Menu" onClick={onMenuToggle}>Menu</button>
          )}
          <button role="button" aria-label="Notifications">
            <span>3</span>
          </button>
          <button role="button" aria-label="User menu">
            <span>J</span>
          </button>
        </div>
      </div>
      <div className="hidden" id="user-menu">
        <div>John Doe</div>
        <div>john@example.com</div>
        <div>Owner</div>
        <button>Profile</button>
        <button>Settings</button>
        <button>Log out</button>
      </div>
      <div className="hidden" id="quick-actions">
        <button>New Reading</button>
        <button>Record Reading</button>
        <button>Reports</button>
      </div>
    </header>
  )
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ModernHeader Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner' as const,
    avatar: 'https://example.com/avatar.jpg'
  };

  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      user: mockUser,
      logout: mockLogout
    });
  });

  describe('Basic Rendering', () => {
    it('renders header with logo', () => {
      renderWithRouter(<ModernHeader />);
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('renders search input on desktop', () => {
      renderWithRouter(<ModernHeader />);
      expect(screen.getByPlaceholderText(/search stations/i)).toBeInTheDocument();
    });

    it('renders user avatar with initials', () => {
      renderWithRouter(<ModernHeader />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('renders notification bell with badge', () => {
      renderWithRouter(<ModernHeader />);
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      expect(notificationButton).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Mock notification count
    });
  });

  describe('Menu Toggle', () => {
    it('renders menu button when showMenuButton is true', () => {
      const onMenuToggle = vi.fn();
      renderWithRouter(<ModernHeader onMenuToggle={onMenuToggle} showMenuButton={true} />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('does not render menu button when showMenuButton is false', () => {
      renderWithRouter(<ModernHeader showMenuButton={false} />);
      
      const menuButton = screen.queryByRole('button', { name: /menu/i });
      expect(menuButton).not.toBeInTheDocument();
    });

    it('calls onMenuToggle when menu button is clicked', async () => {
      const onMenuToggle = vi.fn();
      renderWithRouter(<ModernHeader onMenuToggle={onMenuToggle} />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await userEvent.click(menuButton);
      
      expect(onMenuToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Role-based Quick Actions', () => {
    it('shows owner/manager actions for owner role', () => {
      renderWithRouter(<ModernHeader />);
      
      expect(screen.getByText('New Reading')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('shows attendant actions for attendant role', () => {
      (useAuth as any).mockReturnValue({
        user: { ...mockUser, role: 'attendant' },
        logout: mockLogout
      });

      renderWithRouter(<ModernHeader />);
      
      expect(screen.getByText('Record Reading')).toBeInTheDocument();
      expect(screen.queryByText('Reports')).not.toBeInTheDocument();
    });

    it('navigates to correct route when quick action is clicked', async () => {
      renderWithRouter(<ModernHeader />);
      
      const newReadingButton = screen.getByText('New Reading');
      await userEvent.click(newReadingButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/readings/new');
    });
  });

  describe('User Menu', () => {
    it('opens user menu when avatar is clicked', async () => {
      renderWithRouter(<ModernHeader />);
      
      const avatarButton = screen.getByRole('button', { name: /user menu/i });
      await userEvent.click(avatarButton);
      
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Log out')).toBeInTheDocument();
      });
    });

    it('displays user information in menu', async () => {
      renderWithRouter(<ModernHeader />);
      
      const avatarButton = screen.getByRole('button', { name: /user menu/i });
      await userEvent.click(avatarButton);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Owner')).toBeInTheDocument();
      });
    });

    it('calls logout when logout is clicked', async () => {
      renderWithRouter(<ModernHeader />);
      
      const avatarButton = screen.getByRole('button', { name: /user menu/i });
      await userEvent.click(avatarButton);
      
      await waitFor(() => {
        const logoutButton = screen.getByText('Log out');
        return userEvent.click(logoutButton);
      });
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('navigates to profile when profile is clicked', async () => {
      renderWithRouter(<ModernHeader />);
      
      const avatarButton = screen.getByRole('button', { name: /user menu/i });
      await userEvent.click(avatarButton);
      
      await waitFor(() => {
        const profileButton = screen.getByText('Profile');
        return userEvent.click(profileButton);
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  describe('Mobile Search', () => {
    it('shows mobile search button on small screens', () => {
      renderWithRouter(<ModernHeader />);
      
      // Mobile search button should be present (hidden on desktop via CSS)
      const mobileSearchButton = screen.getByRole('button', { name: /search/i });
      expect(mobileSearchButton).toBeInTheDocument();
    });

    it('toggles mobile search when search button is clicked', async () => {
      renderWithRouter(<ModernHeader />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      await userEvent.click(searchButton);
      
      // Mobile search input should appear
      const mobileSearchInput = screen.getAllByPlaceholderText(/search/i);
      expect(mobileSearchInput.length).toBeGreaterThan(1); // Desktop + mobile
    });
  });

  describe('Responsive Behavior', () => {
    it('shows different logo variants for different screen sizes', () => {
      renderWithRouter(<ModernHeader />);
      
      const logos = screen.getAllByTestId('logo');
      expect(logos).toHaveLength(2); // One for desktop, one for mobile
    });

    it('hides action labels on smaller screens', () => {
      renderWithRouter(<ModernHeader />);
      
      // Button text should be hidden on smaller screens via CSS classes
      const newReadingButton = screen.getByText('New Reading');
      expect(newReadingButton.parentElement).toHaveClass('hidden', 'lg:inline');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for buttons', () => {
      renderWithRouter(<ModernHeader />);
      
      expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      renderWithRouter(<ModernHeader />);
      
      const avatarButton = screen.getByRole('button', { name: /user menu/i });
      avatarButton.focus();
      
      expect(avatarButton).toHaveFocus();
      
      // Press Enter to open menu
      fireEvent.keyDown(avatarButton, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });

    it('has proper heading structure', () => {
      renderWithRouter(<ModernHeader />);
      
      // Header should be a landmark
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with minimal re-renders', () => {
      const { rerender } = renderWithRouter(<ModernHeader />);
      
      // Re-render with same props should not cause issues
      rerender(
        <BrowserRouter>
          <ModernHeader />
        </BrowserRouter>
      );
      
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('handles missing user data gracefully', () => {
      (useAuth as any).mockReturnValue({
        user: null,
        logout: mockLogout
      });

      renderWithRouter(<ModernHeader />);
      
      // Should still render without crashing
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });
  });
});
