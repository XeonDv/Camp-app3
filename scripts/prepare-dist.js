/* Copia dentro de "dist" todo lo que la app necesita para funcionar aunque el hosting
 * publique solo esa carpeta: el formulario ya construido, el esquema de la base y el script del admin. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function copy(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
  console.log(`copiado: ${path.relative(root, from)} -> ${path.relative(root, to)}`);
}

copy(path.join(root, 'web', 'dist'), path.join(dist, 'public'));
copy(path.join(root, 'prisma', 'schema.prisma'), path.join(dist, 'prisma', 'schema.prisma'));
copy(path.join(root, 'scripts', 'create-admin.js'), path.join(dist, 'scripts', 'create-admin.js'));
