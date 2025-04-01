import { Module } from '@nestjs/common';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { FabricService } from 'src/fabric/fabric.service';

@Module({
  imports: [],
  controllers: [ResultController],
  providers: [ResultService, FabricService],
})
export class ResultModule {}
