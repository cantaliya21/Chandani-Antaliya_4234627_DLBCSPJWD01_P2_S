/**
 * Create Sample User Script
 * 
 * Creates a sample user account for testing login functionality
 * Run with: node create-sample-user.js
 */

import db from './database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function createSampleUser() {
  try {
    console.log('Creating sample user...\n');

    // Sample user credentials
    const sampleUser = {
      username: 'demo',
      email: 'demo@example.com',
      password: 'demo123'
    };

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(
      sampleUser.email,
      sampleUser.username
    );

    if (existingUser) {
      console.log('Sample user already exists!');
      console.log('Username:', existingUser.username);
      console.log('Email:', existingUser.email);
      console.log('\nYou can login with:');
      console.log('Email: demo@example.com');
      console.log('Password: demo123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sampleUser.password, 10);

    // Create user
    const userId = uuidv4();
    const insertUser = db.prepare('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)');
    const result = insertUser.run(userId, sampleUser.username, sampleUser.email, hashedPassword);

    console.log('✅ Sample user created successfully!');
    console.log('\nLogin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    demo@example.com');
    console.log('Password: demo123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify user was created
    const createdUser = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(userId);
    if (createdUser) {
      console.log('User Details:');
      console.log('  ID:', createdUser.id);
      console.log('  Username:', createdUser.username);
      console.log('  Email:', createdUser.email);
      console.log('  Created:', createdUser.created_at);
    }

    console.log('\n✅ You can now login with these credentials!');
  } catch (error) {
    console.error('❌ Error creating sample user:');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

createSampleUser();
