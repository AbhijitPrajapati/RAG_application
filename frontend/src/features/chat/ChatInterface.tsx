import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components//ui/scroll-area';
import { toast } from 'sonner';
import type { Message, Config } from '@/types';
import { fetchRAGResponse } from '@/services/rag';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ChatInterfaceProps {
	messages: Array<Message>;
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
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollAreaRef.current !== null) {
			scrollAreaRef.current.scrollIntoView(false);
		}
	}, [messages]);

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
			toast.info('No collections have been selected');
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
		<div className='basis-4/5 border h-screen'>
			<div className='w-4xl mx-auto h-full flex flex-col'>
				{messages.length > 0 ? (
					<div className='flex-1 overflow-y-auto'>
						<ScrollArea className='h-full'>
							<div className='space-y-8 p-8' ref={scrollAreaRef}>
								{messages.map((msg, idx) => (
									<div
										key={idx}
										className={`p-3 ${
											msg.role === 'user'
												? 'rounded-lg w-fit max-w-[70%] ml-auto bg-primary text-primary-foreground'
												: 'mx-auto text-foreground leading-relaxed'
										}
										`}
									>
										{msg.content}
									</div>
								))}
							</div>
						</ScrollArea>
					</div>
				) : (
					<div className='flex flex-col justify-end h-1/2'>
						<h1 className='text-5xl font-semibold leading-tight text-center'>
							Start a Conversation
						</h1>
					</div>
				)}

				<div className='mx-auto p-8 flex gap-2 w-full'>
					<Textarea
						value={query}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								sendMessage();
							}
						}}
						placeholder='Type your message...'
						className='resize-none overflow-y-auto max-h-70 rounded-2xl min-h-20 p-3 !text-base'
					/>
					<Button onClick={sendMessage} className='rounded-full'>
						<Send />
					</Button>
				</div>
			</div>
		</div>
	);
}
