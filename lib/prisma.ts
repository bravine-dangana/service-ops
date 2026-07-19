import { PrismaClient } from '@prisma/client';

// Avoid exhausting the connection pool from Next.js dev server hot-reloads by
// caching the client on the global object.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Errors and warnings always log. Set PRISMA_LOG_QUERIES=true in .env to also
// log every SQL statement Prisma runs (verbose — useful when debugging, noisy
// to leave on permanently).
const logLevels: Array<'query' | 'info' | 'warn' | 'error'> =
  process.env.PRISMA_LOG_QUERIES === 'true' ? ['query', 'warn', 'error'] : ['warn', 'error'];

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: logLevels });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
