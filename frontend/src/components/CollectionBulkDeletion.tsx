import React from 'react';
import { deleteCollections } from '@/stores/useCollectionStore';
import { toast } from 'sonner';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from './ui/dialog';
import { Button } from '@/components/ui/button';

interface CollectionBulkDeletionProps {
	deletion_ids: Array<number>;
}

export default function CollectionBulkDeletion({
	deletion_ids,
}: CollectionBulkDeletionProps) {
	const deleteBulk = async () => {
		try {
			const data = await deleteCollections(deletion_ids);
			const text =
				data.collection_ids.length === 1
					? `collection ids ${data.collection_ids[0]}`
					: `${data.collection_ids.length} collections`;

			toast(`Deleted ${text}`);
		} catch (err) {
			toast(`Error deleting collections: ${err}`);
		}
	};

	return (
		<div className='w-full p-3'>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Delete</Button>
				</DialogTrigger>
				<DialogContent className='min-w-[500px] min-h-[200px] max-w-none p-8'>
					<DialogHeader>
						<DialogTitle>Are You Sure?</DialogTitle>
					</DialogHeader>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								className='mx-auto min-w-[150px]'
								onClick={deleteBulk}
							>
								Delete
							</Button>
							<Button
								className='mx-auto min-w-[150px]'
								variant='outline'
							>
								Cancel
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
