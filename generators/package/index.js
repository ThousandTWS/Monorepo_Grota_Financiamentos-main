const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const name = args[0];

if (!name) {
  console.error('Use: turbo gen package <name>');
  process.exit(1);
}

// Caminhos
const templateDir = path.join(__dirname, 'template');
const targetDir = path.join(__dirname, '../../packages', name);

// Função para copiar template recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name.replace('{{name}}', name));

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/{{name}}/g, name);
      fs.writeFileSync(destPath, content);
    }
  }
}

copyDir(templateDir, targetDir);

console.log(`✅ Package '${name}' criado em packages/${name}`);
