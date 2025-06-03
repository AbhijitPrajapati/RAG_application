import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function Query() {
    const [query, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      setResponse('')
  
      try {
        const res = await fetch('http://localhost:8000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: query }),
        });

        const reader = res.body?.getReader();  
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader!.read();
          if (done) break;
      
          setResponse(prev => prev + decoder.decode(value, { stream: true }));
        }
        if (buffer.length > 0 && buffer.startsWith('data: ')) {
          console.log('Received last data:', buffer.slice(6));
        }
        console.log('Stream ended');
  
      } catch (err) {
        setResponse('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };


    return (
      <div>
      <form onSubmit={handleSubmit}>
        <Textarea
          rows={4}
          value={query}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type your message here...'
        />
        <Button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
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