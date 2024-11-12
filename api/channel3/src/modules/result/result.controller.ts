import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { ResultService } from './result.service';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

// DTOS
// cambiar a vote registry 


@ApiHeader({
  name: 'auth',
  description: 'Api key token',
  required: true,
})
@Controller('result')
@UseGuards(ApiKeyGuard)
export class ResultController {
  
  constructor(
    private readonly resultService: ResultService, 
    private readonly fabricService: FabricService
  ) {
    this.fabricService.connect();
  }



 
}
