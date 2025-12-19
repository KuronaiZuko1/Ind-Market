import pool from '../src/config/database.js';

async function test() {
  console.log('Running backend self-test...');

  await pool.query('SELECT 1');
  console.log('✅ DB OK');

  await pool.query('SELECT COUNT(*) FROM users');
  console.log('✅ Users table OK');

  await pool.query('SELECT COUNT(*) FROM licenses');
  console.log('✅ Licenses table OK');

  console.log('🎉 Backend PASSED all checks');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ Self-test failed:', err);
  process.exit(1);
});