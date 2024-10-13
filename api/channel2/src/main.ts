import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'; // helmet helps by setting http headers and security
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API 1. Electoral Roll')
    .setDescription('Endpoints for the electoral roll channel')
    .setVersion('1.4')
    // .addTag('Development')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  
  app.enableCors({
    origin: '*', 
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST'],
  });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000);

}
bootstrap();
