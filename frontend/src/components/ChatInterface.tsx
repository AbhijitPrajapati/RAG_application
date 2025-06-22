import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { toast } from 'sonner';
import type { Message, Config } from '@/types';
import { fetchRAGResponse } from '@/services';

interface ChatInterfaceProps {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	selectedCollectionIds: Set<number>;
	config: Config;
}

export default function ChatInterface({
	messages,
	setMessages,
	selectedCollectionIds,
	config,
}: ChatInterfaceProps) {
	const [query, setInput] = useState('');

	const streamResponse = async (body: ReadableStream<Uint8Array>) => {
		const updateMessage = (chunk: string) => {
			setMessages((prev) => {
				const updated = [...prev];
				const idx = updated.length - 1;
				updated[idx] = {
					...updated[idx],
					content: updated[idx].content + chunk,
				};
				return updated;
			});
		};

		setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

		const reader = body.getReader();
		const decoder = new TextDecoder();
		const buffer = '';

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

	const sendMessage = async () => {
		if (!query.trim()) return;
		if (selectedCollectionIds.size === 0) {
			toast('No collections have been selected');
			return;
		}

		setMessages((prev) => [...prev, { role: 'user', content: query }]);
		setInput('');
		try {
			const response_body = await fetchRAGResponse(
				query,
				config,
				selectedCollectionIds
			);
			if (response_body) {
				await streamResponse(response_body);
			}
		} catch (err) {
			if (err instanceof Error) {
				setMessages((prev) => [
					...prev,
					{ role: 'assistant', content: 'Error: ' + err.message },
				]);
			}
		}
	};

	return (
		<Card className='fixed right-0 h-screen w-8/10 flex-col'>
			<CardContent className='h-9/10'>
				<ScrollArea className='h-full'>
					<div className='space-y-4'>
						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={`rounded-lg p-3 text-sm w-fit max-w-[80%] ${
									msg.role === 'user'
										? 'ml-auto bg-primary text-primary-foreground'
										: 'mr-auto bg-muted text-muted-foreground'
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
							sendMessage();
						}
					}}
					placeholder='Type your message...'
				/>
				<Button onClick={sendMessage}>Send</Button>
			</div>
		</Card>
	);
}
