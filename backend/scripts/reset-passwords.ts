import pool from '../src/utils/db';
import bcrypt from 'bcrypt';

async function resetPasswords() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Reset admin user password
    const adminEmail = 'admin@fuelsync.dev';
    const adminPassword = 'password';
    
    console.log(`Resetting password for admin user: ${adminEmail}`);
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const adminResult = await client.query(
      `UPDATE public.admin_users SET password_hash = $1 WHERE email = $2 RETURNING id`,
      [adminPasswordHash, adminEmail]
    );
    
    if (adminResult.rows.length > 0) {
      console.log(`✅ Admin user password reset successfully`);
    } else {
      console.log(`❌ Admin user not found: ${adminEmail}`);
    }
    
    // Get all tenants
    const { rows: tenants } = await client.query(
      'SELECT id FROM public.tenants'
    );

    for (const tenant of tenants) {
      console.log(`\nResetting passwords for users of tenant: ${tenant.id}`);

      try {
        const password = 'password';
        const passwordHash = await bcrypt.hash(password, 10);

        const { rows: users } = await client.query(
          'SELECT id, email FROM public.users WHERE tenant_id = $1',
          [tenant.id]
        );

        for (const user of users) {
          await client.query(
            'UPDATE public.users SET password_hash = $1 WHERE id = $2',
            [passwordHash, user.id]
          );
          console.log(`✅ Reset password for ${user.email}`);
        }

        console.log(`Reset ${users.length} passwords for tenant ${tenant.id}`);
      } catch (error: any) {
        console.error(`Error resetting passwords for tenant ${tenant.id}:`, error?.message || 'Unknown error');
      }
    }
    
    await client.query('COMMIT');
    console.log('\nAll passwords have been reset to "password"');
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Failed to reset passwords:', error?.message || error);
  } finally {
    client.release();
  }
}

resetPasswords().then(() => {
  console.log('Done');
  process.exit(0);
}).catch((error: any) => {
  console.error('Script failed:', error?.message || error);
  process.exit(1);
});