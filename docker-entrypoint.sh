#!/bin/sh
# Arranque del contenedor de la API.
set -e

# Crea/actualiza las tablas nuevas en la base de datos. Solo AGREGA columnas y tablas:
# si un cambio pudiera borrar datos, prisma se detiene y el contenedor no arranca.
if [ "$AUTO_DB_PUSH" = "true" ]; then
  echo "[camp-api] Actualizando tablas de la base de datos (prisma db push)..."
  npx prisma db push --skip-generate
fi

# Si se definieron ADMIN_EMAIL y ADMIN_PASSWORD, crea ese administrador.
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  node scripts/create-admin.js
fi

exec node dist/main
