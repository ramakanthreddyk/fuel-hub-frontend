/**
 * @file __tests__/integration/UserWorkflowIntegration.test.tsx
 * @description End-to-end user workflow integration tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '@/App';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PumpsPage from '@/pages/dashboard/PumpsPage';
import StationsPage from '@/pages/dashboard/StationsPage';

// Mock authentication
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'manager',
  permissions: ['read:pumps', 'write:pumps', 'read:stations', 'write:stations'],
};

// Mock data
const mockDashboardData = {
  stats: {
    totalSales: 125000,
    totalTransactions: 1250,
    activePumps: 12,
    totalStations: 3,
  },
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'Maintenance Required',
      message: 'Pump 4 requires scheduled maintenance',
      priority: 'medium',
    },
  ],
};

const mockPumps = [
  {
    id: '1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    stationId: 'station-1',
    stationName: 'Main Station',
    status: 'active',
    nozzleCount: 4,
  },
  {
    id: '4',
    name: 'Pump 4',
    serialNumber: 'SN004',
    stationId: 'station-1',
    stationName: 'Main Station',
    status: 'maintenance',
    nozzleCount: 2,
  },
];

const mockStations = [
  {
    id: 'station-1',
    name: 'Main Station',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    status: 'active',
    pumpCount: 8,
  },
];

// MSW server setup
const server = setupServer(
  // Authentication
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ user: mockUser, token: 'mock-token' }));
  }),
  
  rest.get('/api/auth/me', (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  
  // Dashboard
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(ctx.json(mockDashboardData.stats));
  }),
  
  rest.get('/api/dashboard/alerts', (req, res, ctx) => {
    return res(ctx.json(mockDashboardData.alerts));
  }),
  
  // Pumps
  rest.get('/api/pumps', (req, res, ctx) => {
    return res(ctx.json(mockPumps));
  }),
  
  rest.put('/api/pumps/:id', (req, res, ctx) => {
    const { id } = req.params;
    const pump = mockPumps.find(p => p.id === id);
    return res(ctx.json({ ...pump, ...req.body }));
  }),
  
  // Stations
  rest.get('/api/stations', (req, res, ctx) => {
    return res(ctx.json(mockStations));
  }),
  
  // Maintenance
  rest.post('/api/pumps/:id/maintenance', (req, res, ctx) => {
    return res(ctx.json({ id: 'maint-1', ...req.body }));
  })
);

const TestApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pumps" element={<PumpsPage />} />
      <Route path="/stations" element={<StationsPage />} />
    </Routes>
  </BrowserRouter>
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
      {children}
    </QueryClientProvider>
  );
};

describe('User Workflow Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    server.listen();
    // Mock localStorage for auth token
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe('dashboard to pump management workflow', () => {
    it('should navigate from dashboard alert to pump maintenance', async () => {
      render(<TestApp />, { wrapper: createWrapper() });

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
        expect(screen.getByText('Maintenance Required')).toBeInTheDocument();
      });

      // Click on maintenance alert
      const alert = screen.getByText('Maintenance Required');
      await user.click(alert);

      // Should open alert details
      const alertModal = screen.getByRole('dialog', { name: /alert details/i });
      expect(alertModal).toBeInTheDocument();

      // Click "Go to Pump" button
      const goToPumpButton = within(alertModal).getByRole('button', { name: /go to pump/i });
      await user.click(goToPumpButton);

      // Should navigate to pumps page
      expect(window.location.pathname).toBe('/pumps');

      // Wait for pumps page to load
      await waitFor(() => {
        expect(screen.getByText('Pump 4')).toBeInTheDocument();
        expect(screen.getByText('maintenance')).toBeInTheDocument();
      });

      // Pump 4 should be highlighted/filtered
      expect(screen.getByTestId('pump-4')).toHaveClass('highlighted');
    });

    it('should complete maintenance workflow from alert', async () => {
      let maintenanceScheduled = false;
      server.use(
        rest.post('/api/pumps/:id/maintenance', (req, res, ctx) => {
          maintenanceScheduled = true;
          return res(ctx.json({ id: 'maint-1', status: 'scheduled' }));
        })
      );

      render(<TestApp />, { wrapper: createWrapper() });

      // Start from dashboard
      await waitFor(() => {
        expect(screen.getByText('Maintenance Required')).toBeInTheDocument();
      });

      // Navigate to pump maintenance
      const alert = screen.getByText('Maintenance Required');
      await user.click(alert);

      const alertModal = screen.getByRole('dialog');
      const goToPumpButton = within(alertModal).getByRole('button', { name: /go to pump/i });
      await user.click(goToPumpButton);

      // Schedule maintenance
      await waitFor(() => {
        expect(screen.getByText('Pump 4')).toBeInTheDocument();
      });

      const scheduleButton = screen.getByRole('button', { name: /schedule maintenance/i });
      await user.click(scheduleButton);

      const maintenanceModal = screen.getByRole('dialog', { name: /schedule maintenance/i });
      const dateInput = within(maintenanceModal).getByRole('textbox', { name: /date/i });
      const typeSelect = within(maintenanceModal).getByRole('combobox', { name: /type/i });

      await user.type(dateInput, '2024-02-15');
      await user.selectOptions(typeSelect, 'routine');

      const confirmButton = within(maintenanceModal).getByRole('button', { name: /schedule/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(maintenanceScheduled).toBe(true);
      });

      // Should show success message
      expect(screen.getByText(/maintenance scheduled successfully/i)).toBeInTheDocument();
    });
  });

  describe('pump status management workflow', () => {
    it('should update pump status and reflect changes across the app', async () => {
      let updatedPumpStatus: string | null = null;
      server.use(
        rest.put('/api/pumps/:id', async (req, res, ctx) => {
          const body = await req.json();
          updatedPumpStatus = body.status;
          const pump = mockPumps.find(p => p.id === req.params.id);
          return res(ctx.json({ ...pump, status: body.status }));
        })
      );

      render(<TestApp />, { wrapper: createWrapper() });

      // Navigate to pumps page
      window.history.pushState({}, '', '/pumps');
      
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Change pump status
      const statusButtons = screen.getAllByRole('button', { name: /change status/i });
      await user.click(statusButtons[0]); // Pump 1

      const statusMenu = screen.getByRole('menu');
      const maintenanceOption = within(statusMenu).getByRole('menuitem', { name: /maintenance/i });
      await user.click(maintenanceOption);

      await waitFor(() => {
        expect(updatedPumpStatus).toBe('maintenance');
      });

      // Navigate back to dashboard
      window.history.pushState({}, '', '/dashboard');

      // Dashboard stats should reflect the change
      await waitFor(() => {
        expect(screen.getByText('11')).toBeInTheDocument(); // Active pumps reduced by 1
      });
    });

    it('should handle bulk pump operations', async () => {
      let bulkUpdateData: any = null;
      server.use(
        rest.put('/api/pumps/bulk', async (req, res, ctx) => {
          bulkUpdateData = await req.json();
          return res(ctx.json({ updated: bulkUpdateData.ids.length }));
        })
      );

      render(<TestApp />, { wrapper: createWrapper() });

      // Navigate to pumps page
      window.history.pushState({}, '', '/pumps');

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Select multiple pumps
      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
      await user.click(selectAllCheckbox);

      // Perform bulk action
      const bulkActionsButton = screen.getByRole('button', { name: /bulk actions/i });
      await user.click(bulkActionsButton);

      const statusUpdateOption = screen.getByRole('menuitem', { name: /update status/i });
      await user.click(statusUpdateOption);

      const bulkModal = screen.getByRole('dialog', { name: /bulk status update/i });
      const statusSelect = within(bulkModal).getByRole('combobox', { name: /new status/i });
      await user.selectOptions(statusSelect, 'inactive');

      const updateButton = within(bulkModal).getByRole('button', { name: /update/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(bulkUpdateData).toEqual({
          ids: ['1', '4'],
          status: 'inactive',
        });
      });

      // Should show success message
      expect(screen.getByText(/2 pumps updated successfully/i)).toBeInTheDocument();
    });
  });

  describe('station management workflow', () => {
    it('should navigate from station to pump management', async () => {
      render(<TestApp />, { wrapper: createWrapper() });

      // Navigate to stations page
      window.history.pushState({}, '', '/stations');

      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
      });

      // Click on station to view details
      const stationCard = screen.getByTestId('station-card-station-1');
      const viewPumpsButton = within(stationCard).getByRole('button', { name: /view pumps/i });
      await user.click(viewPumpsButton);

      // Should navigate to pumps page with station filter
      expect(window.location.pathname).toBe('/pumps');
      expect(window.location.search).toContain('stationId=station-1');

      // Should show only pumps from that station
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 4')).toBeInTheDocument();
      });

      // Station filter should be applied
      const stationFilter = screen.getByRole('combobox', { name: /station/i });
      expect(stationFilter).toHaveValue('station-1');
    });

    it('should create new station and add pumps', async () => {
      let createdStation: any = null;
      let createdPump: any = null;

      server.use(
        rest.post('/api/stations', async (req, res, ctx) => {
          createdStation = await req.json();
          return res(ctx.json({ id: 'station-2', ...createdStation }));
        }),
        rest.post('/api/pumps', async (req, res, ctx) => {
          createdPump = await req.json();
          return res(ctx.json({ id: 'pump-new', ...createdPump }));
        })
      );

      render(<TestApp />, { wrapper: createWrapper() });

      // Navigate to stations page
      window.history.pushState({}, '', '/stations');

      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
      });

      // Create new station
      const addStationButton = screen.getByRole('button', { name: /add station/i });
      await user.click(addStationButton);

      const stationModal = screen.getByRole('dialog', { name: /create station/i });
      const nameInput = within(stationModal).getByRole('textbox', { name: /name/i });
      const addressInput = within(stationModal).getByRole('textbox', { name: /address/i });

      await user.type(nameInput, 'New Station');
      await user.type(addressInput, '456 New St');

      const createButton = within(stationModal).getByRole('button', { name: /create/i });
      await user.click(createButton);

      await waitFor(() => {
        expect(createdStation.name).toBe('New Station');
      });

      // Navigate to pumps and add pump to new station
      window.history.pushState({}, '', '/pumps');

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      const addPumpButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addPumpButton);

      const pumpModal = screen.getByRole('dialog', { name: /create pump/i });
      const pumpNameInput = within(pumpModal).getByRole('textbox', { name: /name/i });
      const stationSelect = within(pumpModal).getByRole('combobox', { name: /station/i });

      await user.type(pumpNameInput, 'New Pump');
      await user.selectOptions(stationSelect, 'station-2');

      const createPumpButton = within(pumpModal).getByRole('button', { name: /create/i });
      await user.click(createPumpButton);

      await waitFor(() => {
        expect(createdPump.name).toBe('New Pump');
        expect(createdPump.stationId).toBe('station-2');
      });
    });
  });

  describe('error handling across workflows', () => {
    it('should handle network errors gracefully', async () => {
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      render(<TestApp />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });

      // Retry should work
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.json(mockDashboardData.stats));
        })
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
      });
    });

    it('should handle permission errors', async () => {
      server.use(
        rest.put('/api/pumps/:id', (req, res, ctx) => {
          return res(ctx.status(403), ctx.json({
            error: 'Insufficient permissions'
          }));
        })
      );

      render(<TestApp />, { wrapper: createWrapper() });

      window.history.pushState({}, '', '/pumps');

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      const statusButtons = screen.getAllByRole('button', { name: /change status/i });
      await user.click(statusButtons[0]);

      const statusMenu = screen.getByRole('menu');
      const maintenanceOption = within(statusMenu).getByRole('menuitem', { name: /maintenance/i });
      await user.click(maintenanceOption);

      await waitFor(() => {
        expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
      });
    });
  });

  describe('accessibility workflow', () => {
    it('should support keyboard navigation across pages', async () => {
      render(<TestApp />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
      });

      // Tab through dashboard elements
      const firstFocusable = screen.getByRole('button', { name: /refresh/i });
      firstFocusable.focus();

      await user.tab();
      const secondFocusable = screen.getByRole('combobox', { name: /date range/i });
      expect(document.activeElement).toBe(secondFocusable);

      // Navigate to pumps page using keyboard
      await user.keyboard('{Enter}');
      
      // Should maintain focus management
      await waitFor(() => {
        const pumpPageHeading = screen.getByRole('heading', { name: /pumps/i });
        expect(pumpPageHeading).toBeInTheDocument();
      });
    });

    it('should announce page changes to screen readers', async () => {
      render(<TestApp />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
      });

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');

      // Navigate to pumps page
      window.history.pushState({}, '', '/pumps');

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/navigated to pumps page/i);
      });
    });
  });

  describe('performance across workflows', () => {
    it('should lazy load pages efficiently', async () => {
      const pumpPageImportSpy = vi.fn();
      
      vi.doMock('@/pages/dashboard/PumpsPage', () => {
        pumpPageImportSpy();
        return {
          default: () => <div data-testid="pumps-page">Pumps Page</div>
        };
      });

      render(<TestApp />, { wrapper: createWrapper() });

      // Pumps page should not be loaded initially
      expect(pumpPageImportSpy).not.toHaveBeenCalled();

      // Navigate to pumps page
      window.history.pushState({}, '', '/pumps');

      await waitFor(() => {
        expect(pumpPageImportSpy).toHaveBeenCalled();
        expect(screen.getByTestId('pumps-page')).toBeInTheDocument();
      });
    });

    it('should cache data between page navigations', async () => {
      const statsApiSpy = vi.fn();
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          statsApiSpy();
          return res(ctx.json(mockDashboardData.stats));
        })
      );

      render(<TestApp />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
        expect(statsApiSpy).toHaveBeenCalledTimes(1);
      });

      // Navigate away and back
      window.history.pushState({}, '', '/pumps');
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      window.history.pushState({}, '', '/dashboard');
      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
      });

      // Should use cached data
      expect(statsApiSpy).toHaveBeenCalledTimes(1);
    });
  });
});
