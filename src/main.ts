import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { CustomLogger } from './custom.logger';

async function bootstrap() {
  const dbFileName = 'inventoryControl.sqlite';
  if (existsSync(dbFileName)) unlinkSync(dbFileName);

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', process.env.FRONT_URL],
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useLogger(app.get(CustomLogger));

  await app.listen(process.env.PORT ?? 8000, );
}
bootstrap();
