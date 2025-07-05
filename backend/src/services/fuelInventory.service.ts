import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import prisma from '../utils/prisma';
import { parseRows } from '../utils/parseDb';

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: string;
  currentVolume: number;
  capacity: number;
  lastUpdated: string;
}

export async function calculateTankLevel(
  _db: Pool,
  tenantId: string,
  stationId: string,
  fuelType: string
) {
  const delivered = await prisma.fuelDelivery.aggregate({
    where: { tenant_id: tenantId, station_id: stationId, fuel_type: fuelType },
    _sum: { volume: true },
  });
  const sold = await prisma.sale.aggregate({
    where: { tenant_id: tenantId, station_id: stationId, fuel_type: fuelType },
    _sum: { volume: true },
  });
  return Number(delivered._sum.volume || 0) - Number(sold._sum.volume || 0);
}

export async function getFuelInventory(
  _db: Pool,
  tenantId: string
): Promise<FuelInventory[]> {
  try {
    const items = await prisma.fuelInventory.findMany({
      where: { tenant_id: tenantId },
      include: { station: { select: { name: true } } },
      orderBy: [{ station: { name: 'asc' } }, { fuel_type: 'asc' }],
    });
    return items.map(i => ({
      id: i.id,
      stationId: i.station_id,
      stationName: (i as any).station.name,
      fuelType: i.fuel_type,
      currentVolume: Number(i.current_stock),
      capacity: Number(i.minimum_level),
      lastUpdated: i.last_updated.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching fuel inventory:', error);
    return [];
  }
}


export async function seedFuelInventory(
  _db: Pool,
  tenantId: string
): Promise<void> {
  // First check if we have any inventory records
  const existing = await prisma.fuelInventory.count({ where: { tenant_id: tenantId } });
  if (existing > 0) {
    return; // Already has data
  }

  const stations = await prisma.station.findMany({
    where: { tenant_id: tenantId },
    select: { id: true },
  });
  
  // For each station, create inventory for different fuel types
  for (const station of stations) {
    const fuelTypes = ['petrol', 'diesel', 'premium'];
    
    for (const fuelType of fuelTypes) {
      const capacity = Math.floor(Math.random() * 10000) + 5000; // Random capacity between 5000-15000
      const currentVolume = Math.floor(Math.random() * capacity); // Random current volume
      
      await prisma.fuelInventory.create({
        data: {
          id: randomUUID(),
          tenant_id: tenantId,
          station_id: station.id,
          fuel_type: fuelType,
          current_stock: currentVolume,
          minimum_level: capacity,
        },
      });
    }
  }
}
export interface FuelInventorySummary {
  fuelType: string;
  totalVolume: number;
  totalCapacity: number;
}

export async function getComputedFuelInventory(
  db: Pool,
  tenantId: string
): Promise<FuelInventory[]> {
  const stations = await prisma.station.findMany({
    where: { tenant_id: tenantId },
    select: { id: true, name: true },
  });
  const results: FuelInventory[] = [];
  for (const st of stations) {
    const fuels = await prisma.nozzle.findMany({
      where: { tenant_id: tenantId, pump: { station_id: st.id } },
      distinct: ['fuel_type'],
      select: { fuel_type: true },
    });
    for (const f of fuels) {
      const volume = await calculateTankLevel(db, tenantId, st.id, f.fuel_type);
      results.push({
        id: `${st.id}-${f.fuel_type}`,
        stationId: st.id,
        stationName: st.name,
        fuelType: f.fuel_type,
        currentVolume: volume,
        capacity: 0,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  return results;
}

export async function getFuelInventorySummary(
  _db: Pool,
  tenantId: string
): Promise<FuelInventorySummary[]> {
  try {
    const rows = await prisma.fuelInventory.groupBy({
      by: ['fuel_type'],
      where: { tenant_id: tenantId },
      _sum: { current_stock: true, minimum_level: true },
    });
    return rows.map(r => ({
      fuelType: r.fuel_type,
      totalVolume: Number(r._sum.current_stock || 0),
      totalCapacity: Number(r._sum.minimum_level || 0),
    }));
  } catch (error) {
    console.error('Error fetching fuel inventory summary:', error);
    return [];
  }
}
