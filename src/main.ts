import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';

async function bootstrap() {
  const dbFileName = 'inventoryControl.sqlite';
  if (existsSync(dbFileName)) unlinkSync(dbFileName);

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  })
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
