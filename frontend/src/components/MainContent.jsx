import React, { useState } from 'react';
import axios from 'axios';

const MainContent = ({ onSummaryGenerated }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Enter some text");
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/summarize/', { text });
      const result = res.data.summary;
      setSummary(result);
      onSummaryGenerated({ source: text, summary: result });
    } catch (err) {
      alert("Summarization failed");
    }
    setLoading(false);
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please upload a file (.txt or .pdf)");
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
      const result = res.data.summary;
      setSummary(result);
      onSummaryGenerated({ source: `📄 ${file.name}`, summary: result });
    } catch (err) {
      alert("Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">🧠 AI Notes Summarizer</h1>

      <textarea
        className="w-full border rounded p-3 mb-3"
        rows="6"
        placeholder="Paste your notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
        onClick={handleSummarize}
        disabled={loading}
      >
        Summarize Text
      </button>

      <div className="my-4">
        <input type="file" accept=".txt,.pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded ml-2"
          onClick={handleFileUpload}
          disabled={loading}
        >
          Upload & Summarize
        </button>
      </div>

      {loading && <p className="text-gray-500">⏳ Processing...</p>}

      {summary && (
        <div className="bg-gray-100 p-4 mt-4 border rounded">
          <h3 className="font-semibold mb-2">📋 Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
