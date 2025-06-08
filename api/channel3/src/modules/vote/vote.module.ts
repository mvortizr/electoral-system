import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { FabricService } from 'src/fabric/fabric.service';
import { SuperAdminService } from 'src/fabric/superadmin.service';

@Module({
  imports: [],
  controllers: [VoteController],
  providers: [VoteService, FabricService, SuperAdminService],
})
export class VoteModule {}
