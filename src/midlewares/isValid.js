import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { ticketId } = req.params;
  if (!isValidObjectId(ticketId)) {
    return next(createHttpError(400, `${ticketId} is not valid id`));
  }
  next();
};
