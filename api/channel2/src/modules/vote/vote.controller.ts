import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { VoteService } from './vote.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { VoteInfoDTO } from './dtos/dto_vote_info';
import { v4 as uuidv4 } from 'uuid';

// DTOS


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
  @ApiOperation({ summary: "Let's user vote for a candidate" })
  async setVote(@Body() voteInfo: VoteInfoDTO, @Res() res: Response): Promise<object> {
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "VoteRegistryContract:createVoteRegistry"
    const internalRegistryUID: string = uuidv4();


    // #1 escribir en el cuaderno de votacion
    const result = await this.fabricService.submitTransaction(
      chaincode,
      functionName,
      internalRegistryUID,
      voteInfo.electorID,
      voteInfo.postulationID
    )

    // #2 guardar el registro del voto (API #3 llamada)


    return res.status(200).json({ statusCode: 200, message: 'success' });
  }


 
}
