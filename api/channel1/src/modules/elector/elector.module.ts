import { Module } from '@nestjs/common';
import { FabricService } from 'src/fabric/fabric.service';
import { ElectorController } from './elector.controller';
import { ElectorService } from './elector.service';
import { SuperAdminService } from 'src/fabric/superadmin.service';




@Module({
  imports: [],
  controllers: [ElectorController],
  providers: [ElectorService, FabricService, SuperAdminService],
})
export class ElectorModule {}