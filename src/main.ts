import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://finuchenie.online',
      'http://localhost:8000',
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
