import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ChatInterface from '@/components/ChatInterface';
import CollectionSelection from '@/components/CollectionSelection';
import ConfigDrawer from '@/components/ConfigDrawer';
import QuickUpload from '@/components/QuickUpload';

import { Button } from '@/components/ui/button';
import type { Message, Config } from '@/types';

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([]);

	const defaultConfig = {
		n_chunks: 4,
		max_tokens: 512,
		temperature: 0.7,
	};
	const [config, setConfig] = useState<Config>(defaultConfig);

	const updateConfig = <K extends keyof Config>(key: K, value: Config[K]) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
	};

	const resetConfig = () => setConfig(defaultConfig);

	const [selectedCollectionIds, setSelectedCollectionIds] = useState<
		Set<number>
	>(new Set());

	const toggleSelectedCollection = (id: number) => {
		const newSet = new Set(selectedCollectionIds);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		setSelectedCollectionIds(newSet);
	};

	return (
		<div className='flex'>
			<div className='flex flex-col w-2/10 items-center p-8'>
				<CollectionSelection
					selectedCollectionIds={selectedCollectionIds}
					toggleSelectedCollection={toggleSelectedCollection}
				/>
				<QuickUpload />
				<div className='w-full p-3'>
					<Button className='w-full' asChild>
						<Link to='/collections'>Manage Collections</Link>
					</Button>
				</div>
				<ConfigDrawer
					config={config}
					updateConfig={updateConfig}
					resetConfig={resetConfig}
				/>
				<div className='w-full p-3'>
					<Button onClick={() => setMessages([])} className='w-full'>
						Clear Chat
					</Button>
				</div>
			</div>
			<ChatInterface
				messages={messages}
				setMessages={setMessages}
				selectedCollectionIds={selectedCollectionIds}
				config={config}
			/>
		</div>
	);
}
