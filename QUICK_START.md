# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

**Terminal 1 - Backend:**
```bash
cd server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
```

### Step 2: Start Backend Server

**In Terminal 1:**
```bash
cd server
npm start
```

You should see:
```
Server running on http://localhost:3001
API endpoints available at http://localhost:3001/api/tasks
```

### Step 3: Start Frontend Development Server

**In Terminal 2:**
```bash
cd client
npm run dev
```

The browser should automatically open to `http://localhost:3000`

## ✅ Verify Installation

1. Backend is running on port 3001
2. Frontend is running on port 3000
3. Browser opens automatically
4. You can create tasks and they persist

## 🧪 Quick Test

1. Enter a task title: "Test Task"
2. Click "Add Task"
3. Task should appear in the list
4. Click the checkbox to toggle completion
5. Refresh the page - task should still be there!

## 🐛 Troubleshooting

### Port Already in Use
- Backend: Change port in `server/server.js` (line 18)
- Frontend: Change port in `client/vite.config.js` (line 7)

### CORS Errors
- Ensure backend server is running before frontend
- Check that backend has CORS enabled (already configured)

### Tasks Not Persisting
- Check that `server/data/` directory exists
- Verify file permissions for `tasks.json`

### Module Not Found Errors
- Run `npm install` in both server and client directories
- Ensure Node.js version is 18.x or higher

## 📝 Next Steps

- Review the README.md for detailed documentation
- Check TEST_CASES.md for test scenarios
- Customize styles in CSS files
- Add more features as needed
