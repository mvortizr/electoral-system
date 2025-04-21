import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ResultService } from './result.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { DTOVotePagination } from './dtos/dto_get_all_votes';

// DTOS
// cambiar a vote registry 

@ApiHeader({
  name: 'auth',
  description: 'Api key token',
  required: true,
})
@Controller('results')
@UseGuards(ApiKeyGuard)
export class ResultController {
  
  constructor(
    private readonly resultService: ResultService, 
    private readonly fabricService: FabricService
  ) {
    this.fabricService.connect();
  }

  //get all votes paginated
  @Post('/getAllVotes') 
  @ApiOperation({ summary: 'Get all votes paginated' })
  async readCandidates(@Body() queryParams: DTOVotePagination, @Res() res: Response): Promise<object> {
      // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
      const chaincode = process.env.CHAINCODE_NAME!.toString()
      const functionName = "ResultContract:queryVotesWithPagination"
      const params = JSON.stringify({
          pageSize: queryParams.pageSize,
          bookmark: queryParams.bookmark
      })
      const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
      return res.status(200).json({ statusCode: 200, result: result });
  }

 
}
