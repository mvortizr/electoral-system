import { Module } from '@nestjs/common';
import { FabricService } from 'src/fabric/fabric.service';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';

@Module({
  imports: [],
  controllers: [CandidateController],
  providers: [CandidateService, FabricService],
})
export class CandidateModule {}