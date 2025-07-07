import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { VoteService } from './vote.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { storeVoteDTO } from './dtos/storeVoteDTO';
import { stringify } from 'querystring';

@ApiHeader({
  name: 'auth',
  description: 'Api key token',
  required: true,
})
@Controller('vote')
@UseGuards(ApiKeyGuard)
export class VoteController {
  
  constructor(
    private readonly voteService: VoteService, 
    private readonly fabricService: FabricService
  ) {
    this.fabricService.connect();
  }

  
  @Post('/register')
  @ApiOperation({ summary: "Lets user vote for a candidate" })
  async setVote(@Body() vote: storeVoteDTO, @Res() res: Response): Promise<object> {

    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "VoteResultContract:createVote"
    const internalRegistryUID: string = uuidv4();

  
    
    const result = await this.fabricService.submitTransaction(
      chaincode,
      functionName,
      internalRegistryUID,
      JSON.stringify({...vote})
    )

    
    let parsedResults = new TextDecoder().decode(result);
    let finalResult  = JSON.parse(parsedResults);
  
    if (!(finalResult.success)) {
      return res.status(400).json({ statusCode: 400, ...finalResult });
    } 
    return res.status(201).json({ statusCode: 201, message: 'vote saved correctly', success: true });
  
  }

  @Get('/general_results')
  @ApiOperation({ summary: 'Returns general voting results grouped by position' })
  async getGeneralResults(@Res() res: Response): Promise<any> {
    const chaincode = process.env.CHAINCODE_NAME!.toString();
    const functionName = 'VoteResultContract:getFinalResult';
  
    try {
      const resultBuffer = await this.fabricService.evaluateTransaction(chaincode, functionName);
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
          Party: info.partyName ?? 'None',
          Candidate: info.candidateFullName,
          totalVotes,
          partyID: info.partyID ?? 'None',
          partyExtID: info.partyExtID ?? 'None',
          candidateID: info.candidateID,
          candidateExtID: info.candidateExtID,
          postulationID: info.postulationID ?? 'None',
          postulationExtID: info.postulationExtID ?? 'None',
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
