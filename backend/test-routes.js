const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

// Test importing each route file one by one
console.log('Testing auth routes...');
try {
  const authRoutes = require('./src/routes/auth.routes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes OK');
} catch (err) {
  console.log('❌ Auth routes ERROR:', err.message);
}

console.log('Testing license routes...');
try {
  const licenseRoutes = require('./src/routes/license.routes');
  app.use('/api/licenses', licenseRoutes);
  console.log('✅ License routes OK');
} catch (err) {
  console.log('❌ License routes ERROR:', err.message);
}

console.log('Testing EA routes...');
try {
  const eaRoutes = require('./src/routes/ea.routes');
  app.use('/api/eas', eaRoutes);
  console.log('✅ EA routes OK');
} catch (err) {
  console.log('❌ EA routes ERROR:', err.message);
}

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
