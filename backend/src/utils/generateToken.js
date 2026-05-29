import jwt from 'jsonwebtoken';

export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });

export const verifyToken = (token, refresh = false) => {
  const secret = refresh
    ? process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};
