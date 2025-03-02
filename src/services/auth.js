import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import * as fs from 'node:fs/promises';
import handlebars from 'handlebars';

import UsersCollection from '../db/models/Users.js';
import SessionsCollection from '../db/models/Sessions.js';

import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { validateCode, getUsernameFromGoogleTokenPayload } from '../utils/googleOAuth2.js';

import { SMTP, accessTokenLifetime, refreshTokenLifetime } from '../constants/index.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import GroupsCollection from '../db/models/Groups.js';

const emailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');

const emailTemplateSource = await readFile(emailTemplatePath, 'utf-8');

const appDomain = getEnvVar('APP_DOMAIN');
const jwtSecret = getEnvVar('JWT_SECRET');

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'User already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });

  //   const template = Handlebars.compile(emailTemplateSource);

  //   const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

  //   const html = template({
  //     link: `${appDomain}/auth/verify?token=${token}`,
  //   });

  //   const verifyEmail = {
  //     to: email,
  //     subject: 'Verify email',
  //     html,
  //   };

  //   await sendEmail(verifyEmail);

  return newUser;
};

export const verify = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    await UsersCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const login = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  //   if (!user.verify) {
  //     throw createHttpError(401, 'Email not verfied');
  //   }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshToken = async (payload) => {
  const oldSession = await SessionsCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return SessionsCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const loginOrRegisterWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const username = getUsernameFromGoogleTokenPayload(payload);
    const password = await bcrypt.hash(randomBytes(10).toString('base64'), 10);

    user = await UsersCollection.create({
      email: payload.email,
      username,
      password,
    });
  }

  const sessionData = createSessionData();

  return SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const logout = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const getUser = (filter) => UsersCollection.findOne(filter);

export const getSession = (filter) => SessionsCollection.findOne(filter);

export const getGroups = async () => await GroupsCollection.find();

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');

  const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.username,
    link: `${getEnvVar('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error.message);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async ({ token, password }) => {
  let entries;

  try {
    entries = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne(
    {
      _id: entries.sub,
    },
    {
      password: hashPassword,
    },
  );

  await SessionCollection.deleteOne({ userId: user._id });
};
