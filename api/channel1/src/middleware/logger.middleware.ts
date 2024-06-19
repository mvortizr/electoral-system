import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, headers, originalUrl } = req;
    const message = `${method} ${originalUrl} - RUNTIME: ${headers['user-agent']}`;
    Logger.log(message);
    //Logger.debug('Request body:', req.body);
    next();
  }
}
