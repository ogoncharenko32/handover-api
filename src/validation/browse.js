import Joi from 'joi';

export const ticketSchema = Joi.object({
  status: Joi.string().required(),
  link: Joi.string().required(),
  description: Joi.string().required(),
  isImportant: Joi.boolean().required(),
  comment: Joi.string(),
  shiftId: Joi.string().required(),
});

export const ticketUpdateSchema = Joi.object({
  _id: Joi.string().required(),
  status: Joi.string().required(),
  link: Joi.string().required(),
  description: Joi.string().required(),
  isImportant: Joi.boolean().required(),
  comment: Joi.string(),
  shiftId: Joi.string(),
});
