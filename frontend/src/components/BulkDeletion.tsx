import React, { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ConfimationDialog';
import { Button } from '@/components/ui/button';
import type { File, Collection } from '@/types';

interface FileBulkDeletionProps<T extends Collection | File> {
	deletion_items: Array<T>;
	item_type: 'collections' | 'files';
	deletion_func: (ids: Array<number>) => void;
}

export default function FileBulkDeletion<T extends Collection | File>({
	deletion_items,
	item_type,
	deletion_func,
}: FileBulkDeletionProps<T>) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const deleteBulk = async () => {
		try {
			await deletion_func(deletion_items.map((c) => c.id));
			const text =
				deletion_items.length === 1
					? deletion_items.at(0)?.name
					: `${deletion_items.length} ${item_type}`;

			toast.success(`Deleted ${text}`);
		} catch (err) {
			if (err instanceof Error)
				toast.error(`Error deleting ${item_type}: ${err.message}`);
		}
	};

	return (
		<>
			<Button
				disabled={deletion_items.length == 0}
				onClick={() => setDeleteDialogOpen(true)}
			>
				Delete
			</Button>
			<ConfirmationDialog
				onConfirm={deleteBulk}
				openState={deleteDialogOpen}
				setOpenState={setDeleteDialogOpen}
			/>
		</>
	);
}
