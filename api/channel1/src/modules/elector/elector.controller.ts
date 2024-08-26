import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { ElectorService } from './elector.service';
import { ElectorDTO } from './dtos/elector_dto';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { ElectorPaginationDTO } from './dtos/elector_pagination_dto';
import { DTOElectorByExtID } from './dtos/elector_by_ext_id_dto';

@ApiHeader({
    name: 'auth',
    description: 'Api key token',
    required: true,
  })
  @Controller('elector')
  @UseGuards(ApiKeyGuard)
  export class ElectorController {
    constructor(
        private readonly electorService: ElectorService, 
        private readonly fabricService: FabricService
    ) {
        this.fabricService.connect();
    }

    @Post('/createElector')
    @ApiOperation({ summary: 'Creates a new elector' })
    async createElector(@Body() elector: ElectorDTO, @Res() res: Response): Promise<object> {
      
    const chaincode = process.env.CHAINCODE_NAME!.toString()
      const functionName = "ElectorsContract:createElector"
      const internalUID: string = uuidv4();
  
      const { electorID, ...data} = elector
      
      const result = await this.fabricService.submitTransaction(
        chaincode,
        functionName,
        internalUID,// position ID
        JSON.stringify({
          electorExternalID: elector.electorID,
          ...data
        })
        
      )
      return res.status(201).json({ statusCode: 201, message: 'success' });
    }


    @Post('/createElectorBatch')
    @ApiOperation({ summary: 'Creates batch of electors' })
    async createElectorBatch(@Body() electors: ElectorDTO[], @Res() res: Response): Promise<object> {
      const chaincode = process.env.CHAINCODE_NAME!.toString();
      const functionName = "ElectorsContract:createElectorsBatch";
      
      // Process each position in the array
      const electorsArray = electors.map(elector => {
        const internalUID: string = uuidv4();
        const { electorID, ...electorData} = elector
  
        
        return {
            electorID: internalUID, // Unique ID for each position
            electorExternalID: elector.electorID,
            ...electorData
        };
      });
  
      // Call the chaincode to create multiple positions
      const result = await this.fabricService.submitTransaction(
        chaincode,
        functionName,
        JSON.stringify(electorsArray) // Send the array as a JSON string
      );
      return res.status(201).json({ statusCode: 201, message: 'success' });
    }

    @Post('/getElectors') 
    @ApiOperation({ summary: 'Get all electors paginated' })
    async readElectors(@Body() queryParams: ElectorPaginationDTO, @Res() res: Response): Promise<object> {
        // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "ElectorsContract:queryElectorsWithPagination"
        const params = JSON.stringify({
            pageSize: queryParams.pageSize,
            bookmark: queryParams.bookmark
        })
        const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
        return res.status(200).json({ statusCode: 200, result: result });
    }

    @Post('/getElectorByExtID') 
    @ApiOperation({ summary: 'Get an candidate by external ID' })
    async readPositionByExternalID(@Body() queryParams: DTOElectorByExtID, @Res() res: Response): Promise<object> {
        // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "ElectorsContract:queryElectorsByExternalID"
        const params = queryParams.queryID
        const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
        return res.status(200).json({ statusCode: 200, result: result });
    }



}