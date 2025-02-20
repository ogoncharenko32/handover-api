import { Router } from 'express';

import * as ticketsControllers from '../controllers/browse.js';

import { authenticate } from '../midlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { ticketSchema } from '../validation/browse.js';

const browseRouter = Router();

browseRouter.use(authenticate);

browseRouter.get('/', ctrlWrapper(ticketsControllers.getTicketsController));
browseRouter.post('/', validateBody(ticketSchema), ctrlWrapper(ticketsControllers.addTicketController));

browseRouter.post('/create-shift', ctrlWrapper(ticketsControllers.createShiftController));
browseRouter.get('/get-shifts', ctrlWrapper(ticketsControllers.getShiftsController));

export default browseRouter;
