import { Request, Response } from 'express';
import { Pool } from 'pg';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';
import { normalizeStationId } from '../utils/normalizeStationId';

export function createReportsHandlers(db: Pool) {
  async function runExportSales(req: Request, res: Response) {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');
        
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const dateFrom = req.query.dateFrom as string | undefined;
        const dateTo = req.query.dateTo as string | undefined;
        const format = req.query.format as string || 'json';
        
        const conditions = [];
        const params = [];
        let paramIndex = 1;
        
        if (stationId) {
          conditions.push(`s.station_id = $${paramIndex++}`);
          params.push(stationId);
        }
        if (dateFrom) {
          conditions.push(`s.recorded_at >= $${paramIndex++}`);
          params.push(dateFrom);
        }
        if (dateTo) {
          conditions.push(`s.recorded_at <= $${paramIndex++}`);
          params.push(dateTo);
        }
        
        conditions.push(`s.tenant_id = $${paramIndex++}`);
        params.push(tenantId);
        const whereClause = `WHERE ${conditions.join(' AND ')}`;
        
        const query = `
          SELECT 
            s.id,
            st.name as station_name,
            s.fuel_type,
            s.volume,
            s.fuel_price,
            s.cost_price,
            s.amount,
            s.profit,
            s.payment_method,
            c.party_name as creditor_name,
            s.recorded_at
          FROM public.sales s
          JOIN public.stations st ON s.station_id = st.id
          LEFT JOIN public.creditors c ON s.creditor_id = c.id
          ${whereClause}
          ORDER BY s.recorded_at DESC
        `;
        
        const result = await db.query(query, params);
        
        if (format === 'csv') {
          const csv = convertToCSV(result.rows);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
          res.send(csv);
        } else {
          successResponse(res, {
            data: result.rows,
            summary: {
              totalRecords: result.rows.length,
              totalSales: result.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0),
              totalProfit: result.rows.reduce((sum, row) => sum + parseFloat(row.profit), 0)
            }
          });
        }
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
    }
  }

  async function runExportFinancial(req: Request, res: Response) {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');

        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const period = req.query.period as string || 'monthly';

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

        const stationFilter = stationId ? 'AND s.station_id = $1' : '';
        const params = stationId ? [stationId] : [];

        const query = `
          SELECT
            st.name as station_name,
            s.fuel_type,
            SUM(s.volume) as total_volume,
            SUM(s.amount) as total_revenue,
            SUM(s.profit) as total_profit,
            AVG(s.fuel_price) as avg_price,
            COUNT(*) as transaction_count,
            CASE WHEN SUM(s.amount) > 0 THEN (SUM(s.profit) / SUM(s.amount)) * 100 ELSE 0 END as profit_margin
          FROM public.sales s
          JOIN public.stations st ON s.station_id = st.id
          WHERE s.tenant_id = $${stationId ? 2 : 1} ${dateFilter} ${stationFilter}
          GROUP BY st.name, s.fuel_type
          ORDER BY st.name, total_revenue DESC
        `;

        params.push(tenantId);
        const result = await db.query(query, params);

        successResponse(res, {
          period,
          data: result.rows.map(row => ({
            stationName: row.station_name,
            fuelType: row.fuel_type,
            totalVolume: parseFloat(row.total_volume),
            totalRevenue: parseFloat(row.total_revenue),
            totalProfit: parseFloat(row.total_profit),
            avgPrice: parseFloat(row.avg_price),
            transactionCount: parseInt(row.transaction_count),
            profitMargin: parseFloat(row.profit_margin)
          }))
        });
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
  }

  return {
    exportSales: runExportSales,
    exportSalesPost: async (req: Request, res: Response) => {
      req.query = { ...req.body } as any;
      await runExportSales(req, res);
    },

    getSales: async (req: Request, res: Response) => {
      await runExportSales(req, res);
    },

    exportGeneric: async (req: Request, res: Response) => {
      try {
        const { type, format, stationId, dateRange } = req.body || {};
        if (!type) return errorResponse(res, 400, 'type required');

        if (type === 'sales') {
          req.query = {
            stationId,
            dateFrom: dateRange?.from,
            dateTo: dateRange?.to,
            format,
          } as any;
          await runExportSales(req, res);
        } else if (type === 'financial') {
          req.query = { stationId, period: 'monthly' } as any;
          await runExportFinancial(req, res);
        } else {
          return errorResponse(res, 400, 'Unsupported report type');
        }
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    scheduleReport: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');
        const { type, stationId, frequency } = req.body || {};
        if (!type || !frequency) {
          return errorResponse(res, 400, 'type and frequency required');
        }
        const result = await db.query(
          `INSERT INTO public.report_schedules (tenant_id, station_id, type, frequency) VALUES ($1,$2,$3,$4) RETURNING id`,
          [tenantId, stationId || null, type, frequency]
        );
        successResponse(res, { id: result.rows[0].id }, undefined, 201);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    exportFinancial: runExportFinancial
  };
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}