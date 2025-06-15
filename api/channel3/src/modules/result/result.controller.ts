import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ResultService } from './result.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

// DTOS
// cambiar a vote registry 


@ApiHeader({
  name: 'auth',
  description: 'Api key token',
  required: true,
})
@Controller('result')
@UseGuards(ApiKeyGuard)
export class ResultController {
  
  constructor(
    private readonly resultService: ResultService, 
    private readonly fabricService: FabricService
  ) {
    this.fabricService.connect();
  }

  @Get('/readAllAssets') /// DEBUG ONLY
  @ApiOperation({ summary: '(DEBUG ONLY) Dumps every data inside the channel unordered' })
  async readAllAssets( @Res() res: Response): Promise<object> {
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "readEntireElectoralChannel"
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName)
    return res.status(200).json({ statusCode: 200, result: result });
  }
 
}
