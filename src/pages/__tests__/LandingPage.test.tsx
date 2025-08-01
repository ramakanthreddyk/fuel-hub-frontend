/**
 * @file pages/__tests__/LandingPage.test.tsx
 * @description Tests for LandingPage component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from '../LandingPage';

// Mock the auth context
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock setup status hook
vi.mock('@/hooks/useSetupStatus', () => ({
  useSetupStatus: () => ({
    data: { isSetupComplete: true },
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

describe('LandingPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
  });

  it('should render landing page with hero section', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Power Your')).toBeInTheDocument();
    expect(screen.getByText('Fuel Empire')).toBeInTheDocument();
    expect(screen.getByText(/revolutionary fuel management platform/i)).toBeInTheDocument();
  });

  it('should show main call-to-action buttons', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('button', { name: /launch dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /watch demo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start free trial/i })).toBeInTheDocument();
  });

  it('should display feature highlights', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/real-time monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/inventory management/i)).toBeInTheDocument();
    expect(screen.getByText(/sales analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/automated reporting/i)).toBeInTheDocument();
  });

  it('should show login options when launch dashboard is clicked', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const launchButton = screen.getByRole('button', { name: /launch dashboard/i });
    await user.click(launchButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-options-dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('Choose Login Type')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /user login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /admin login/i })).toBeInTheDocument();
  });

  it('should navigate to user login', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const launchButton = screen.getByRole('button', { name: /launch dashboard/i });
    await user.click(launchButton);

    const userLoginButton = screen.getByRole('button', { name: /user login/i });
    await user.click(userLoginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should navigate to admin login', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const launchButton = screen.getByRole('button', { name: /launch dashboard/i });
    await user.click(launchButton);

    const adminLoginButton = screen.getByRole('button', { name: /admin login/i });
    await user.click(adminLoginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login/admin');
  });

  it('should show demo dialog when watch demo is clicked', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const demoButton = screen.getByRole('button', { name: /watch demo/i });
    await user.click(demoButton);

    await waitFor(() => {
      expect(screen.getByTestId('demo-dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('FuelSync Hub Demo')).toBeInTheDocument();
    expect(screen.getByText(/interactive demo/i)).toBeInTheDocument();
  });

  it('should show trial dialog when start trial is clicked', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const trialButton = screen.getByRole('button', { name: /start free trial/i });
    await user.click(trialButton);

    await waitFor(() => {
      expect(screen.getByTestId('trial-dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('Start Your Free Trial')).toBeInTheDocument();
    expect(screen.getByText(/30-day free trial/i)).toBeInTheDocument();
  });

  it('should display pricing information', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/starter/i)).toBeInTheDocument();
    expect(screen.getByText(/professional/i)).toBeInTheDocument();
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
  });

  it('should show testimonials section', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/what our customers say/i)).toBeInTheDocument();
    expect(screen.getByText(/testimonials/i)).toBeInTheDocument();
  });

  it('should display contact information', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
    expect(screen.getByText(/support@fuelsync.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockAuthContext.isLoading = true;

    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText(/initializing fuelsync hub/i)).toBeInTheDocument();
  });

  it('should redirect authenticated users', () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { id: '1', name: 'Test User', role: 'admin' };

    const { container } = render(<LandingPage />, { wrapper: createWrapper() });

    // Should return null for authenticated users (redirect handled by AuthContext)
    expect(container.firstChild).toBeNull();
  });

  it('should be accessible', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    // Check main landmarks
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    // Check heading hierarchy
    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveProperty('tagName', 'H1');

    // Check button accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  it('should handle keyboard navigation', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const launchButton = screen.getByRole('button', { name: /launch dashboard/i });
    
    // Focus and activate with keyboard
    launchButton.focus();
    fireEvent.keyDown(launchButton, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('login-options-dialog')).toBeInTheDocument();
    });
  });

  it('should close dialogs with escape key', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const demoButton = screen.getByRole('button', { name: /watch demo/i });
    await user.click(demoButton);

    const dialog = screen.getByTestId('demo-dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId('demo-dialog')).not.toBeInTheDocument();
    });
  });

  it('should show feature cards with animations', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const featureCards = screen.getAllByTestId('feature-card');
    expect(featureCards.length).toBeGreaterThan(0);

    featureCards.forEach(card => {
      expect(card).toHaveClass('animate-fade-in');
    });
  });

  it('should display social proof metrics', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/trusted by 500\+ fuel stations/i)).toBeInTheDocument();
    expect(screen.getByText(/99\.9% uptime/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 support/i)).toBeInTheDocument();
  });

  it('should show newsletter signup', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/stay updated/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('should handle newsletter signup', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(subscribeButton);

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should display footer links', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    expect(screen.getByText(/documentation/i)).toBeInTheDocument();
    expect(screen.getByText(/api reference/i)).toBeInTheDocument();
  });

  it('should show mobile-responsive design', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<LandingPage />, { wrapper: createWrapper() });

    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toHaveClass('mobile-responsive');
  });

  it('should handle smooth scrolling to sections', async () => {
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    render(<LandingPage />, { wrapper: createWrapper() });

    const featuresLink = screen.getByText(/features/i);
    await user.click(featuresLink);

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should show loading animation on buttons', async () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    const launchButton = screen.getByRole('button', { name: /launch dashboard/i });
    await user.click(launchButton);

    expect(launchButton).toHaveClass('loading');
  });

  it('should display security badges', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/ssl secured/i)).toBeInTheDocument();
    expect(screen.getByText(/gdpr compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/iso 27001/i)).toBeInTheDocument();
  });

  it('should show integration logos', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('integrations-section')).toBeInTheDocument();
    expect(screen.getByText(/integrates with/i)).toBeInTheDocument();
  });
});
