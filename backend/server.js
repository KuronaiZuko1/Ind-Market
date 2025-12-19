import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import pool from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';
import licenseRoutes from './src/routes/license.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   Global Middleware
======================= */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* =======================
   Rate Limiting
======================= */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/auth', authLimiter);

/* =======================
   Health Check
======================= */
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

/* =======================
   Routes
======================= */
app.use('/auth', authRoutes);
app.use('/licenses', licenseRoutes);

/* =======================
   Global Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

/* =======================
   Server Startup (FAIL-FAST)
======================= */
async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('🟢 Database connection verified');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed');
    console.error(err);
    process.exit(1);
  }
}

startServer();