import React, { useState } from 'react';
import { deleteCollections } from '@/stores/useCollectionStore';
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

	const deleteBulk = async () => {
		try {
			await deleteCollections(deletion_ids);
			const text =
				deletion_ids.length === 1
					? `collection ids ${deletion_ids}`
					: `${deletion_ids.length} collections`;

			toast.success(`Deleted ${text}`);
		} catch (err) {
			if (err instanceof Error)
				toast.error(`Error deleting collections: ${err.message}`);
		} finally {
			setDeleteDialogOpen(false);
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
				closeDialog={() => setDeleteDialogOpen(false)}
			/>
		</div>
	);
}

// 	<Dialog>
// 		<DialogTrigger asChild>
// 			<Button disabled={deletion_ids.length == 0}>Delete</Button>
// 		</DialogTrigger>
// 		<DialogContent className='min-w-[500px] min-h-[200px] max-w-none p-8'>
// 			<DialogHeader>
// 				<DialogTitle>Are You Sure?</DialogTitle>
// 			</DialogHeader>

// 			<DialogFooter>
// 				<DialogClose asChild>
// 					<Button
// 						className='mx-auto min-w-[150px]'
// 						onClick={deleteBulk}
// 					>
// 						Delete
// 					</Button>
// 					<Button
// 						className='mx-auto min-w-[150px]'
// 						variant='outline'
// 					>
// 						Cancel
// 					</Button>
// 				</DialogClose>
// 			</DialogFooter>
// 		</DialogContent>
// 	</Dialog>
