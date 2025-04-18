"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        snapshot: true
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('API 1. Electoral Roll')
        .setDescription('Endpoints for the electoral roll channel')
        .setVersion('1.4')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.enableCors({
        origin: '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST'],
    });
    app.use((0, helmet_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map