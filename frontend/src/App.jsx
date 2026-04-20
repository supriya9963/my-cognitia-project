// Cognitia AI Assistant - Main React Component
// Handles user input, API calls to backend, and displays AI responses
import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAsk = async () => {
    if (!question.trim()) {
      setError('Please enter a question.')
      return
    }
    setLoading(true)
    setError('')
    setAnswer('')
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ask`,
        { question }
      )
      setAnswer(response.data.answer)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>🤖 Cognitia AI Assistant</h1>
      <p className="subtitle">Ask me anything!</p>
      <div className="input-section">
        <textarea
          className="question-input"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
        />
        <button
          className="ask-button"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {answer && (
        <div className="answer-section">
          <h2>Answer:</h2>
          <p className="answer-text">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default App