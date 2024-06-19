import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'; // helmet helps by setting http headers and security

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*', // TODO: replace
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST'],
  });

  app.use(helmet());


  await app.listen(3000);

}
bootstrap();
