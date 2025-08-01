/**
 * @file __tests__/api/apiIntegration.test.ts
 * @description API integration tests for all endpoints
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { secureAPI } from '@/utils/apiSecurity';

// Mock data
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

const mockStations = [
  {
    id: 'station-1',
    name: 'Main Station',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    status: 'active',
  },
];

const mockNozzles = [
  {
    id: '1',
    name: 'Nozzle 1A',
    pumpId: '1',
    fuelType: 'gasoline',
    status: 'active',
    flowRate: 10.5,
  },
];

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'manager',
    status: 'active',
  },
];

// MSW server setup
const server = setupServer(
  // Authentication endpoints
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(ctx.json({
        user: { id: '1', email, name: 'Test User', role: 'manager' },
        token: 'mock-jwt-token',
        expiresIn: 3600,
      }));
    }
    
    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  }),
  
  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  
  rest.get('/api/auth/me', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }
    
    return res(ctx.json({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'manager',
    }));
  }),
  
  // Pumps endpoints
  rest.get('/api/pumps', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const stationId = req.url.searchParams.get('stationId');
    const search = req.url.searchParams.get('search');
    
    let filteredPumps = [...mockPumps];
    
    if (status) {
      filteredPumps = filteredPumps.filter(pump => pump.status === status);
    }
    
    if (stationId) {
      filteredPumps = filteredPumps.filter(pump => pump.stationId === stationId);
    }
    
    if (search) {
      filteredPumps = filteredPumps.filter(pump => 
        pump.name.toLowerCase().includes(search.toLowerCase()) ||
        pump.serialNumber.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return res(ctx.json(filteredPumps));
  }),
  
  rest.get('/api/pumps/:id', (req, res, ctx) => {
    const { id } = req.params;
    const pump = mockPumps.find(p => p.id === id);
    
    if (!pump) {
      return res(ctx.status(404), ctx.json({ error: 'Pump not found' }));
    }
    
    return res(ctx.json(pump));
  }),
  
  rest.post('/api/pumps', async (req, res, ctx) => {
    const pumpData = await req.json();
    
    // Validation
    if (!pumpData.name || !pumpData.serialNumber || !pumpData.stationId) {
      return res(ctx.status(400), ctx.json({
        error: 'Missing required fields',
        details: {
          name: !pumpData.name ? 'Name is required' : undefined,
          serialNumber: !pumpData.serialNumber ? 'Serial number is required' : undefined,
          stationId: !pumpData.stationId ? 'Station is required' : undefined,
        }
      }));
    }
    
    // Check for duplicate serial number
    if (mockPumps.some(p => p.serialNumber === pumpData.serialNumber)) {
      return res(ctx.status(400), ctx.json({
        error: 'Serial number already exists'
      }));
    }
    
    const newPump = {
      id: String(mockPumps.length + 1),
      ...pumpData,
      status: 'active',
    };
    
    return res(ctx.status(201), ctx.json(newPump));
  }),
  
  rest.put('/api/pumps/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updateData = await req.json();
    const pump = mockPumps.find(p => p.id === id);
    
    if (!pump) {
      return res(ctx.status(404), ctx.json({ error: 'Pump not found' }));
    }
    
    const updatedPump = { ...pump, ...updateData };
    return res(ctx.json(updatedPump));
  }),
  
  rest.delete('/api/pumps/:id', (req, res, ctx) => {
    const { id } = req.params;
    const pump = mockPumps.find(p => p.id === id);
    
    if (!pump) {
      return res(ctx.status(404), ctx.json({ error: 'Pump not found' }));
    }
    
    // Check if pump has active transactions
    if (pump.status === 'active') {
      return res(ctx.status(400), ctx.json({
        error: 'Cannot delete pump with active status'
      }));
    }
    
    return res(ctx.status(204));
  }),
  
  // Stations endpoints
  rest.get('/api/stations', (req, res, ctx) => {
    return res(ctx.json(mockStations));
  }),
  
  rest.post('/api/stations', async (req, res, ctx) => {
    const stationData = await req.json();
    
    if (!stationData.name || !stationData.address) {
      return res(ctx.status(400), ctx.json({
        error: 'Missing required fields'
      }));
    }
    
    const newStation = {
      id: String(mockStations.length + 1),
      ...stationData,
      status: 'active',
    };
    
    return res(ctx.status(201), ctx.json(newStation));
  }),
  
  // Nozzles endpoints
  rest.get('/api/nozzles', (req, res, ctx) => {
    const pumpId = req.url.searchParams.get('pumpId');
    
    let filteredNozzles = [...mockNozzles];
    if (pumpId) {
      filteredNozzles = filteredNozzles.filter(n => n.pumpId === pumpId);
    }
    
    return res(ctx.json(filteredNozzles));
  }),
  
  // Users endpoints
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json(mockUsers));
  }),
  
  rest.post('/api/users', async (req, res, ctx) => {
    const userData = await req.json();
    
    if (!userData.name || !userData.email) {
      return res(ctx.status(400), ctx.json({
        error: 'Missing required fields'
      }));
    }
    
    // Check for duplicate email
    if (mockUsers.some(u => u.email === userData.email)) {
      return res(ctx.status(400), ctx.json({
        error: 'Email already exists'
      }));
    }
    
    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
      status: 'active',
    };
    
    return res(ctx.status(201), ctx.json(newUser));
  }),
  
  // Dashboard endpoints
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(ctx.json({
      totalSales: 125000,
      totalTransactions: 1250,
      activePumps: mockPumps.filter(p => p.status === 'active').length,
      totalStations: mockStations.length,
    }));
  }),
  
  rest.get('/api/dashboard/sales', (req, res, ctx) => {
    const range = req.url.searchParams.get('range') || 'week';
    
    const salesData = [
      { date: '2024-01-01', sales: 12000 },
      { date: '2024-01-02', sales: 13500 },
      { date: '2024-01-03', sales: 11800 },
    ];
    
    return res(ctx.json(salesData));
  }),
  
  // Error simulation endpoints
  rest.get('/api/error/500', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
  }),
  
  rest.get('/api/error/timeout', (req, res, ctx) => {
    return res(ctx.delay(5000), ctx.json({ data: 'delayed' }));
  }),
  
  rest.get('/api/error/network', (req, res, ctx) => {
    return res.networkError('Network error');
  })
);

describe('API Integration Tests', () => {
  beforeEach(() => {
    server.listen();
    // Set up CSRF token
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = 'test-csrf-token';
    document.head.appendChild(meta);
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
    // Clean up DOM
    document.head.innerHTML = '';
  });

  describe('Authentication API', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await secureAPI.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.user.email).toBe('test@example.com');
      expect(data.token).toBe('mock-jwt-token');
    });

    it('should reject invalid credentials', async () => {
      const response = await secureAPI.post('/auth/login', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid credentials');
    });

    it('should get current user with valid token', async () => {
      // First login to get token
      await secureAPI.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await secureAPI.get('/auth/me');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.email).toBe('test@example.com');
    });

    it('should reject requests without valid token', async () => {
      const response = await secureAPI.get('/auth/me');
      expect(response.status).toBe(401);
    });
  });

  describe('Pumps API', () => {
    it('should get all pumps', async () => {
      const response = await secureAPI.get('/pumps');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Pump 1');
    });

    it('should filter pumps by status', async () => {
      const response = await secureAPI.get('/pumps?status=active');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveLength(1);
      expect(data[0].status).toBe('active');
    });

    it('should search pumps by name', async () => {
      const response = await secureAPI.get('/pumps?search=Pump 1');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Pump 1');
    });

    it('should get pump by ID', async () => {
      const response = await secureAPI.get('/pumps/1');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.id).toBe('1');
      expect(data.name).toBe('Pump 1');
    });

    it('should return 404 for non-existent pump', async () => {
      const response = await secureAPI.get('/pumps/999');
      expect(response.status).toBe(404);
    });

    it('should create new pump with valid data', async () => {
      const newPump = {
        name: 'New Pump',
        serialNumber: 'SN003',
        stationId: 'station-1',
        nozzleCount: 4,
      };

      const response = await secureAPI.post('/pumps', newPump);
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.name).toBe('New Pump');
      expect(data.status).toBe('active');
    });

    it('should validate required fields on create', async () => {
      const invalidPump = {
        name: '',
        serialNumber: '',
      };

      const response = await secureAPI.post('/pumps', invalidPump);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Missing required fields');
      expect(data.details.name).toBeDefined();
      expect(data.details.serialNumber).toBeDefined();
    });

    it('should prevent duplicate serial numbers', async () => {
      const duplicatePump = {
        name: 'Duplicate Pump',
        serialNumber: 'SN001', // Already exists
        stationId: 'station-1',
      };

      const response = await secureAPI.post('/pumps', duplicatePump);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Serial number already exists');
    });

    it('should update pump', async () => {
      const updateData = {
        name: 'Updated Pump 1',
        status: 'maintenance',
      };

      const response = await secureAPI.put('/pumps/1', updateData);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.name).toBe('Updated Pump 1');
      expect(data.status).toBe('maintenance');
    });

    it('should delete pump with inactive status', async () => {
      // First update pump to inactive
      await secureAPI.put('/pumps/2', { status: 'inactive' });
      
      const response = await secureAPI.delete('/pumps/2');
      expect(response.status).toBe(204);
    });

    it('should prevent deletion of active pump', async () => {
      const response = await secureAPI.delete('/pumps/1');
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Cannot delete pump with active status');
    });
  });

  describe('Stations API', () => {
    it('should get all stations', async () => {
      const response = await secureAPI.get('/stations');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Main Station');
    });

    it('should create new station', async () => {
      const newStation = {
        name: 'New Station',
        address: '456 New St',
        city: 'New City',
        state: 'NC',
        zipCode: '12345',
      };

      const response = await secureAPI.post('/stations', newStation);
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.name).toBe('New Station');
      expect(data.status).toBe('active');
    });

    it('should validate required fields for station', async () => {
      const invalidStation = {
        name: '',
      };

      const response = await secureAPI.post('/stations', invalidStation);
      expect(response.status).toBe(400);
    });
  });

  describe('Nozzles API', () => {
    it('should get all nozzles', async () => {
      const response = await secureAPI.get('/nozzles');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
    });

    it('should filter nozzles by pump', async () => {
      const response = await secureAPI.get('/nozzles?pumpId=1');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveLength(1);
      expect(data[0].pumpId).toBe('1');
    });
  });

  describe('Users API', () => {
    it('should get all users', async () => {
      const response = await secureAPI.get('/users');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
    });

    it('should create new user', async () => {
      const newUser = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'operator',
      };

      const response = await secureAPI.post('/users', newUser);
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.name).toBe('Jane Doe');
      expect(data.status).toBe('active');
    });

    it('should prevent duplicate emails', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: 'john@example.com', // Already exists
        role: 'operator',
      };

      const response = await secureAPI.post('/users', duplicateUser);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Email already exists');
    });
  });

  describe('Dashboard API', () => {
    it('should get dashboard stats', async () => {
      const response = await secureAPI.get('/dashboard/stats');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.totalSales).toBe(125000);
      expect(data.activePumps).toBe(1); // Only one active pump in mock data
    });

    it('should get sales data with date range', async () => {
      const response = await secureAPI.get('/dashboard/sales?range=week');
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle 500 server errors', async () => {
      const response = await secureAPI.get('/error/500');
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });

    it('should handle network errors', async () => {
      await expect(secureAPI.get('/error/network')).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      // Set a short timeout for testing
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 1000);

      await expect(
        secureAPI.request('/error/timeout', {
          signal: controller.signal,
        })
      ).rejects.toThrow();
    });
  });

  describe('Security Features', () => {
    it('should include CSRF token in requests', async () => {
      let csrfToken: string | null = null;
      
      server.use(
        rest.post('/api/test-csrf', (req, res, ctx) => {
          csrfToken = req.headers.get('X-CSRF-Token');
          return res(ctx.json({ success: true }));
        })
      );

      await secureAPI.post('/test-csrf', { data: 'test' });
      expect(csrfToken).toBe('test-csrf-token');
    });

    it('should include security headers', async () => {
      let requestedWith: string | null = null;
      
      server.use(
        rest.get('/api/test-headers', (req, res, ctx) => {
          requestedWith = req.headers.get('X-Requested-With');
          return res(ctx.json({ success: true }));
        })
      );

      await secureAPI.get('/test-headers');
      expect(requestedWith).toBe('XMLHttpRequest');
    });

    it('should sanitize input data', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        description: 'javascript:alert("xss")',
      };

      // This should not throw an error due to input validation
      await expect(secureAPI.post('/pumps', maliciousData)).rejects.toThrow('Invalid data');
    });
  });

  describe('Rate Limiting', () => {
    it('should track rate limit status', async () => {
      const status = secureAPI.getRateLimitStatus();
      expect(status.remaining).toBeGreaterThan(0);
      expect(typeof status.resetTime).toBe('number');
    });

    it('should handle rate limit exceeded', async () => {
      // Make many requests to trigger rate limit
      const requests = Array.from({ length: 101 }, () => 
        secureAPI.get('/pumps').catch(() => {}) // Ignore errors
      );

      await Promise.all(requests);

      // Next request should be rate limited
      await expect(secureAPI.get('/pumps')).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('Request Validation', () => {
    it('should validate URL format', async () => {
      await expect(secureAPI.get('invalid-url')).rejects.toThrow('Invalid URL');
    });

    it('should validate request body', async () => {
      const invalidData = {
        name: '<script>alert("xss")</script>',
      };

      await expect(secureAPI.post('/pumps', invalidData)).rejects.toThrow('Invalid data');
    });
  });

  describe('Response Handling', () => {
    it('should handle JSON responses', async () => {
      const response = await secureAPI.get('/pumps');
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should handle empty responses', async () => {
      const response = await secureAPI.delete('/pumps/2');
      expect(response.status).toBe(204);
      expect(response.body).toBeNull();
    });

    it('should handle malformed JSON', async () => {
      server.use(
        rest.get('/api/malformed', (req, res, ctx) => {
          return res(ctx.text('invalid json {'));
        })
      );

      const response = await secureAPI.get('/malformed');
      await expect(response.json()).rejects.toThrow();
    });
  });
});
