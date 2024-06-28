import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'; // helmet helps by setting http headers and security
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true
  });
  
  app.enableCors({
    origin: '*', // TODO: replace
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST'],
  });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe())


  await app.listen(3000);

}
bootstrap();
