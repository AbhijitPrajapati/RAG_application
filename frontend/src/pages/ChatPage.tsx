import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatInterface from '@/features/chat/ChatInterface';
import CollectionSelection from '@/features/collections/CollectionSelection';
import ConfigDrawer from '@/features/config/ConfigDrawer';

import { Button } from '@/components/ui/button';
import type { Message, Config } from '@/types';
import UploadDialog from '@/features/upload/UploadDialog';

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

	const [openUpload, setOpenUpload] = useState(false);

	const navigate = useNavigate();

	return (
		<div className='flex'>
			<div className='flex flex-col w-2/10 items-center py-8 px-10 gap-y-6'>
				<CollectionSelection
					selectedCollectionIds={selectedCollectionIds}
					toggleSelectedCollection={toggleSelectedCollection}
				/>
				<Button className='w-full' onClick={() => setOpenUpload(true)}>
					Upload
				</Button>
				<UploadDialog
					openState={openUpload}
					closeDialog={() => setOpenUpload(false)}
				/>
				<div className='w-full'>
					<Button
						className='w-full'
						onClick={() => navigate('/collections')}
					>
						Manage Collections
					</Button>
				</div>
				<ConfigDrawer
					config={config}
					updateConfig={updateConfig}
					resetConfig={resetConfig}
				/>
				<div className='w-full'>
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
