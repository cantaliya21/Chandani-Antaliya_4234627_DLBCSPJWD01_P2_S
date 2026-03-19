/**
 * TaskList — sort controls, count badge, improved empty state
 */
import { useState, useMemo } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  const [sortBy, setSortBy] = useState('newest');

  const sorted = useMemo(() => {
    const arr = [...tasks];
    switch (sortBy) {
      case 'newest': return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest': return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'priority': return arr.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      case 'dueDate': return arr.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      case 'az': return arr.sort((a, b) => a.title.localeCompare(b.title));
      default: return arr;
    }
  }, [tasks, sortBy]);

  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state">
          <div className="empty-icon">🗒️</div>
          <p className="empty-title">No tasks yet!</p>
          <p className="empty-subtitle">Press <kbd>N</kbd> or use the form above to add your first task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="list-header">
        <h2 className="list-title">
          Your Tasks
          <span className="task-count-badge">{tasks.length}</span>
        </h2>
        <div className="sort-bar">
          <span className="sort-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            aria-label="Sort tasks"
          >
            <option value="newest">🕐 Newest</option>
            <option value="oldest">🕐 Oldest</option>
            <option value="priority">🔴 Priority</option>
            <option value="dueDate">📅 Due Date</option>
            <option value="az">🔤 A–Z</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {sorted.map((task, i) => (
          <TaskItem
            key={task.id}
            task={task}
            index={i}
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
