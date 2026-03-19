/**
 * Test script to verify database operations
 * Run with: node test-db.js
 */

import db from './database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function testDatabase() {
  console.log('Testing database operations...\n');

  try {
    // Test 1: Check if database is initialized
    console.log('Test 1: Database initialization');
    console.log('✓ Database loaded');

    // Test 2: Check if users table exists
    console.log('\nTest 2: Check users table');
    const userCheck = db.prepare('SELECT name FROM sqlite_master WHERE type="table" AND name="users"').get();
    if (userCheck) {
      console.log('✓ Users table exists');
    } else {
      console.log('✗ Users table does not exist');
      return;
    }

    // Test 3: Try to insert a test user
    console.log('\nTest 3: Insert test user');
    const testUserId = uuidv4();
    const testUsername = 'testuser_' + Date.now();
    const testEmail = 'test_' + Date.now() + '@test.com';
    const testPassword = await bcrypt.hash('test123', 10);

    try {
      const insertStmt = db.prepare('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)');
      const result = insertStmt.run(testUserId, testUsername, testEmail, testPassword);
      console.log('✓ User inserted successfully, changes:', result.changes);
    } catch (insertError) {
      console.log('✗ Failed to insert user:', insertError.message);
      throw insertError;
    }

    // Test 4: Try to retrieve the test user
    console.log('\nTest 4: Retrieve test user');
    const retrievedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId);
    if (retrievedUser) {
      console.log('✓ User retrieved successfully');
      console.log('  Username:', retrievedUser.username);
      console.log('  Email:', retrievedUser.email);
    } else {
      console.log('✗ Failed to retrieve user');
      return;
    }

    // Test 5: Try to delete the test user
    console.log('\nTest 5: Delete test user');
    const deleteStmt = db.prepare('DELETE FROM users WHERE id = ?');
    const deleteResult = deleteStmt.run(testUserId);
    console.log('✓ User deleted successfully, changes:', deleteResult.changes);

    console.log('\n✅ All database tests passed!');
  } catch (error) {
    console.error('\n❌ Database test failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testDatabase();
