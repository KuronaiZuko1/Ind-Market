const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Middleware
const errorHandler = require('./src/middleware/errorHandler');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const licenseRoutes = require('./src/routes/license.routes');
const eaRoutes = require('./src/routes/ea.routes');

const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;

/*
====================================
SECURITY
====================================
*/
app.use(helmet());

app.use(cors({
  origin: NODE_ENV === 'development' ? true : process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));

/*
====================================
BODY PARSERS
====================================
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
====================================
LOGGING
====================================
*/
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/*
====================================
HEALTH
====================================
*/
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    env: NODE_ENV,
  });
});


const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'NeonDB connected',
      time: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: err.message
    });
  }
});
/*
====================================
ROUTES
====================================
*/
app.use('/api/auth', authRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/eas', eaRoutes);

/*
====================================
404
====================================
*/
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/*
====================================
ERROR HANDLER
====================================
*/
app.use(errorHandler);

/*
====================================
START SERVER
====================================
*/
app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 Server running`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📡 Port: ${PORT}`);
  console.log('=================================');
});