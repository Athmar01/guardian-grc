import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Add middleware for soft delete
export const softDeleteMiddleware = async (params: any, next: any) => {
  // Soft delete for models with deletedAt
  if (params.model && ['User', 'Organization', 'Framework'].includes(params.model)) {
    if (params.action === 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany';
      if (params.args.data !== undefined) {
        params.args.data.deletedAt = new Date();
      } else {
        params.args.data = { deletedAt: new Date() };
      }
    }
  }
  return next(params);
};

// Apply middleware
prisma.$use(softDeleteMiddleware);

export default prisma;
