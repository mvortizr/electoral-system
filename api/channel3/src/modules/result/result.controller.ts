import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ResultService } from './result.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { DTOPagination } from './dtos/dto_pagination';

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

  @Post('/precount')
  @ApiOperation({ summary: 'Trigger vote precount (every 500 entries)' })
  async makePrecount(@Res() res: Response): Promise<object> {
    const chaincode = process.env.CHAINCODE_NAME!.toString();
    const functionName = 'VoteResultContract:makeVotePrecount';

    const result = await this.fabricService.submitTransaction(chaincode, functionName);

    const parsedResults = new TextDecoder().decode(result);
    const finalResult = JSON.parse(parsedResults);

    if (!finalResult.success) {
      return res.status(400).json({ statusCode: 400, ...finalResult });
    }

    return res.status(200).json({ statusCode: 200, ...finalResult });
  }

  @Post('/final_count')
  @ApiOperation({ summary: 'Aggregate all precounts into a final result' })
    async finalCount(@Res() res: Response): Promise<object> {
    const chaincode = process.env.CHAINCODE_NAME!.toString();
    const functionName = 'VoteResultContract:makeFinalVoteCount';

    const result = await this.fabricService.submitTransaction(chaincode, functionName);

    const parsedResults = new TextDecoder().decode(result);
    const finalResult = JSON.parse(parsedResults);

    if (!finalResult.success) {
      return res.status(400).json({ statusCode: 400, ...finalResult });
    }

    return res.status(200).json({ statusCode: 200, ...finalResult });
  }

  @Get('/readAllAssets') /// DEBUG ONLY
  @ApiOperation({ summary: '(DEBUG ONLY) Dumps every data inside the channel unordered' })
  async readAllAssets( @Res() res: Response): Promise<object> {
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "readEntireElectoralChannel"
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName)
    return res.status(200).json({ statusCode: 200, result: result });
  }

  @Post('/explore') 
  @ApiOperation({ summary: 'get all data inside the channel' })
  async explore(@Body() queryParams: DTOPagination, @Res() res: Response): Promise<object> {
    // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "ExplorerContract:getAllAssetsWithPagination"
    const params = JSON.stringify({
      pageSize: queryParams.pageSize,
      bookmark: queryParams.bookmark
    })
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
    return res.status(200).json({ statusCode: 200, result: result });
  }

  @Get('/general_results')
  @ApiOperation({ summary: 'Returns general voting results grouped by position' })
  async getGeneralResults(@Res() res: Response): Promise<any> {
    const chaincode = process.env.CHAINCODE_NAME!.toString();
    const functionName = 'VoteResultContract:getFinalResult';
  
    try {
      const resultBuffer = await this.fabricService.submitTransaction(chaincode, functionName);
      const decoded = new TextDecoder().decode(resultBuffer);
      const parsed = JSON.parse(decoded);
  
      if (!parsed.success) {
        return res.status(404).json({ statusCode: 404, message: 'No results found.' });
      }
  
      const rawResults = parsed.results;
      const groupedResults: Record<string, any> = {};
  
      for (const key of Object.keys(rawResults)) {
        const { info, totalVotes } = rawResults[key];
  
        const positionID = info.positionID;
        const positionExtID = info.positionExtID ?? 'unknown';
        const positionName = info.positionName ?? 'unknown';
  
        if (!groupedResults[positionID]) {
          groupedResults[positionID] = {
            positionID,
            positionExtID,
            positionName,
            results: [],
          };
        }
  
        groupedResults[positionID].results.push({
          party: info.partyName ?? 'None',
          candidate: info.candidateFullName,
          totalVotes,
          partyID: info.partyID ?? 'None',
          partyExtID: info.partyExtID ?? 'None',
          candidateID: info.candidateID,
          candidateExtID: info.candidateExtID,
          postulationID: info.postulationID ?? 'None',
          postulationExtID: info.postulationExtID ?? 'None'
        });
      }
  
      const finalOutput = Object.values(groupedResults);
  
      return res.status(200).json(finalOutput);
  
    } catch (error) {
      console.error('Error retrieving results:', error);
      return res.status(500).json({ statusCode: 500, message: 'Failed to get results'});
    }
  }
 
}
