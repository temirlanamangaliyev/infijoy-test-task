import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieSession({ keys: ['testKeys'] }));
  app.useGlobalPipes(
    new ValidationPipe({
      // in thought of security in case of user provide extra property like "admin: true"
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
