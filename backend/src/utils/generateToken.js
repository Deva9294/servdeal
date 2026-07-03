import jwt from 'jsonwebtoken';

export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

export const signRefreshToken = (payload) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET must be defined in environment variables');
  }
  return jwt.sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

export const verifyToken = (token, refresh = false) => {
  let secret;
  if (refresh) {
    secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET must be defined in environment variables');
    }
  } else {
    secret = process.env.JWT_SECRET;
  }
  return jwt.verify(token, secret);
};
