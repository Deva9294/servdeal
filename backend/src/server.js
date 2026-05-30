import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import http from 'http';
import { app } from './appInstance.js';
import { Server } from 'socket.io';
import { initSocket } from './socket/index.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((s) => s.trim()),
    credentials: true,
  },
});

app.set('io', io);
initSocket(io);

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
