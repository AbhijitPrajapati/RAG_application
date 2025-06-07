import React, { useEffect, useState } from 'react';

import ChatInterface from '@/components/ChatInterface';
import CollectionSelection from '@/components/CollectionSelection';

export default function ChatPage() {
  const [collections, setCollections] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
      <div className='flex-col w-2/10'>
        <CollectionSelection selected={selected} toggleCollection={toggleCollection} collections={collections}/>
      </div>
      <ChatInterface selectedCollections={selected}/>
    </div>
  );
}