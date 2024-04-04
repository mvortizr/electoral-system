/*
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import passport from 'passport';
import pinoMiddleware from 'pino-http';
import { positionRouter } from './routes/positions.router';
import { authenticateApiKey, fabricAPIKeyStrategy } from './config/auth';
import { healthRouter } from './routes/health.router';
import { jobsRouter } from './routes/jobs.router';
import { logger } from './config/logger';
import { transactionsRouter } from './routes/transactions.router';
import cors from 'cors';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

export const createServer = async (): Promise<Application> => {
  const app = express();
  app.use(bodyParser.json());
  morganBody(app);

  app.use(
    pinoMiddleware({
      logger,
      customLogLevel: function customLogLevel(res, err) {
        if (
          res.statusCode >= BAD_REQUEST &&
          res.statusCode < INTERNAL_SERVER_ERROR
        ) {
          return 'warn';
        }

        if (res.statusCode >= INTERNAL_SERVER_ERROR || err) {
          return 'error';
        }

        return 'debug';
      },
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // define passport startegy
  passport.use(fabricAPIKeyStrategy);

  // initialize passport js
  app.use(passport.initialize());

  if (process.env.NODE_ENV === 'development') {
    app.use(cors());
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  app.use('/', healthRouter);
  app.use('/api/positions', authenticateApiKey, positionRouter);
  app.use('/api/jobs', authenticateApiKey, jobsRouter);
  app.use('/api/transactions', authenticateApiKey, transactionsRouter);

  // For everything else
  app.use((_req, res) =>
    res.status(NOT_FOUND).json({
      status: getReasonPhrase(NOT_FOUND),
      timestamp: new Date().toISOString(),
    })
  );

  // Print API errors
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: getReasonPhrase(INTERNAL_SERVER_ERROR),
      timestamp: new Date().toISOString(),
    });
  });

  return app;
};
