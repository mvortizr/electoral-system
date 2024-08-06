import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ConfigService } from './config.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation, ApiBearerAuth} from '@nestjs/swagger';

// DTOS
import { DTOElectionConfig } from './dtos/dto_election_config';

@ApiHeader({
  name: 'auth',
  description: 'Api key token',
  required: true,
})
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
  @ApiOperation({ summary: 'Checks if the API key is properly sent to the api' })
  checkHealth(@Res() res: Response): object {
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  @Get('/checkChannelConnection')
  @ApiOperation({ summary: 'Checks if the API key is properly communicating with the chaincode' })
  async checkChannelConnection(@Res() res: Response): Promise<object> {
    const chaincode = 'channel1cc'
    const functionName = "ElectionConfigContract:testConnection"
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName)
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  @Post('/setElectionConfig')
  @ApiOperation({ summary: 'Sets election configuration' })
  async setElectionConfig(@Body() electionConfig: DTOElectionConfig, @Res() res: Response): Promise<object> {
    const chaincode = 'channel1cc'
    const functionName = "ElectionConfigContract:setElectionConfig"
    const result = await this.fabricService.submitTransaction(
      chaincode,
      functionName,
      electionConfig.parties.toString(),
      electionConfig.positions.toString(),
      electionConfig.candidates.toString(),
      electionConfig.electors.toString()) 
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }


  @Get('/readAllAssets') /// DEBUG ONLY
  @ApiOperation({ summary: '(DEBUG ONLY) Dumps every data inside the channel unordered' })
  async readAllAssets( @Res() res: Response): Promise<object> {
    // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
    const chaincode = 'channel1cc'
    const functionName = "readEntireElectoralChannel"
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName)
    return res.status(200).json({ statusCode: 200, result: result });
  }
}
