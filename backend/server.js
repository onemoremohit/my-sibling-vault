import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';

import connectDB from './src/config/db.js';
import packetRoutes from './src/routes/packetRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';

// ── ESM dirname shim ────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Ensure uploads/ directory exists ────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Express App ─────────────────────────────────────────────────────────────
const app = express();

// ── 1. HTTP Security Headers (Helmet) ────────────────────────────────────────
// Helmet sets secure HTTP headers. We relax crossOriginResourcePolicy so that
// Backblaze B2 media and static /uploads assets can be loaded cross-origin.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));

// ── 2. Dynamic CORS Configuration ───────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, Postman, server-to-server, health probes)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: origin "${origin}" is not allowed.`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── 3. Payload Sanitization & Body Limits ────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── 4. Request Logging ──────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── 5. Rate Limiting ────────────────────────────────────────────────────────
// General API rate limiter: 100 requests per 15-min window per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' },
});
app.use('/api/', generalLimiter);

// Strict rate limiter for write-heavy endpoints: 20 requests per 15-min window
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded for this action. Please try again after 15 minutes.' },
});
app.use('/api/packets/upload', strictLimiter);

// ── 6. Serve uploaded media as static files ──────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ── 7. Root Probe & Health Check ────────────────────────────────────────────
// Root probe for Cloud Run, load balancers, and container orchestration
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'sibling-vault-backend',
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Detailed Health Check & MongoDB Connection Monitoring
app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const stateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const isHealthy = readyState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    database: stateMap[readyState] || 'Unknown',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── 8. API Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/packets', packetRoutes);

// ── 9. 404 handler ──────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` }));

// ── 10. Global error handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ── 11. Start server immediately for instant Cloud Run TCP probe passing ────
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  
  // Connect to database in the background after server socket is open
  connectDB().catch((err) => {
    console.error('❌ Background MongoDB connection failed:', err.message);
  });
});

// ── 12. Process Lifecycle & Graceful Shutdown ────────────────────────────────
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ Received ${signal}. Closing MongoDB connection & shutting down server gracefully...`);
  try {
    server.close(() => {
      console.log('HTTP server closed.');
    });
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed cleanly.');
    process.exit(0);
  } catch (err) {
    console.error(`❌ Error during graceful shutdown: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
