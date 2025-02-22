import { Router } from 'express';

import * as ticketsControllers from '../controllers/browse.js';

import { authenticate } from '../midlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { ticketSchema, ticketUpdateSchema } from '../validation/browse.js';
import { isValidId } from '../midlewares/isValid.js';

const browseRouter = Router();

browseRouter.use(authenticate);

browseRouter.get('/', ctrlWrapper(ticketsControllers.getTicketsController));
browseRouter.post('/', validateBody(ticketSchema), ctrlWrapper(ticketsControllers.addTicketController));
browseRouter.delete('/:ticketId', isValidId, ctrlWrapper(ticketsControllers.deleteTicketController));
browseRouter.patch(
  '/:ticketId',
  isValidId,
  validateBody(ticketUpdateSchema),
  ctrlWrapper(ticketsControllers.updateTicketController),
);

browseRouter.post('/create-shift', ctrlWrapper(ticketsControllers.createShiftController));
browseRouter.get('/get-shifts', ctrlWrapper(ticketsControllers.getShiftsController));

export default browseRouter;
