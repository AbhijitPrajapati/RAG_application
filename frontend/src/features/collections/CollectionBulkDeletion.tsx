import React, { useState } from 'react';
import { deleteCollections, useCollections } from '@/stores/useCollectionStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import { ConfirmationDialog } from '@/components/ConfimationDialog';

interface CollectionBulkDeletionProps {
	deletion_ids: Array<number>;
}

export default function CollectionBulkDeletion({
	deletion_ids,
}: CollectionBulkDeletionProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const allCollections = useCollections();
	const deletion_names = allCollections
		.filter((c) => deletion_ids.includes(c.id))
		.map((c) => c.name);

	const deleteBulk = async () => {
		try {
			await deleteCollections(deletion_ids);
			const text =
				deletion_ids.length === 1
					? deletion_names.at(0)
					: `${deletion_ids.length} collections`;

			toast.success(`Deleted ${text}`);
		} catch (err) {
			if (err instanceof Error)
				toast.error(`Error deleting collections: ${err.message}`);
		}
	};

	return (
		<div>
			<Button
				disabled={deletion_ids.length == 0}
				onClick={() => setDeleteDialogOpen(true)}
			>
				Delete
			</Button>
			<ConfirmationDialog
				onConfirm={deleteBulk}
				openState={deleteDialogOpen}
				setOpenState={setDeleteDialogOpen}
			/>
		</div>
	);
}
