import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const config = new DocumentBuilder()
    .setTitle("PickMe API")
    .setDescription("The documentation for PickMe APi")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type:"http",
        scheme: "bearer",
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs/swagger', app, documentFactory)

    app.setGlobalPrefix('api/v2')
    app.useGlobalPipes(new ValidationPipe())
    app.use(cookieParser())
    app.enableCors({
      origin: 'http://localhost:8080',
      methods:  'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      optionsSuccessStatus: 204,
    })

    await app.listen(8080)
}

bootstrap();
