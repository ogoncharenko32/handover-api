import { Router } from 'express';

import * as ticketsControllers from '../controllers/browse.js';

import { authenticate } from '../midlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const browseRouter = Router();

browseRouter.use(authenticate);

browseRouter.get('/', ctrlWrapper(ticketsControllers.getTicketsController));
browseRouter.post('/', ctrlWrapper(ticketsControllers.addTicketController));

export default browseRouter;
