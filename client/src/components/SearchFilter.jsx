/**
 * SearchFilter Component
 * 
 * Provides search and filter functionality:
 * - Search by title/description
 * - Filter by priority
 * - Filter by category
 * - Filter by completion status
 */

import './SearchFilter.css';

function SearchFilter({
  searchQuery,
  onSearchChange,
  filterPriority,
  onPriorityChange,
  filterCategory,
  onCategoryChange,
  filterStatus,
  onStatusChange,
  tasks
}) {
  // Get unique categories from tasks
  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))];

  return (
    <div className="search-filter-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            value={filterPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {(searchQuery || filterPriority !== 'all' || filterCategory !== 'all' || filterStatus !== 'all') && (
          <button
            onClick={() => {
              onSearchChange('');
              onPriorityChange('all');
              onCategoryChange('all');
              onStatusChange('all');
            }}
            className="clear-filters"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;
