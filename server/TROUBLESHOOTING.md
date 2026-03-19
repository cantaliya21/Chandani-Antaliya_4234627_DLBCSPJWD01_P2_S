# Troubleshooting Registration Issues

## Common Issues and Solutions

### Issue: "Failed to register user" Error

**Possible Causes:**

1. **Database Not Initialized**
   - Check server console for "Database initialized successfully" message
   - Verify `server/data/taskmanager.db` file exists
   - Restart the server if database initialization failed

2. **SQL.js Binding Error**
   - sql.js might have issues with parameter binding
   - Check server console for detailed error messages
   - Look for "Database run() error" in logs

3. **Unique Constraint Violation**
   - User with same email/username already exists
   - Check database for existing users
   - Error should show "User already exists" message

4. **Password Hashing Error**
   - bcryptjs might fail if password is invalid
   - Ensure password is at least 6 characters
   - Check server logs for bcrypt errors

## Debugging Steps

1. **Check Server Console**
   - Look for detailed error messages
   - Check for "Database run() error" logs
   - Verify database initialization messages

2. **Check Database File**
   - Verify `server/data/taskmanager.db` exists
   - Check file permissions
   - Try deleting and recreating the database

3. **Test Database Directly**
   - Use a SQLite browser to check the database
   - Verify tables exist: `users` and `tasks`
   - Check if users table has correct schema

4. **Check Network**
   - Verify backend server is running on port 3001
   - Check CORS configuration
   - Verify frontend can reach backend

## Quick Fixes

1. **Delete and Recreate Database**
   ```bash
   cd server
   rm data/taskmanager.db
   npm start
   ```

2. **Check Server Logs**
   - Registration attempts will show detailed logs
   - Look for the exact error message
   - Check error stack traces

3. **Verify Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Test Registration Endpoint**
   Use curl or Postman to test:
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@test.com","password":"test123"}'
   ```
