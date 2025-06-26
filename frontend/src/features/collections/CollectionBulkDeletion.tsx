import React, { useState } from 'react';
import {
	useDeleteCollections,
	useCollections,
} from '@/stores/useCollectionStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import { ConfirmationDialog } from '@/components/ConfimationDialog';

interface CollectionBulkDeletionProps {
	deletion_ids: Set<number>;
}

export default function CollectionBulkDeletion({
	deletion_ids,
}: CollectionBulkDeletionProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const deleteCollections = useDeleteCollections();

	const allCollections = useCollections();
	const deletion_names = allCollections
		.filter((c) => deletion_ids.has(c.id))
		.map((c) => c.name);

	const deleteBulk = async () => {
		try {
			await deleteCollections(Array.from(deletion_ids));
			const text =
				deletion_ids.size === 1
					? deletion_names.at(0)
					: `${deletion_ids.size} collections`;

			toast.success(`Deleted ${text}`);
		} catch (err) {
			if (err instanceof Error)
				toast.error(`Error deleting collections: ${err.message}`);
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
