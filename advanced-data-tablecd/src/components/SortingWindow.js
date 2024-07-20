import React, { useState, useEffect } from 'react';
import './SortingWindow.css';

const SortingWindow = ({ columns, onSort, show, onClose, onClearSort }) => {
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    if (selectedColumn && sortDirection) {
      onSort(selectedColumn, sortDirection);
    }
  }, [selectedColumn, sortDirection, onSort]);

  const handleSortChange = (columnId, direction) => {
    setSelectedColumn(columnId);
    setSortDirection(direction);
  };

  const clearSort = () => {
    setSelectedColumn(null);
    setSortDirection(null);
    onClearSort();
  };

  return (
    <div className={`sorting-window ${show ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Sorting Options</h2>
      <div className="sort-list">
        {columns.map(column => (
          <div key={column.id} className="sort-item">
            <label className="sort-label">
              {column.Header}
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name={`sort_${column.id}`}
                    checked={selectedColumn === column.id && sortDirection === 'asc'}
                    onChange={() => handleSortChange(column.id, 'asc')}
                  />
                  Asc
                </label>
                <label>
                  <input
                    type="radio"
                    name={`sort_${column.id}`}
                    checked={selectedColumn === column.id && sortDirection === 'desc'}
                    onChange={() => handleSortChange(column.id, 'desc')}
                  />
                  Desc
                </label>
              </div>
            </label>
          </div>
        ))}
      </div>
      <div className="sort-footer">
        <button className="clear-sort-button" onClick={clearSort}>Clear Sort</button>
      </div>
    </div>
  );
};

export default SortingWindow;
