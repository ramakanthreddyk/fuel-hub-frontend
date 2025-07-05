const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Skip entirely when running in Codex/CI environments
if (process.env.CODEX_ENV_NODE_VERSION || process.env.CI) {
  console.log('Codex environment detected. Skipping Azure schema setup.');
  process.exit(0);
}

async function run() {
  const filePath = path.join(__dirname, '../migrations/schema/003_unified_schema.sql');
  let sql = fs.readFileSync(filePath, 'utf8');

  // Comment out pgcrypto extension for Azure
  sql = sql.replace(/CREATE EXTENSION IF NOT EXISTS pgcrypto;/i, '-- CREATE EXTENSION IF NOT EXISTS pgcrypto;');

  if (!process.env.DB_HOST) {
    console.error('DB_HOST is not set. Provide Azure connection details in a .env file.');
    return;
  }

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Applying unified schema to Azure database...');
    await pool.query(sql);
    console.log('✅ Schema applied successfully');
  } catch (err) {
    console.error('Error applying schema:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  run();
}
