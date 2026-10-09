FROM --platform=linux/amd64 node:18-alpine AS builder

# Prisma necesita openssl en Alpine.
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
# npm install (no "ci"): el package-lock.json todavía no incluye "stripe". Se regenera en el primer despliegue.
RUN npm install --no-audit --no-fund

COPY . .
ENV DATABASE_URL="mysql://build:build@localhost:3306/camp"
RUN npx prisma generate && npm run build

FROM --platform=linux/amd64 node:18-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY scripts ./scripts
COPY docker-entrypoint.sh ./

EXPOSE 3000

# "sh" explícito: no depende de que el archivo conserve el permiso de ejecución.
CMD ["sh", "docker-entrypoint.sh"]
