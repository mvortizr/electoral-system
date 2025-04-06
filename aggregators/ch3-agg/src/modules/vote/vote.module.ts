import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { FabricService } from 'src/fabric/fabric.service';

@Module({
  imports: [],
  controllers: [VoteController],
  providers: [VoteService, FabricService],
})
export class VoteModule {}
