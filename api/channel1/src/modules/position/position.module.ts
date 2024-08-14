import { Module } from '@nestjs/common';
import { FabricService } from 'src/fabric/fabric.service';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';

@Module({
  imports: [],
  controllers: [PositionController],
  providers: [PositionService, FabricService],
})
export class PositionModule {}
