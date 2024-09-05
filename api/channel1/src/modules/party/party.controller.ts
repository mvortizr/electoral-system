import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { PartyService } from './party.service';
import { DTOParty } from './dtos/dto_party';
import { v4 as uuidv4 } from 'uuid';
import { DTOPartyPagination } from './dtos/dto_parties_pagination';
import { DTOPartyByExtID } from './dtos/dto_party_by_id';

@ApiHeader({
    name: 'auth',
    description: 'Api key token',
    required: true,
  })
  @Controller('party')
  @UseGuards(ApiKeyGuard)
  export class PartyController {
    constructor(
        private readonly partyService: PartyService, 
        private readonly fabricService: FabricService
    ) {
        this.fabricService.connect();
    }

    @Post('/createParty')
    @ApiOperation({ summary: 'Creates a new party' })
    async createParty(@Body() party: DTOParty, @Res() res: Response): Promise<object> {
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "PartiesContract:createParty"
        const internalUID: string = uuidv4();

        const result = await this.fabricService.submitTransaction(
            chaincode,
            functionName,
            internalUID,// party ID
            JSON.stringify(
                {
                    partyExternalID: party.partyID,
                    partyName: party.partyName
                }
            )
          )

        let parsedResults = new TextDecoder().decode(result);
        let finalResult  = JSON.parse(parsedResults);

        if (finalResult.success) {
            return res.status(201).json({ statusCode: 201, ...finalResult });
        } else {
            return res.status(400).json({ statusCode: 400, ...finalResult });
        }
        
    }

    @Post('/createPartyBatch')
    @ApiOperation({ summary: 'Creates a batch of parties, receives an array of parties but swagger didnt pick it up' })
    async createPartyBatch(@Body() parties: DTOParty[], @Res() res: Response): Promise<object> {
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "PartiesContract:createPartyBatch"

        const partyBatchArray = parties.map( party => {
            const internalUID: string = uuidv4();

            return {
                partyID: internalUID,
                partyExternalID: party.partyID,
                partyName: party.partyName
            }

        })
        
        
        const result = await this.fabricService.submitTransaction(
            chaincode,
            functionName,
            JSON.stringify(partyBatchArray)
        )

        return res.status(201).json({ statusCode: 201, success: true });
    }

    @Post('/getParties') 
    @ApiOperation({ summary: 'Get all parties paginated' })
    async readPositions(@Body() queryParams: DTOPartyPagination, @Res() res: Response): Promise<object> {
        // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "PartiesContract:queryPartiesWithPagination"
        const params = JSON.stringify({
        pageSize: queryParams.pageSize,
        bookmark: queryParams.bookmark
        })
        const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
        return res.status(200).json({ statusCode: 200, result: result });
    }

    @Post('/getPartyByExtID') 
    @ApiOperation({ summary: 'Get a party by ID' })
    async readPositionByExternalID(@Body() queryParams: DTOPartyByExtID, @Res() res: Response): Promise<object> {
        // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "PartiesContract:queryPartyByExternalID"
        const params = queryParams.queryID
        const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
        return res.status(200).json({ statusCode: 200, result: result });
    }



}