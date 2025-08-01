/**
 * @file pages/__tests__/LoginPage.test.tsx
 * @description Tests for LoginPage component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '../LoginPage';

// Mock the auth context
const mockLogin = vi.fn();
const mockAuthContext = {
  login: mockLogin,
  user: null,
  isAuthenticated: false,
  logout: vi.fn(),
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/login' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// Mock toast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
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

describe('LoginPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = '/login';
  });

  it('should render login form', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show admin portal badge for admin login route', () => {
    mockLocation.pathname = '/login/admin';
    
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    expect(screen.getByText('Platform Management & Analytics Dashboard')).toBeInTheDocument();
  });

  it('should handle email input', async () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should handle password input', async () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should toggle password visibility', async () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByTestId('password-toggle');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should submit login form with correct credentials', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', false);
  });

  it('should submit admin login form', async () => {
    mockLocation.pathname = '/login/admin';
    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'admin123');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'admin123', true);
  });

  it('should show loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('should handle form submission with Enter key', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    fireEvent.keyDown(passwordInput, { key: 'Enter' });

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', false);
  });

  it('should validate required fields', async () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should show demo credentials for development', () => {
    process.env.NODE_ENV = 'development';
    
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText('admin@fuelsync.com')).toBeInTheDocument();
    expect(screen.getByText('attendant@fuelsync.com')).toBeInTheDocument();
  });

  it('should fill demo credentials when clicked', async () => {
    process.env.NODE_ENV = 'development';
    
    render(<LoginPage />, { wrapper: createWrapper() });

    const adminDemoButton = screen.getByTestId('demo-admin-credentials');
    await user.click(adminDemoButton);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveValue('admin@fuelsync.com');
    expect(passwordInput).toHaveValue('admin123');
  });

  it('should be accessible', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    // Check form accessibility
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    // Check input labels
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Check button accessibility
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should handle keyboard navigation', async () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Tab through form elements
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(screen.getByTestId('password-toggle')).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('should show forgot password link', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  it('should show sign up link for new users', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    const signUpLink = screen.getByText(/sign up/i);
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });

  it('should display branding and features', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('fuelsync-logo')).toBeInTheDocument();
    expect(screen.getByText('FuelSync Hub')).toBeInTheDocument();
    
    // Check feature highlights
    expect(screen.getByText(/real-time monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/inventory management/i)).toBeInTheDocument();
    expect(screen.getByText(/sales analytics/i)).toBeInTheDocument();
  });

  it('should handle different user roles appropriately', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Test regular user login
    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', false);
  });

  it('should show appropriate error for network issues', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: 'Network error',
        variant: 'destructive',
      });
    });
  });

  it('should clear form on successful login', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    // Form should be cleared after successful login
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });
});
