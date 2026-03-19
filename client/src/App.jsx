/**
 * Main App Component
 * Features: rotating quotes, confetti on 100%, keyboard shortcut (N key),
 *           dark mode, search/filter, task stats
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import SearchFilter from './components/SearchFilter';
import { API_BASE_URL } from './config';
import './App.css';

const QUOTES = [
  '✨ One task at a time — progress, not perfection.',
  '🚀 Every completed task is a step forward.',
  '💡 Break big goals into small wins.',
  '🎯 Focus is the superpower of the productive.',
  '⚡ Done is better than perfect.',
  '🌟 Small steps lead to big achievements.',
  '🔥 Your future self will thank you.',
  '🎉 Celebrate every completed task!',
];

const CONFETTI_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#f97316'];

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [prevRate, setPrevRate] = useState(0);

  const taskFormRef = useRef(null); // ref for keyboard shortcut to focus task title

  // ── Session restore ──────────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserId = localStorage.getItem('userId');
    const storedDark = localStorage.getItem('darkMode');
    if (storedUser && storedUserId) setUser(JSON.parse(storedUser));
    else setLoading(false);
    if (storedDark === 'true') setDarkMode(true);
  }, []);

  // ── Fetch tasks when user changes ────────────────────────────────
  useEffect(() => { if (user) fetchTasks(); }, [user]);

  // ── Persist dark mode ─────────────────────────────────────────────
  useEffect(() => { localStorage.setItem('darkMode', darkMode.toString()); }, [darkMode]);

  // ── Rotating quotes ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => setQuoteIndex(i => (i + 1) % QUOTES.length), 8000);
    return () => clearInterval(id);
  }, [user]);

  // ── Confetti when all tasks complete ──────────────────────────────
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  useEffect(() => {
    if (completionRate === 100 && prevRate < 100 && tasks.length > 0) {
      triggerConfetti();
    }
    setPrevRate(completionRate);
  }, [completionRate]);

  const triggerConfetti = () => {
    const particles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: `${6 + Math.random() * 10}px`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${2.5 + Math.random() * 2}s`,
      shape: Math.random() > 0.5 ? '50%' : '2px',
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 5000);
  };

  // ── Keyboard shortcut: N → focus task title ───────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (e.key === 'n' && tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
        e.preventDefault();
        taskFormRef.current?.focusTitle();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Client-side filter ────────────────────────────────────────────
  useEffect(() => {
    let filtered = [...tasks];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    }
    if (filterPriority !== 'all') filtered = filtered.filter(t => t.priority === filterPriority);
    if (filterCategory !== 'all') filtered = filtered.filter(t => t.category === filterCategory);
    if (filterStatus === 'completed') filtered = filtered.filter(t => t.completed);
    else if (filterStatus === 'pending') filtered = filtered.filter(t => !t.completed);
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterPriority, filterCategory, filterStatus]);

  // ── API helpers ───────────────────────────────────────────────────
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      const res = await axios.get(`${API_BASE_URL}/tasks`, { headers: { 'user-id': userId } });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) { handleLogout(); setError('Session expired. Please login again.'); }
      else setError('Failed to load tasks. Make sure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => { setUser(userData); setError(null); };
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    setTasks([]);
    setFilteredTasks([]);
  };

  const refresh = () => fetchTasks();

  // ── Auth screens ──────────────────────────────────────────────────
  if (!user) {
    return (
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        {showRegister
          ? <Register onLogin={handleLogin} onSwitchToLogin={() => setShowRegister(false)} />
          : <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
        }
      </div>
    );
  }

  // ── Main App ──────────────────────────────────────────────────────
  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Confetti overlay */}
      {confetti.length > 0 && (
        <div className="confetti-overlay" aria-hidden>
          {confetti.map(p => (
            <div
              key={p.id}
              className="confetti-particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: p.shape,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      )}

      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📋 Task Manager</h1>
            <p className="subtitle">Welcome back, <strong>{user.username}</strong>!</p>
          </div>
          <div className="header-actions">
            <button onClick={() => setDarkMode(d => !d)} className="theme-toggle" aria-label="Toggle dark mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
        {/* Motivational quote */}
        <div className="quote-bar">
          <p className="quote-text" key={quoteIndex}>{QUOTES[quoteIndex]}</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <TaskStats tasks={tasks} completionRate={completionRate} />

          <SearchFilter
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            filterPriority={filterPriority} onPriorityChange={setFilterPriority}
            filterCategory={filterCategory} onCategoryChange={setFilterCategory}
            filterStatus={filterStatus} onStatusChange={setFilterStatus}
            tasks={tasks}
          />

          <TaskForm ref={taskFormRef} onTaskCreated={refresh} />

          {loading && (
            <div className="loading-message">
              <div className="spinner" />
              <p>Loading tasks…</p>
            </div>
          )}

          {error && <div className="error-banner" role="alert">{error}</div>}

          {!loading && !error && (
            <TaskList
              tasks={filteredTasks}
              onTaskUpdated={refresh}
              onTaskDeleted={refresh}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ⚛️ React &amp; Express · SQLite Database · Press <kbd>N</kbd> to add a task</p>
      </footer>
    </div>
  );
}

export default App;
