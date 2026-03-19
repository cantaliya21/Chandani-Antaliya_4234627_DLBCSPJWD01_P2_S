/**
 * TaskStats — stat cards + animated progress bar
 */
import './TaskStats.css';

function TaskStats({ tasks, completionRate }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const highP = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const mediumP = tasks.filter(t => t.priority === 'medium' && !t.completed).length;
  const lowP = tasks.filter(t => t.priority === 'low' && !t.completed).length;

  return (
    <div className="task-stats">
      <div className="stat-card">
        <div className="stat-icon">📋</div>
        <div className="stat-content">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>

      <div className="stat-card completed">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-value">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="stat-card pending">
        <div className="stat-icon">⏳</div>
        <div className="stat-content">
          <div className="stat-value">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="stat-card progress">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      {/* Animated progress bar — spans full width */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-percent">{completionRate}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
            role="progressbar"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Priority breakdown */}
      {pending > 0 && (
        <div className="priority-breakdown">
          <div className="priority-item high">
            <span className="priority-dot" /> <span>🔴 High: {highP}</span>
          </div>
          <div className="priority-item medium">
            <span className="priority-dot" /> <span>🟡 Medium: {mediumP}</span>
          </div>
          <div className="priority-item low">
            <span className="priority-dot" /> <span>🟢 Low: {lowP}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskStats;
