import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!process.env.ALLOWED_ORIGINS) {
    throw new Error('ALLOWED_ORIGINS environment variable is required for CORS configuration');
  }
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
