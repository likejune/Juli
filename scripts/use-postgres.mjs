/**
 * Swaps the active Prisma schema to the PostgreSQL variant.
 * Used by `npm run build:vercel` (see vercel.json buildCommand).
 */
import { copyFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
copyFileSync(`${root}/prisma/schema.postgres.prisma`, `${root}/prisma/schema.prisma`);
console.log('[use-postgres] prisma/schema.prisma now targets PostgreSQL');
