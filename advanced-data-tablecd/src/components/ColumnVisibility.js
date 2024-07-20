import React from 'react';
import './ColumnVisibility.css';

const ColumnVisibility = ({ columns, onToggleColumn, show, onClose, onApply, onShowAll }) => {
  return (
    <div className={`column-visibility ${show ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Show/Hide Columns</h2>
      <div className="column-list">
        {columns.map(column => (
          <div key={column.id} className="column-item">
            <label>
              <span>{column.Header}</span>
              <input
                type="checkbox"
                checked={!column.isHidden}
                onChange={() => onToggleColumn(column.id)}
              />
            </label>
          </div>
        ))}
      </div>
      <div className="column-footer">
        <button className="show-all-button" onClick={onShowAll}>Show all columns</button>
        <button className="apply-button" onClick={onApply}>Apply</button>
      </div>
    </div>
  );
};

export default ColumnVisibility;
