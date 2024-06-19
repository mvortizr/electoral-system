import { Controller, Get, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';
//import { ConfigService } from './config.service';
import { ConfigService } from './config.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';

@Controller('config')
@UseGuards(ApiKeyGuard)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/checkAuthorization')
  checkHealth(@Res() res: Response): object {
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }
}
