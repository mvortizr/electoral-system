/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * This sample is intended to work with the basic asset transfer
 * chaincode which imposes some constraints on what is possible here.
 *
 * For example,
 *  - There is no validation for Asset IDs
 *  - There are no error codes from the chaincode
 *
 * To avoid timeouts, long running tasks should be decoupled from HTTP request
 * processing
 *
 * Submit transactions can potentially be very long running, especially if the
 * transaction fails and needs to be retried one or more times
 *
 * To allow requests to respond quickly enough, this sample queues submit
 * requests for processing asynchronously and immediately returns 202 Accepted
 */

import express, { Request, Response } from 'express';
// import { body, validationResult } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
// import { Queue } from 'bullmq';
// import { AssetNotFoundError } from '../config/errors';
import { evatuateTransaction } from '../config/fabric';
// import { addSubmitTransactionJob } from '../config/jobs';
import { logger } from '../config/logger';

// const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } =
//   StatusCodes;

const { INTERNAL_SERVER_ERROR, OK } = StatusCodes;

export const positionRouter = express.Router();

positionRouter.get('/init', async (req: Request, res: Response) => {
  logger.debug('Init Ledger');
  try {
    const mspId = req.user as string;
    const contract = req.app.locals[mspId]?.positionContract as Contract;

    const data = await evatuateTransaction(contract, 'InitLedger');
    let assets = [];
    if (data.length > 0) {
      assets = JSON.parse(data.toString());
    }

    return res.status(OK).json(assets);
  } catch (err) {
    logger.error({ err }, 'Error processing get all assets request');
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: getReasonPhrase(INTERNAL_SERVER_ERROR),
      timestamp: new Date().toISOString(),
    });
  }
});

positionRouter.get('/readAll', async (req: Request, res: Response) => {
  logger.debug('Log all assets in the ledger');
  try {
    const mspId = req.user as string;
    const contract = req.app.locals[mspId]?.positionContract as Contract;

    logger.debug('contract', contract);

    const data = await evatuateTransaction(
      contract,
      'readEntireElectoralChannel'
    );
    let assets = [];

    logger.debug('assets', data);
    if (data.length > 0) {
      assets = JSON.parse(data.toString());
    }

    return res.status(OK).json(assets);
  } catch (err) {
    logger.error({ err }, 'Error processing get all assets request');
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: getReasonPhrase(INTERNAL_SERVER_ERROR),
      timestamp: new Date().toISOString(),
    });
  }
});
