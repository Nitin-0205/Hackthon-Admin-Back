import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    // whitelist: true,
    // transform: true,
    // forbidNonWhitelisted: true,
    })
  );
  const documentOptions = new DocumentBuilder()

    .setTitle('Participant API')
    .setDescription('The Participant API description')
    .setVersion('1.0')
    .addTag('Participant')
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
