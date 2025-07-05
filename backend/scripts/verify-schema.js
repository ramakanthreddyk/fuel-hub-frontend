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

async function verifySchema() {
  try {
    console.log('Verifying unified schema...');
    
    // Check tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\nTables in public schema:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check tenant_id columns
    const tenantIdColumnsResult = await pool.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND column_name = 'tenant_id'
      ORDER BY table_name;
    `);
    
    console.log('\nTables with tenant_id column:');
    tenantIdColumnsResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check foreign keys to tenants table
    const foreignKeysResult = await pool.query(`
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_name = 'tenants'
      ORDER BY tc.table_name;
    `);
    
    console.log('\nForeign keys to tenants table:');
    foreignKeysResult.rows.forEach(row => {
      console.log(`- ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
    });
    
    // Check migrations
    const migrationsResult = await pool.query(`
      SELECT version, description, executed_at
      FROM schema_migrations
      ORDER BY version;
    `);
    
    console.log('\nApplied migrations:');
    migrationsResult.rows.forEach(row => {
      console.log(`- ${row.version}: ${row.description} (${row.executed_at})`);
    });
    
  } catch (error) {
    console.error('Error verifying schema:', error.message);
  } finally {
    await pool.end();
  }
}

verifySchema();