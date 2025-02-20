import Joi from 'joi';

export const ticketSchema = Joi.object({
  status: Joi.string().required(),
  link: Joi.string().required(),
  description: Joi.string().required(),
  isImportant: Joi.boolean().required(),
  comment: Joi.string(),
  shiftId: Joi.string().required(),
});
