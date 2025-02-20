import Joi from 'joi';

import { emailRegexp } from '../constants/index.js';

export const authRegisterSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  groupId: Joi.string(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const googleOAuthSchema = Joi.object({
  code: Joi.string().required,
});
