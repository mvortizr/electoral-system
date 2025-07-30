import { Controller, Get, Res, UseGuards, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { ElectorService } from './elector.service';
import { ElectorDTO } from './dtos/elector_dto';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { ElectorPaginationDTO } from './dtos/elector_pagination_dto';
import { DTOElectorByExtID } from './dtos/elector_by_ext_id_dto';
import { ElectorPreVoteValidationDTO } from './dtos/elector_validation_dto';
import { SuperAdminService } from 'src/fabric/superadmin.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from 'class-validator';



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
        private readonly fabricService: FabricService,
        private superAdminService: SuperAdminService
        
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
      let parsedResults = new TextDecoder().decode(result);
      let finalResult  = JSON.parse(parsedResults);

      if (finalResult.success) {
          return res.status(201).json({ statusCode: 201, ...finalResult });
      } else {
          return res.status(400).json({ statusCode: 400, ...finalResult });
      }
    }


    @Post('/createElectorBatch')
    @ApiOperation({ summary: 'Creates batch of electors' })
    async createElectorBatch(@Body() electors: ElectorDTO[], @Res() res: Response): Promise<object> {
      const chaincode = process.env.CHAINCODE_NAME!.toString();
      const functionName = "ElectorsContract:createElectorsBatch";

      const areUnique: boolean = this.electorService.checkUniqueElectorIDs(electors)
      if (!areUnique) {
          return res.status(400).json({ statusCode: 400,  error: "elector ids in the array aren't unique " });
      }
      
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
      let parsedResults = new TextDecoder().decode(result);
      let finalResult  = JSON.parse(parsedResults);

      if (finalResult.success) {
          return res.status(201).json({ statusCode: 201, ...finalResult });
      } else {
          return res.status(400).json({ statusCode: 400, ...finalResult });
      }
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

    @Post('/validatePreVoteElector')
    async validateElector(@Body() electorValidationData: ElectorPreVoteValidationDTO, @Res() res: Response): Promise<object> {
      const chaincode = process.env.CHAINCODE_NAME!.toString()
      const functionName = "ElectorsContract:checkVotingRequirements"
     
      
      const result = await this.fabricService.submitTransaction(
        chaincode,
        functionName,
        electorValidationData.electorID,
        electorValidationData.postulationID,
        electorValidationData.candidateID    
      )
      let parsedResults = new TextDecoder().decode(result);
      let finalResult  = JSON.parse(parsedResults);

      if (finalResult.success) {
          return res.status(201).json({ statusCode: 201, ...finalResult });
      } else {
          return res.status(400).json({ statusCode: 400, ...finalResult });
      }

    } 
    
    /// Elector impugnation
    @Post('/createImpugnatedElector')
    @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'certFile', maxCount: 1 },
        { name: 'keyFile', maxCount: 1 },
      ]),
    )
    async createElectorWithFiles(
      @UploadedFiles()
      files: { certFile?: Express.Multer.File[]; keyFile?: Express.Multer.File[] },
      @Body('data') data: string,
      @Res() res: Response,
    ) {
      try {
        //  Handle missing files
        const certFile = files.certFile?.[0];
        const keyFile = files.keyFile?.[0];
  
        if (!certFile || !keyFile) {
          return res
            .status(400)
            .json({ success: false, message: 'Both certFile and keyFile are required.' });
        }
  
        //  Parse and validate JSON body
        const parsedData = JSON.parse(data);
        const electorInstance = plainToInstance(ElectorDTO, parsedData);
        const errors = await validate(electorInstance);
  
        if (errors.length > 0) {
          const formattedErrors = errors.map((error: ValidationError) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
          }));
        
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
          });
        }
  
        // Extract PEM contents
        const certPem = certFile.buffer.toString('utf-8');
        const keyPem = keyFile.buffer.toString('utf-8');
  
        // Submit to chaincode
        const chaincode = process.env.CHAINCODE_NAME!.toString();
        const functionName = 'ElectorsContract:createImpugnatedElector';
        const internalUID: string = uuidv4();
  
        const { electorID, ...restOfElectorData } = parsedData;

        const resultBuffer = await this.superAdminService.submitTransaction(
          keyPem,
          certPem,
          chaincode,
          functionName,
          internalUID,
          JSON.stringify({
            electorExternalID: electorID,
            ...restOfElectorData,
          }),
        );
  
        const parsedResult = new TextDecoder().decode(resultBuffer);
        const finalResult = JSON.parse(parsedResult);
  
        if (!finalResult.success) {
          return res.status(400).json({ statusCode: 400, ...finalResult });
        }
  
        return res.status(201).json({ statusCode: 201, ...finalResult });
      } catch (err) {
        return res.status(500).json({ success: false, error: err });
      }
    }

    @Post('/getImpugnatedElectors')
    @ApiOperation({ summary: 'Get impugnated electors paginated' })
    async readImpugnatedElectors(@Body() queryParams: ElectorPaginationDTO, @Res() res: Response): Promise<object> {
        const chaincode = process.env.CHAINCODE_NAME!.toString();
        const functionName = "ElectorsContract:queryImpugnatedElectorsWithPagination";

        const params = JSON.stringify({
            pageSize: queryParams.pageSize,
            bookmark: queryParams.bookmark
        });

        const result = await this.fabricService.evaluateTransaction(chaincode, functionName, params);

        return res.status(200).json({ statusCode: 200, result: result });
    }

}