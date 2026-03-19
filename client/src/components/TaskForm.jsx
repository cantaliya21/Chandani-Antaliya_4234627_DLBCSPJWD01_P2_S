/**
 * TaskForm — with forwardRef so App can focus title via keyboard shortcut (N key)
 */
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './TaskForm.css';

const TaskForm = forwardRef(function TaskForm({ onTaskCreated }, ref) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const titleInputRef = useRef(null);

  // Expose focusTitle() to parent via ref
  useImperativeHandle(ref, () => ({
    focusTitle: () => {
      titleInputRef.current?.focus();
      titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Task title is required.'); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`${API_BASE_URL}/tasks`, {
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category.trim() || 'general',
        dueDate: dueDate || null
      }, { headers: { 'user-id': userId } });

      setTitle(''); setDescription(''); setPriority('medium');
      setCategory('general'); setDueDate('');
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>
        <span className="form-icon">➕</span>
        Add New Task
        <span className="kbd-hint">Press N</span>
      </h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              ref={titleInputRef}
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              disabled={isSubmitting}
              className={error && !title.trim() ? 'error' : ''}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={e => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add details (optional)…"
            rows="3"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. work, personal, shopping"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="submit-button"
        >
          {isSubmitting ? '⏳ Adding…' : '➕ Add Task'}
        </button>
      </form>
    </div>
  );
});

export default TaskForm;
