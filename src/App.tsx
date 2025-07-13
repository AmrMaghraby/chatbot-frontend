import { useState } from 'react';
import './App.css';

interface ChatResponse {
  message?: string;
  tool_call?: string;
  arguments?: Record<string, string>;
  result?: string;
  error?: string;
}

function App() {
  const [message, setMessage] = useState('');
  const [model, setModel] = useState<'gpt-4' | 'llama3'>('gpt-4');
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const sendMessage = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${apiUrl}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          session_id: 'frontend-ui-session',
          model
        })
      });

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🧠 LLM Chatbot</h1>
      <textarea
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div style={{ marginTop: 10 }}>
        <label>Model: </label>
        <select value={model} onChange={(e) => setModel(e.target.value as any)}>
          <option value="gpt-4">GPT-4</option>
          <option value="llama3">LLaMA3</option>
        </select>
        <button onClick={sendMessage} disabled={loading || !message.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="response">
        {response && (
          <pre>{JSON.stringify(response, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default App;
