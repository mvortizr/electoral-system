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
  async setElectionConfig(@Body() electionConfig: DTOElectionConfig, @Res() res: Response): Promise<object> {
    const chaincode = 'channel1cc'
    const functionName = "setElectionConfig"
    const result = await this.fabricService.submitTransaction(
      chaincode,
      functionName,"1","2","3","4") ///ESTA FALLANDO
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  @Post('/createPosition') //MOVE AFTER k8S DONE
  async createPosition( @Res() res: Response): Promise<object> {
    const chaincode = 'channel1cc'
    const functionName = "createPosition"
    const result = await this.fabricService.submitTransaction(chaincode,functionName, "12345678910", "presidente")
   
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  @Get('/readAllAssets') /// DEBUG ONLY
  async readAllAssets( @Res() res: Response): Promise<object> {
    // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
    const chaincode = 'channel1cc'
    const functionName = "readEntireElectoralChannel"
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName)
    return res.status(200).json({ statusCode: 200, result: result });
  }
}
