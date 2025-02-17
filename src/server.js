import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './midlewares/notFoundHandler.js';
import { errorHandler } from './midlewares/errorHandler.js';

import authRouter from './routers/auth.js';
import browseRouter from './routers/browse.js';

export const startServer = () => {
  const app = express();

  app.use(
    cors({
      origin:
        // 'https://h2o-tracker-ui.vercel.app',
        // 'https://remezovskyi2508.github.io/h2o-tracker-ui',
        'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(express.static('uploads'));
  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/browse', browseRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server running on ${port} port`));
};
