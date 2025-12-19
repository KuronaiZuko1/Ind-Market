require('dotenv').config();
const { pool } = require('./src/config/database');

console.log('Testing database connection...');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully!');
    console.log('Server time:', res.rows[0].now);
    process.exit(0);
  }
});
