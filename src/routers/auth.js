import { Router } from 'express';

import * as authControllers from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import {
  authLoginSchema,
  authRegisterSchema,
  googleOAuthSchema,
  resetPasswordSchema,
  sendResetEmailSchema,
} from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post('/register', validateBody(authRegisterSchema), ctrlWrapper(authControllers.registerController));

authRouter.get('/get-groups', ctrlWrapper(authControllers.getGroupsController));

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

authRouter.get('/current', ctrlWrapper(authControllers.getCurrentUserController));

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(authControllers.requestResetEmailConstoller),
);

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(authControllers.resetPasswordController));

export default authRouter;
