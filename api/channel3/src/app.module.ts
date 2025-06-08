import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { FabricService } from './fabric/fabric.service';
import { VoteModule } from './modules/vote/vote.module';
import { ResultModule } from './modules/result/result.module';
import { SuperAdminService } from './fabric/superadmin.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal:true
    }),
    VoteModule,
    ResultModule
  ],
  controllers: [AppController],
  providers: [AppService, FabricService, SuperAdminService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
