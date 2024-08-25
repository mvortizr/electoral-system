import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';
import { ApiKeyGuard } from 'src/middleware/auth.middleware';
import { FabricService } from '../../fabric/fabric.service';
import { ApiHeader, ApiOperation} from '@nestjs/swagger';
import { ElectorService } from './elector.service';


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


}