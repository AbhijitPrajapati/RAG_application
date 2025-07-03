import React from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
	onConfirm: () => void;
	openState: boolean;
	setOpenState: (open: boolean) => void;
}

export function ConfirmationDialog({
	onConfirm,
	openState,
	setOpenState,
}: ConfirmationDialogProps) {
	return (
		<Dialog open={openState} onOpenChange={setOpenState}>
			<DialogContent
				showCloseButton={false}
				aria-describedby={undefined}
				className='p-8'
			>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
				</DialogHeader>
				<p>This action cannot be undone.</p>
				<DialogFooter className='space-x-2'>
					<DialogClose asChild>
						<Button variant='outline'>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							variant='destructive'
							className='bg-destructive/75'
							onClick={onConfirm}
						>
							Confirm
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
