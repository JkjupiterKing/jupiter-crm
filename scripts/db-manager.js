#!/usr/bin/env node

/**
 * Database Manager Script
 * Handles database operations for both normal and mock modes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PRISMA_DIR = path.join(process.cwd(), 'prisma');
const MOCK_DB_PATH = path.join(PRISMA_DIR, 'mock.db');
const MAIN_DB_PATH = path.join(PRISMA_DIR, 'database.db');
const MOCK_DATA_SQL = path.join(PRISMA_DIR, 'mock-data.sql');

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
  log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  log(`${colors.bright}${colors.cyan}${message}${colors.reset}`);
  log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
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

function runCommand(command, description) {
  try {
    logStep('RUN', description);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    logSuccess(description);
    return true;
  } catch (error) {
    logError(`Failed to ${description.toLowerCase()}: ${error.message}`);
    return false;
  }
}

function checkPrerequisites() {
  logHeader('Checking Prerequisites');
  
  // Check if Prisma is installed
  try {
    execSync('npx prisma --version', { stdio: 'pipe' });
    logSuccess('Prisma CLI is available');
  } catch (error) {
    logError('Prisma CLI not found. Please install it first: npm install -g prisma');
    return false;
  }

  // Check if mock data file exists
  if (!fs.existsSync(MOCK_DATA_SQL)) {
    logError(`Mock data file not found: ${MOCK_DATA_SQL}`);
    return false;
  }
  logSuccess('Mock data file found');

  return true;
}

function setupMockDatabase() {
  logHeader('Setting Up Mock Database');
  
  // Remove existing mock database
  if (fs.existsSync(MOCK_DB_PATH)) {
    fs.unlinkSync(MOCK_DB_PATH);
    logInfo('Removed existing mock database');
  }

  // Create new mock database
  logStep('CREATE', 'Creating new mock database');
  try {
    execSync(`npx prisma db push --schema=${path.join(PRISMA_DIR, 'schema.prisma')} --accept-data-loss`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: `file:${MOCK_DB_PATH}` }
    });
    logSuccess('Mock database created');
  } catch (error) {
    logError('Failed to create mock database');
    return false;
  }

  // Load mock data
  logStep('LOAD', 'Loading mock data into database');
  try {
    execSync(`npx prisma db execute --file=${MOCK_DATA_SQL} --schema=${path.join(PRISMA_DIR, 'schema.prisma')}`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: `file:${MOCK_DB_PATH}` }
    });
    logSuccess('Mock data loaded successfully');
  } catch (error) {
    logError('Failed to load mock data');
    return false;
  }

  return true;
}

function resetMainDatabase() {
  logHeader('Resetting Main Database');
  
  // Remove existing main database
  if (fs.existsSync(MAIN_DB_PATH)) {
    fs.unlinkSync(MAIN_DB_PATH);
    logInfo('Removed existing main database');
  }

  // Create new main database
  logStep('CREATE', 'Creating new main database');
  try {
    execSync(`npx prisma db push --schema=${path.join(PRISMA_DIR, 'schema.prisma')} --accept-data-loss`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: `file:${MAIN_DB_PATH}` }
    });
    logSuccess('Main database created');
  } catch (error) {
    logError('Failed to create main database');
    return false;
  }

  return true;
}

function generatePrismaClient() {
  logHeader('Generating Prisma Client');
  
  if (runCommand('npx prisma generate', 'Generating Prisma client')) {
    logSuccess('Prisma client generated successfully');
    return true;
  }
  return false;
}

function showDatabaseStatus() {
  logHeader('Database Status');
  
  const mockExists = fs.existsSync(MOCK_DB_PATH);
  const mainExists = fs.existsSync(MAIN_DB_PATH);
  
  logInfo(`Mock Database: ${mockExists ? colors.green + 'EXISTS' + colors.reset : colors.red + 'MISSING' + colors.reset}`);
  if (mockExists) {
    const stats = fs.statSync(MOCK_DB_PATH);
    logInfo(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
    logInfo(`  Modified: ${stats.mtime.toLocaleString()}`);
  }
  
  logInfo(`Main Database: ${mainExists ? colors.green + 'EXISTS' + colors.reset : colors.red + 'MISSING' + colors.reset}`);
  if (mainExists) {
    const stats = fs.statSync(MAIN_DB_PATH);
    logInfo(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
    logInfo(`  Modified: ${stats.mtime.toLocaleString()}`);
  }
  
  logInfo(`Mock Data SQL: ${fs.existsSync(MOCK_DATA_SQL) ? colors.green + 'EXISTS' + colors.reset : colors.red + 'MISSING' + colors.reset}`);
}

function showHelp() {
  logHeader('Database Manager Help');
  
  log('Available commands:', 'bright');
  log('  setup-mock     - Create and populate mock database');
  log('  reset-main     - Reset main database (WARNING: This will delete all data)');
  log('  generate       - Generate Prisma client');
  log('  status         - Show database status');
  log('  help           - Show this help message');
  
  log('\nExamples:', 'bright');
  log('  node scripts/db-manager.js setup-mock');
  log('  node scripts/db-manager.js reset-main');
  log('  node scripts/db-manager.js status');
}

function main() {
  const command = process.argv[2] || 'help';
  
  if (!checkPrerequisites()) {
    process.exit(1);
  }
  
  switch (command) {
    case 'setup-mock':
      if (setupMockDatabase()) {
        logSuccess('Mock database setup completed successfully!');
      } else {
        logError('Mock database setup failed');
        process.exit(1);
      }
      break;
      
    case 'reset-main':
      if (resetMainDatabase()) {
        logSuccess('Main database reset completed successfully!');
      } else {
        logError('Main database reset failed');
        process.exit(1);
      }
      break;
      
    case 'generate':
      if (generatePrismaClient()) {
        logSuccess('Prisma client generation completed successfully!');
      } else {
        logError('Prisma client generation failed');
        process.exit(1);
      }
      break;
      
    case 'status':
      showDatabaseStatus();
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  setupMockDatabase,
  resetMainDatabase,
  generatePrismaClient,
  showDatabaseStatus
};
