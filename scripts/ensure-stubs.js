const fs = require('fs');
const path = require('path');

const projectRoot = __dirname ? path.join(__dirname, '..') : path.resolve('..');
const nodeModules = path.join(projectRoot, 'node_modules');
const stubsRoot = path.join(projectRoot, 'stubs');

const packages = [
  { name: 'typescript', source: path.join(stubsRoot, 'typescript') },
  { name: '@types/react', source: path.join(stubsRoot, '@types', 'react') },
  { name: '@types/node', source: path.join(stubsRoot, '@types', 'node') },
];

if (!fs.existsSync(nodeModules)) {
  fs.mkdirSync(nodeModules, { recursive: true });
}

for (const pkg of packages) {
  const segments = pkg.name.split('/');
  const targetDir = path.join(nodeModules, ...segments);
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.cpSync(pkg.source, targetDir, { recursive: true });
}
