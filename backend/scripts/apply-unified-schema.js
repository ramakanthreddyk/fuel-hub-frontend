const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function applyMigration() {
  try {
    console.log('Applying unified schema migration...');
    
    // Ensure schema_migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        rollback_sql TEXT
      );
    `);
    
    console.log('✅ Ensured schema_migrations table exists');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/schema/005_master_unified_schema.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSql);
    
    console.log('✅ Migration applied successfully!');
    
    // Record the migration
    await pool.query(`
      INSERT INTO public.schema_migrations (version, description)
      VALUES ('005', 'Master unified schema for fresh setups')
      ON CONFLICT (version) DO NOTHING;
    `);
    
    console.log('✅ Migration recorded in schema_migrations table');
    
    // List all tables to verify
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\nVerifying tables in public schema:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('Error applying migration:', error.message);
  } finally {
    await pool.end();
  }
}

applyMigration();