import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔒 Global validation (VERY GOOD PRACTICE)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🌐 CORS (safe for local + production)
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:3001'],
    credentials: true,
  });

  // 🪵 Structured HTTP logging
  app.use(
    pinoHttp({
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
              },
            }
          : undefined,
    }),
  );

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  Logger.log(`🚀 Backend running on port ${port}`);
}

bootstrap();
