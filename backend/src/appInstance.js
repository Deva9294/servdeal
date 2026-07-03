import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initSocket } from './socket/index.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In production, whitelist specific Render deployment URL only
    if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
      if (origin === process.env.RENDER_EXTERNAL_URL) {
        return callback(null, true);
      }
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  frameguard: { action: 'deny' },
  xssFilter: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests' },
  })
);

app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

export { app };
