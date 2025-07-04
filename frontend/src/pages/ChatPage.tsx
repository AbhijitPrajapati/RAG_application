import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatInterface from '@/features/chat/ChatInterface';
import CollectionMultiSelection from '@/features/collections/CollectionMultiSelection';
import ConfigDrawer from '@/features/config/ConfigDrawer';

import { Button } from '@/components/ui/button';
import UploadDialog from '@/features/files/UploadDialog';
import useSelectedCollectionIds from '@/features/collections/useSelectedCollectionIds';
import useConfig from '@/features/config/useConfig';
import useMessages from '@/features/chat/useMessages';

export default function ChatPage() {
	const defaultConfig = {
		n_chunks: 50,
		max_tokens: 512,
		temperature: 0.7,
		top_n_chunks: 5,
	};
	const [config, setConfig] = useConfig(defaultConfig);

	const [messages, setMessages] = useMessages();

	const [selectedCollectionIds, setSelectedCollectionIds] =
		useSelectedCollectionIds();

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
			<div className='flex flex-col basis-1/5 items-center py-8 px-12 gap-y-8'>
				<CollectionMultiSelection
					selectedCollectionIds={selectedCollectionIds}
					toggleSelectedCollection={toggleSelectedCollection}
				/>
				<Button
					className='w-full'
					onClick={() => setOpenUpload(true)}
					variant='secondary'
				>
					Upload
				</Button>
				<UploadDialog
					openState={openUpload}
					setOpenState={setOpenUpload}
				/>
				<Button
					className='w-full'
					onClick={() => navigate('/collections')}
					variant='secondary'
				>
					Manage Collections
				</Button>
				<ConfigDrawer
					config={config}
					setConfig={setConfig}
					defaultConfig={defaultConfig}
				/>
				<Button
					onClick={() => setMessages([])}
					className='w-full hover:bg-destructive/50 hover:text-destructive-foreground duration-300'
					variant='secondary'
				>
					Clear Chat
				</Button>
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
