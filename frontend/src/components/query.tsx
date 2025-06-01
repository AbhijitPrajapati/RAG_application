import React, { useState } from 'react';

export default function Query() {
    const [query, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const res = await fetch('http://localhost:8000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: query }),
        });
  
        const data = await res.json();
        setResponse(data.response); // adjust based on API response format
      } catch (err) {
        setResponse('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };


    return (
      <div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          value={query}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type your message here...'
        />
        <button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {response && (
        <div>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
    );
  }