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
    const LIVE_COUNT_URL = process.env.LIVE_COUNT_URL!;

    
    
    // save on channel 3
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


    // save on live counting cache
    //let dataToSend = JSON.stringify({...vote}) 
    // let dataToSend = { multiplier: vote.multiplier, positionID: vote.positionID, candidateID: vote.candidateID, partyID: vote.partyID }
    // const liveCountResponse = await this.voteService.postVoteOnLiveCount(`${LIVE_COUNT_URL}/votes`,dataToSend)

    // if (liveCountResponse.status !== 200 && liveCountResponse.status !== 201) {
    //   console.warn('Live count service responded with unexpected status', liveCountResponse.status);
    //   console.log('livecount',liveCountResponse)
    //   return res.status(207).json({
    //     statusCode: 207,
    //     message: 'Vote saved on chain, but live count update may have failed',
    //     success: true,
    //     liveCountStatus: liveCountResponse.status
    //   });
    // }
    
    return res.status(201).json({ statusCode: 201, message: 'vote saved correctly', success: true });
  
  }
  
 
}
