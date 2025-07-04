import type { Message } from '@/types';
import { useState, useRef, useEffect } from 'react';

export default function useMessages() {
	const [messages, setMessages] = useState<Message[]>(() => {
		const session = sessionStorage.getItem('messages');
		return session ? JSON.parse(session) : [];
	});

	const messagesUpdateCount = useRef(0);

	useEffect(() => {
		messagesUpdateCount.current += 1;

		if (messagesUpdateCount.current >= 25) {
			sessionStorage.setItem('messages', JSON.stringify(messages));
			messagesUpdateCount.current = 0;
		}
	}, [messages]);

	return [messages, setMessages] as const;
}
