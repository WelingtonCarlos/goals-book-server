import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Permitir apenas essa origem
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    credentials: true, // Permitir envio de cookies e headers de autenticação
  });

  await app.listen(3333);
}
bootstrap();
