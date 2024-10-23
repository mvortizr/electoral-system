import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { CandidateService } from './candidate.service';
import { CandidateDTO } from './dtos/dto_candidate';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { DTOCandidatePagination } from './dtos/dto_candidate_pagination';
import { DTOCandidateByExtID } from './dtos/dto_candidate_by_ext_id';


@ApiHeader({
    name: 'auth',
    description: 'Api key token',
    required: true,
  })
  @Controller('candidate')
  @UseGuards(ApiKeyGuard)
  export class CandidateController {
    constructor(
        private readonly candidateService: CandidateService, 
        private readonly fabricService: FabricService
    ) {
        this.fabricService.connect();
    }


    @Post('/createCandidate')
    @ApiOperation({ summary: 'Creates a new candidate' })
    async createCandidate(@Body() candidate: CandidateDTO, @Res() res: Response): Promise<object> {
      const chaincode = process.env.CHAINCODE_NAME!.toString()
      const functionName = "CandidatesContract:createCandidate"
      const internalUID: string = uuidv4();
  
      const { candidateID, ...data} = candidate

      if (candidate.postulations != null){
        candidate.postulations = this.candidateService.processPostulations(candidate.postulations)
      }
      
      const result = await this.fabricService.submitTransaction(
        chaincode,
        functionName,
        internalUID,// position ID
        JSON.stringify({
          candidateExternalID: candidate.candidateID,
          ...data
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

    @Post('/createCandidateBatch')
    @ApiOperation({ summary: 'Creates a candidate in batch' })
    async createCandidateBatch(@Body() candidates: CandidateDTO[], @Res() res: Response): Promise<object> {
      const chaincode = process.env.CHAINCODE_NAME!.toString();
      const functionName = "CandidatesContract:createCandidateBatch";
      
      // Process each position in the array
      const candidatesArray = candidates.map(candidate => {
        const internalUID: string = uuidv4();
        const { candidateID, ...candidateData} = candidate
  
        if (candidate.postulations != null){
            candidate.postulations = this.candidateService.processPostulations(candidate.postulations)
        } 
  
        return {
            candidateID: internalUID, // Unique ID for each position
            candidateExternalID: candidate.candidateID,
            ...candidateData
        };
      });
  
      // Call the chaincode to create multiple positions
      const result = await this.fabricService.submitTransaction(
        chaincode,
        functionName,
        JSON.stringify(candidatesArray) // Send the array as a JSON string
      );
      let parsedResults = new TextDecoder().decode(result);
      let finalResult  = JSON.parse(parsedResults);

      if (finalResult.success) {
          return res.status(201).json({ statusCode: 201, ...finalResult });
      } else {
          return res.status(400).json({ statusCode: 400, ...finalResult });
      }
    }

    @Post('/getCandidates') 
    @ApiOperation({ summary: 'Get all candidates paginated' })
    async readCandidates(@Body() queryParams: DTOCandidatePagination, @Res() res: Response): Promise<object> {
        // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "CandidatesContract:queryCandidatesWithPagination"
        const params = JSON.stringify({
            pageSize: queryParams.pageSize,
            bookmark: queryParams.bookmark
        })
        const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
        return res.status(200).json({ statusCode: 200, result: result });
    }

    @Post('/getCandidateByExtID') 
    @ApiOperation({ summary: 'Get a candidate by  external ID' })
    async readPositionByExternalID(@Body() queryParams: DTOCandidateByExtID, @Res() res: Response): Promise<object> {
        // async submitTransaction(chaincodeName: string, functionName: string, ...args: string[])
        const chaincode = process.env.CHAINCODE_NAME!.toString()
        const functionName = "CandidatesContract:queryCandidatesByExtID"
        const params = queryParams.queryID
        const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params)
        return res.status(200).json({ statusCode: 200, result: result });
    }

}