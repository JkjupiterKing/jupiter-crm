import { PrismaClient } from '@prisma/client';
import { config } from './config';

// Create Prisma client with appropriate database configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url
    }
  }
});

// Log database mode for debugging
if (config.database.isMockMode) {
  console.log('🎭 Prisma Client initialized in MOCK MODE');
  console.log('📊 Using database:', config.database.url);
} else {
  console.log('🏢 Prisma Client initialized in NORMAL MODE');
  console.log('📊 Using database:', config.database.url);
}

export { prisma };
