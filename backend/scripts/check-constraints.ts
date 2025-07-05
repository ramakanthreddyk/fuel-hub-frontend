import { Client } from 'pg';

const schema = process.argv[2];
if (!schema) {
  console.error('Usage: ts-node check-constraints.ts <schema>');
  process.exit(1);
}

const NOT_NULL: Record<string, string[]> = {
  stations: ['name'],
  pumps: ['station_id'],
  nozzles: ['nozzle_number', 'fuel_type'],
  nozzle_readings: ['nozzle_id', 'recorded_at'],
  fuel_prices: ['station_id'],
  creditors: ['contact_person', 'email'],
  fuel_deliveries: ['supplier'],
};

const CHECKS: Record<string, string[]> = {
  nozzle_readings: ['reading > 0'],
  sales: ['volume > 0', 'price_per_litre > 0', 'sale_amount > 0'],
  fuel_prices: ['price > 0'],
  creditors: ['credit_limit >= 0'],
  credit_payments: ['amount > 0'],
  fuel_deliveries: ['litres_delivered > 0'],
};

async function main() {
  const client = new Client();
  await client.connect();

  const { rows: tables } = await client.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema=$1`,
    [schema]
  );

  for (const { table_name } of tables) {
    const { rows: cols } = await client.query<{ column_name: string; is_nullable: string }>(
      `SELECT column_name, is_nullable FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2`,
      [schema, table_name]
    );
    const colMap: Record<string, string> = {};
    for (const c of cols) colMap[c.column_name] = c.is_nullable;
    if (!('created_at' in colMap)) {
      console.log(`${table_name}: missing created_at`);
    }
    if (!('updated_at' in colMap)) {
      console.log(`${table_name}: missing updated_at`);
    }
    for (const col of NOT_NULL[table_name] || []) {
      if (colMap[col] !== 'NO') {
        console.log(`${table_name}.${col} should be NOT NULL`);
      }
    }
    const { rows: checks } = await client.query(
      `SELECT pg_get_constraintdef(c.oid) as def FROM pg_constraint c
       JOIN pg_class t ON c.conrelid = t.oid
       JOIN pg_namespace n ON t.relnamespace = n.oid
       WHERE n.nspname=$1 AND t.relname=$2 AND c.contype='c'`,
      [schema, table_name]
    );
    const defs = checks.map((r: { def: string }) => r.def);
    for (const expr of CHECKS[table_name] || []) {
      if (!defs.some((d: string) => d.includes(expr))) {
        console.log(`${table_name}: missing CHECK ${expr}`);
      }
    }
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
