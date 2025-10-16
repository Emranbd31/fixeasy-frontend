#!/usr/bin/env node
const { spawn } = require('child_process');

const [, , command, ...args] = process.argv;

if (!command) {
  console.error('Usage: node scripts/run-next.js <command> [args...]');
  process.exit(1);
}

process.env.NEXT_DISABLE_VERSION_CHECK = '1';
process.env.NEXT_TELEMETRY_DISABLED = process.env.NEXT_TELEMETRY_DISABLED || '1';

const child = spawn('next', [command, ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
