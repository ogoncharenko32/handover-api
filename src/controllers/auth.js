import createHttpError from 'http-errors';
import * as authServices from '../services/auth.js';

import { generateOAuthUrl } from '../utils/googleOAuth2.js';
import { getSession, getUser } from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    secure: true,
    sameSite: 'none',
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    secure: true,
    sameSite: 'none',
  });
};

export const registerController = async (req, res) => {
  const { email, password } = req.body;
  await authServices.register(req.body);

  const session = await authServices.login({ email, password });

  const user = await authServices.getUser({ email: email });

  setupSession(res, session);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered user',
    data: {
      user: {
        username: user.username,
        email: user.email,
        groupId: user.groupId,
      },
      accessToken: session.accessToken,
    },
  });
};

export const loginController = async (req, res) => {
  const { email } = req.body;
  const session = await authServices.login(req.body);

  const user = await authServices.getUser({ email: email });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully login user',
    data: {
      user: {
        username: user.username,
        email: user.email,
        groupId: user.groupId,
      },
      accessToken: session.accessToken,
    },
  });
};

export const getGroupsController = async (req, res) => {
  const data = await authServices.getGroups();

  res.status(200).json({
    status: 200,
    message: 'Successfully found groups',
    data,
  });
};

export const verifyController = async (req, res) => {
  const { token } = req.query;
  await authServices.verify(token);

  res.json({
    status: 200,
    message: 'Email verified',
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateOAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const { code } = req.body;
  const session = await authServices.loginOrRegisterWithGoogle(code);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully login with Google OAuth',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await authServices.refreshToken({ refreshToken, sessionId });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logout(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const getCurrentUserController = async (req, res) => {
  // const { refreshToken, sessionId } = req.cookies;
  // if (!refreshToken && !sessionId) {
  //   throw createHttpError(401, 'token or session id not found');
  // }
  // const { userId } = await authServices.getSession({ _id: sessionId, refreshToken: refreshToken });

  const authHeader = req.get('Authorization');
  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    createHttpError(401, 'Header must be Bearer type');
  }

  const session = await getSession({ accessToken });
  if (!session) {
    createHttpError(401, 'Session not found');
  }

  if (Date.now() > session.accessTokenValidUntil) {
    createHttpError(401, 'Access token expired');
  }

  const user = await getUser({ _id: session.userId });
  if (!user) {
    createHttpError(401, 'User not found');
  }


  if (user) {
    // const data = await authServices.getUser({ _id: userId });
    res.status(200).json({
      status: 200,
      message: 'Logged user returned',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        groupId: user.groupId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }
  return;
};

export const requestResetEmailConstoller = async (req, res) => {
  await authServices.requestResetToken(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
