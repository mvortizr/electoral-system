import { Controller, Get, Res, UseGuards, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { Response } from 'express';
import { LifecycleService } from './lifecycle.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SuperAdminService } from 'src/fabric/superadmin.service';


@ApiHeader({
  name: 'auth',
  description: 'Api key token',
  required: true,
})
@Controller('lifecycle')
@UseGuards(ApiKeyGuard)
export class LifecycleController {
  
  constructor(
    private superAdminService: SuperAdminService
  ) {
    
  }

  @Post('/open')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certFile', maxCount: 1 },
      { name: 'keyFile', maxCount: 1 },
    ])
  )
  async handleVote(
    @UploadedFiles()
    files: { certFile?: Express.Multer.File[]; keyFile?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    try {
      const certFile = files.certFile?.[0];
      const keyFile = files.keyFile?.[0];

      if (!certFile || !keyFile) {
        return res.status(400).json({ success: false, message: 'Both certFile and keyFile are required.' });
      }

      const certPem = certFile.buffer.toString('utf-8');
      const keyPem = keyFile.buffer.toString('utf-8');

      //TODO: REPLACE

      const chaincode = process.env.CHAINCODE_NAME!.toString()
      const functionName = "LifecycleContract:requestOpening"

      console.log(`call done`);
     

      const resultBuffer = await this.superAdminService.submitTransaction(
        keyPem,
        certPem,
        chaincode,
        functionName,
        ""
      );

      const parsedResult = new TextDecoder().decode(resultBuffer);
      const finalResult = JSON.parse(parsedResult);

      console.log('final result', finalResult);

      if (!finalResult.success) {
        return res.status(400).json({ statusCode: 400, ...finalResult });
      }

      return res.status(200).json({
        statusCode: 200,
        message: 'Opening request made successfully',
        success: true,
        data: finalResult,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  }



 
}
