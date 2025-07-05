import { Request, Response } from 'express';
import { Pool } from 'pg';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';
import { normalizeStationId } from '../utils/normalizeStationId';
import { getSystemHealth } from '../services/analytics.service';
import { getDashboardStationMetrics } from '../services/station.service';

export function createDashboardHandlers(db: Pool) {
  return {
    getSalesSummary: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const range = (req.query.range as string) || 'monthly';

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

        const stationFilter = stationId ? `AND p.station_id = $1` : '';
        const query = `
          SELECT
            COALESCE(SUM(s.amount), 0) as total_sales,
            COALESCE(SUM(s.profit), 0) as total_profit,
            COALESCE(SUM(s.volume), 0) as total_volume,
            COUNT(s.id) as transaction_count,
            CASE WHEN SUM(s.amount) > 0 THEN (SUM(s.profit) / SUM(s.amount)) * 100 ELSE 0 END as profit_margin
          FROM public.sales s
          JOIN public.nozzles n ON s.nozzle_id = n.id
          JOIN public.pumps p ON n.pump_id = p.id
          WHERE s.tenant_id = $${stationId ? 2 : 1} ${dateFilter} ${stationFilter}
        `;
        const params = stationId ? [stationId, tenantId] : [tenantId];
        const result = await db.query(query, params);
        const row = result.rows[0];

        successResponse(res, {
          totalRevenue: parseFloat(row.total_sales),
          totalProfit: parseFloat(row.total_profit),
          profitMargin: parseFloat(row.profit_margin),
          totalVolume: parseFloat(row.total_volume),
          salesCount: parseInt(row.transaction_count, 10),
          period: range
        });
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getPaymentMethodBreakdown: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const dateFrom = req.query.dateFrom as string | undefined;
        const dateTo = req.query.dateTo as string | undefined;

        const conds: string[] = [];
        const params: any[] = [];
        let idx = 1;
        if (stationId) {
          conds.push(`p.station_id = $${idx++}`);
          params.push(stationId);
        }
        if (dateFrom) {
          conds.push(`s.recorded_at >= $${idx++}`);
          params.push(dateFrom);
        }
        if (dateTo) {
          conds.push(`s.recorded_at <= $${idx++}`);
          params.push(dateTo);
        }
        const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';

        const query = `
          SELECT
            s.payment_method,
            SUM(s.amount) as amount,
            COUNT(*) as count
          FROM public.sales s
          JOIN public.nozzles n ON s.nozzle_id = n.id
          JOIN public.pumps p ON n.pump_id = p.id
          ${where}
          AND s.tenant_id = $${idx++}
          GROUP BY s.payment_method
          ORDER BY amount DESC
        `;

        params.push(tenantId);
        const result = await db.query(query, params);
        if (result.rows.length === 0) {
          return successResponse(res, []);
        }
        const totalAmount = result.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

        const breakdown = result.rows.map(row => ({
          paymentMethod: row.payment_method,
          amount: parseFloat(row.amount),
          percentage: totalAmount > 0 ? (parseFloat(row.amount) / totalAmount) * 100 : 0
        }));

        successResponse(res, breakdown);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getFuelTypeBreakdown: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const period = (req.query.period as string) || 'monthly';

        let dateFilter = '';
        switch (period) {
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

        const stationFilter = stationId ? `AND p.station_id = $1` : '';
        const query = `
          SELECT
            s.fuel_type,
            SUM(s.volume) as volume,
            SUM(s.amount) as amount
          FROM public.sales s
          JOIN public.nozzles n ON s.nozzle_id = n.id
          JOIN public.pumps p ON n.pump_id = p.id
          WHERE s.tenant_id = $${stationId ? 2 : 1} ${dateFilter} ${stationFilter}
          GROUP BY s.fuel_type
          ORDER BY amount DESC
        `;

        const params2 = stationId ? [stationId, tenantId] : [tenantId];
        const result = await db.query(query, params2);
        if (result.rows.length === 0) {
          return successResponse(res, []);
        }

        const breakdown = result.rows.map(row => ({
          fuelType: row.fuel_type,
          volume: parseFloat(row.volume),
          amount: parseFloat(row.amount)
        }));

        successResponse(res, breakdown);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getTopCreditors: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const limit = parseInt(req.query.limit as string) || 5;

        const query = `
          SELECT
            c.id,
            c.party_name,
            COALESCE(SUM(s.amount) - COALESCE(SUM(cp.amount), 0), 0) as outstanding_amount,
            c.credit_limit
          FROM public.creditors c
          LEFT JOIN public.sales s ON c.id = s.creditor_id AND s.payment_method = 'credit' AND s.tenant_id = $${stationId ? 3 : 2}
          LEFT JOIN public.nozzles n ON s.nozzle_id = n.id
          LEFT JOIN public.pumps p ON n.pump_id = p.id
          LEFT JOIN public.credit_payments cp ON c.id = cp.creditor_id AND cp.tenant_id = $${stationId ? 3 : 2}
          WHERE c.tenant_id = $1 AND c.status = 'active' ${stationId ? 'AND p.station_id = $2' : ''}
          GROUP BY c.id, c.party_name, c.credit_limit
          HAVING COALESCE(SUM(s.amount) - COALESCE(SUM(cp.amount), 0), 0) > 0
          ORDER BY outstanding_amount DESC
          LIMIT $${stationId ? 4 : 3}
        `;

        const params = stationId ? [tenantId, stationId, tenantId, limit] : [tenantId, tenantId, limit];
        const result = await db.query(query, params);
        if (result.rows.length === 0) {
          return successResponse(res, []);
        }

        const topCreditors = result.rows.map(row => ({
          id: row.id,
          partyName: row.party_name,
          outstandingAmount: parseFloat(row.outstanding_amount),
          creditLimit: row.credit_limit ? parseFloat(row.credit_limit) : null
        }));

        successResponse(res, topCreditors);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getDailySalesTrend: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const days = parseInt(req.query.days as string) || 7;

        const query = `
          SELECT
            DATE(s.recorded_at) as date,
            SUM(s.amount) as amount,
            SUM(s.volume) as volume
          FROM public.sales s
          JOIN public.nozzles n ON s.nozzle_id = n.id
          JOIN public.pumps p ON n.pump_id = p.id
          WHERE s.recorded_at >= CURRENT_DATE - INTERVAL '${days} days' ${stationId ? 'AND p.station_id = $1' : ''} AND s.tenant_id = $${stationId ? 2 : 1}
          GROUP BY DATE(s.recorded_at)
          ORDER BY date ASC
        `;

        const params3 = stationId ? [stationId, tenantId] : [tenantId];
        const result = await db.query(query, params3);
        if (result.rows.length === 0) {
          return successResponse(res, []);
        }

        const trend = result.rows.map(row => ({
          date: row.date,
          amount: parseFloat(row.amount),
          volume: parseFloat(row.volume)
        }));

        successResponse(res, trend);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getStationMetrics: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');
        const data = await getDashboardStationMetrics(db, tenantId);
        successResponse(res, data);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getSystemHealth: async (_req: Request, res: Response) => {
        try {
        const data = await getSystemHealth();
        successResponse(res, data);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    }
  };
}
