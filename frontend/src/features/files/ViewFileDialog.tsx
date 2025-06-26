import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { File } from '@/types';
import { getDocument } from '@/services';

interface ViewFileDialogProps {
	openState: boolean;
	setOpenState: (open: boolean) => void;
	file: File;
}

export default function ViewFileDialog({
	openState,
	setOpenState,
	file,
}: ViewFileDialogProps) {
	const [content, setContent] = useState('');
	useEffect(() => {
		if (!openState) return;
		const getContent = async (): Promise<void> => {
			const doc = await getDocument(file.id);
			setContent(doc['document']);
		};
		getContent();
	}, [openState, file.id]);

	return (
		<Dialog open={openState} onOpenChange={setOpenState}>
			<DialogContent
				className='min-w-[1200px] min-h-[700px] max-w-none'
				showCloseButton={false}
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>{file.name}</DialogTitle>
				</DialogHeader>
				<DialogClose asChild>
					<Button
						variant='ghost'
						className='absolute right-4 top-4 p-2 rounded-full'
					>
						<X className='h-4 w-4' />
					</Button>
				</DialogClose>
				<div>{content}</div>
			</DialogContent>
		</Dialog>
	);
}
