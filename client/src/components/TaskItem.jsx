/**
 * TaskItem — glassmorphism card, slide-in animation, inline delete confirm
 */
import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './TaskItem.css';

function TaskItem({ task, onTaskUpdated, onTaskDeleted, index = 0 }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      const userId = localStorage.getItem('userId');
      await axios.put(`${API_BASE_URL}/tasks/${task.id}`, { completed: !task.completed }, {
        headers: { 'user-id': userId }
      });
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`${API_BASE_URL}/tasks/${task.id}`, { headers: { 'user-id': userId } });
      if (onTaskDeleted) onTaskDeleted();
    } catch (err) {
      console.error('Error deleting task:', err);
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const priorityClass = `priority-${task.priority || 'medium'}`;

  const getPriorityLabel = () => ({ high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' })[task.priority || 'medium'];

  return (
    <div
      className={`task-item ${priorityClass} ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="task-content">
        {/* Custom animated checkbox */}
        <label className="checkbox-container" aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}>
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isUpdating || isDeleting}
          />
          <span className="checkmark" />
        </label>

        <div className="task-text">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-badges">
              <span className={`priority-badge ${priorityClass}`}>{getPriorityLabel()}</span>
              {task.category && task.category !== 'general' && (
                <span className="category-badge">📁 {task.category}</span>
              )}
            </div>
          </div>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            {task.dueDate && (
              <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue && ' ⚠️ Overdue!'}
              </span>
            )}
            {task.createdAt && (
              <small className="task-date">Created: {new Date(task.createdAt).toLocaleDateString()}</small>
            )}
          </div>
        </div>
      </div>

      {/* Delete — inline confirm instead of alert() */}
      <div className="task-actions">
        {confirmDelete ? (
          <div className="delete-confirm">
            <span className="delete-confirm-text">Delete this task?</span>
            <div className="delete-confirm-buttons">
              <button className="confirm-yes" onClick={handleDeleteConfirmed} disabled={isDeleting}>
                {isDeleting ? '…' : 'Yes'}
              </button>
              <button className="confirm-no" onClick={() => setConfirmDelete(false)}>No</button>
            </div>
          </div>
        ) : (
          <button
            className="delete-button"
            onClick={() => setConfirmDelete(true)}
            disabled={isDeleting || isUpdating}
            aria-label="Delete task"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
