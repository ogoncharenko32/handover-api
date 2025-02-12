import { Router } from 'express';

import { authenticate } from '../midlewares/authenticate.js';

const browseRouter = Router();

browseRouter.use(authenticate);

export default browseRouter;
