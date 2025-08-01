/**
 * @file __tests__/integration/PumpManagementIntegration.test.tsx
 * @description Integration tests for pump management workflow
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PumpsPage from '@/pages/dashboard/PumpsPage';

// Mock data
const mockPumps = [
  {
    id: '1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    stationId: 'station-1',
    stationName: 'Main Station',
    status: 'active',
    nozzleCount: 4,
    lastMaintenance: '2024-01-15',
    fuelType: 'gasoline',
    totalSales: 15000,
    dailyTransactions: 45,
  },
  {
    id: '2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    stationId: 'station-1',
    stationName: 'Main Station',
    status: 'maintenance',
    nozzleCount: 2,
    lastMaintenance: '2024-01-10',
    fuelType: 'diesel',
    totalSales: 12000,
    dailyTransactions: 32,
  },
];

const mockStations = [
  { id: 'station-1', name: 'Main Station' },
  { id: 'station-2', name: 'North Station' },
];

const mockNozzles = [
  { id: '1', name: 'Nozzle 1A', pumpId: '1', fuelType: 'gasoline', status: 'active' },
  { id: '2', name: 'Nozzle 1B', pumpId: '1', fuelType: 'diesel', status: 'active' },
  { id: '3', name: 'Nozzle 2A', pumpId: '2', fuelType: 'diesel', status: 'maintenance' },
];

// MSW server setup
const server = setupServer(
  rest.get('/api/pumps', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const stationId = req.url.searchParams.get('stationId');
    
    let filteredPumps = mockPumps;
    if (status) {
      filteredPumps = filteredPumps.filter(pump => pump.status === status);
    }
    if (stationId) {
      filteredPumps = filteredPumps.filter(pump => pump.stationId === stationId);
    }
    
    return res(ctx.json(filteredPumps));
  }),
  
  rest.post('/api/pumps', (req, res, ctx) => {
    const newPump = { id: '3', ...req.body };
    return res(ctx.json(newPump));
  }),
  
  rest.put('/api/pumps/:id', (req, res, ctx) => {
    const { id } = req.params;
    const updatedPump = mockPumps.find(p => p.id === id);
    return res(ctx.json({ ...updatedPump, ...req.body }));
  }),
  
  rest.delete('/api/pumps/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  
  rest.get('/api/stations', (req, res, ctx) => {
    return res(ctx.json(mockStations));
  }),
  
  rest.get('/api/pumps/:id/nozzles', (req, res, ctx) => {
    const { id } = req.params;
    const pumpNozzles = mockNozzles.filter(n => n.pumpId === id);
    return res(ctx.json(pumpNozzles));
  }),
  
  rest.get('/api/pumps/:id/maintenance', (req, res, ctx) => {
    return res(ctx.json({
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      maintenanceHistory: [
        { date: '2024-01-15', type: 'routine', notes: 'Regular maintenance' },
        { date: '2023-10-15', type: 'repair', notes: 'Fixed nozzle issue' },
      ]
    }));
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

describe('Pump Management Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe('pump listing and filtering', () => {
    it('should load and display pumps with filtering', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      // Wait for pumps to load
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
      });

      // Test status filtering
      const statusFilter = screen.getByRole('combobox', { name: /status/i });
      await user.selectOptions(statusFilter, 'active');

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.queryByText('Pump 2')).not.toBeInTheDocument();
      });

      // Test station filtering
      await user.selectOptions(statusFilter, ''); // Clear status filter
      const stationFilter = screen.getByRole('combobox', { name: /station/i });
      await user.selectOptions(stationFilter, 'station-1');

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
      });
    });

    it('should search pumps by name and serial number', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('textbox', { name: /search/i });
      await user.type(searchInput, 'SN001');

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.queryByText('Pump 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('pump creation workflow', () => {
    it('should create a new pump with validation', async () => {
      let createdPump: any = null;
      server.use(
        rest.post('/api/pumps', async (req, res, ctx) => {
          createdPump = await req.json();
          return res(ctx.json({ id: '3', ...createdPump }));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Open create modal
      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog', { name: /create pump/i });
      expect(modal).toBeInTheDocument();

      // Fill form
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      const serialInput = within(modal).getByRole('textbox', { name: /serial/i });
      const stationSelect = within(modal).getByRole('combobox', { name: /station/i });
      const nozzleCountInput = within(modal).getByRole('spinbutton', { name: /nozzle count/i });

      await user.type(nameInput, 'New Pump');
      await user.type(serialInput, 'SN003');
      await user.selectOptions(stationSelect, 'station-1');
      await user.clear(nozzleCountInput);
      await user.type(nozzleCountInput, '6');

      // Submit form
      const submitButton = within(modal).getByRole('button', { name: /create/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(createdPump).toEqual({
          name: 'New Pump',
          serialNumber: 'SN003',
          stationId: 'station-1',
          nozzleCount: 6,
        });
      });

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should validate form fields', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const submitButton = within(modal).getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/serial number is required/i)).toBeInTheDocument();
        expect(screen.getByText(/station is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('pump editing workflow', () => {
    it('should edit pump details', async () => {
      let updatedPump: any = null;
      server.use(
        rest.put('/api/pumps/:id', async (req, res, ctx) => {
          updatedPump = await req.json();
          return res(ctx.json({ id: req.params.id, ...updatedPump }));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Click edit button
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      const modal = screen.getByRole('dialog', { name: /edit pump/i });
      expect(modal).toBeInTheDocument();

      // Update name
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Pump 1');

      // Submit changes
      const submitButton = within(modal).getByRole('button', { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(updatedPump.name).toBe('Updated Pump 1');
      });
    });

    it('should update pump status', async () => {
      let statusUpdate: any = null;
      server.use(
        rest.put('/api/pumps/:id', async (req, res, ctx) => {
          statusUpdate = await req.json();
          return res(ctx.json({ id: req.params.id, ...statusUpdate }));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Click status change button
      const statusButtons = screen.getAllByRole('button', { name: /change status/i });
      await user.click(statusButtons[0]);

      // Select maintenance status
      const statusMenu = screen.getByRole('menu');
      const maintenanceOption = within(statusMenu).getByRole('menuitem', { name: /maintenance/i });
      await user.click(maintenanceOption);

      await waitFor(() => {
        expect(statusUpdate.status).toBe('maintenance');
      });
    });
  });

  describe('pump deletion workflow', () => {
    it('should delete pump with confirmation', async () => {
      let deletedPumpId: string | null = null;
      server.use(
        rest.delete('/api/pumps/:id', (req, res, ctx) => {
          deletedPumpId = req.params.id as string;
          return res(ctx.status(204));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // Confirm deletion
      const confirmDialog = screen.getByRole('dialog', { name: /confirm delete/i });
      const confirmButton = within(confirmDialog).getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(deletedPumpId).toBe('1');
      });
    });

    it('should prevent deletion of pumps with active transactions', async () => {
      server.use(
        rest.delete('/api/pumps/:id', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({
            error: 'Cannot delete pump with active transactions'
          }));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      const confirmDialog = screen.getByRole('dialog', { name: /confirm delete/i });
      const confirmButton = within(confirmDialog).getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/cannot delete pump with active transactions/i)).toBeInTheDocument();
      });
    });
  });

  describe('pump details and maintenance', () => {
    it('should view pump details with nozzles', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Click view details
      const viewButtons = screen.getAllByRole('button', { name: /view details/i });
      await user.click(viewButtons[0]);

      const detailsModal = screen.getByRole('dialog', { name: /pump details/i });
      expect(detailsModal).toBeInTheDocument();

      // Should show nozzles
      await waitFor(() => {
        expect(screen.getByText('Nozzle 1A')).toBeInTheDocument();
        expect(screen.getByText('Nozzle 1B')).toBeInTheDocument();
      });

      // Should show maintenance info
      expect(screen.getByText(/last maintenance/i)).toBeInTheDocument();
      expect(screen.getByText(/next maintenance/i)).toBeInTheDocument();
    });

    it('should schedule maintenance', async () => {
      let maintenanceSchedule: any = null;
      server.use(
        rest.post('/api/pumps/:id/maintenance', async (req, res, ctx) => {
          maintenanceSchedule = await req.json();
          return res(ctx.json({ id: 'maint-1', ...maintenanceSchedule }));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Open maintenance modal
      const maintenanceButtons = screen.getAllByRole('button', { name: /schedule maintenance/i });
      await user.click(maintenanceButtons[0]);

      const maintenanceModal = screen.getByRole('dialog', { name: /schedule maintenance/i });
      expect(maintenanceModal).toBeInTheDocument();

      // Fill maintenance form
      const dateInput = within(maintenanceModal).getByRole('textbox', { name: /date/i });
      const typeSelect = within(maintenanceModal).getByRole('combobox', { name: /type/i });
      const notesInput = within(maintenanceModal).getByRole('textbox', { name: /notes/i });

      await user.type(dateInput, '2024-02-15');
      await user.selectOptions(typeSelect, 'routine');
      await user.type(notesInput, 'Scheduled routine maintenance');

      const scheduleButton = within(maintenanceModal).getByRole('button', { name: /schedule/i });
      await user.click(scheduleButton);

      await waitFor(() => {
        expect(maintenanceSchedule).toEqual({
          date: '2024-02-15',
          type: 'routine',
          notes: 'Scheduled routine maintenance',
        });
      });
    });
  });

  describe('bulk operations', () => {
    it('should perform bulk status updates', async () => {
      let bulkUpdate: any = null;
      server.use(
        rest.put('/api/pumps/bulk', async (req, res, ctx) => {
          bulkUpdate = await req.json();
          return res(ctx.json({ updated: bulkUpdate.ids.length }));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Select multiple pumps
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Select Pump 1
      await user.click(checkboxes[1]); // Select Pump 2

      // Open bulk actions menu
      const bulkActionsButton = screen.getByRole('button', { name: /bulk actions/i });
      await user.click(bulkActionsButton);

      // Select status update
      const statusUpdateOption = screen.getByRole('menuitem', { name: /update status/i });
      await user.click(statusUpdateOption);

      // Choose new status
      const statusModal = screen.getByRole('dialog', { name: /bulk status update/i });
      const statusSelect = within(statusModal).getByRole('combobox', { name: /new status/i });
      await user.selectOptions(statusSelect, 'maintenance');

      const updateButton = within(statusModal).getByRole('button', { name: /update/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(bulkUpdate).toEqual({
          ids: ['1', '2'],
          status: 'maintenance',
        });
      });
    });

    it('should export pump data', async () => {
      const mockBlob = new Blob(['pump,data'], { type: 'text/csv' });
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();

      server.use(
        rest.get('/api/pumps/export', (req, res, ctx) => {
          return res(ctx.body('pump,data\nPump 1,active\nPump 2,maintenance'));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalled();
      });
    });
  });

  describe('real-time updates', () => {
    it('should update pump status in real-time', async () => {
      const mockWebSocket = {
        send: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      global.WebSocket = vi.fn(() => mockWebSocket) as any;

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      // Simulate WebSocket message
      const messageHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1];

      if (messageHandler) {
        messageHandler({
          data: JSON.stringify({
            type: 'pump_status_update',
            data: { id: '1', status: 'maintenance' }
          })
        });
      }

      await waitFor(() => {
        expect(screen.getByText('maintenance')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      server.use(
        rest.get('/api/pumps', (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should handle validation errors on create', async () => {
      server.use(
        rest.post('/api/pumps', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({
            errors: {
              serialNumber: 'Serial number already exists'
            }
          }));
        })
      );

      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);

      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      const serialInput = within(modal).getByRole('textbox', { name: /serial/i });
      const stationSelect = within(modal).getByRole('combobox', { name: /station/i });

      await user.type(nameInput, 'Test Pump');
      await user.type(serialInput, 'SN001'); // Duplicate serial
      await user.selectOptions(stationSelect, 'station-1');

      const submitButton = within(modal).getByRole('button', { name: /create/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/serial number already exists/i)).toBeInTheDocument();
      });
    });
  });
});
