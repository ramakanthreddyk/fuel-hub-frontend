import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';
import os from 'os';

/** Hourly sales metrics for a station */
export async function getHourlySales(
  tenantId: string,
  stationId: string,
  dateFrom: Date,
  dateTo: Date
) {
  const query = Prisma.sql`
    SELECT date_trunc('hour', recorded_at) AS hour,
           SUM(volume) AS "salesVolume",
           SUM(amount) AS "salesAmount"
    FROM "sales"
    WHERE tenant_id = ${tenantId}
      AND station_id = ${stationId}
      AND recorded_at >= ${dateFrom}
      AND recorded_at <= ${dateTo}
    GROUP BY 1
    ORDER BY 1`;
  
  return prisma.$queryRaw<{ hour: Date; salesVolume: number; salesAmount: number }[]>(query);
}

/** Peak sales hour for a station */
export async function getPeakHours(tenantId: string, stationId: string) {
  const query = Prisma.sql`
    SELECT to_char(date_trunc('hour', recorded_at), 'HH24:MI') AS hour,
           SUM(volume) AS "salesVolume"
    FROM "sales"
    WHERE tenant_id = ${tenantId}
      AND station_id = ${stationId}
    GROUP BY 1
    ORDER BY "salesVolume" DESC
    LIMIT 1`;
  
  return prisma.$queryRaw<{ hour: string; salesVolume: number }[]>(query);
}

/** Fuel performance for a station over a date range */
export async function getFuelPerformance(
  tenantId: string,
  stationId: string,
  dateFrom: Date,
  dateTo: Date
) {
  const query = Prisma.sql`
    SELECT fuel_type AS "fuelType",
           SUM(volume) AS "totalSalesVolume",
           SUM(amount) AS "totalSalesAmount"
    FROM "sales"
    WHERE tenant_id = ${tenantId}
      AND station_id = ${stationId}
      AND recorded_at >= ${dateFrom}
      AND recorded_at <= ${dateTo}
    GROUP BY fuel_type
    ORDER BY fuel_type`;
  
  return prisma.$queryRaw<{
    fuelType: string;
    totalSalesVolume: number;
    totalSalesAmount: number;
  }[]>(query);
}

export async function getSystemHealth() {
  const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // MB
  return {
    uptime: process.uptime(),
    cpuUsage: os.loadavg()[0],
    memoryUsage,
    dbHealthy: true,
  };
}

export async function getTenantDashboardMetrics(tenantId: string) {
  const aggregates = await prisma.sale.aggregate({
    where: { tenant_id: tenantId },
    _sum: { amount: true, volume: true },
    _count: { _all: true },
  });
  const fuelBreakdown = await prisma.sale.groupBy({
    by: ['fuel_type'],
    where: { tenant_id: tenantId },
    _sum: { volume: true },
  });
  return {
    totalSales: Number(aggregates._sum.amount || 0),
    totalVolume: Number(aggregates._sum.volume || 0),
    transactionCount: aggregates._count._all,
    fuelBreakdown: fuelBreakdown.map((r: typeof fuelBreakdown[number]) => ({
      fuelType: r.fuel_type,
      volume: Number(r._sum.volume || 0),
    })),
  };
}
