const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function fixConstraints() {
  try {
    console.log('Removing problematic constraints...');
    
    // Drop the schema_name constraint
    await pool.query('ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_schema_name_key');
    console.log('✅ Dropped tenants_schema_name_key constraint');
    
    // Drop the schema_name column if it exists
    await pool.query('ALTER TABLE tenants DROP COLUMN IF EXISTS schema_name');
    console.log('✅ Dropped schema_name column');
    
    console.log('Constraints fixed successfully!');
  } catch (error) {
    console.error('Error fixing constraints:', error.message);
  } finally {
    await pool.end();
  }
}

fixConstraints();