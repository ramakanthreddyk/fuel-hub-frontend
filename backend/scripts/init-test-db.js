const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config({ path: '.env.test' });

async function initTestDb() {
  const host = process.env.PGHOST || 'localhost';
  const port = parseInt(process.env.PGPORT || '5432');
  const user = process.env.PGUSER || 'postgres';
  const password = process.env.PGPASSWORD || 'postgres';
  const dbName = process.env.PGDATABASE || 'fuelsync_test';

  const admin = new Client({ host, port, user, password, database: 'postgres' });
  await admin.connect();
  try {
    await admin.query(`CREATE DATABASE ${dbName}`);
  } catch (err) {
    if (err.code !== '42P04') throw err;
  }
  await admin.end();

  const client = new Client({ host, port, user, password, database: dbName });
  await client.connect();

  const publicSql = fs.readFileSync(path.join(__dirname, '../migrations/schema/001_initial_schema.sql'), 'utf8');
  await client.query(publicSql);

  await client.query(`INSERT INTO public.plans (name, config_json) VALUES ('basic', '{}'::jsonb) ON CONFLICT (name) DO NOTHING`);
  const { rows: planRows } = await client.query(`SELECT id FROM public.plans WHERE name='basic' LIMIT 1`);
  const planId = planRows[0].id;

  const tenantRes = await client.query(
    `INSERT INTO public.tenants (name, plan_id, status) VALUES ($1,$2,'active') RETURNING id`,
    ['Test Tenant', planId]
  );
  const tenantId = tenantRes.rows[0].id;

  const hash = await bcrypt.hash('password', 1);
  await client.query(
    `INSERT INTO public.users (tenant_id, email, password_hash, role) VALUES ($1,$2,$3,'owner')`,
    [tenantId, `owner@test.com`, hash]
  );

  await client.end();
}

module.exports = { initTestDb };

if (require.main === module) {
  initTestDb().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
