import { Module } from '@nestjs/common';
// import { ConfigController } from './config.controller';
// import { ConfigService } from './config.service';
import { FabricService } from 'src/fabric/fabric.service';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';

@Module({
  imports: [],
  controllers: [PositionController],
  providers: [PositionService, FabricService],
})
export class PositionModule {}
