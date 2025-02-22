import React, { useState } from "react";
import "./QueryForm.css";

const QueryForm = () => {
  const [query, setQuery] = useState("");
  const [inputType, setInputType] = useState("attach");
  const [jsonText, setJsonText] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const formData = new FormData();
    formData.append("query", query);

    if (inputType === "attach" && file) {
      formData.append("file", file);
    } else {
      formData.append("jsonText", jsonText);
    }

    try {
      const res = await fetch("http://localhost:3000/fetchsql", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setResponse({ error: "Failed to fetch response" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-container">
      {/* Left: Input Section */}
      <div className="input-section">
        <h2 className="title">AI Table Selection</h2>
        <form onSubmit={handleSubmit} className="query-form">
          <div className="form-group">
            <label className="form-label">Enter your query:</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., Show me all orders from last month"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Choose Input Type:</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="dropdown"
            >
              <option value="attach">Attach a File</option>
              <option value="paste">Paste JSON</option>
            </select>
          </div>

          {inputType === "attach" ? (
            <div className="form-group">
              <label className="form-label">Upload JSON File:</label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Paste JSON Schema:</label>
              <textarea
                rows="6"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='{"tables": [{"name": "orders", "columns": ["id", "date"]}]}'
                className="textarea"
              ></textarea>
            </div>
          )}

          <button type="submit" className="process-btn" disabled={loading}>
            {loading ? "Processing..." : "Generate query"}
          </button>
        </form>
      </div>

      {/* Right: Output Section */}
      <div className="output-section">
        <h2 className="title">Response</h2>
        {loading ? (
          <p className="loading-text">Processing your query...</p>
        ) : response ? (
          <pre className="response-box">
            {
  response.split('\n').map(function( item, idx) {
    return (
        <span key={idx}>
          {item}
          <br/>
        </span>
        )
        })
        }
          </pre>
        ) : (
          <p className="placeholder-text">Processed output will appear here...</p>
        )}
      </div>
    </div>
  );
};

export default QueryForm;