import React from 'react';
import { Info } from 'lucide-react';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';

interface HoverInfoProps {
	details: string;
}

export default function HoverInfo({ details }: HoverInfoProps) {
	return (
		<HoverCard openDelay={300}>
			<HoverCardTrigger asChild>
				<Info size='14' className='text-foreground/40' />
			</HoverCardTrigger>
			<HoverCardContent className='text-sm'>{details}</HoverCardContent>
		</HoverCard>
	);
}
