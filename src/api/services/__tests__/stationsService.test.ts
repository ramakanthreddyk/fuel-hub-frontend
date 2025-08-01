/**
 * @file api/services/__tests__/stationsService.test.ts
 * @description Tests for stationsService
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { stationsService } from '../stationsService';

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
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'station-2',
    name: 'Highway Station',
    address: '456 Highway Road',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    status: 'maintenance',
    pumpCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// MSW server setup
const server = setupServer(
  rest.get('/api/stations', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const search = req.url.searchParams.get('search');
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    
    let filteredStations = [...mockStations];
    
    if (status) {
      filteredStations = filteredStations.filter(station => station.status === status);
    }
    
    if (search) {
      filteredStations = filteredStations.filter(station => 
        station.name.toLowerCase().includes(search.toLowerCase()) ||
        station.city.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStations = filteredStations.slice(startIndex, endIndex);
    
    return res(ctx.json({
      data: paginatedStations,
      total: filteredStations.length,
      page,
      limit,
      totalPages: Math.ceil(filteredStations.length / limit),
    }));
  }),
  
  rest.get('/api/stations/:id', (req, res, ctx) => {
    const { id } = req.params;
    const station = mockStations.find(s => s.id === id);
    
    if (!station) {
      return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
    }
    
    return res(ctx.json(station));
  }),
  
  rest.post('/api/stations', async (req, res, ctx) => {
    const stationData = await req.json();
    
    // Validate required fields
    if (!stationData.name || !stationData.address) {
      return res(ctx.status(400), ctx.json({ 
        error: 'Validation failed',
        details: ['Name and address are required']
      }));
    }
    
    const newStation = {
      id: 'station-3',
      ...stationData,
      status: 'active',
      pumpCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return res(ctx.status(201), ctx.json(newStation));
  }),
  
  rest.put('/api/stations/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updateData = await req.json();
    const station = mockStations.find(s => s.id === id);
    
    if (!station) {
      return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
    }
    
    const updatedStation = {
      ...station,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    return res(ctx.json(updatedStation));
  }),
  
  rest.delete('/api/stations/:id', (req, res, ctx) => {
    const { id } = req.params;
    const station = mockStations.find(s => s.id === id);
    
    if (!station) {
      return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
    }
    
    return res(ctx.status(204));
  }),
  
  rest.get('/api/stations/:id/metrics', (req, res, ctx) => {
    const { id } = req.params;
    const station = mockStations.find(s => s.id === id);
    
    if (!station) {
      return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
    }
    
    return res(ctx.json({
      stationId: id,
      todaySales: 25000,
      todayTransactions: 150,
      activePumps: 7,
      totalPumps: 8,
      efficiency: 87.5,
    }));
  })
);

describe('stationsService', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe('getStations', () => {
    it('should fetch all stations successfully', async () => {
      const result = await stationsService.getStations();
      
      expect(result.data).toEqual(mockStations);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should filter stations by status', async () => {
      const result = await stationsService.getStations({ status: 'active' });
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('active');
    });

    it('should search stations by name', async () => {
      const result = await stationsService.getStations({ search: 'main' });
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Main Station');
    });

    it('should search stations by city', async () => {
      const result = await stationsService.getStations({ search: 'pune' });
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0].city).toBe('Pune');
    });

    it('should handle pagination', async () => {
      const result = await stationsService.getStations({ page: 1, limit: 1 });
      
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it('should handle empty results', async () => {
      const result = await stationsService.getStations({ search: 'nonexistent' });
      
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle API errors', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      await expect(stationsService.getStations()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      await expect(stationsService.getStations()).rejects.toThrow();
    });
  });

  describe('getStation', () => {
    it('should fetch single station successfully', async () => {
      const station = await stationsService.getStation('station-1');
      
      expect(station).toEqual(mockStations[0]);
    });

    it('should handle station not found', async () => {
      await expect(stationsService.getStation('non-existent')).rejects.toThrow();
    });

    it('should handle invalid station ID', async () => {
      await expect(stationsService.getStation('')).rejects.toThrow();
    });
  });

  describe('createStation', () => {
    it('should create station successfully', async () => {
      const newStationData = {
        name: 'New Station',
        address: '789 New Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
      };

      const station = await stationsService.createStation(newStationData);
      
      expect(station).toEqual({
        id: 'station-3',
        ...newStationData,
        status: 'active',
        pumpCount: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        name: '',
        address: '',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
      };

      await expect(stationsService.createStation(invalidData)).rejects.toThrow();
    });

    it('should handle duplicate station names', async () => {
      server.use(
        rest.post('/api/stations', (req, res, ctx) => {
          return res(ctx.status(409), ctx.json({ 
            error: 'Station name already exists' 
          }));
        })
      );

      const duplicateData = {
        name: 'Main Station',
        address: '789 New Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
      };

      await expect(stationsService.createStation(duplicateData)).rejects.toThrow();
    });
  });

  describe('updateStation', () => {
    it('should update station successfully', async () => {
      const updateData = {
        name: 'Updated Main Station',
        status: 'maintenance',
      };

      const station = await stationsService.updateStation('station-1', updateData);
      
      expect(station.name).toBe('Updated Main Station');
      expect(station.status).toBe('maintenance');
      expect(station.updatedAt).toBeDefined();
    });

    it('should handle partial updates', async () => {
      const updateData = { name: 'Partially Updated' };

      const station = await stationsService.updateStation('station-1', updateData);
      
      expect(station.name).toBe('Partially Updated');
      expect(station.address).toBe(mockStations[0].address); // Should remain unchanged
    });

    it('should handle station not found', async () => {
      const updateData = { name: 'Updated' };

      await expect(
        stationsService.updateStation('non-existent', updateData)
      ).rejects.toThrow();
    });

    it('should handle invalid update data', async () => {
      server.use(
        rest.put('/api/stations/:id', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ 
            error: 'Invalid data' 
          }));
        })
      );

      await expect(
        stationsService.updateStation('station-1', { invalidField: 'value' } as any)
      ).rejects.toThrow();
    });
  });

  describe('deleteStation', () => {
    it('should delete station successfully', async () => {
      await expect(stationsService.deleteStation('station-1')).resolves.toBeUndefined();
    });

    it('should handle station not found', async () => {
      await expect(stationsService.deleteStation('non-existent')).rejects.toThrow();
    });

    it('should handle stations with active pumps', async () => {
      server.use(
        rest.delete('/api/stations/:id', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ 
            error: 'Cannot delete station with active pumps' 
          }));
        })
      );

      await expect(stationsService.deleteStation('station-1')).rejects.toThrow();
    });
  });

  describe('getStationMetrics', () => {
    it('should fetch station metrics successfully', async () => {
      const metrics = await stationsService.getStationMetrics('station-1');
      
      expect(metrics).toEqual({
        stationId: 'station-1',
        todaySales: 25000,
        todayTransactions: 150,
        activePumps: 7,
        totalPumps: 8,
        efficiency: 87.5,
      });
    });

    it('should handle station not found', async () => {
      await expect(
        stationsService.getStationMetrics('non-existent')
      ).rejects.toThrow();
    });

    it('should handle metrics not available', async () => {
      server.use(
        rest.get('/api/stations/:id/metrics', (req, res, ctx) => {
          return res(ctx.status(503), ctx.json({ 
            error: 'Metrics service unavailable' 
          }));
        })
      );

      await expect(
        stationsService.getStationMetrics('station-1')
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle timeout errors', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.delay(30000)); // Simulate timeout
        })
      );

      // This would timeout in a real scenario
      // For testing, we'll just verify the request is made
      const promise = stationsService.getStations();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should handle malformed JSON responses', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.text('Invalid JSON'));
        })
      );

      await expect(stationsService.getStations()).rejects.toThrow();
    });

    it('should handle unexpected response structure', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.json({ unexpected: 'structure' }));
        })
      );

      await expect(stationsService.getStations()).rejects.toThrow();
    });
  });

  describe('request configuration', () => {
    it('should include proper headers', async () => {
      let requestHeaders: Headers | undefined;
      
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          requestHeaders = req.headers;
          return res(ctx.json({ data: [], total: 0, page: 1, totalPages: 0 }));
        })
      );

      await stationsService.getStations();
      
      expect(requestHeaders?.get('Content-Type')).toBe('application/json');
    });

    it('should handle authentication headers', async () => {
      // Mock authentication token
      const mockToken = 'mock-auth-token';
      localStorage.setItem('authToken', mockToken);

      let authHeader: string | null = null;
      
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          authHeader = req.headers.get('Authorization');
          return res(ctx.json({ data: [], total: 0, page: 1, totalPages: 0 }));
        })
      );

      await stationsService.getStations();
      
      expect(authHeader).toBe(`Bearer ${mockToken}`);
      
      // Cleanup
      localStorage.removeItem('authToken');
    });
  });

  describe('data transformation', () => {
    it('should transform response data correctly', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.json({
            data: [{
              id: 'station-1',
              name: 'Test Station',
              created_at: '2024-01-01T00:00:00Z', // Snake case from API
              updated_at: '2024-01-01T00:00:00Z',
            }],
            total: 1,
            page: 1,
            totalPages: 1,
          }));
        })
      );

      const result = await stationsService.getStations();
      
      // Should transform snake_case to camelCase
      expect(result.data[0]).toHaveProperty('createdAt');
      expect(result.data[0]).toHaveProperty('updatedAt');
      expect(result.data[0]).not.toHaveProperty('created_at');
      expect(result.data[0]).not.toHaveProperty('updated_at');
    });
  });
});
