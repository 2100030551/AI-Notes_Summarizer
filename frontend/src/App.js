import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { loadHistory, saveToHistory } from './utils/historyUtils';

function App() {
  const [history, setHistory] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleSummaryGenerated = (entry) => {
    saveToHistory(entry);
    setHistory(loadHistory());
    setSelectedSummary(entry);
  };

  const handleSelectHistory = (entry) => {
    setSelectedSummary(entry);
  };

  const handleNewChat = () => {
    setSelectedSummary(null);
  };

  // ✅ Add this function
  const deleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
  };

  return (
    <div className="app-container">
      <Sidebar
        history={history} // ✅ fixed from chats → history
        onNewChat={handleNewChat}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={deleteHistoryItem} // ✅ pass the function
      />

      <main className="main-content">
        {selectedSummary ? (
          <div className="summary-container">
            <h2 className="summary-title">📋 Summary:</h2>
            <p className="summary-text">{selectedSummary.summary}</p>
            <button className="back-button" onClick={handleNewChat}>
              ⬅️ Back to New Chat
            </button>
          </div>
        ) : (
          <MainContent onSummaryGenerated={handleSummaryGenerated} />
        )}
      </main>
    </div>
  );
}

export default App;
