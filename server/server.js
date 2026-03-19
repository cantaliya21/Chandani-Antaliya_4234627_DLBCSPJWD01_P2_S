/**
 * Express Server for Task Manager Application
 * 
 * This server provides REST API endpoints for managing tasks.
 * Uses SQLite database for data persistence.
 * Includes user authentication endpoints.
 */

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from './database.js';

const app = express();
const PORT = 3001; // Backend port

// Middleware
app.use(cors()); // Enable CORS for React frontend
app.use(express.json()); // Parse JSON request bodies

/**
 * Authentication middleware
 * Checks for userId in request headers
 */
function authenticateUser(req, res, next) {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
}

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email.trim().toLowerCase(), username.trim());
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userId = uuidv4();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Create new user - wrap in try-catch for better error handling
    try {
      console.log('Attempting to insert user:', { userId, username: trimmedUsername, email: trimmedEmail });
      const insertUser = db.prepare('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)');
      const result = insertUser.run(userId, trimmedUsername, trimmedEmail, hashedPassword);
      console.log('User inserted successfully, changes:', result.changes);
    } catch (insertError) {
      console.error('Insert error details:');
      console.error('Error message:', insertError.message);
      console.error('Error name:', insertError.name);
      if (insertError.stack) {
        console.error('Error stack:', insertError.stack);
      }

      // Check if it's a unique constraint error
      const errorMsg = (insertError.message || '').toLowerCase();
      if (errorMsg.includes('unique') || errorMsg.includes('constraint') || errorMsg.includes('duplicate')) {
        return res.status(400).json({ error: 'User already exists with this email or username' });
      }
      // Re-throw to be caught by outer catch
      throw insertError;
    }

    // Return user without password
    const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(userId);

    if (!user) {
      throw new Error('User was created but could not be retrieved');
    }

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    console.error('========================');

    // Check for specific database errors
    const errorMessage = (error.message || '').toLowerCase();
    if (errorMessage.includes('unique constraint') || errorMessage.includes('unique') || errorMessage.includes('constraint')) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }

    // Return error message for debugging (always show in development)
    res.status(500).json({
      error: 'Failed to register user',
      details: error.message || 'Unknown error occurred'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    // Accept 'identifier' (new field) or legacy 'email' field
    const { identifier, email: legacyEmail, password } = req.body;
    const loginId = (identifier || legacyEmail || '').trim();

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Email (or username) and password are required' });
    }

    // Normalise: lowercase for comparison (works for both email and username)
    const loginIdLower = loginId.toLowerCase();

    // Find user by email OR username (case-insensitive)
    const user = db.prepare(
      'SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?'
    ).get(loginIdLower, loginIdLower);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password using bcryptjs
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error('Password comparison error:', bcryptError);
      return res.status(500).json({ error: 'Authentication error occurred' });
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user without password
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

/**
 * GET /api/tasks
 * Retrieve all tasks for the authenticated user
 */
app.get('/api/tasks', authenticateUser, (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);

    // Convert completed integer to boolean and include new fields
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority || 'medium',
      category: task.category || 'general',
      dueDate: task.due_date,
      completed: task.completed === 1,
      createdAt: task.created_at
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 * Validates that title is provided
 */
app.post('/api/tasks', authenticateUser, (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    // Validation: title is required
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Create new task with enhanced features
    const taskId = uuidv4();
    const insertTask = db.prepare('INSERT INTO tasks (id, user_id, title, description, priority, category, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertTask.run(
      taskId,
      req.userId,
      title.trim(),
      description ? description.trim() : '',
      priority || 'medium',
      category || 'general',
      dueDate || null
    );

    // Fetch created task
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

    const newTask = {
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority || 'medium',
      category: task.category || 'general',
      dueDate: task.due_date,
      completed: task.completed === 1,
      createdAt: task.created_at
    };

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task (primarily for toggling completion status)
 * Can also update title and description
 */
app.put('/api/tasks/:id', authenticateUser, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, category, dueDate } = req.body;

    // Check if task exists and belongs to user
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title.trim());
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description.trim());
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      values.push(completed ? 1 : 0);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (dueDate !== undefined) {
      updates.push('due_date = ?');
      values.push(dueDate || null);
    }

    if (updates.length > 0) {
      values.push(id, req.userId);
      const updateQuery = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;
      db.prepare(updateQuery).run(...values);
    }

    // Fetch updated task
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);

    const responseTask = {
      id: updatedTask.id,
      userId: updatedTask.user_id,
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority || 'medium',
      category: updatedTask.category || 'general',
      dueDate: updatedTask.due_date,
      completed: updatedTask.completed === 1,
      createdAt: updatedTask.created_at
    };

    res.status(200).json(responseTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID
 */
app.delete('/api/tasks/:id', authenticateUser, (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists and belongs to user
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete task
    const deleteTask = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
    const result = deleteTask.run(id, req.userId);

    if (result.changes > 0) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints: http://localhost:${PORT}/api/tasks`);
  console.log(`🗄️  Database: SQLite (sql.js)`);
});

// Handle port already in use — give a clear error instead of a crash
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`   Run this to kill the process: npx kill-port ${PORT}`);
    console.error(`   Or on Windows: netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown — save DB before exit
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  db.save();
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.save();
  server.close(() => process.exit(0));
});
