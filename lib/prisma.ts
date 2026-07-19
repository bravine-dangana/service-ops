import { PrismaClient } from '@prisma/client';

// Avoid exhausting the connection pool from Next.js dev server hot-reloads by
// caching the client on the global object.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
