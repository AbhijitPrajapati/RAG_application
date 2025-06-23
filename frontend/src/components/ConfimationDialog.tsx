import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
	onConfirm: () => void;
	openState: boolean;
	closeDialog: () => void;
}

export function ConfirmationDialog({
	onConfirm,
	openState,
	closeDialog,
}: ConfirmationDialogProps) {
	return (
		<Dialog open={openState}>
			<DialogContent showCloseButton={false} aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
				</DialogHeader>
				<p>This action cannot be undone.</p>
				<DialogFooter>
					<Button variant='outline' onClick={closeDialog}>
						Cancel
					</Button>
					<Button
						variant='destructive'
						onClick={() => {
							onConfirm();
							closeDialog();
						}}
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
