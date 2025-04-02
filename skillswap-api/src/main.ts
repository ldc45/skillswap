import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Utilisation du middleware cookie-parser
  app.use(cookieParser());

  // Determine allowed origins
  let allowedOrigins: string[] = [];
  if (process.env.NODE_ENV === 'production') {
    // In production, use ALLOWED_ORIGINS
    if (process.env.ALLOWED_ORIGINS) {
      allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    }
  } else {
    // In development, use localhost
    allowedOrigins = [
      'http://localhost:3000',
      'http://frontend:3000',
      'http://127.0.0.1:3000',
    ];
  }
  // CORS configuration with explicit types
  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (Postman/Curl)
      if (!origin) {
        callback(null, true);
        return;
      }
      // Check if origin is in the allowed list
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked origin: ${origin}`);
        callback(new Error('Origin not allowed'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permet l'envoi de cookies
    exposedHeaders: ['Set-Cookie'], // Permet d'exposer les en-têtes Set-Cookie au frontend
  };
  app.enableCors(corsOptions);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
