import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

/** Primer archivo que exista de una lista de rutas posibles (con hosting o con Docker cambia la ubicación). */
function firstExisting(...paths: string[]): string | undefined {
  return paths.find((p) => existsSync(p));
}

/** Preparación opcional al arrancar (hosting sin terminal): crear tablas y administrador. Nunca tumba la app. */
function runStartupTasks(logger: Logger) {
  const root = join(__dirname, '..');

  if (process.env.AUTO_DB_PUSH === 'true') {
    try {
      const schema = firstExisting(
        join(__dirname, 'prisma', 'schema.prisma'),
        join(root, 'prisma', 'schema.prisma'),
      );
      if (!schema) throw new Error('No se encontró prisma/schema.prisma');
      logger.log('Actualizando tablas de la base de datos (prisma db push)...');
      // Solo AGREGA columnas/tablas: si un cambio pudiera borrar datos, prisma se detiene.
      execSync(`npx prisma db push --skip-generate --schema "${schema}"`, { cwd: root, stdio: 'inherit' });
    } catch (error) {
      logger.error(`No se pudieron actualizar las tablas: ${(error as Error).message}`);
    }
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    try {
      const script = firstExisting(
        join(__dirname, 'scripts', 'create-admin.js'),
        join(root, 'scripts', 'create-admin.js'),
      );
      if (!script) throw new Error('No se encontró scripts/create-admin.js');
      execSync(`node "${script}"`, { cwd: root, stdio: 'inherit' });
    } catch (error) {
      logger.error(`No se pudo crear el administrador: ${(error as Error).message}`);
    }
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  runStartupTasks(logger);
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

  // Si existe el formulario ya construido (dist/public o web/dist), esta misma app lo entrega.
  // Así un solo sitio Node.js (p. ej. Hostinger) sirve formulario + API. Con Docker no se usa (nginx lo hace).
  const webDist = firstExisting(
    join(__dirname, 'public'),
    join(__dirname, '..', 'web', 'dist'),
  );
  if (webDist && existsSync(join(webDist, 'index.html'))) {
    app.useStaticAssets(webDist, { index: false });
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(join(webDist, 'index.html'));
      }
      next();
    });
    logger.log(`🖥️  Serving web frontend from ${webDist}`);
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
