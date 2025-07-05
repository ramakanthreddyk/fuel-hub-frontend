import { Client } from 'pg';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: envFile });

function fail(msg: string) {
  console.error(`\u274c FAILED: ${msg}`); // cross mark
}

async function main() {
  const schema = process.argv[2] || 'demo_tenant_001';
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  let hasError = false;

  // Validate users
  const { rows: userRows } = await client.query<{ role: string }>(
    `SELECT role FROM ${schema}.users ORDER BY role`
  );
  const roles = userRows.map((r) => r.role);
  if (userRows.length !== 3) {
    fail(`expected 3 users, found ${userRows.length}`);
    hasError = true;
  }
  const expectedRoles = ['attendant', 'manager', 'owner'];
  for (const role of expectedRoles) {
    if (!roles.includes(role)) {
      fail(`missing user role ${role}`);
      hasError = true;
    }
  }

  // Validate station -> pump -> nozzle hierarchy
  const { rows: stations } = await client.query<{ id: string }>(
    `SELECT id FROM ${schema}.stations`
  );
  if (stations.length !== 1) {
    fail(`expected 1 station, found ${stations.length}`);
    hasError = true;
  }
  const stationId = stations[0]?.id;

  const { rows: pumps } = await client.query<{ id: string; station_id: string }>(
    `SELECT id, station_id FROM ${schema}.pumps`
  );
  if (pumps.length !== 1) {
    fail(`expected 1 pump, found ${pumps.length}`);
    hasError = true;
  }
  const pumpId = pumps[0]?.id;
  if (pumpId && pumps[0].station_id !== stationId) {
    fail('pump is not linked to station');
    hasError = true;
  }

  const { rows: nozzles } = await client.query<{ pump_id: string }>(
    `SELECT pump_id FROM ${schema}.nozzles`
  );
  if (nozzles.length !== 2) {
    fail(`expected 2 nozzles, found ${nozzles.length}`);
    hasError = true;
  }
  for (const n of nozzles) {
    if (n.pump_id !== pumpId) {
      fail('nozzle not linked to pump');
      hasError = true;
      break;
    }
  }

  await client.end();

  if (hasError) {
    console.error('\u274c Demo tenant validation failed');
    process.exit(1);
  } else {
    console.log('\u2705 Demo tenant validation passed');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
