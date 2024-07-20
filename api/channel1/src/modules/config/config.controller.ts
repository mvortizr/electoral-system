import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ConfigService } from './config.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';

// DTOS
import { DTOElectionConfig } from './dtos/dto_election_config';


@Controller('config')
@UseGuards(ApiKeyGuard)
export class ConfigController {
  
  constructor(
    private readonly configService: ConfigService, 
    private readonly fabricService: FabricService
  ) {
    this.fabricService.connect();
  }
  

  @Get('/checkAuthorization')
  checkHealth(@Res() res: Response): object {
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  @Post('/setElectionConfig')
  setElectionConfig(@Body() electionConfig: DTOElectionConfig, @Res() res: Response): object {
    console.log('electionConfig', electionConfig)
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  @Get('/testInitLedger')
  async testInitLedger( @Res() res: Response): Promise<object> {
    // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
    const chaincode = 'channel1cc'
    const functionName = "InitLedger"
    const result = await this.fabricService.submitTransaction(chaincode, functionName)
    return res.status(200).json({ statusCode: 200, result: result });
  }
}
