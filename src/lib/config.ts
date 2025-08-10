/**
 * Application Configuration
 * Manages environment variables and database settings
 */

import path from 'path';

export interface DatabaseConfig {
  url: string;
  isMockMode: boolean;
}

export interface AppConfig {
  database: DatabaseConfig;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Determine the current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isMockMode = process.env.MOCK_MODE === 'true';

// Database configuration
const getDatabaseConfig = (): DatabaseConfig => {
  if (isMockMode) {
    // Use absolute path for mock database
    const mockDbPath = path.resolve(process.cwd(), 'prisma', 'mock.db');
    console.log('🎭 MOCK MODE: Using mock database at:', mockDbPath);
    return {
      url: `file:${mockDbPath}`,
      isMockMode: true
    };
  }

  // Use the DATABASE_URL from environment or default to production database
  const dbPath = process.env.DATABASE_URL || path.resolve(process.cwd(), 'prisma', 'database.db');
  console.log('🏢 NORMAL MODE: Using database at:', dbPath);
  return {
    url: dbPath.startsWith('file:') ? dbPath : `file:${dbPath}`,
    isMockMode: false
  };
};

// Export configuration
export const config: AppConfig = {
  database: getDatabaseConfig(),
  isDevelopment,
  isProduction
};

// Helper functions
export const isMockDatabase = (): boolean => config.database.isMockMode;
export const getDatabaseUrl = (): string => config.database.url;
