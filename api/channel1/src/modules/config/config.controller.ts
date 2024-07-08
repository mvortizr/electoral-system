import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ConfigService } from './config.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';

// DTOS
import { DTOElectionConfig } from './dtos/dto_election_config';

@Controller('config')
@UseGuards(ApiKeyGuard)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/checkAuthorization')
  checkHealth(@Res() res: Response): object {
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  @Post('/setElectionConfig')
  setElectionConfig(@Body() electionConfig: DTOElectionConfig, @Res() res: Response): object {
    console.log('electionConfig', electionConfig)
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }
}
