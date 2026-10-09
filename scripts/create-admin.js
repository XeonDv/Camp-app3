/* Crea (o actualiza la contraseña de) un usuario administrador.
 *   ADMIN_EMAIL=tu@correo.com ADMIN_PASSWORD='una-clave-larga' node scripts/create-admin.js
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const email = (process.env.ADMIN_EMAIL || process.argv[2] || '').trim();
  const password = process.env.ADMIN_PASSWORD || process.argv[3] || '';

  if (!email || password.length < 10) {
    console.error('Falta el correo o la contraseña es muy corta (mínimo 10 caracteres).');
    console.error("Uso: ADMIN_EMAIL=tu@correo.com ADMIN_PASSWORD='una-clave-larga' node scripts/create-admin.js");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hash },
      create: { email, password: hash, role: 'admin' },
    });
    console.log(`Administrador listo: ${user.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('No se pudo crear el administrador:', error.message);
  process.exit(1);
});
