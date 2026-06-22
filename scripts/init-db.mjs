/**
 * Automatic database initialisation.
 * Runs before `dev`, `build` and `start`:
 *   1. creates .env from .env.example if missing
 *   2. pushes the Prisma schema to the database
 *   3. seeds initial content (idempotent — safe to run repeatedly)
 */
import { execSync } from 'node:child_process';
import { existsSync, copyFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;

if (!existsSync(`${root}/.env`)) {
  copyFileSync(`${root}/.env.example`, `${root}/.env`);
  // generate a unique session secret on first run
  const env = readFileSync(`${root}/.env`, 'utf8').replace(
    /SESSION_SECRET=".*"/,
    `SESSION_SECRET="${randomBytes(32).toString('hex')}"`
  );
  writeFileSync(`${root}/.env`, env);
  console.log('[init-db] Created .env with a fresh SESSION_SECRET');
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: root });

console.log('[init-db] Syncing database schema…');
run('npx prisma db push --skip-generate');

console.log('[init-db] Seeding initial data…');
run('node prisma/seed.mjs');

console.log('[init-db] Database ready.');
