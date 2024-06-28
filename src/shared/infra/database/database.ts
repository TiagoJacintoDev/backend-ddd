import { PrismaClient } from '@prisma/client';

export class Database {
  private readonly connection: PrismaClient;

  constructor() {
    this.connection = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  getConnection() {
    return this.connection;
  }

  async connect() {
    await this.connection.$connect();
  }

  async disconnect() {
    await this.connection.$disconnect();
  }
}

// const globalForPrisma = globalThis as unknown as {
//   prisma: Maybe<ReturnType<typeof createPrismaClient>>;
// };

// export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// if (environment !== 'production') globalForPrisma.prisma = prisma;
