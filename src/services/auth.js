import { User } from '../db/models/user.js';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }
  // Eski session'ı sil
  await Session.deleteMany({ userId: user._id });
  // Token üret
  const accessToken = jwt.sign({ userId: user._id }, env('JWT_ACCESS_SECRET'), {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(
    { userId: user._id },
    env('JWT_REFRESH_SECRET'),
    { expiresIn: '30d' },
  );
  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000,
  );
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env('JWT_REFRESH_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }
  // Eski session'ı sil
  await Session.deleteMany({ userId: payload.userId });
  // Yeni tokenlar
  const accessToken = jwt.sign(
    { userId: payload.userId },
    env('JWT_ACCESS_SECRET'),
    { expiresIn: '15m' },
  );
  const newRefreshToken = jwt.sign(
    { userId: payload.userId },
    env('JWT_REFRESH_SECRET'),
    { expiresIn: '30d' },
  );
  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000,
  );
  await Session.create({
    userId: payload.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutSession = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env('JWT_REFRESH_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }
  await Session.deleteMany({ userId: payload.userId });
};
