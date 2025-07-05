import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { parseRows, parseRow } from '../utils/parseDb';

export async function getInventory(db: Pool, tenantId: string, stationId?: string) {
  const params: any[] = [tenantId];
  let stationFilter = '';
  let idx = 2;
  if (stationId) {
    stationFilter = `AND fi.station_id = $${idx++}`;
    params.push(stationId);
  }
  
  const query = `
    SELECT 
      fi.id,
      fi.station_id,
      st.name as station_name,
      fi.fuel_type,
      fi.current_stock,
      fi.minimum_level,
      fi.last_updated,
      CASE 
        WHEN fi.current_stock <= fi.minimum_level THEN 'low'
        WHEN fi.current_stock <= fi.minimum_level * 1.5 THEN 'medium'
        ELSE 'good'
      END as stock_status
    FROM public.fuel_inventory fi
    JOIN public.stations st ON fi.station_id = st.id
    WHERE fi.tenant_id = $1 ${stationFilter}
    ORDER BY st.name, fi.fuel_type
  `;

  const result = await db.query(query, params);
  return parseRows(
    result.rows.map(row => ({
      id: row.id,
      stationId: row.station_id,
      stationName: row.station_name,
      fuelType: row.fuel_type,
      currentStock: parseFloat(row.current_stock),
      minimumLevel: parseFloat(row.minimum_level),
      lastUpdated: row.last_updated,
      stockStatus: row.stock_status
    }))
  );
}

export async function updateInventory(db: Pool, tenantId: string, stationId: string, fuelType: string, newStock: number) {
  const query = `
    UPDATE public.fuel_inventory
    SET current_stock = $4, last_updated = NOW()
    WHERE tenant_id = $1 AND station_id = $2 AND fuel_type = $3
  `;
  await db.query(query, [tenantId, stationId, fuelType, newStock]);
  
  // Check if stock is low and create alert
  const checkQuery = `
    SELECT current_stock, minimum_level
    FROM public.fuel_inventory
    WHERE tenant_id = $1 AND station_id = $2 AND fuel_type = $3
  `;
  const result = await db.query(checkQuery, [tenantId, stationId, fuelType]);
  const { current_stock, minimum_level } = result.rows[0];
  
  if (current_stock <= minimum_level) {
    await createAlert(db, tenantId, stationId, 'low_inventory', 
      `Low ${fuelType} inventory at station. Current: ${current_stock}L, Minimum: ${minimum_level}L`, 'warning');
  }
}

export async function createAlert(db: Pool, tenantId: string, stationId: string, alertType: string, message: string, severity: string = 'info') {
  const query = `
    INSERT INTO public.alerts (id, tenant_id, station_id, alert_type, message, severity, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
  `;
  await db.query(query, [randomUUID(), tenantId, stationId, alertType, message, severity]);
}

export async function getAlerts(db: Pool, tenantId: string, stationId?: string, unreadOnly: boolean = false) {
  const conditions = ['a.tenant_id = $1'];
  const params: any[] = [tenantId];
  let paramIndex = 2;
  
  if (stationId) {
    conditions.push(`a.station_id = $${paramIndex++}`);
    params.push(stationId);
  }
  
  if (unreadOnly) {
    conditions.push(`a.is_read = false`);
  }
  
  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  
  const query = `
    SELECT 
      a.id,
      a.station_id,
      st.name as station_name,
      a.alert_type,
      a.message,
      a.severity,
      a.is_read,
      a.created_at
    FROM public.alerts a
    LEFT JOIN public.stations st ON a.station_id = st.id
    ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT 50
  `;
  
  const result = await db.query(query, params);
  return parseRows(
    result.rows.map(row => ({
      id: row.id,
      stationId: row.station_id,
      stationName: row.station_name,
      alertType: row.alert_type,
      message: row.message,
      severity: row.severity,
      isRead: row.is_read,
      createdAt: row.created_at
    }))
  );
}

export async function markAlertRead(db: Pool, tenantId: string, alertId: string): Promise<boolean> {
  const result = await db.query(
    `UPDATE public.alerts SET is_read = TRUE WHERE tenant_id = $1 AND id = $2 RETURNING id`,
    [tenantId, alertId]
  );
  return (result.rowCount ?? 0) > 0;
}