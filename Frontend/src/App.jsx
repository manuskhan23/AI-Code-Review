import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import { languages } from './languages'

function App() {
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [ review, setReview ] = useState(``)
  const [ language, setLanguage ] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved && languages.includes(saved)) {
      return saved;
    }
    localStorage.setItem('language', 'javascript');
    return 'javascript';
  });

  const [ inputLanguage, setInputLanguage ] = useState(language);

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      const response = await axios.post(`${API_URL}/ai/get-review`, { code, language })
      setReview(response.data)
    } catch (error) {
      setReview("Error: " + (error.response?.data || error.message))
    }
  }

  const handleApplyLanguage = () => {
    setLanguage(inputLanguage);
    localStorage.setItem('language', inputLanguage);
  };

  return (
    <>
      <main>
        <div className="left">
          <div className="code" style={{ position: 'relative' }}>
            <div
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 10,
    display: "flex",
    gap: "10px",
    background: "rgba(17, 24, 39, 0.9)",
    padding: "8px",
    borderRadius: "10px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  }}
>
  <select
    value={inputLanguage}
    onChange={(e) => setInputLanguage(e.target.value)}
    style={{
      background: "#1f2937",
      color: "#fff",
      border: "1px solid #374151",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "14px",
      outline: "none",
      cursor: "pointer",
      minWidth: "140px",
    }}
  >
    {languages.map((lang) => (
      <option key={lang} value={lang}>
        {lang}
      </option>
    ))}
  </select>

  <button
    onClick={handleApplyLanguage}
    style={{
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.target.style.background = "#1d4ed8";
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "#2563eb";
    }}
  >
    Apply
  </button>
</div>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages[language] || prism.languages.javascript, language)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
                overflow: "auto"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          <Markdown

            rehypePlugins={[ rehypeHighlight ]}

          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}



export default App
