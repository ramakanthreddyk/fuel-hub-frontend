import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';
import { createAlert } from './alert.service';

/**
 * Generate alerts when no readings have been received for a nozzle in 24 hours.
 */
export async function checkNoReadings24h(tenantId: string) {
  const query = Prisma.sql`
    SELECT n.id AS nozzle_id, p.station_id
      FROM "nozzles" n
      JOIN "pumps" p ON p.id = n.pump_id
      LEFT JOIN LATERAL (
        SELECT recorded_at
          FROM "nozzle_readings" nr
         WHERE nr.nozzle_id = n.id
           AND nr.tenant_id = ${tenantId}
         ORDER BY recorded_at DESC
         LIMIT 1
      ) r ON TRUE
     WHERE n.tenant_id = ${tenantId}
       AND n.status = 'active'
       AND (r.recorded_at IS NULL OR r.recorded_at < NOW() - INTERVAL '24 hours');`;

  const rows = (await prisma.$queryRaw(query)) as { nozzle_id: string; station_id: string }[];
  for (const row of rows) {
    await createAlert(
      tenantId,
      row.station_id,
      'no_readings_24h',
      `No readings for nozzle ${row.nozzle_id} in the last 24h`,
      'warning'
    );
  }
}

/**
 * Alert when an active nozzle lacks a current fuel price.
 */
export async function checkNozzlePriceMissing(tenantId: string) {
  const query = Prisma.sql`
    SELECT n.id AS nozzle_id, p.station_id, n.fuel_type
      FROM "nozzles" n
      JOIN "pumps" p ON p.id = n.pump_id
      LEFT JOIN LATERAL (
        SELECT 1
          FROM "fuel_prices" fp
         WHERE fp.station_id = p.station_id
           AND fp.fuel_type = n.fuel_type
           AND fp.tenant_id = ${tenantId}
           AND fp.valid_from <= NOW()
           AND (fp.effective_to IS NULL OR fp.effective_to > NOW())
         LIMIT 1
      ) price ON TRUE
     WHERE n.tenant_id = ${tenantId}
       AND n.status = 'active'
       AND price IS NULL;`;

  const rows = (await prisma.$queryRaw(query)) as { nozzle_id: string; station_id: string; fuel_type: string }[];
  for (const row of rows) {
    await createAlert(
      tenantId,
      row.station_id,
      'missing_price',
      `No current price for ${row.fuel_type} on nozzle ${row.nozzle_id}`,
      'warning'
    );
  }
}

/**
 * Alert when a creditor balance exceeds 90% of their credit limit.
 */
export async function checkCreditorsNearLimit(tenantId: string) {
  const query = Prisma.sql`
    SELECT id, station_id, party_name
      FROM "creditors"
     WHERE tenant_id = ${tenantId}
       AND status = 'active'
       AND credit_limit > 0
       AND balance >= credit_limit * 0.9;`;
  const rows = (await prisma.$queryRaw(query)) as { id: string; station_id: string | null; party_name: string }[];
  for (const row of rows) {
    await createAlert(
      tenantId,
      row.station_id,
      'credit_near_limit',
      `${row.party_name} is over 90% of credit limit`,
      'warning'
    );
  }
}

/**
 * Alert when a station shows no activity or pumps stuck in maintenance.
 */
export async function checkStationInactivity(tenantId: string) {
  const inactiveQuery = Prisma.sql`
    SELECT st.id
      FROM "stations" st
      LEFT JOIN LATERAL (
        SELECT MAX(nr.recorded_at) AS last_read
          FROM "nozzle_readings" nr
          JOIN "nozzles" n ON nr.nozzle_id = n.id
          JOIN "pumps" p ON n.pump_id = p.id
         WHERE p.station_id = st.id
           AND nr.tenant_id = ${tenantId}
      ) r ON TRUE
     WHERE st.tenant_id = ${tenantId}
       AND (r.last_read IS NULL OR r.last_read < NOW() - INTERVAL '48 hours');`;
  const stations = (await prisma.$queryRaw(inactiveQuery)) as { id: string }[];
  for (const row of stations) {
    await createAlert(tenantId, row.id, 'station_inactive', 'Station inactive for 48h', 'warning');
  }

  const pumpQuery = Prisma.sql`
    SELECT id, station_id
      FROM "pumps"
     WHERE tenant_id = ${tenantId}
       AND status = 'maintenance'
       AND updated_at < NOW() - INTERVAL '7 days';`;
  const pumps = (await prisma.$queryRaw(pumpQuery)) as { id: string; station_id: string }[];
  for (const p of pumps) {
    await createAlert(
      tenantId,
      p.station_id,
      'maintenance_overdue',
      `Pump ${p.id} in maintenance for over 7 days`,
      'warning'
    );
  }
}

/**
 * Detect large jumps between successive nozzle readings.
 */
export async function checkReadingDiscrepancies(tenantId: string) {
  const query = Prisma.sql`
    WITH last_read AS (
      SELECT nr.nozzle_id,
             p.station_id,
             nr.reading,
             LAG(nr.reading) OVER (PARTITION BY nr.nozzle_id ORDER BY nr.recorded_at) AS prev_read,
             ROW_NUMBER() OVER (PARTITION BY nr.nozzle_id ORDER BY nr.recorded_at DESC) AS rn
        FROM "nozzle_readings" nr
        JOIN "nozzles" n ON nr.nozzle_id = n.id
        JOIN "pumps" p ON n.pump_id = p.id
       WHERE nr.tenant_id = ${tenantId}
    )
    SELECT nozzle_id, station_id, reading - prev_read AS delta, prev_read
      FROM last_read
     WHERE rn = 1
       AND prev_read IS NOT NULL
       AND (reading - prev_read) > prev_read * 0.2;`;
  const rows = (await prisma.$queryRaw(query)) as { nozzle_id: string; station_id: string; delta: number }[];
  for (const row of rows) {
    await createAlert(
      tenantId,
      row.station_id,
      'reading_discrepancy',
      `Large jump (${row.delta}) detected for nozzle ${row.nozzle_id}`,
      'warning'
    );
  }
}

/**
 * Alert when a station lacks a cash report for today.
 */
export async function checkMissingCashReports(tenantId: string) {
  const query = Prisma.sql`
    SELECT st.id
      FROM "stations" st
     WHERE st.tenant_id = ${tenantId}
       AND NOT EXISTS (
         SELECT 1 FROM "cash_reports" cr
          WHERE cr.station_id = st.id
            AND cr.tenant_id = ${tenantId}
            AND cr.date = CURRENT_DATE
       );`;
  const rows = (await prisma.$queryRaw(query)) as { id: string }[];
  for (const row of rows) {
    await createAlert(tenantId, row.id, 'missing_cash_report', 'No cash report submitted today', 'warning');
  }
}

/** Run all alert checks sequentially. */
export async function runAllAlertRules(tenantId: string) {
  await checkNoReadings24h(tenantId);
  await checkNozzlePriceMissing(tenantId);
  await checkCreditorsNearLimit(tenantId);
  await checkStationInactivity(tenantId);
  await checkReadingDiscrepancies(tenantId);
  await checkMissingCashReports(tenantId);
}
