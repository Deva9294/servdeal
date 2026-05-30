import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User.js';

let mongod;
let server;
let api;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  // import server after setting MONGO_URI
  const mod = await import('../src/server.js');
  // server listens in start(); we need to connect without starting HTTP server.
  // Instead call connectDB directly and create an express app instance if exported.
  // For now, start the real server on a random port via the start function.
  server = mod.default || null;
});

afterAll(async () => {
  if (server && server.close) server.close();
  if (mongod) await mongod.stop();
  await mongoose.disconnect();
});

test('update location on /api/v1/users/me requires auth and updates location', async () => {
  // create a user directly
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.create({ name: 'Test', email: 't@test.com', phone: '9999999999', password: 'password' });

  // simulate token generation by importing utils to sign token
  const { signAccessToken } = await import('../src/utils/generateToken.js');
  const token = signAccessToken({ id: user._id, role: user.role });

  // start express server app (import creates app listening). Instead we'll call the API via supertest directly importing app instance
  const { app } = await import('../src/appInstance.js');

  const res = await request(app)
    .patch('/api/v1/users/me')
    .set('Authorization', `Bearer ${token}`)
    .send({ location: { lat: 12.34, lng: 56.78 } })
    .expect(200);

  expect(res.body.success).toBe(true);
  expect(res.body.data.location).toMatchObject({ lat: 12.34, lng: 56.78 });
});
