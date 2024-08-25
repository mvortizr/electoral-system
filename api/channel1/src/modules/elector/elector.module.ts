import { Module } from '@nestjs/common';
import { FabricService } from 'src/fabric/fabric.service';
import { ElectorController } from './elector.controller';
import { ElectorService } from './elector.service';




@Module({
  imports: [],
  controllers: [ElectorController],
  providers: [ElectorService, FabricService],
})
export class ElectorModule {}