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
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://support-saas-two.vercel.app', // ✅ Vercel frontend
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
