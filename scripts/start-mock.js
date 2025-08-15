#!/usr/bin/env node

/**
 * Start Mock Mode Script
 * Sets up mock database and starts the application in mock mode
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Import database manager functions
const dbManager = require('./db-manager.js');

// Configuration
const MOCK_DB_PATH = path.join(process.cwd(), 'prisma', 'mock.db');
const MOCK_DATA_SQL = path.join(process.cwd(), 'prisma', 'mock-data.sql');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}`);
  log(`${colors.bright}${colors.magenta}${message}${colors.reset}`);
  log(`${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}\n`);
}

function logStep(step, message) {
  log(`${colors.yellow}${step}${colors.reset}: ${message}`);
}

function logSuccess(message) {
  log(`${colors.green}✓${colors.reset} ${message}`);
}

function logError(message) {
  log(`${colors.red}✗${colors.reset} ${message}`);
}

function logInfo(message) {
  log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

function checkMockDatabase() {
  logStep('CHECK', 'Checking mock database status');
  
  if (!fs.existsSync(MOCK_DB_PATH)) {
    logInfo('Mock database does not exist, will create it');
    return false;
  }
  
  if (!fs.existsSync(MOCK_DATA_SQL)) {
    logError('Mock data SQL file not found');
    return false;
  }
  
  // Check if database is recent (within last hour)
  const stats = fs.statSync(MOCK_DB_PATH);
  const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
  
  if (ageInHours > 1) {
    logInfo('Mock database is older than 1 hour, will refresh it');
    return false;
  }
  
  logSuccess('Mock database exists and is recent');
  return true;
}

function setupMockEnvironment() {
  logHeader('Setting Up Mock Environment');
  
  // Set environment variables
  process.env.MOCK_MODE = 'true';
  process.env.DATABASE_URL = `file:${MOCK_DB_PATH}`;
  
  logInfo('Environment variables set:');
  logInfo(`  MOCK_MODE: ${process.env.MOCK_MODE}`);
  logInfo(`  DATABASE_URL: ${process.env.DATABASE_URL}`);
  
  // Check if mock database needs to be created/refreshed
  if (!checkMockDatabase()) {
    logStep('SETUP', 'Setting up mock database');
    if (!dbManager.setupMockDatabase()) {
      logError('Failed to setup mock database');
      process.exit(1);
    }
  }
  
  // Generate Prisma client if needed
  logStep('GENERATE', 'Ensuring Prisma client is up to date');
  if (!dbManager.generatePrismaClient()) {
    logError('Failed to generate Prisma client');
    process.exit(1);
  }
  
  logSuccess('Mock environment setup completed');
}

function startApplication() {
  logHeader('Starting Application in Mock Mode');
  
  logInfo('Starting Next.js development server...');
  logInfo('Press Ctrl+C to stop the server');
  
  try {
    // Start the Next.js development server
    execSync('npx next dev --turbopack', {
      stdio: 'inherit',
      env: { ...process.env, MOCK_MODE: 'true' }
    });
  } catch (error) {
    if (error.signal === 'SIGINT') {
      logInfo('Server stopped by user');
    } else {
      logError(`Server failed to start: ${error.message}`);
      process.exit(1);
    }
  }
}

function main() {
  try {
    logHeader('🎭 Jupiter CRM - Mock Mode Starter');
    
    // Setup mock environment
    setupMockEnvironment();
    
    // Start the application
    startApplication();
    
  } catch (error) {
    logError(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  setupMockEnvironment,
  startApplication
};
