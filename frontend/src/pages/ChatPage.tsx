import React, { useEffect, useState } from 'react';

import ChatInterface from '@/components/ChatInterface';
import CollectionSelection from '@/components/CollectionSelection';
import ConfigDrawer from '@/components/ConfigDrawer';
import QuickUpload from '@/components/QuickUpload';

import { Button } from '@/components/ui/button';
import { Message, Config } from '@/types';

const DEFAULT_CONFIG = {
  n_chunks: 4,
  max_tokens: 512,
  temperature: 0.7
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  useEffect(() => {
    fetch('http://localhost:8000/collections')
        .then(res => res.json())
        .then(data => setCollections(data['collections']))
        .catch(console.error)
  }, []);

  const toggleCollection = (name: string) => {
    setSelected(prev => {
        const next = new Set(prev);
        if (next.has(name)) {
            next.delete(name);
        } else {
            next.add(name);
        }
        return next;
    });
  };

  return (
    <div className='flex'>
      <div className='flex flex-col w-2/10 items-center p-8'>
        <CollectionSelection selected={selected} toggleCollection={toggleCollection} collections={collections}/>
        <QuickUpload collections={collections} />
        <ConfigDrawer config={config} setConfig={setConfig} resetConfig={() => setConfig(DEFAULT_CONFIG)}/>
        <div className='w-full p-3'>
          <Button onClick={() => setMessages([])} className='w-full'>Clear Chat</Button>
        </div>
      </div>
      <ChatInterface selectedCollections={selected} messages={messages} setMessages={setMessages} config={config}/>
    </div>
  );
}