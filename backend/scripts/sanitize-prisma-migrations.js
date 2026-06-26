const fs = require('fs');
const path = require('path');

const migrationsDir = process.argv[2] || 'prisma/migrations';

if (!fs.existsSync(migrationsDir)) {
  console.log('No migrations directory found, skipping sanitization.');
  process.exit(0);
}

function sanitizeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/^--.*prisma.*$/gim, '');
  content = content.replace(/^--\s*This is an empty migration.*$/gim, '');
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Sanitized: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.sql')) {
      sanitizeFile(fullPath);
    }
  }
}

walkDir(migrationsDir);
console.log('Prisma migration sanitization complete.');
