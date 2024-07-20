import React from 'react';
import './GroupingWindow.css';

const GroupingWindow = ({ show, onClose, onGroup, onClear, selectedGroup, setSelectedGroup }) => {
  return (
    <div className={`grouping-window ${show ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Create Groups</h2>
      <div className="window-body">
        <label htmlFor="group-select">Select a column</label>
        <select
          id="group-select"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">Select a column</option>
          <option value="category">Category</option>
          <option value="subcategory">Subcategory</option>
        </select>
      </div>
      <div className="window-footer">
        <button onClick={onClear} className="clear-button">Clear Grouping</button>
        <button onClick={onGroup} className="group-button">Apply Grouping</button>
      </div>
    </div>
  );
};

export default GroupingWindow;
