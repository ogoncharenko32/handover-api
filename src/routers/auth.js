import { Router } from 'express';

import * as authControllers from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { authLoginSchema, authRegisterSchema, googleOAuthSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post('/register', validateBody(authRegisterSchema), ctrlWrapper(authControllers.registerController));

authRouter.post('/login', validateBody(authLoginSchema), ctrlWrapper(authControllers.loginController));

authRouter.get('/get-oauth-url', ctrlWrapper(authControllers.getGoogleOAuthUrlController));

authRouter.post(
  '/confirm-oauth',
  validateBody(googleOAuthSchema),
  ctrlWrapper(authControllers.loginWithGoogleController),
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshTokenController));

authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));

authRouter.get('/verify', ctrlWrapper(authControllers.verifyController));

authRouter.get('/current', ctrlWrapper(authControllers.getCurrectUserController));

export default authRouter;
