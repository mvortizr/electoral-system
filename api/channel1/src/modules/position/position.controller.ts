import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { PositionService } from './position.service';
import { DTOPosition } from './dtos/dto_position';
import { v4 as uuidv4 } from 'uuid';
import { TiebreakerConfigItem } from './dtos/tiebreaker';
import { DTOPositionPagination } from './dtos/dto_position_pagination';
import { DTOPositionByExtID } from './dtos/dto_position_by_id';




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
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "PositionContract:createPosition"
    const internalUID: string = uuidv4();

    if (position.tiebreakerConfig != null){
      let areUniqueIDTiebreakers = this.positionService.checkUniqueTiebreakers(position.tiebreakerConfig)
      if (!areUniqueIDTiebreakers) {
        return res.status(400).json({ statusCode: 400, error: "error repeated tiebreaker ID in position" });
      }
      position.tiebreakerConfig = this.positionService.processTieBreaker(position.tiebreakerConfig)
    }
    
    const result = await this.fabricService.submitTransaction(
      chaincode,
      functionName,
      internalUID,// position ID
      JSON.stringify({
        positionExternalID: position.positionID,
        positionName: position.positionName,
        positionVacancies: position.vacancies,
        tiebreaker: position.tiebreakerConfig
      })
      
    )

    let parsedResults = new TextDecoder().decode(result);
        let finalResult  = JSON.parse(parsedResults);

        if (finalResult.success) {
            return res.status(201).json({ statusCode: 201, ...finalResult });
        } else {
            return res.status(400).json({ statusCode: 400, ...finalResult });
        }
  }

  @Post('/createPositionBatch')
  @ApiOperation({ summary: 'Creates positions in batch, swagger doesnt pick it up but receives a positions array' })
  async createPositionBatch(@Body() positions: DTOPosition[], @Res() res: Response): Promise<object> {
    const chaincode = process.env.CHAINCODE_NAME!.toString();
    const functionName = "PositionContract:createPositionsBatch";
    
    // Process each position in the array
    const positionsArray = positions.map(position => {
      const internalUID: string = uuidv4();

      if (position.tiebreakerConfig != null) {
        let areUniqueIDTiebreakers = this.positionService.checkUniqueTiebreakers(position.tiebreakerConfig)
        if (!areUniqueIDTiebreakers) {
          return res.status(400).json({ statusCode: 400, error: `error repeated tiebreaker ID in position ${position.positionID}` });
        }
        position.tiebreakerConfig = this.positionService.processTieBreaker(position.tiebreakerConfig);
      }

      return {
          positionID: internalUID, // Unique ID for each position
          positionExternalID: position.positionID,
          positionName: position.positionName,
          positionVacancies: position.vacancies,
          tiebreaker: position.tiebreakerConfig
      };
    });

    // Call the chaincode to create multiple positions
    const result = await this.fabricService.submitTransaction(
      chaincode,
      functionName,
      JSON.stringify(positionsArray) // Send the array as a JSON string
    );

    let parsedResults = new TextDecoder().decode(result);
    let finalResult  = JSON.parse(parsedResults);

    if (finalResult.success) {
        return res.status(201).json({ statusCode: 201, ...finalResult });
    } else {
        return res.status(400).json({ statusCode: 400, ...finalResult });
    }
  }

  @Post('/getPositions') 
  @ApiOperation({ summary: 'Get all positions paginated' })
  async readPositions(@Body() queryParams: DTOPositionPagination, @Res() res: Response): Promise<object> {
    // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "PositionContract:queryPositionsWithPagination"
    const params = JSON.stringify({
      pageSize: queryParams.pageSize,
      bookmark: queryParams.bookmark
    })
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
    return res.status(200).json({ statusCode: 200, result: result });
  }

  @Post('/getPositionByExtID') 
  @ApiOperation({ summary: 'Get a position by ID' })
  async readPositionByExternalID(@Body() queryParams: DTOPositionByExtID, @Res() res: Response): Promise<object> {
    // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
    const chaincode = process.env.CHAINCODE_NAME!.toString()
    const functionName = "PositionContract:queryPositionByExternalID"
    const params = queryParams.queryID
    const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
    return res.status(200).json({ statusCode: 200, result: result });
  }


  
}
