import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { PositionService } from './position.service';
import { DTOPosition } from './dtos/dto_position';
import { v4 as uuidv4 } from 'uuid';





@ApiHeader({
  name: 'auth',
  description: 'Api key token',
  required: true,
})
@Controller('position')
@UseGuards(ApiKeyGuard)
export class PositionController {
  
  constructor(
    private readonly positionService: PositionService, 
    private readonly fabricService: FabricService
  ) {
    this.fabricService.connect();
  }
  

  

  @Post('/createPosition')
  @ApiOperation({ summary: 'Creates a new position' })
  async createPosition(@Body() position: DTOPosition, @Res() res: Response): Promise<object> {
    const chaincode = 'channel1cc'
    const functionName = "PositionContract:createPosition"
    const internalUID: string = uuidv4();
    const result = await this.fabricService.submitTransaction(
      chaincode,
      functionName,
      internalUID,// position ID
      JSON.stringify({
        externalUID: position.positionID,
        positionName: position.positionName,
        positionVacancies: position.vacancies,
        tiebreaker: position.tiebreakerConfig
      })
      
    )
    return res.status(201).json({ statusCode: 201, message: 'success' });
  }


  
}
