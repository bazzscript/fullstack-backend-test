import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-decorator properties
      forbidNonWhitelisted: true, // Throw error on non-decorator properties
      transform: true, // Automatically transform payloads to DTOs
    }),
  );

  await app.listen(process.env.PORT ?? 5005);
}
bootstrap();
