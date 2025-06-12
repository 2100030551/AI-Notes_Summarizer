import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotesSummarizer.css';

const NotesSummarizer = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);

  // Load chat history on mount
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setChats(storedChats);
  }, []);

  // Save new summary to chat history
  const saveToHistory = (source, summary) => {
    const newEntry = { id: Date.now(), source, summary };
    const updated = [...chats, newEntry];
    setChats(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
  };

  // Delete a chat from history
  const deleteHistoryItem = (id) => {
    const updated = chats.filter(item => item.id !== id);
    setChats(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
  };

  // Summarize plain text
  const handleTextSummarize = async () => {
    if (!text.trim()) return alert("Please enter some text");
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/summarize/', { text });
      const result = res.data.summary;
      saveToHistory(text, result);
      setText('');
    } catch (err) {
      alert("Error summarizing text");
    }
    setLoading(false);
  };

  // Upload and summarize file
  const handleFileUpload = async () => {
    if (!file) return alert("Please upload a .txt or .pdf file");
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const result = res.data.summary;
      saveToHistory(`📄 ${file.name}`, result);
      setFile(null);
    } catch (err) {
      alert("Error uploading file");
    }
    setLoading(false);
  };

  return (
    <div className="notes-summarizer">
      <h2>🧠 AI Notes Summarizer</h2>

      <textarea
        placeholder="Enter or paste notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="buttons-row">
        <button
          className="btn-summarize"
          onClick={handleTextSummarize}
          disabled={loading}
        >
          Summarize Text
        </button>

        <input
          type="file"
          accept=".txt,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={loading}
          aria-label="Upload notes file"
        />

        <button
          className="btn-upload"
          onClick={handleFileUpload}
          disabled={loading || !file}
        >
          Upload & Summarize
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}

      {chats.length > 0 && (
        <div className="chat-box">
          <h3>🧾 Chat History</h3>
          {chats.map(({ id, source, summary }) => (
            <div key={id} className="chat-message">
              <p><strong>📝 You:</strong> {source.length > 500 ? source.slice(0, 500) + '...' : source}</p>
              <p><strong>🧠 Summary:</strong> {summary}</p>
              <button
                onClick={() => deleteHistoryItem(id)}
                className="text-red-500 text-xs mt-1 underline"
              >
                🗑️ Delete
              </button>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesSummarizer;
