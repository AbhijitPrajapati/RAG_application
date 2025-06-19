import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ChatInterface from '@/components/ChatInterface';
import CollectionSelection from '@/components/CollectionSelection';
import ConfigDrawer from '@/components/ConfigDrawer';
import QuickUpload from '@/components/QuickUpload';
import { useFetchCollections } from '@/stores/useCollectionStore'

import { Button } from '@/components/ui/button';
import { Message } from '@/types';



export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const fetchCollections = useFetchCollections();

  useEffect(() => {
    fetchCollections()
  }, []);

  return (
    <div className='flex'>
      <div className='flex flex-col w-2/10 items-center p-8'>
        <CollectionSelection/>
        <QuickUpload/>
        <div className='w-full p-3'>
          <Button className='w-full' asChild>
            <Link to='/collections'>Manage Collections</Link>
          </Button>
        </div>
        <ConfigDrawer/>
        <div className='w-full p-3'>
          <Button onClick={() => setMessages([])} className='w-full'>Clear Chat</Button>
        </div>
      </div>
      <ChatInterface messages={messages} setMessages={setMessages} />
    </div>
  );
}