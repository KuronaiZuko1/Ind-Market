const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const licenseRoutes = require('./src/routes/license.routes');
const eaRoutes = require('./src/routes/ea.routes');

const app = express();

/*
====================================
ENVIRONMENT
====================================
*/
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;

/*
====================================
TRUST PROXY (ONLY IN PROD)
====================================
*/
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

/*
====================================
SECURITY MIDDLEWARE
====================================
*/
app.use(helmet());

/*
====================================
CORS CONFIG (FIXED)
====================================
*/
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server & browser-less requests
      if (!origin) return callback(null, true);

      // Dev mode: allow all
      if (NODE_ENV === 'development') {
        return callback(null, true);
      }

      // Prod: whitelist only
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
  })
);

/*
====================================
BODY PARSERS
====================================
*/
app.use(express.json({ limit: '10mb' }));
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
HEALTH CHECK
====================================
*/
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/*
====================================
ROOT
====================================
*/
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'EA License Manager API',
    version: '1.0.0',
  });
});

/*
====================================
API ROUTES
====================================
*/
app.use('/api/auth', authRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/eas', eaRoutes);

/*
====================================
404 HANDLER
====================================
*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/*
====================================
ERROR HANDLER (LAST)
====================================
*/
app.use(errorHandler);

/*
====================================
START SERVER
====================================
*/
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 Server running`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📡 Port: ${PORT}`);
  console.log('=================================');
});

/*
====================================
GRACEFUL SHUTDOWN
====================================
*/
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
  });
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;