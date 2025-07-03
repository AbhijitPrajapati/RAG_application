import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { File } from '@/types';
import { useGetFile } from '@/stores/useFilesStore';
import DialogExit from '@/components/dialog/DialogExit';
import { ScrollArea } from '@/components/ui/scroll-area';

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
	const getFile = useGetFile();
	useEffect(() => {
		if (!openState) return;
		const getContent = async (): Promise<void> => {
			const doc = await getFile(file.id);
			setContent(doc);
		};
		getContent();
	}, [openState, file.id]);

	return (
		<Dialog open={openState} onOpenChange={setOpenState}>
			<DialogContent
				className='!w-6xl max-h-3/4 min-h-1/4 !max-w-none'
				showCloseButton={false}
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle className='m-1.5'>{file.name}</DialogTitle>
					<DialogExit />
				</DialogHeader>
				<ScrollArea className='p-6 h-full max-h-[calc(75vh-100px)] overflow-y-auto scroll-smooth'>
					{content}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
