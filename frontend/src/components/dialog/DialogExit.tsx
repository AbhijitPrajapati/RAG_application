import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import React from 'react';

export default function DialogExit() {
	return (
		<DialogClose asChild>
			<Button
				variant='ghost'
				className='absolute right-4 top-4 rounded-full'
			>
				<X className='h-4 w-4' />
			</Button>
		</DialogClose>
	);
}
