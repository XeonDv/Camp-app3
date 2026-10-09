# Camp App — Young Leaders Camp (Registro 2027)

Sistema de inscripción al campamento de verano: formulario público para las familias, pago de la cuota de registro con Stripe y panel de administración.

Este repositorio es la **copia de trabajo**. La app real sigue funcionando por separado y no depende de lo que se haga aquí.

## Qué hay en cada carpeta

| Carpeta | Qué es |
| --- | --- |
| `src/` | API (NestJS + Prisma + MySQL): inscripciones, pagos, login de administrador |
| `prisma/schema.prisma` | Estructura de la base de datos |
| `web/` | Formulario público de 6 pasos, páginas de pago y panel de administración (React + Vite) |
| `scripts/create-admin.js` | Crea el usuario administrador |
| `docker-compose.test.yml` | Levanta la **versión de prueba** (nombres y puerto propios) |

## Cómo funciona el pago

1. La familia llena el formulario y pulsa **Enviar y pagar $350 CAD**.
2. La API guarda la inscripción (estado: *sin pagar*) y crea una sesión de pago de Stripe.
3. La familia paga en la página segura de Stripe.
4. Stripe avisa a `POST /api/payments/webhook`. La API verifica la firma y marca la inscripción como **pagada**.

El monto se define **solo en el servidor** (`REGISTRATION_FEE_CENTS`, por defecto 35000 = $350.00 CAD). El navegador nunca decide cuánto se cobra.
Si la familia cierra la ventana de pago, su inscripción queda guardada y puede reintentar sin duplicarla.

## Base de datos

Los cambios del formulario 2027 **solo agregan** columnas. Las inscripciones anteriores se conservan y siguen visibles en el panel (marcadas "2026"). Para la prueba, use una base de datos **separada** de la real.

## Configurar Stripe (modo prueba)

1. En el panel de Stripe, active el **modo de prueba** y copie la clave secreta (`sk_test_...`) a `STRIPE_SECRET_KEY`.
2. En *Developers → Webhooks* agregue el destino `https://TU-DOMINIO-DE-PRUEBA/api/payments/webhook` con los eventos `checkout.session.completed` y `checkout.session.async_payment_succeeded`.
3. Copie el *signing secret* (`whsec_...`) a `STRIPE_WEBHOOK_SECRET`.
4. Pruebe con la tarjeta `4242 4242 4242 4242` (cualquier fecha futura y cualquier CVC). No se cobra dinero real.

Solo cuando todo funcione en prueba se cambia a las claves reales (`sk_live_...`).

## Desarrollo en un computador

```bash
cp .env.example .env      # y complete los valores
npm install
npx prisma db push        # crea las tablas en la base indicada en DATABASE_URL
npm run start:dev         # API en http://localhost:3000/api

cd web && npm install && npm run dev   # formulario en http://localhost:5173
```

Crear el administrador:

```bash
ADMIN_EMAIL=tu@correo.com ADMIN_PASSWORD='una-clave-larga' node scripts/create-admin.js
```

Pruebas automáticas: `npm test` (API) y `cd web && npm test` (formulario).

## Versión de prueba con Docker

Cree `.env.test` a partir de `.env.example` (con `AUTO_DB_PUSH=true`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` para que las tablas y el administrador se creen solos al arrancar) y ejecute:

```bash
docker compose -f docker-compose.test.yml up -d --build
```

La web de prueba queda en el puerto `8081`. Quite `ADMIN_PASSWORD` de `.env.test` después del primer arranque.

## Seguridad

- Nunca suba `.env` ni `.env.test` a GitHub (ya están en `.gitignore`).
- Si alguna clave se compartió por error, genérela de nuevo en Stripe / Hostinger.
- La API no devuelve datos personales a quien envía el formulario: solo el número de referencia y los estados.
