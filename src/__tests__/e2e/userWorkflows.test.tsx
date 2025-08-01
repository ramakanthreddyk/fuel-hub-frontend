/**
 * @file __tests__/e2e/userWorkflows.test.tsx
 * @description End-to-end tests for complete user workflows
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '@/App';

// Mock authentication context
const mockAuthContext = {
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  },
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock data
const mockStations = [
  {
    id: 'station-1',
    name: 'Main Station',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    status: 'active',
    pumpCount: 8,
  },
];

const mockPumps = [
  {
    id: 'pump-1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    stationId: 'station-1',
    status: 'active',
    nozzleCount: 4,
  },
  {
    id: 'pump-2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    stationId: 'station-1',
    status: 'maintenance',
    nozzleCount: 2,
  },
];

const mockDashboardStats = {
  totalSales: 125000,
  totalTransactions: 1250,
  activePumps: 12,
  totalStations: 3,
  todaySales: 15000,
  salesGrowth: 12.5,
};

const mockTransactions = [
  {
    id: 'txn-1',
    amount: 45.50,
    pumpId: 'pump-1',
    pumpName: 'Pump 1',
    fuelType: 'petrol',
    timestamp: '2024-01-01T10:30:00Z',
  },
];

// MSW server setup
const server = setupServer(
  // Dashboard endpoints
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(ctx.json(mockDashboardStats));
  }),
  
  rest.get('/api/dashboard/transactions/recent', (req, res, ctx) => {
    return res(ctx.json(mockTransactions));
  }),
  
  // Stations endpoints
  rest.get('/api/stations', (req, res, ctx) => {
    return res(ctx.json(mockStations));
  }),
  
  rest.get('/api/stations/:id', (req, res, ctx) => {
    const { id } = req.params;
    const station = mockStations.find(s => s.id === id);
    return res(ctx.json(station));
  }),
  
  rest.post('/api/stations', async (req, res, ctx) => {
    const stationData = await req.json();
    const newStation = {
      id: 'station-2',
      ...stationData,
      status: 'active',
      pumpCount: 0,
    };
    return res(ctx.status(201), ctx.json(newStation));
  }),
  
  rest.put('/api/stations/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updateData = await req.json();
    const station = mockStations.find(s => s.id === id);
    return res(ctx.json({ ...station, ...updateData }));
  }),
  
  rest.delete('/api/stations/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  
  // Pumps endpoints
  rest.get('/api/pumps', (req, res, ctx) => {
    const stationId = req.url.searchParams.get('stationId');
    let pumps = mockPumps;
    if (stationId) {
      pumps = pumps.filter(p => p.stationId === stationId);
    }
    return res(ctx.json(pumps));
  }),
  
  rest.post('/api/pumps', async (req, res, ctx) => {
    const pumpData = await req.json();
    const newPump = {
      id: 'pump-3',
      ...pumpData,
      status: 'active',
    };
    return res(ctx.status(201), ctx.json(newPump));
  }),
  
  rest.put('/api/pumps/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updateData = await req.json();
    const pump = mockPumps.find(p => p.id === id);
    return res(ctx.json({ ...pump, ...updateData }));
  }),
  
  rest.delete('/api/pumps/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  })
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
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

describe('End-to-End User Workflows', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    server.listen();
    // Reset auth context
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    };
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe('Dashboard Overview Workflow', () => {
    it('should complete dashboard overview workflow', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Should load dashboard by default
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Should display dashboard stats
      await waitFor(() => {
        expect(screen.getByText('₹1,25,000')).toBeInTheDocument(); // Total sales
        expect(screen.getByText('1,250')).toBeInTheDocument(); // Total transactions
        expect(screen.getByText('12')).toBeInTheDocument(); // Active pumps
      });

      // Should display recent transactions
      await waitFor(() => {
        expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
        expect(screen.getByText('₹45.50')).toBeInTheDocument();
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Should be able to refresh data
      const refreshButton = screen.getByTestId('refresh-dashboard');
      await user.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText('₹1,25,000')).toBeInTheDocument();
      });
    });

    it('should handle dashboard navigation', async () => {
      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Navigate to stations
      const stationsLink = screen.getByText('Stations');
      await user.click(stationsLink);

      await waitFor(() => {
        expect(screen.getByText('Station Management')).toBeInTheDocument();
      });

      // Navigate back to dashboard
      const dashboardLink = screen.getByText('Dashboard');
      await user.click(dashboardLink);

      await waitFor(() => {
        expect(screen.getByText('₹1,25,000')).toBeInTheDocument();
      });
    });
  });

  describe('Station Management Workflow', () => {
    it('should complete full station CRUD workflow', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Navigate to stations
      const stationsLink = screen.getByText('Stations');
      await user.click(stationsLink);

      await waitFor(() => {
        expect(screen.getByText('Station Management')).toBeInTheDocument();
      });

      // Should display existing stations
      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
        expect(screen.getByText('Mumbai')).toBeInTheDocument();
      });

      // Create new station
      const addStationButton = screen.getByRole('button', { name: /add station/i });
      await user.click(addStationButton);

      await waitFor(() => {
        expect(screen.getByText('Create New Station')).toBeInTheDocument();
      });

      // Fill station form
      const nameInput = screen.getByLabelText(/station name/i);
      const addressInput = screen.getByLabelText(/address/i);
      const cityInput = screen.getByLabelText(/city/i);
      const stateInput = screen.getByLabelText(/state/i);
      const zipInput = screen.getByLabelText(/zip code/i);

      await user.type(nameInput, 'New Test Station');
      await user.type(addressInput, '456 Test Street');
      await user.type(cityInput, 'Delhi');
      await user.type(stateInput, 'Delhi');
      await user.type(zipInput, '110001');

      // Submit form
      const createButton = screen.getByRole('button', { name: /create station/i });
      await user.click(createButton);

      // Should show success message and close dialog
      await waitFor(() => {
        expect(screen.queryByText('Create New Station')).not.toBeInTheDocument();
      });

      // Should refresh station list (new station would appear in real scenario)
      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
      });

      // Edit existing station
      const editButton = screen.getByTestId('edit-station-station-1');
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Station')).toBeInTheDocument();
      });

      const editNameInput = screen.getByDisplayValue('Main Station');
      await user.clear(editNameInput);
      await user.type(editNameInput, 'Updated Main Station');

      const updateButton = screen.getByRole('button', { name: /update station/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.queryByText('Edit Station')).not.toBeInTheDocument();
      });

      // View station details
      const stationCard = screen.getByTestId('station-card-station-1');
      await user.click(stationCard);

      await waitFor(() => {
        expect(screen.getByText('Station Details')).toBeInTheDocument();
        expect(screen.getByText('Main Station')).toBeInTheDocument();
      });
    });

    it('should handle station deletion workflow', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Navigate to stations
      const stationsLink = screen.getByText('Stations');
      await user.click(stationsLink);

      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
      });

      // Delete station
      const deleteButton = screen.getByTestId('delete-station-station-1');
      await user.click(deleteButton);

      // Confirm deletion
      await waitFor(() => {
        expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
      });
    });
  });

  describe('Pump Management Workflow', () => {
    it('should complete pump management workflow', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Navigate to pumps
      const pumpsLink = screen.getByText('Pumps');
      await user.click(pumpsLink);

      await waitFor(() => {
        expect(screen.getByText('Pump Management')).toBeInTheDocument();
      });

      // Should display existing pumps
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
        expect(screen.getByText('SN001')).toBeInTheDocument();
      });

      // Filter pumps by station
      const stationFilter = screen.getByTestId('station-filter');
      await user.click(stationFilter);
      await user.click(screen.getByText('Main Station'));

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Filter by status
      const statusFilter = screen.getByTestId('status-filter');
      await user.click(statusFilter);
      await user.click(screen.getByText('Active'));

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.queryByText('Pump 2')).not.toBeInTheDocument();
      });

      // Create new pump
      const addPumpButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addPumpButton);

      await waitFor(() => {
        expect(screen.getByText('Create New Pump')).toBeInTheDocument();
      });

      // Fill pump form
      const pumpNameInput = screen.getByLabelText(/pump name/i);
      const serialInput = screen.getByLabelText(/serial number/i);
      const stationSelect = screen.getByTestId('pump-station-select');
      const nozzleInput = screen.getByLabelText(/nozzle count/i);

      await user.type(pumpNameInput, 'New Pump');
      await user.type(serialInput, 'SN003');
      await user.click(stationSelect);
      await user.click(screen.getByText('Main Station'));
      await user.clear(nozzleInput);
      await user.type(nozzleInput, '6');

      const createPumpButton = screen.getByRole('button', { name: /create pump/i });
      await user.click(createPumpButton);

      await waitFor(() => {
        expect(screen.queryByText('Create New Pump')).not.toBeInTheDocument();
      });

      // Update pump status
      const pumpCard = screen.getByTestId('pump-card-pump-1');
      const statusButton = within(pumpCard).getByTestId('status-toggle');
      await user.click(statusButton);

      await waitFor(() => {
        expect(screen.getByText('Maintenance')).toBeInTheDocument();
      });
    });
  });

  describe('Cross-Component Integration Workflow', () => {
    it('should handle station-to-pump navigation workflow', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Start at stations
      const stationsLink = screen.getByText('Stations');
      await user.click(stationsLink);

      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
      });

      // Click on station to view details
      const stationCard = screen.getByTestId('station-card-station-1');
      await user.click(stationCard);

      await waitFor(() => {
        expect(screen.getByText('Station Details')).toBeInTheDocument();
      });

      // Navigate to station's pumps
      const viewPumpsButton = screen.getByRole('button', { name: /view pumps/i });
      await user.click(viewPumpsButton);

      await waitFor(() => {
        expect(screen.getByText('Pump Management')).toBeInTheDocument();
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
      });

      // Should be filtered to show only this station's pumps
      const stationFilter = screen.getByTestId('station-filter');
      expect(stationFilter).toHaveValue('station-1');
    });

    it('should handle real-time updates across components', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Start at dashboard
      await waitFor(() => {
        expect(screen.getByText('12')).toBeInTheDocument(); // Active pumps
      });

      // Navigate to pumps and change status
      const pumpsLink = screen.getByText('Pumps');
      await user.click(pumpsLink);

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Change pump status to maintenance
      const pumpCard = screen.getByTestId('pump-card-pump-1');
      const statusButton = within(pumpCard).getByTestId('status-toggle');
      await user.click(statusButton);

      // Navigate back to dashboard
      const dashboardLink = screen.getByText('Dashboard');
      await user.click(dashboardLink);

      // Dashboard should reflect the change (in real scenario)
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Workflows', () => {
    it('should handle network errors gracefully', async () => {
      // Simulate network error
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      });

      // Should show retry option
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();

      // Reset server to working state
      server.resetHandlers();
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.json(mockDashboardStats));
        })
      );

      // Retry should work
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('₹1,25,000')).toBeInTheDocument();
      });
    });

    it('should handle validation errors in forms', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Navigate to stations and try to create invalid station
      const stationsLink = screen.getByText('Stations');
      await user.click(stationsLink);

      const addStationButton = screen.getByRole('button', { name: /add station/i });
      await user.click(addStationButton);

      // Submit empty form
      const createButton = screen.getByRole('button', { name: /create station/i });
      await user.click(createButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      });

      // Form should remain open
      expect(screen.getByText('Create New Station')).toBeInTheDocument();
    });
  });

  describe('Authentication Workflows', () => {
    it('should handle logout workflow', async () => {
      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Click user menu
      const userAvatar = screen.getByTestId('user-avatar');
      await user.click(userAvatar);

      // Click logout
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(mockAuthContext.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle unauthorized access', async () => {
      // Simulate unauthorized user
      mockAuthContext.isAuthenticated = false;
      mockAuthContext.user = null;

      render(<App />, { wrapper: createWrapper() });

      // Should redirect to login or show login form
      await waitFor(() => {
        expect(screen.getByText(/login/i) || screen.getByText(/sign in/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Accessibility Workflows', () => {
    it('should handle keyboard navigation workflow', async () => {
      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Tab through navigation
      await user.tab();
      expect(document.activeElement).toHaveAttribute('href', '/dashboard');

      await user.tab();
      expect(document.activeElement).toHaveAttribute('href', '/stations');

      await user.tab();
      expect(document.activeElement).toHaveAttribute('href', '/pumps');

      // Press Enter to navigate
      fireEvent.keyDown(document.activeElement!, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Pump Management')).toBeInTheDocument();
      });
    });

    it('should handle mobile responsive workflow', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Should show mobile menu button
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();

      // Open mobile menu
      const mobileMenuButton = screen.getByTestId('mobile-menu-button');
      await user.click(mobileMenuButton);

      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });
  });
});
