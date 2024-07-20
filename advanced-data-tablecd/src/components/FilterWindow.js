import React, { useState, useEffect } from 'react';
import './FilterWindow.css';

const FilterWindow = ({ columns, filters, setFilter, show, onClose, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (columnId, value) => {
    setLocalFilters({
      ...localFilters,
      [columnId]: value,
    });
    setFilter(columnId, value);
  };

  const handleClearFilter = (columnId) => {
    handleInputChange(columnId, '');
  };

  return (
    <div className={`filter-window ${show ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Filters</h2>
      <div className="filter-list">
        {columns.map(column => (
          <div key={column.id} className="filter-item">
            <label className="filter-label">
              {column.Header}
              <div className="filter-input">
                <input
                  type="text"
                  value={localFilters[column.id] || ''}
                  onChange={(e) => handleInputChange(column.id, e.target.value)}
                />
                <button onClick={() => handleClearFilter(column.id)}>⟲</button>
              </div>
            </label>
          </div>
        ))}
      </div>
      <div className="filter-footer">
        <button className="clear-filters-button" onClick={onClearFilters}>Clear Filters</button>
      </div>
    </div>
  );
};

export default FilterWindow;
