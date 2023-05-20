import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // in thought of security in case of user provide extra property like "admin: true"
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
