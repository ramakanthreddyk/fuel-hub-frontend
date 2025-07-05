const { initTestDb } = require('./scripts/init-test-db.js');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

module.exports = async () => {
  await initTestDb();
  const client = new Client({
    host: process.env.DB_HOST || process.env.PGHOST,
    port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
    user: process.env.DB_USER || process.env.PGUSER,
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
    database: process.env.DB_NAME || process.env.PGDATABASE,
  });
  await client.connect();
  await client.end();
};
