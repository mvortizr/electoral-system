import { Module } from '@nestjs/common';
import { FabricService } from 'src/fabric/fabric.service';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';



@Module({
  imports: [],
  controllers: [PartyController],
  providers: [PartyService, FabricService],
})
export class PartyModule {}