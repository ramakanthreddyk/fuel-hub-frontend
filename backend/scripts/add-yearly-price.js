const { Pool } = require('pg');

async function addYearlyPrice() {
  console.log('Adding yearly price to plans...');
  
  try {
    require('dotenv').config();
  } catch (e) {
    console.log('dotenv not available, using environment variables');
  }
  
  // Connection parameters
  console.log('DB Connection Parameters:');
  console.log('- Host:', process.env.DB_HOST || 'localhost');
  console.log('- Database:', process.env.DB_NAME || 'fuelsync_db');
  console.log('- User:', process.env.DB_USER || 'postgres');
  
  // Azure PostgreSQL connection
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false } // Required for Azure PostgreSQL
  });

  try {
    console.log('Connected to database');
    
    // Check if schema_migrations table exists
    const checkMigrationsTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations'
      )
    `);
    
    // Create schema_migrations table if it doesn't exist
    if (!checkMigrationsTable.rows[0].exists) {
      console.log('Creating schema_migrations table...');
      await pool.query(`
        CREATE TABLE public.schema_migrations (
          id SERIAL PRIMARY KEY,
          version VARCHAR(50) NOT NULL UNIQUE,
          description TEXT NOT NULL,
          executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          rollback_sql TEXT
        )
      `);
    }
    
    // Check if price_yearly column exists
    const checkColumn = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'plans' 
        AND column_name = 'price_yearly'
      )
    `);
    
    // Add price_yearly column if it doesn't exist
    if (!checkColumn.rows[0].exists) {
      console.log('Adding price_yearly column to plans table...');
      await pool.query(`
        ALTER TABLE public.plans
        ADD COLUMN price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0
      `);
      
      // Record migration
      await pool.query(`
        INSERT INTO public.schema_migrations (version, description)
        VALUES ('005', 'Add price_yearly to plans')
        ON CONFLICT (version) DO NOTHING
      `);
      
      // Update existing plans with yearly price (12x monthly price)
      console.log('Updating existing plans with yearly price...');
      await pool.query(`
        UPDATE public.plans
        SET price_yearly = price_monthly * 12
      `);
      
      console.log('Migration completed successfully');
    } else {
      console.log('price_yearly column already exists');
    }
    
    // Show current plans with yearly price
    const plans = await pool.query(`
      SELECT id, name, price_monthly, price_yearly FROM public.plans
    `);
    
    console.log('\nCurrent plans:');
    plans.rows.forEach(plan => {
      console.log(`- ${plan.name}: $${plan.price_monthly}/month, $${plan.price_yearly}/year`);
    });
    
  } catch (error) {
    console.error('Error adding yearly price:', error);
  } finally {
    await pool.end();
  }
}

addYearlyPrice().catch(console.error);