import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  // rawBody: Stripe firma el cuerpo original del aviso de pago; hay que conservarlo para validarlo.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const configService = app.get(ConfigService);

  const frontendUrl = configService.get('FRONTEND_URL');
  const nodeEnv = configService.get('NODE_ENV') || 'development';
  
  app.enableCors({
    origin: nodeEnv === 'production' 
      ? true // Allow all origins in production
      : frontendUrl || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Si existe el formulario ya construido (web/dist), esta misma app lo entrega.
  // Así un solo sitio Node.js (p. ej. Hostinger) sirve formulario + API. Con Docker no se usa (nginx lo hace).
  const webDist = join(__dirname, '..', 'web', 'dist');
  if (existsSync(join(webDist, 'index.html'))) {
    app.useStaticAssets(webDist, { index: false });
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(join(webDist, 'index.html'));
      }
      next();
    });
    logger.log('🖥️  Serving web frontend from web/dist');
  }

  const port = configService.get('PORT') || 3000;
  
  await app.listen(port);
  
  logger.log(`🚀 Camp API started successfully`);
  logger.log(`📍 Server running on port ${port}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
  logger.log(`🔗 API endpoint: http://localhost:${port}/api`);
  logger.log(`📊 Frontend URL: ${configService.get('FRONTEND_URL') || 'http://localhost:5173'}`);
}

bootstrap();
