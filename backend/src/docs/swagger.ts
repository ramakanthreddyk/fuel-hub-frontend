const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'FuelSync Hub API',
    version: '1.0.0',
    description: 'Multi-tenant ERP system for fuel station management'
  },
  servers: [
    { url: '/api', description: 'Development server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      },
      Station: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          tenantId: { type: 'string', format: 'uuid' }
        }
      },
      NozzleReading: {
        type: 'object',
        required: ['nozzleId', 'reading', 'recordedAt'],
        properties: {
          nozzleId: { type: 'string', format: 'uuid' },
          reading: { type: 'number', minimum: 0 },
          recordedAt: { type: 'string', format: 'date-time' },
          creditorId: { type: 'string', format: 'uuid', nullable: true },
          paymentMethod: { type: 'string', enum: ['cash', 'card', 'upi', 'credit'] }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/v1/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Login successful', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' } } } } } },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/v1/users': {
      get: {
        tags: ['User Management'],
        summary: 'List tenant users',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of users' }
        }
      },
      post: {
        tags: ['User Management'],
        summary: 'Create tenant user',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  role: { type: 'string', enum: ['owner', 'manager', 'attendant'] }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User created' }
        }
      }
    },
    '/v1/admin/users': {
      get: {
        tags: ['Admin Management'],
        summary: 'List super admin users',
        responses: {
          200: { description: 'List of admin users' }
        }
      },
      post: {
        tags: ['Admin Management'],
        summary: 'Create super admin user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  role: { type: 'string', enum: ['superadmin'] }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Admin user created' }
        }
      }
    },
    '/v1/pumps': {
      get: {
        tags: ['Station Hierarchy'],
        summary: 'List pumps',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'stationId', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of pumps' }
        }
      },
      post: {
        tags: ['Station Hierarchy'],
        summary: 'Create pump under station',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['stationId', 'name'],
                properties: {
                  stationId: { type: 'string', format: 'uuid' },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Pump created' }
        }
      }
    },
    '/v1/nozzles': {
      get: {
        tags: ['Station Hierarchy'],
        summary: 'List nozzles',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'pumpId', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of nozzles' }
        }
      },
      post: {
        tags: ['Station Hierarchy'],
        summary: 'Create nozzle under pump',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['pumpId', 'nozzleNumber', 'fuelType'],
                properties: {
                  pumpId: { type: 'string', format: 'uuid' },
                  nozzleNumber: { type: 'integer' },
                  fuelType: { type: 'string', enum: ['petrol', 'diesel', 'premium'] }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Nozzle created' }
        }
      }
    },
    '/v1/credit-payments': {
      get: {
        tags: ['Credit Management'],
        summary: 'List credit payments',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'creditorId', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of credit payments' }
        }
      },
      post: {
        tags: ['Credit Management'],
        summary: 'Make credit payment',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['creditorId', 'amount'],
                properties: {
                  creditorId: { type: 'string', format: 'uuid' },
                  amount: { type: 'number', minimum: 0 },
                  paymentMethod: { type: 'string', enum: ['cash', 'bank_transfer', 'check'] },
                  referenceNumber: { type: 'string' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Payment recorded' }
        }
      }
    },
    '/v1/fuel-deliveries': {
      get: {
        tags: ['Fuel Management'],
        summary: 'View delivery history',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'stationId', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of fuel deliveries' }
        }
      },
      post: {
        tags: ['Fuel Management'],
        summary: 'Log fuel received',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['stationId', 'fuelType', 'volume', 'deliveryDate'],
                properties: {
                  stationId: { type: 'string', format: 'uuid' },
                  fuelType: { type: 'string', enum: ['petrol', 'diesel', 'premium'] },
                  volume: { type: 'number', minimum: 0 },
                  deliveryDate: { type: 'string', format: 'date' },
                  supplier: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Delivery recorded' }
        }
      }
    },
    '/v1/fuel-inventory': {
      get: {
        tags: ['Fuel Management'],
        summary: 'View remaining volume by fuel type',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'stationId', in: 'query', schema: { type: 'string' } },
          { name: 'fuelType', in: 'query', schema: { type: 'string', enum: ['petrol', 'diesel', 'premium'] } }
        ],
        responses: {
          200: { 
            description: 'Current fuel inventory levels',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      stationId: { type: 'string', format: 'uuid' },
                      fuelType: { type: 'string' },
                      currentVolume: { type: 'number' },
                      updatedAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/v1/stations': {
      get: {
        tags: ['Stations'],
        summary: 'List stations',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of stations', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Station' } } } } }
        }
      },
      post: {
        tags: ['Stations'],
        summary: 'Create station',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } }
            }
          }
        },
        responses: {
          201: { description: 'Station created' },
          400: { description: 'Invalid input' }
        }
      }
    },
    '/v1/nozzle-readings': {
      post: {
        tags: ['Nozzle Readings'],
        summary: 'Record nozzle reading and auto-generate sale',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NozzleReading' }
            }
          }
        },
        responses: {
          201: { description: 'Reading recorded and sale generated' },
          400: { description: 'Invalid reading data' }
        }
      },
      get: {
        tags: ['Nozzle Readings'],
        summary: 'List nozzle readings',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'stationId', in: 'query', schema: { type: 'string' } },
          { name: 'nozzleId', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of readings' }
        }
      }
    },
    '/v1/nozzle-readings/can-create/{nozzleId}': {
      get: {
        tags: ['Nozzle Readings'],
        summary: 'Check if a nozzle reading can be created',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'nozzleId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Check result' } }
      }
    },
    '/v1/fuel-prices': {
      get: {
        tags: ['Fuel Prices'],
        summary: 'List fuel prices',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of fuel prices' }
        }
      },
      post: {
        tags: ['Fuel Prices'],
        summary: 'Create fuel price entry',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['stationId', 'fuelType', 'price'],
                properties: {
                  stationId: { type: 'string', format: 'uuid' },
                  fuelType: { type: 'string', enum: ['petrol', 'diesel', 'premium'] },
                  price: { type: 'number', minimum: 0 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Price created' }
        }
      }
    },
    '/v1/fuel-prices/{id}': {
      put: {
        tags: ['Fuel Prices'],
        summary: 'Update fuel price entry',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['stationId', 'fuelType', 'price'],
                properties: {
                  stationId: { type: 'string', format: 'uuid' },
                  fuelType: { type: 'string', enum: ['petrol', 'diesel', 'premium'] },
                  price: { type: 'number', minimum: 0 },
                  validFrom: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Price updated' } }
      }
    },
    '/v1/alerts': {
      get: {
        tags: ['Alerts'],
        summary: 'List alerts',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'List of alerts' } }
      }
    },
    '/v1/alerts/{id}/read': {
      patch: {
        tags: ['Alerts'],
        summary: 'Mark alert as read',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Alert marked as read' } }
      }
    },
    '/v1/analytics/station-comparison': {
      get: {
        tags: ['Analytics'],
        summary: 'Compare stations',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'stationIds', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'period', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Comparison data' } }
      }
    },
    '/v1/reports/sales': {
      post: {
        tags: ['Reports'],
        summary: 'Export sales data',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: { required: false },
        responses: { 200: { description: 'Sales export' } }
      }
    },
    '/v1/creditors': {
      get: {
        tags: ['Creditors'],
        summary: 'List creditors',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of creditors' }
        }
      },
      post: {
        tags: ['Creditors'],
        summary: 'Create creditor',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['partyName'],
                properties: {
                  partyName: { type: 'string' },
                  creditLimit: { type: 'number', minimum: 0 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Creditor created' }
        }
      }
    },
    '/v1/reconciliation': {
      post: {
        tags: ['Reconciliation'],
        summary: 'Run daily reconciliation',
        parameters: [
          { name: 'x-tenant-id', in: 'header', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['stationId', 'date'],
                properties: {
                  stationId: { type: 'string', format: 'uuid' },
                  date: { type: 'string', format: 'date' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Reconciliation completed' }
        }
      }
    }
  }
};

export default swaggerSpec;
