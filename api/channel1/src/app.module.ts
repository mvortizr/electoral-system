import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule as ConfigurationModule } from './modules/config/config.module';
import { ConfigModule } from '@nestjs/config';
import { FabricService } from './fabric/fabric.service';
import { PositionModule } from './modules/position/position.module';
import { PartyModule } from './modules/party/party.module';
import { ElectorModule } from './modules/elector/elector.module';
import { CandidateModule } from './modules/candidate/candidate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal:true
    }),
    ConfigurationModule,
    PositionModule,
    PartyModule,
    CandidateModule,
    ElectorModule
  ],
  controllers: [AppController],
  providers: [AppService, FabricService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
