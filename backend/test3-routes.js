const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

console.log('Middleware loaded successfully');

// Test if auth routes exist
try {
  const authRoutes = require('./src/routes/auth.routes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
}

// Test if license routes exist
try {
  const licenseRoutes = require('./src/routes/license.routes');
  app.use('/api/licenses', licenseRoutes);
  console.log('✅ License routes loaded');
} catch (error) {
  console.error('❌ Error loading license routes:', error.message);
}

// Test if EA routes exist
try {
  const eaRoutes = require('./src/routes/ea.routes');
  app.use('/api/eas', eaRoutes);
  console.log('✅ EA routes loaded');
} catch (error) {
  console.error('❌ Error loading EA routes:', error.message);
}

app.get('/', (req, res) => {
  res.json({ message: 'Test 3: Routes loaded!' });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test 3 passed: Server with routes running on port ${PORT}`);
});
