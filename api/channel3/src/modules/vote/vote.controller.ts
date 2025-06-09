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

    // #0 antes de enviar, revisar que datos esten correctos

    // #1 llenar la urna
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "VoteContract:createVote"
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
 
}
