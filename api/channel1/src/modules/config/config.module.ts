import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  imports: [],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
