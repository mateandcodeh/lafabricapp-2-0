const fs = require('fs');
const path = require('path');

const srcCandidates = [
  path.join(process.cwd(), 'assets', 'logo.png'),
  path.join(process.cwd(), 'www', 'logo.png')
];
const srcLogo = srcCandidates.find(p => fs.existsSync(p));
if (!srcLogo) {
  console.log('Sin logo para aplicar a mipmap.');
  process.exit(0);
}

const resDir = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'res');
if (!fs.existsSync(resDir)) {
  console.log('No existe carpeta res de Android todavia.');
  process.exit(0);
}

const anydpiDir = path.join(resDir, 'mipmap-anydpi-v26');
if (fs.existsSync(anydpiDir)) {
  fs.rmSync(anydpiDir, { recursive: true, force: true });
}

const entries = fs.readdirSync(resDir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.isDirectory() && entry.name.startsWith('mipmap-')) {
    const dirPath = path.join(resDir, entry.name);
    for (const fn of fs.readdirSync(dirPath)) {
      if (fn.endsWith('.xml') || fn.endsWith('.webp')) {
        fs.rmSync(path.join(dirPath, fn), { force: true });
      }
    }
    for (const targetName of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
      fs.copyFileSync(srcLogo, path.join(dirPath, targetName));
    }
  }
}

console.log('Logo aplicado a carpetas mipmap desde:', srcLogo);
