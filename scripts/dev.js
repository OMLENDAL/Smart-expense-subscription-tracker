// Starts backend (with --watch) and Vite frontend together.
// Uses Node's spawn directly so Windows paths with spaces or & never break.
const { spawn } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

const services = [
  {
    name: 'backend ',
    color: '\x1b[36m',   // cyan
    cwd:  path.join(projectRoot, 'backend'),
    args: ['--watch', 'src/server.js'],
  },
  {
    name: 'frontend',
    color: '\x1b[35m',   // magenta
    cwd:  path.join(projectRoot, 'frontend'),
    args: ['node_modules/vite/bin/vite.js'],
  },
];

const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';

const selectedNames = process.argv.slice(2);
const toRun = selectedNames.length
  ? services.filter((s) => selectedNames.includes(s.name.trim()))
  : services;

if (toRun.length === 0) {
  console.error('Unknown service. Use "backend" or "frontend".');
  process.exit(1);
}

const children = [];
let isStopping = false;

function prefix(service) {
  return `${BOLD}${service.color}[${service.name}]${RESET} `;
}

function log(service, line) {
  process.stdout.write(`${prefix(service)}${line}\n`);
}

for (const service of toRun) {
  log(service, `Starting…`);

  const child = spawn(process.execPath, service.args, {
    cwd: service.cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  children.push(child);

  const tag = prefix(service);

  // Pipe stdout line-by-line with prefix
  child.stdout.on('data', (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line) process.stdout.write(`${tag}${line}\n`);
    }
  });

  // Pipe stderr line-by-line with prefix
  child.stderr.on('data', (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line) process.stderr.write(`${tag}${line}\n`);
    }
  });

  child.on('error', (err) => {
    log(service, `Failed to start: ${err.message}`);
    process.exitCode = 1;
    stopAll();
  });

  child.on('exit', (code, signal) => {
    if (!isStopping) {
      log(service, `Exited (code=${code ?? signal}). Stopping all services…`);
      process.exitCode = code || 1;
      stopAll();
    }
  });
}

function stopAll() {
  if (isStopping) return;
  isStopping = true;
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill();
    }
  }
}

process.on('SIGINT',  stopAll);
process.on('SIGTERM', stopAll);

console.log(
  `\n${BOLD}▶  Pennywise dev servers starting…${RESET}\n` +
  `   \x1b[36mBackend  →\x1b[0m  http://localhost:5000\n` +
  `   \x1b[35mFrontend →\x1b[0m  http://localhost:5173\n`
);
