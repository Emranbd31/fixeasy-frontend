const fs = require('fs');

const sys = {
  args: [],
  newLine: '\n',
  useCaseSensitiveFileNames: false,
  getCurrentDirectory: () => process.cwd(),
  readFile: (filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return undefined;
    }
  },
  fileExists: (filePath) => fs.existsSync(filePath),
  directoryExists: (dirPath) => {
    try {
      return fs.statSync(dirPath).isDirectory();
    } catch (error) {
      return false;
    }
  },
  readDirectory: () => [],
  getDirectories: () => [],
  realpath: (filePath) => filePath,
};

function readConfigFile(fileName, readFile) {
  try {
    const text = readFile(fileName);
    return { config: JSON.parse(text ?? '{}'), error: undefined };
  } catch (error) {
    return { config: {}, error };
  }
}

function parseJsonConfigFileContent(config) {
  const normalizedConfig = config ?? {};
  return {
    options: normalizedConfig.compilerOptions ?? {},
    fileNames: [],
    errors: [],
    raw: normalizedConfig,
  };
}

function formatDiagnostic(message) {
  if (!message) return '';
  if (typeof message === 'string') return message;
  if (typeof message.messageText === 'string') return message.messageText;
  return 'TypeScript diagnostics are unavailable in offline mode.';
}

module.exports = {
  version: '5.5.4',
  sys,
  ScriptTarget: { ESNext: 'esnext' },
  ScriptKind: { TSX: 'tsx' },
  ModuleKind: {
    ESNext: 'esnext',
    ES2020: 'es2020',
    CommonJS: 'commonjs',
    AMD: 'amd',
    NodeNext: 'nodenext',
    Node16: 'node16',
    Node10: 'node10',
    NodeJs: 'node',
    Preserve: 'preserve',
    Bundler: 'bundler',
  },
  ModuleResolutionKind: {
    Bundler: 'bundler',
    NodeNext: 'nodenext',
    Node16: 'node16',
    Node12: 'node12',
    Node10: 'node10',
    NodeJs: 'node',
  },
  JsxEmit: {
    Preserve: 'preserve',
    ReactJSX: 'react-jsx',
    ReactJSXDev: 'react-jsxdev',
  },
  createProgram() {
    throw new Error('TypeScript compiler is not available in this offline environment.');
  },
  readConfigFile,
  parseJsonConfigFileContent,
  formatDiagnostic,
};
module.exports.default = module.exports;
