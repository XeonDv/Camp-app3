#!/bin/sh
# Arranque del contenedor de la API.
# Las tablas (AUTO_DB_PUSH) y el administrador (ADMIN_EMAIL/ADMIN_PASSWORD) los prepara la propia app al iniciar.
exec node dist/main
