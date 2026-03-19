/**
 * Database Setup and Configuration using sql.js
 * 
 * Uses sql.js (WebAssembly SQLite) which doesn't require native compilation
 * Perfect for Windows environments without Visual Studio Build Tools
 */

import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const DB_PATH = join(__dirname, 'data', 'taskmanager.db');

let db = null;
let SQL = null;

/**
 * Initialize SQL.js and database
 */
async function initializeDatabase() {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs();

    // Load existing database or create new one
    if (existsSync(DB_PATH)) {
      const buffer = readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
      console.log('Database loaded from file');
    } else {
      // Ensure data directory exists
      const dataDir = join(__dirname, 'data');
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }
      db = new SQL.Database();
      console.log('New database created');
    }

    // Create tables
    createTables();

    // Save database to file periodically
    setInterval(() => {
      saveDatabase();
    }, 5000); // Save every 5 seconds

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Create database tables
 */
function createTables() {
  try {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'medium',
        category TEXT DEFAULT 'general',
        due_date DATETIME,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    try {
      db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`);
    } catch (e) {}
    try {
      db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)`);
    } catch (e) {}
    try {
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    } catch (e) {}

    // Save after creating tables
    saveDatabase();
  } catch (error) {
    // Ignore "already exists" errors
    if (!error.message?.includes('already exists') && !error.message?.includes('duplicate')) {
      console.error('Error creating tables:', error);
    }
  }
}

/**
 * Save database to file
 */
function saveDatabase() {
  try {
    if (db) {
      const data = db.export();
      const buffer = Buffer.from(data);
      writeFileSync(DB_PATH, buffer);
    }
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

/**
 * Prepare statement wrapper for sql.js compatibility with better-sqlite3 API
 * Creates a new statement each time to avoid memory leaks
 */
function prepare(sql) {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  return {
    get: (...params) => {
      const stmt = db.prepare(sql);
      try {
        if (params.length > 0) {
          // sql.js bind() expects an array of values
          stmt.bind(params);
        }
        if (stmt.step()) {
          return stmt.getAsObject();
        }
        return undefined;
      } catch (error) {
        // Re-throw errors with more context
        console.error('Database get() error:', error.message);
        console.error('SQL:', sql);
        console.error('Params:', params);
        throw error;
      } finally {
        stmt.free();
      }
    },
    all: (...params) => {
      const stmt = db.prepare(sql);
      try {
        if (params.length > 0) {
          // sql.js bind() expects an array of values
          stmt.bind(params);
        }
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        return results;
      } catch (error) {
        // Re-throw errors with more context
        console.error('Database all() error:', error.message);
        console.error('SQL:', sql);
        console.error('Params:', params);
        throw error;
      } finally {
        stmt.free();
      }
    },
    run: (...params) => {
      const stmt = db.prepare(sql);
      try {
        if (params.length > 0) {
          // sql.js bind() expects an array of values
          stmt.bind(params);
        }
        // sql.js step() executes the statement
        // Returns true if a row was returned (for SELECT) or if statement executed (for INSERT/UPDATE/DELETE)
        // Throws exceptions for errors like constraint violations
        const result = stmt.step();
        // In sql.js, use db.getRowsModified() to get the number of rows modified
        const changes = db.getRowsModified() || (result ? 1 : 0);
        saveDatabase(); // Auto-save after changes
        return { changes };
      } catch (error) {
        // Re-throw the error with more context for debugging
        console.error('Database run() error:', error.message);
        console.error('Error name:', error.name);
        console.error('SQL:', sql);
        console.error('Params:', params);
        if (error.stack) {
          console.error('Stack:', error.stack);
        }
        throw error;
      } finally {
        stmt.free();
      }
    }
  };
}

/**
 * Execute SQL directly
 */
function exec(sql) {
  db.run(sql);
  saveDatabase();
}

// Initialize database on module load
await initializeDatabase();

// Export database functions compatible with better-sqlite3 API
export default {
  prepare,
  exec,
  save: saveDatabase
};
