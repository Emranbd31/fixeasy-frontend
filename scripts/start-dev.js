#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const os = require('os');

const PORT = process.env.PORT || 3000;

function log(...args) { console.log('[start-dev]', ...args); }

function getPidsOnPort(port) {
  try {
    if (process.platform === 'win32') {
      // netstat -ano | findstr :PORT
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const pids = new Set();
      out.split(/\r?\n/).forEach((line) => {
        line = line.trim();
        if (!line) return;
        const parts = line.split(/\s+/);
        const pid = parts[parts.length - 1];
        if (/^\d+$/.test(pid)) pids.add(pid);
      });
      return Array.from(pids).map((p) => parseInt(p, 10));
    } else {
      // try lsof -t -i :PORT
      try {
        const out = execSync(`lsof -t -i :${port}`, { encoding: 'utf8' }).trim();
        if (!out) return [];
        return Array.from(new Set(out.split(/\s+/))).map((p) => parseInt(p, 10));
      } catch (e) {
        // fallback to ss
        try {
          const out2 = execSync(`ss -ltnp 'sport = :${port}'`, { encoding: 'utf8' });
          const pids = new Set();
          out2.split(/\r?\n/).forEach((line) => {
            const m = line.match(/pid=(\d+),/);
            if (m) pids.add(parseInt(m[1], 10));
          });
          return Array.from(pids);
        } catch (e2) {
          return [];
        }
      }
    }
  } catch (err) {
    return [];
  }
}

function killPid(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } else {
      process.kill(pid, 'SIGKILL');
    }
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  log(`Checking port ${PORT}...`);
  const pids = getPidsOnPort(PORT);
  if (pids.length === 0) {
    log(`Port ${PORT} appears free.`);
  } else {
    log(`Port ${PORT} is in use by PID(s): ${pids.join(', ')}. Attempting to kill...`);
    for (const pid of pids) {
      const ok = killPid(pid);
      log(`- PID ${pid} ${ok ? 'killed' : 'could not be killed'}`);
    }
    // Wait a short moment for the OS to release the port
    await new Promise((r) => setTimeout(r, 800));
    const pidsAfter = getPidsOnPort(PORT);
    if (pidsAfter.length === 0) {
      log(`Port ${PORT} freed.`);
    } else {
      log(`Warning: port ${PORT} still in use by PID(s): ${pidsAfter.join(', ')}.`);
    }
  }

  log('Starting Next dev...');
  const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'dev', '-p', String(PORT)], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: Object.assign({}, process.env, { NODE_ENV: process.env.NODE_ENV || 'development' }),
  });

  child.on('exit', (code, signal) => {
    log(`Next dev exited with code=${code} signal=${signal}`);
    process.exit(code !== null ? code : 0);
  });

  process.on('SIGINT', () => {
    try { child.kill('SIGINT'); } catch(e) {}
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('[start-dev] Unexpected error', err);
  process.exit(1);
});
