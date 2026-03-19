# Task Manager - React + Express Full-Stack Application

A modern task management application built with React frontend and Express backend, demonstrating full-stack development with REST API architecture.

##  Tech Stack

- **Frontend**: React 18, Vite, Axios
- **Backend**: Node.js, Express
- **Database**: SQLite (sql.js — WebAssembly, no native compilation needed)
- **Authentication**: bcryptjs for password hashing
- **Styling**: CSS3 with custom properties, Flexbox, and Media Queries

##  Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher

##  Project Structure

```
task-manager-app/
├── server/
│   ├── server.js          # Express server and all API routes
│   ├── database.js        # sql.js (WebAssembly SQLite) setup & wrapper
│   ├── routes/
│   │   └── tasks.js       # Route module placeholder
│   ├── data/
│   │   └── taskmanager.db # SQLite database file (auto-created)
│   └── package.json       # Backend dependencies
├── client/
│   ├── src/
│   │   ├── config.js              # Shared API base URL (single source of truth)
│   │   ├── components/
│   │   │   ├── Login.jsx          # Login component
│   │   │   ├── Register.jsx       # Registration component
│   │   │   ├── Auth.css           # Shared auth styles
│   │   │   ├── TaskForm.jsx       # Task creation form
│   │   │   ├── TaskList.jsx       # Task list container
│   │   │   ├── TaskItem.jsx       # Individual task component
│   │   │   ├── TaskStats.jsx      # Task statistics dashboard
│   │   │   └── SearchFilter.jsx   # Search and filter controls
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   ├── App.css                # App-level styles
│   │   └── index.css              # Global CSS design tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json               # Frontend dependencies
└── README.md
```

## 🛠️ Installation

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 3: (Optional) Configure API URL via environment variable

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

If not set, the app defaults to `http://localhost:3001/api`.

##  Running the Application

### Start the Backend Server

Open a terminal and run:

```bash
cd server
npm start
```

The server will start on `http://localhost:3001`

### Start the Frontend Development Server

Open a **new terminal** and run:

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

##  Access the Application

Once both servers are running, access the application at:

**http://localhost:3000**

## 📡 API Endpoints

| Method | Route | Auth Required | Description |
|--------|-------|:---:|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login with email and password |
| `GET` | `/api/tasks` | ✅ | Retrieve all tasks for authenticated user |
| `POST` | `/api/tasks` | ✅ | Create a new task |
| `PUT` | `/api/tasks/:id` | ✅ | Update a task (partial update supported) |
| `DELETE` | `/api/tasks/:id` | ✅ | Delete a task |

### Authentication

All task endpoints require a `user-id` header containing the authenticated user's ID:

```
user-id: <user-uuid>
```

### Example API Usage

**Register:**
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Create Task:**
```bash
POST http://localhost:3001/api/tasks
Content-Type: application/json
user-id: <user-id>

{
  "title": "Complete assignment",
  "description": "Finish Phase 2 development",
  "priority": "high",
  "category": "work",
  "dueDate": "2026-03-10"
}
```

**Toggle Completion:**
```bash
PUT http://localhost:3001/api/tasks/:id
Content-Type: application/json
user-id: <user-id>

{
  "completed": true
}
```

## ✨ Features

### Core Features
- ✅ User authentication (Login & Registration)
- ✅ Create tasks with title, description, priority, category, and due date
- ✅ Toggle task completion status
- ✅ Delete tasks
- ✅ User-specific task management (each user sees only their tasks)
- ✅ Persistent data storage with SQLite database
- ✅ Secure password hashing with bcryptjs (10 salt rounds)

### UI/UX Features
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode toggle with localStorage persistence
- ✅ Show/hide password toggle on all password fields
- ✅ Real-time updates after backend operations
- ✅ Error handling and validation (client-side & server-side)
- ✅ Session management with localStorage
- ✅ Loading spinner during API calls

### Task Management Features
- ✅ Priority levels: 🔴 High, 🟡 Medium, 🟢 Low
- ✅ Custom categories (free-form text)
- ✅ Due date picker (restricted to today and future dates)
- ✅ Overdue task highlighting
- ✅ Task statistics dashboard (total, completed, pending, progress %)
- ✅ Search tasks by title or description
- ✅ Filter by priority, category, and completion status
- ✅ Clear all filters in one click

## 🎯 Dynamic Backend Interactions

This application demonstrates **multiple dynamic backend interactions**:

1. **User Registration**: Form → `POST /api/auth/register` → User stored in SQLite → Auto-login
2. **User Login**: Credentials → `POST /api/auth/login` → Password verified with bcrypt → Session established
3. **Create Task**: Form → `POST /api/tasks` → Task saved to SQLite → Frontend refreshes
4. **Toggle Completion**: Checkbox → `PUT /api/tasks/:id` → Database updated → Frontend refreshes
5. **Delete Task**: Delete button → `DELETE /api/tasks/:id` → Removed from SQLite → Frontend refreshes
6. **Fetch Tasks**: Component mount → `GET /api/tasks` → User's tasks loaded from SQLite

## 🗄️ Database Schema

**Users Table:**

| Column | Type | Constraint |
|--------|------|------------|
| id | TEXT | PRIMARY KEY (UUID v4) |
| username | TEXT | NOT NULL, UNIQUE |
| email | TEXT | NOT NULL, UNIQUE |
| password | TEXT | NOT NULL (bcrypt hash) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

**Tasks Table:**

| Column | Type | Constraint / Default |
|--------|------|------------|
| id | TEXT | PRIMARY KEY (UUID v4) |
| user_id | TEXT | NOT NULL (→ users.id) |
| title | TEXT | NOT NULL |
| description | TEXT | — |
| priority | TEXT | DEFAULT 'medium' |
| category | TEXT | DEFAULT 'general' |
| due_date | DATETIME | — |
| completed | INTEGER | DEFAULT 0 (0=false, 1=true) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## 🏗️ Architecture

### Backend Architecture

- **Express REST API**: All routes defined in `server.js` with full CRUD support
- **sql.js (WebAssembly SQLite)**: Chosen over `better-sqlite3` to avoid Windows native build-tool dependencies. Data held in-memory and flushed to disk on every write + every 5 seconds.
- **`database.js` shim**: Wraps the async sql.js API to expose a synchronous `prepare().get()/.all()/.run()` interface compatible with better-sqlite3 conventions
- **Dynamic UPDATE builder**: PUT route builds the SQL query from only the fields present in the request body (supports true partial updates)
- **Authentication middleware**: Validates `user-id` header on all task routes
- **Password security**: bcryptjs with 10 salt rounds

### Frontend Architecture

| File | Responsibility |
|------|---------------|
| `config.js` | Single source of truth for `API_BASE_URL` (reads from env, falls back to localhost) |
| `App.jsx` | Auth state, task state, filtering logic, dark mode |
| `Login.jsx` | Email + password form; normalises email before sending |
| `Register.jsx` | Registration form with client-side username regex validation |
| `TaskForm.jsx` | Task creation with priority, category, due date |
| `TaskList.jsx` | Renders list of `TaskItem` components |
| `TaskItem.jsx` | Single task: toggle, delete, priority/category badges, overdue highlight |
| `TaskStats.jsx` | Derived statistics from tasks array (no API call) |
| `SearchFilter.jsx` | Client-side search + filter controls |

### Component Hierarchy

```
App
├── Login / Register        (unauthenticated)
└── (authenticated)
    ├── TaskStats
    ├── SearchFilter
    ├── TaskForm
    └── TaskList
        └── TaskItem (×n)
```

### CSS Design System

Global design tokens defined in `index.css` via CSS custom properties:
- Color palette (primary, success, danger, warning)
- Dark mode overrides via `.app.dark-mode` class
- Spacing scale (xs / sm / md / lg / xl)
- Border radius, shadows
- Smooth theme transitions (`0.3s ease`)

## 📱 Responsive Design

- Mobile-first CSS approach
- Flexible layouts using Flexbox
- Media queries at `768px` breakpoint
- `font-size: 16px` on inputs (prevents iOS auto-zoom)
- Touch-friendly button sizing

## 🔐 Authentication Flow

```
Register → bcrypt.hash(password, 10) → INSERT INTO users
         → return { user } → localStorage.setItem('user', 'userId')
         → App: setUser() → main app shown

Login    → SELECT user WHERE email = ? → bcrypt.compare()
         → return { user } → localStorage.setItem('user', 'userId')
         → App: setUser() → main app shown

Task API → headers: { 'user-id': localStorage.getItem('userId') }
         → server: authenticateUser middleware → req.userId
         → all queries: WHERE user_id = req.userId

Logout   → localStorage.removeItem('user', 'userId')
         → App: setUser(null) → Login screen shown
```

## ✅ Input Validation

### Client-Side

| Field | Rule |
|-------|------|
| Username | 3–30 chars; letters, digits, underscores only — no spaces (`/^[a-zA-Z0-9_]{3,30}$/`) |
| Email | Trimmed + lowercased before sending; HTML5 `type="email"` |
| Password | Minimum 6 characters |
| Confirm Password | Must match password field |
| Task Title | Cannot be empty or whitespace-only |
| Due Date | Restricted to today or future dates |

### Server-Side

| Route | Validation |
|-------|------------|
| Register | All fields required; password ≥ 6 chars; unique email & username |
| Login | Email and password required |
| Create Task | Title required |
| Update Task | Task must exist and belong to authenticated user |
| Delete Task | Task must exist and belong to authenticated user |

## 🧪 Test Cases

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| TC01 | Create valid task | Task appears in list immediately |
| TC02 | Submit empty task title | Validation error shown, no API call |
| TC03 | Toggle task completion | Checkbox + visual style update |
| TC04 | Delete task (confirm) | Task removed permanently |
| TC05 | Refresh page | All tasks persist (SQLite) |
| TC06 | Login with wrong password | "Invalid credentials" error |
| TC07 | Register with existing email | "User already exists" error |
| TC08 | Username with spaces | Client validation rejects it |
| TC09 | Password mismatch on register | "Passwords do not match" error |
| TC10 | Filter by priority | Only matching tasks shown |

## � Development Notes

- Backend runs on port **3001**; frontend on port **3000**
- Both servers must run simultaneously
- SQLite database: `server/data/taskmanager.db` — auto-initialised on first start
- API URL is configured in `client/src/config.js` — override via `VITE_API_BASE_URL` env variable
- Database auto-saves every 5 seconds and after every write operation
- CORS is fully open — restrict origins before any production deployment

## � Changes from Phase 1

**Originally Planned**: HTML/CSS/JavaScript (vanilla) with JSON file storage  
**Final Implementation**: React + Express + SQLite (component-based architecture with database)

**Reasons for Change**:
- Better state management with React hooks
- Improved code modularity and reusability
- SQLite database for reliable data persistence
- User authentication for secure multi-user support
- Modern development practices and tooling (Vite)
- Better separation of frontend and backend concerns

## 📄 License

This project is created for educational purposes as part of an assignment (DLBCSPJWD01-2).
