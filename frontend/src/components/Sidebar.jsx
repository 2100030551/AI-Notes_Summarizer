import React from 'react';
import "./Sidebar.css"
const Sidebar = ({ history, onNewChat, onSelectHistory, onDeleteHistory }) => {
  return (
    <div className="sidebar">
      <h2>AI Notes</h2>
      <button onClick={onNewChat}>+ New Chat</button>
      <div>
        <h3>🕓 History</h3>
        {history.length === 0 && <p>No history yet.</p>}
        {history.map((item, index) => (
          <div key={index} className="history-item-wrapper">
            <div
              className="history-item"
              onClick={() => onSelectHistory(item)}
            >
              {item.source?.substring(0, 30) || 'Untitled'}...
            </div>
            <button
              className="delete-btn"
              onClick={() => onDeleteHistory(item.id)}
              aria-label={`Delete ${item.source}`}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
