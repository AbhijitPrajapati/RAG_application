import React, { useState } from 'react';
import { useSelectedIds } from '@/stores/useSelectedCollectionsStore';
import { useConfigSnapshot } from '@/stores/useConfigStore';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import { Message } from '@/types';

interface ChatInterfaceProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export default function ChatInterface({ messages, setMessages }: ChatInterfaceProps) {
  const [query, setInput] = useState('');
  const selected_ids = useSelectedIds();
  const config = useConfigSnapshot();

  const streamResponse = async (body) => {
    const updateMessage = (chunk) => {
      setMessages(prev => {
        const updated = [...prev];
        const idx = updated.length - 1;
        updated[idx] = {
          ...updated[idx],
          content: updated[idx].content + chunk
        };
        return updated;
      });
    };

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;

      updateMessage(decoder.decode(value, { stream: true }));
    }
    if (buffer.length > 0 && buffer.startsWith('data: ')) {
      console.log('Received last data:', buffer.slice(6));
    }
    console.log('Stream ended');
  };


  const fetchResponse = async (q) => {
    return fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: q,
        selected_collection_ids: Array.from(selected_ids),
        ...config
      }),
    })
      .then(res => res.body)
      .catch(err => setMessages(
        prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]
      ));
  };

  const sendMessage = async (e) => {
    if (!query.trim()) return;
    if (selected_ids.size === 0) {
      toast('No collections have been selected');
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');

    const body = await fetchResponse(query);
    await streamResponse(body);
  };

  return (
    <Card className='fixed right-0 h-screen w-8/10 flex-col'>
      <CardContent className='h-9/10'>
        <ScrollArea className='h-full'>
          <div className='space-y-4'>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-3 text-sm w-fit max-w-[80%] ${msg.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted text-muted-foreground"
                  }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <div className='max-w-[40vw] mx-auto flex gap-2'>
        <Input
          value={query}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
          placeholder='Type your message...'
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
      <Toaster />
    </Card>
  );
}


