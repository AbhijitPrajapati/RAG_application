import React, { useState } from 'react';
import { bulkDeleteFiles } from '@/services';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ConfimationDialog';
import { Button } from '@/components/ui/button';

interface FileBulkDeletionProps {
	deletion_ids: Set<number>;
}

export default function FileBulkDeletion({
	deletion_ids,
}: FileBulkDeletionProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const deleteBulk = async () => {
		try {
			await bulkDeleteFiles(Array.from(deletion_ids));
			// const text =
			// 	deletion_ids.size === 1
			// 		? deletion_names.at(0)
			// 		: `${deletion_ids.size} collections`;
			toast.success('Deleted files');
		} catch (err) {
			if (err instanceof Error) {
				toast.error(`Error deleting files: ${err.message}`);
			}
		}
	};

	return (
		<>
			<Button
				disabled={deletion_ids.size == 0}
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
