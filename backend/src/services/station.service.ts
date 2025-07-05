import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { beforeCreateStation } from '../middlewares/planEnforcement';
import { parseRows, parseRow } from '../utils/parseDb';

export async function createStation(
  _db: Pool,
  tenantId: string,
  name: string,
  address?: string
): Promise<string> {
  return prisma.$transaction(async tx => {
    await beforeCreateStation(tx, tenantId);
    const exists = await tx.station.findFirst({
      where: { tenant_id: tenantId, name },
      select: { id: true },
    });
    if (exists) {
      throw new Error('A station with this name already exists for your account.');
    }
    const station = await tx.station.create({
      data: {
        id: randomUUID(),
        tenant_id: tenantId,
        name,
        address: address ?? null,
      },
      select: { id: true },
    });
    return station.id;
  });
}

export async function getStation(
  _db: Pool,
  tenantId: string,
  stationId: string,
  includeMetrics = false
) {
  const station = await prisma.station.findFirst({
    where: { id: stationId, tenant_id: tenantId },
    include: { _count: { select: { pumps: true } } },
  });
  if (!station) {
    throw new Error(`Station not found: ${stationId}`);
  }
  const result: any = {
    id: station.id,
    name: station.name,
    status: station.status,
    address: station.address,
    manager: null,
    attendantCount: 0,
    pumpCount: station._count.pumps,
    createdAt: station.created_at,
  };
  if (includeMetrics) {
    result.metrics = await getStationMetrics(_db, tenantId, stationId, 'today');
  }
  return result;
}

export async function listStations(
  _db: Pool,
  tenantId: string,
  includeMetrics = false
) {
  const stations = await prisma.station.findMany({
    where: { tenant_id: tenantId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { pumps: true } } },
  });
  const result = stations.map(st => ({
    id: st.id,
    name: st.name,
    status: st.status,
    address: st.address,
    manager: null,
    attendantCount: 0,
    pumpCount: st._count.pumps,
    createdAt: st.created_at,
  })) as any[];
  if (!includeMetrics) return result;
  for (const st of result) {
    st.metrics = await getStationMetrics(_db, tenantId, st.id, 'today');
  }
  return result;
}



export async function updateStation(
  _db: Pool,
  tenantId: string,
  id: string,
  name?: string
) {
  await prisma.station.updateMany({
    where: { id, tenant_id: tenantId },
    data: { name: name ?? undefined },
  });
}

export async function deleteStation(_db: Pool, tenantId: string, id: string) {
  await prisma.station.deleteMany({ where: { id, tenant_id: tenantId } });
}

export async function getStationMetrics(
  _db: Pool,
  tenantId: string,
  stationId: string,
  period: string
) {
  const where: Prisma.SaleWhereInput = { station_id: stationId, tenant_id: tenantId };
  if (period === 'today') {
    where.recorded_at = { gte: new Date(new Date().setHours(0, 0, 0, 0)) };
  } else if (period === 'monthly') {
    where.recorded_at = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  }
  const agg = await prisma.sale.aggregate({
    where,
    _sum: { amount: true, volume: true },
    _count: { id: true },
  });
  return {
    totalSales: Number(agg._sum.amount || 0),
    totalVolume: Number(agg._sum.volume || 0),
    transactionCount: agg._count.id,
  };
}

export async function getStationPerformance(
  db: Pool,
  tenantId: string,
  stationId: string,
  range: string
) {
  const current = await getStationMetrics(db, tenantId, stationId, range);
  let prevWhere: Prisma.SaleWhereInput = { station_id: stationId, tenant_id: tenantId };
  if (range === 'monthly') {
    const start = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const end = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    prevWhere.recorded_at = { gte: start, lt: end };
  } else {
    const start = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const end = new Date();
    start.setHours(0, 0, 0, 0);
    prevWhere.recorded_at = { gte: start, lt: end };
  }
  const prevAgg = await prisma.sale.aggregate({
    where: prevWhere,
    _sum: { amount: true, volume: true },
  });
  const prevAmount = Number(prevAgg._sum.amount || 0);
  const prevVolume = Number(prevAgg._sum.volume || 0);
  const growth = prevAmount ? ((current.totalSales - prevAmount) / prevAmount) * 100 : null;
  return { ...current, previousSales: prevAmount, previousVolume: prevVolume, growth };
}

export async function getStationComparison(tenantId: string, stationIds: string[], period: string) {
  const interval = period === 'monthly' ? '30 days' : period === 'weekly' ? '7 days' : '1 day';
  const query = Prisma.sql`
    SELECT
      st.id,
      st.name,
      COALESCE(SUM(s.amount), 0) as total_sales,
      COALESCE(SUM(s.profit), 0) as total_profit,
      COALESCE(SUM(s.volume), 0) as total_volume,
      COUNT(s.id) as transaction_count,
      COALESCE(AVG(s.amount), 0) as avg_transaction,
      CASE WHEN SUM(s.amount) > 0 THEN (SUM(s.profit) / SUM(s.amount)) * 100 ELSE 0 END as profit_margin
    FROM stations st
    LEFT JOIN sales s ON st.id = s.station_id AND s.tenant_id = ${tenantId}
      AND s.recorded_at >= CURRENT_DATE - INTERVAL '${interval}'
    WHERE st.id IN (${Prisma.join(stationIds)}) AND st.tenant_id = ${tenantId}
    GROUP BY st.id, st.name
    ORDER BY total_sales DESC`;
  const rows = (await prisma.$queryRaw(query)) as any[];
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    totalSales: parseFloat(row.total_sales),
    totalProfit: parseFloat(row.total_profit),
    totalVolume: parseFloat(row.total_volume),
    transactionCount: parseInt(row.transaction_count),
    avgTransaction: parseFloat(row.avg_transaction),
    profitMargin: parseFloat(row.profit_margin),
  }));
}

export async function getStationRanking(
  _db: Pool,
  tenantId: string,
  metric: string,
  period: string
) {
  const interval = period === 'monthly' ? '30 days' : period === 'weekly' ? '7 days' : '1 day';
  const orderCol =
    metric === 'profit'
      ? Prisma.sql`total_profit`
      : metric === 'volume'
      ? Prisma.sql`total_volume`
      : Prisma.sql`total_sales`;
  const query = Prisma.sql`
    SELECT
      st.id,
      st.name,
      COALESCE(SUM(s.amount), 0) as total_sales,
      COALESCE(SUM(s.profit), 0) as total_profit,
      COALESCE(SUM(s.volume), 0) as total_volume,
      COUNT(s.id) as transaction_count,
      RANK() OVER (ORDER BY COALESCE(SUM(${orderCol}), 0) DESC) as rank
    FROM stations st
    LEFT JOIN sales s ON st.id = s.station_id AND s.tenant_id = ${tenantId}
      AND s.recorded_at >= CURRENT_DATE - INTERVAL '${interval}'
    WHERE st.tenant_id = ${tenantId}
    GROUP BY st.id, st.name
    ORDER BY ${orderCol} DESC`;
  const rows = (await prisma.$queryRaw(query)) as any[];
  return rows.map(row => ({
    rank: parseInt(row.rank, 10),
    id: row.id,
    name: row.name,
    totalSales: parseFloat(row.total_sales),
    totalProfit: parseFloat(row.total_profit),
    totalVolume: parseFloat(row.total_volume),
    transactionCount: parseInt(row.transaction_count, 10),
  }));
}

export async function getStationEfficiency(
  _db: Pool,
  tenantId: string,
  stationId: string
) {
  const query = Prisma.sql`
    SELECT
      st.id,
      st.name,
      COUNT(DISTINCT p.id) as pump_count,
      COALESCE(SUM(s.amount), 0) as total_sales,
      CASE WHEN COUNT(DISTINCT p.id) > 0
           THEN COALESCE(SUM(s.amount), 0) / COUNT(DISTINCT p.id)
           ELSE 0 END as efficiency
    FROM stations st
    LEFT JOIN pumps p ON p.station_id = st.id
    LEFT JOIN sales s ON s.station_id = st.id AND s.tenant_id = ${tenantId}
    WHERE st.id = ${stationId} AND st.tenant_id = ${tenantId}
    GROUP BY st.id, st.name`;
  const rows = (await prisma.$queryRaw(query)) as any[];
  if (!rows.length) return null;
  const row = rows[0];
  return {
    stationId: row.id,
    stationName: row.name,
    efficiency: parseFloat(row.efficiency),
  };
}

export async function getDashboardStationMetrics(
  _db: Pool,
  tenantId: string
) {
  const query = Prisma.sql`
    SELECT
      st.id,
      st.name,
      st.status,
      COUNT(p.id) FILTER (WHERE p.status = 'active') AS active_pumps,
      COUNT(p.id) AS total_pumps,
      MAX(sa.recorded_at) AS last_activity,
      COALESCE(SUM(CASE WHEN sa.recorded_at >= CURRENT_DATE THEN sa.amount ELSE 0 END),0) AS today_sales,
      COALESCE(SUM(CASE WHEN sa.recorded_at >= CURRENT_DATE - INTERVAL '30 days' THEN sa.amount ELSE 0 END),0) AS monthly_sales,
      COALESCE(SUM(CASE WHEN sa.recorded_at >= CURRENT_DATE - INTERVAL '60 days' AND sa.recorded_at < CURRENT_DATE - INTERVAL '30 days' THEN sa.amount ELSE 0 END),0) AS prev_month_sales
    FROM stations st
    LEFT JOIN pumps p ON p.station_id = st.id
    LEFT JOIN sales sa ON sa.station_id = st.id AND sa.tenant_id = ${tenantId}
    WHERE st.tenant_id = ${tenantId}
    GROUP BY st.id, st.name, st.status
    ORDER BY st.name`;

  const rows = (await prisma.$queryRaw(query)) as any[];
  return rows.map(row => {
    const monthlySales = parseFloat(row.monthly_sales);
    const prev = parseFloat(row.prev_month_sales);
    const growth = prev > 0 ? ((monthlySales - prev) / prev) * 100 : null;
    const activePumps = parseInt(row.active_pumps, 10);
    return {
      id: row.id,
      name: row.name,
      status: row.status,
      todaySales: parseFloat(row.today_sales),
      monthlySales,
      salesGrowth: growth,
      activePumps,
      totalPumps: parseInt(row.total_pumps, 10),
      lastActivity: row.last_activity,
      efficiency: activePumps > 0 ? monthlySales / activePumps : 0,
    };
  });
}