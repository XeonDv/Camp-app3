import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

/**
 * Alternativa a DATABASE_URL: si se definen DB_HOST, DB_USER, DB_PASSWORD y DB_NAME por separado,
 * se arma la dirección aquí y la contraseña puede llevar cualquier carácter (se codifica sola).
 */
function buildDatabaseUrlFromParts() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (DB_HOST && DB_USER && DB_PASSWORD !== undefined && DB_NAME) {
    process.env.DATABASE_URL = `mysql://${encodeURIComponent(DB_USER.trim())}:${encodeURIComponent(
      DB_PASSWORD,
    )}@${DB_HOST.trim()}:${(DB_PORT || '3306').trim()}/${DB_NAME.trim()}`;
  }
}

/** Primer archivo que exista de una lista de rutas posibles (con hosting o con Docker cambia la ubicación). */
function firstExisting(...paths: string[]): string | undefined {
  return paths.find((p) => existsSync(p));
}

/** Ejecuta un comando y, si falla, deja en el log el motivo real (sin claves). */
function runStep(logger: Logger, label: string, command: string, cwd: string) {
  try {
    const out = execSync(command, { cwd, encoding: 'utf8', stdio: 'pipe', timeout: 120000 });
    logger.log(`${label}: OK ${out.trim().split('\n').slice(-3).join(' | ')}`);
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string; message: string };
    let detail = `${e.stderr || ''}\n${e.stdout || ''}`.trim() || e.message;
    for (const secret of [process.env.DATABASE_URL, process.env.DB_PASSWORD, process.env.ADMIN_PASSWORD]) {
      if (secret) detail = detail.split(secret).join('***');
    }
    logger.error(`${label} falló:\n${detail.slice(-1500)}`);
  }
}

/** Preparación opcional al arrancar (hosting sin terminal): crear tablas y administrador. Nunca tumba la app. */
function runStartupTasks(logger: Logger) {
  const root = join(__dirname, '..');

  if (process.env.AUTO_DB_PUSH === 'true') {
    const schema = firstExisting(
      join(__dirname, 'prisma', 'schema.prisma'),
      join(root, 'prisma', 'schema.prisma'),
    );
    let prismaCli: string | undefined;
    try {
      prismaCli = require.resolve('prisma/build/index.js');
    } catch {
      prismaCli = undefined;
    }
    if (!schema || !prismaCli) {
      logger.error(`No se pueden crear las tablas: schema=${schema ?? 'no encontrado'} prismaCli=${prismaCli ?? 'no encontrado'}`);
    } else {
      logger.log('Actualizando tablas de la base de datos (prisma db push)...');
      // Solo AGREGA columnas/tablas: si un cambio pudiera borrar datos, prisma se detiene.
      runStep(logger, 'Tablas', `"${process.execPath}" "${prismaCli}" db push --skip-generate --schema "${schema}"`, root);
    }
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const script = firstExisting(
      join(__dirname, 'scripts', 'create-admin.js'),
      join(root, 'scripts', 'create-admin.js'),
    );
    if (!script) logger.error('No se encontró scripts/create-admin.js');
    else runStep(logger, 'Administrador', `"${process.execPath}" "${script}"`, root);
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  buildDatabaseUrlFromParts();
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
