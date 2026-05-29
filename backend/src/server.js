import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initSocket } from './socket/index.js';
import { razorpayWebhook } from './controllers/paymentController.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://localhost:3000',
    credentials: true,
  },
});

app.set('io', io);
initSocket(io);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://localhost:3000',
    credentials: true,
  })
);
app.use(morgan('dev'));

app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  (req, _res, next) => {
    req.rawBody = req.body?.toString?.('utf8') || '';
    try {
      req.body = JSON.parse(req.rawBody);
    } catch {
      req.body = {};
    }
    next();
  },
  razorpayWebhook
);

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
console.log("Mongo URI:", process.env.MONGO_URI);
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    configureCloudinary();
    server.listen(PORT, () => {
      console.log(`ServDeal API running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
