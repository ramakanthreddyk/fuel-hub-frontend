# FuelSync API Implementation Guide

## Quick Fix Checklist

### 1. Immediate Base URL Fix

**Option A: Update Frontend (Recommended)**
```typescript
// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1'; // Remove /api
```

**Option B: Update Backend**
```typescript
// src/app.ts - Add /api prefix to all routes
app.use('/api/v1/auth', createAuthRouter(pool));
app.use('/api/v1/stations', createStationRouter(pool));
// ... etc for all routes
```

### 2. Missing Dashboard Controller Implementation

Create `src/controllers/dashboard.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { Pool } from 'pg';
import { errorResponse } from '../utils/errorResponse';

export function createDashboardHandlers(db: Pool) {
  return {
    getSalesSummary: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const range = req.query.range || 'monthly';
        
        let dateFilter = '';
        switch (range) {
          case 'daily':
            dateFilter = "AND s.recorded_at >= CURRENT_DATE";
            break;
          case 'weekly':
            dateFilter = "AND s.recorded_at >= CURRENT_DATE - INTERVAL '7 days'";
            break;
          case 'monthly':
            dateFilter = "AND s.recorded_at >= CURRENT_DATE - INTERVAL '30 days'";
            break;
          case 'yearly':
            dateFilter = "AND s.recorded_at >= CURRENT_DATE - INTERVAL '1 year'";
            break;
        }

        const query = `
          SELECT 
            COALESCE(SUM(s.amount), 0) as total_sales,
            COALESCE(SUM(s.volume), 0) as total_volume,
            COUNT(s.id) as transaction_count
          FROM ${tenantId}.sales s
          WHERE 1=1 ${dateFilter}
        `;

        const result = await db.query(query);
        const row = result.rows[0];

        res.json({
          totalSales: parseFloat(row.total_sales),
          totalVolume: parseFloat(row.total_volume),
          transactionCount: parseInt(row.transaction_count),
          period: range
        });
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getPaymentMethodBreakdown: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        
        const query = `
          SELECT 
            s.payment_method,
            SUM(s.amount) as amount,
            COUNT(*) as count
          FROM ${tenantId}.sales s
          WHERE s.recorded_at >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY s.payment_method
          ORDER BY amount DESC
        `;

        const result = await db.query(query);
        const totalAmount = result.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

        const breakdown = result.rows.map(row => ({
          paymentMethod: row.payment_method,
          amount: parseFloat(row.amount),
          percentage: totalAmount > 0 ? (parseFloat(row.amount) / totalAmount) * 100 : 0
        }));

        res.json(breakdown);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getFuelTypeBreakdown: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        
        const query = `
          SELECT 
            s.fuel_type,
            SUM(s.volume) as volume,
            SUM(s.amount) as amount
          FROM ${tenantId}.sales s
          WHERE s.recorded_at >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY s.fuel_type
          ORDER BY amount DESC
        `;

        const result = await db.query(query);
        
        const breakdown = result.rows.map(row => ({
          fuelType: row.fuel_type,
          volume: parseFloat(row.volume),
          amount: parseFloat(row.amount)
        }));

        res.json(breakdown);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getTopCreditors: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const limit = parseInt(req.query.limit as string) || 5;
        
        const query = `
          SELECT 
            c.id,
            c.party_name,
            COALESCE(SUM(s.amount) - COALESCE(SUM(cp.amount), 0), 0) as outstanding_amount,
            c.credit_limit
          FROM ${tenantId}.creditors c
          LEFT JOIN ${tenantId}.sales s ON c.id = s.creditor_id AND s.payment_method = 'credit'
          LEFT JOIN ${tenantId}.credit_payments cp ON c.id = cp.creditor_id
          WHERE c.status = 'active'
          GROUP BY c.id, c.party_name, c.credit_limit
          HAVING COALESCE(SUM(s.amount) - COALESCE(SUM(cp.amount), 0), 0) > 0
          ORDER BY outstanding_amount DESC
          LIMIT $1
        `;

        const result = await db.query(query, [limit]);
        
        const topCreditors = result.rows.map(row => ({
          id: row.id,
          partyName: row.party_name,
          outstandingAmount: parseFloat(row.outstanding_amount),
          creditLimit: row.credit_limit ? parseFloat(row.credit_limit) : null
        }));

        res.json(topCreditors);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getDailySalesTrend: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const days = parseInt(req.query.days as string) || 7;
        
        const query = `
          SELECT 
            DATE(s.recorded_at) as date,
            SUM(s.amount) as amount,
            SUM(s.volume) as volume
          FROM ${tenantId}.sales s
          WHERE s.recorded_at >= CURRENT_DATE - INTERVAL '${days} days'
          GROUP BY DATE(s.recorded_at)
          ORDER BY date ASC
        `;

        const result = await db.query(query);
        
        const trend = result.rows.map(row => ({
          date: row.date,
          amount: parseFloat(row.amount),
          volume: parseFloat(row.volume)
        }));

        res.json(trend);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    }
  };
}
```

### 3. Dashboard Routes

Create `src/routes/dashboard.route.ts`:

```typescript
import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createDashboardHandlers } from '../controllers/dashboard.controller';

export function createDashboardRouter(db: Pool) {
  const router = Router();
  const handlers = createDashboardHandlers(db);

  router.get('/sales-summary', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getSalesSummary);
  router.get('/payment-methods', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getPaymentMethodBreakdown);
  router.get('/fuel-breakdown', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getFuelTypeBreakdown);
  router.get('/top-creditors', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getTopCreditors);
  router.get('/sales-trend', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getDailySalesTrend);

  return router;
}
```

### 4. Update Main App

Add to `src/app.ts`:

```typescript
import { createDashboardRouter } from './routes/dashboard.route';

// Add this line with other route imports
app.use('/v1/dashboard', createDashboardRouter(pool));
```

### 5. Fix Reconciliation Daily Summary

Update `src/controllers/reconciliation.controller.ts`:

```typescript
// Add this method to the existing controller
getDailySummary: async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { stationId, date } = req.query;
    
    if (!stationId || !date) {
      return errorResponse(res, 400, 'stationId and date are required');
    }

    const query = `
      WITH ordered_readings AS (
        SELECT
          nr.nozzle_id,
          n.nozzle_number,
          n.fuel_type,
          nr.reading as current_reading,
          LAG(nr.reading) OVER (PARTITION BY nr.nozzle_id ORDER BY nr.recorded_at) as previous_reading,
          nr.payment_method,
          nr.recorded_at,
          fp.price as price_per_litre
        FROM ${tenantId}.nozzle_readings nr
        JOIN ${tenantId}.nozzles n ON nr.nozzle_id = n.id
        JOIN ${tenantId}.pumps p ON n.pump_id = p.id
        LEFT JOIN ${tenantId}.fuel_prices fp ON p.station_id = fp.station_id AND n.fuel_type = fp.fuel_type
        WHERE p.station_id = $1
        ORDER BY nr.nozzle_id, nr.recorded_at
      )
      SELECT
        nozzle_id,
        nozzle_number,
        fuel_type,
        COALESCE(previous_reading, 0) as previous_reading,
        current_reading,
        GREATEST(current_reading - COALESCE(previous_reading, 0), 0) as delta_volume,
        COALESCE(price_per_litre, 0) as price_per_litre,
        GREATEST(current_reading - COALESCE(previous_reading, 0), 0) * COALESCE(price_per_litre, 0) as sale_value,
        payment_method,
        CASE WHEN payment_method = 'cash' THEN GREATEST(current_reading - COALESCE(previous_reading, 0), 0) * COALESCE(price_per_litre, 0) ELSE 0 END as cash_declared
      FROM ordered_readings
      WHERE DATE(recorded_at) = $2
        AND previous_reading IS NOT NULL
    `;

    const result = await db.query(query, [stationId, date]);
    
    const summary = result.rows.map(row => ({
      nozzleId: row.nozzle_id,
      nozzleNumber: parseInt(row.nozzle_number),
      previousReading: parseFloat(row.previous_reading),
      currentReading: parseFloat(row.current_reading),
      deltaVolume: parseFloat(row.delta_volume),
      pricePerLitre: parseFloat(row.price_per_litre),
      saleValue: parseFloat(row.sale_value),
      paymentMethod: row.payment_method,
      cashDeclared: parseFloat(row.cash_declared),
      fuelType: row.fuel_type
    }));

    res.json(summary);
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
}
```

Update `src/routes/reconciliation.route.ts`:

```typescript
// Add this route
router.get('/daily-summary', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getDailySummary);
```

### 6. Fix Credit Payments URL Structure

**Option A: Update Backend to Match Frontend**

Update `src/routes/creditor.route.ts`:
```typescript
// Remove these lines:
// router.post('/payments', ...)
// router.get('/payments', ...)
```

Create new `src/routes/creditPayment.route.ts`:
```typescript
import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createCreditorHandlers } from '../controllers/creditor.controller';

export function createCreditPaymentRouter(db: Pool) {
  const router = Router();
  const handlers = createCreditorHandlers(db);

  router.post('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.createPayment);
  router.get('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.listPayments);

  return router;
}
```

Add to `src/app.ts`:
```typescript
import { createCreditPaymentRouter } from './routes/creditPayment.route';
app.use('/v1/credit-payments', createCreditPaymentRouter(pool));
```

### 7. Add Missing Auth Endpoints

Update `src/controllers/auth.controller.ts`:

```typescript
// Add these methods to the existing controller
logout: async (req: Request, res: Response) => {
  try {
    // In a production app, you'd want to blacklist the token
    // For now, just return success
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
},

refreshToken: async (req: Request, res: Response) => {
  try {
    // Extract user info from current token (already validated by middleware)
    const user = req.user;
    if (!user) {
      return errorResponse(res, 401, 'Invalid token');
    }

    // Generate new token with same user info
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        tenantId: user.tenantId 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenantName
      }
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
}
```

Update `src/routes/auth.route.ts`:
```typescript
router.post('/logout', authenticateJWT, controller.logout);
router.post('/refresh', authenticateJWT, controller.refreshToken);
```

## Testing Your Implementation

### 1. Test Dashboard Endpoints

```bash
# Test sales summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "x-tenant-id: demo_tenant_001" \
     http://localhost:3001/v1/dashboard/sales-summary?range=monthly

# Test payment methods
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "x-tenant-id: demo_tenant_001" \
     http://localhost:3001/v1/dashboard/payment-methods
```

### 2. Test Reconciliation Daily Summary

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "x-tenant-id: demo_tenant_001" \
     "http://localhost:3001/v1/reconciliation/daily-summary?stationId=STATION_ID&date=2024-01-15"
```

### 3. Test Auth Endpoints

```bash
# Test logout
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/v1/auth/logout

# Test refresh
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/v1/auth/refresh
```

## Database Schema Requirements

Make sure your tenant schemas have these tables:

```sql
-- Sales table (should already exist)
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY,
  nozzle_id UUID NOT NULL,
  station_id UUID NOT NULL,
  volume DECIMAL(10,3) NOT NULL,
  fuel_type VARCHAR(20) NOT NULL,
  fuel_price DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  creditor_id UUID,
  status VARCHAR(20) DEFAULT 'posted',
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Credit payments table (should already exist)
CREATE TABLE IF NOT EXISTS credit_payments (
  id UUID PRIMARY KEY,
  creditor_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  reference_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Nozzle readings table (should already exist)
CREATE TABLE IF NOT EXISTS nozzle_readings (
  id UUID PRIMARY KEY,
  nozzle_id UUID NOT NULL,
  reading DECIMAL(10,3) NOT NULL,
  recorded_at TIMESTAMP NOT NULL,
  payment_method VARCHAR(20),
  creditor_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Frontend Testing

After implementing backend changes, test frontend functionality:

1. **Dashboard**: Check if charts and summaries load
2. **Reconciliation**: Verify daily summary displays
3. **Credit Payments**: Test payment creation and listing
4. **Auth**: Test logout and token refresh

## Deployment Checklist

- [ ] Update environment variables if needed
- [ ] Run database migrations
- [ ] Test all endpoints with Postman/curl
- [ ] Verify frontend integration
- [ ] Update API documentation
- [ ] Monitor logs for errors

This implementation guide provides the essential code needed to align your frontend and backend APIs. Focus on the dashboard endpoints first as they seem to be the most critical missing pieces.