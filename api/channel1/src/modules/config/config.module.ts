import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { FabricService } from 'src/fabric/fabric.service';

@Module({
  imports: [],
  controllers: [ConfigController],
  providers: [ConfigService, FabricService],
})
export class ConfigModule {}
