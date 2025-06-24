import React, { useState } from 'react';

import {
	deleteCollection,
	renameCollection,
	useCollections,
} from '@/stores/useCollectionStore';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import type { Collection } from '@/types';
import { ConfirmationDialog } from '@/components/ConfimationDialog';
import NameDialog from '@/components/NameDialog';
interface CollectionsTableDropdownProps {
	collection: Collection;
}

export function CollectionsTableDropdown({
	collection,
}: CollectionsTableDropdownProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [renameOpen, setRenameOpen] = useState(false);
	const collections = useCollections();

	const delete_fn = async (id: number) => {
		try {
			await deleteCollection(id);
			toast.success(`Collection id deleted: ${id}`);
		} catch (err) {
			if (err instanceof Error)
				toast.error(`Error deleting collection: ${err.message}`);
		} finally {
			setDeleteDialogOpen(false);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem>Manage Collection</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setRenameOpen(true)}>
						Rename
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => setDeleteDialogOpen(true)}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmationDialog
				onConfirm={() => delete_fn(collection.id)}
				openState={deleteDialogOpen}
				closeDialog={() => setDeleteDialogOpen(false)}
			/>
			<NameDialog
				onSubmit={(name: string) =>
					renameCollection(collection.id, name)
				}
				title='Rename Collection'
				placeholder='Collection Name'
				submitText='Rename'
				openState={renameOpen}
				closeDialog={() => setRenameOpen(false)}
				disableSubmit={(name: string) =>
					collections.map((c) => c.name).includes(name)
				}
			/>
		</>
	);
}
