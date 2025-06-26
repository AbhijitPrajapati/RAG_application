import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useDeleteCollection,
	useRenameCollection,
} from '@/stores/useCollectionStore';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import type { Collection } from '@/types';
import { ConfirmationDialog } from '@/components/ConfimationDialog';
import NameDialog from './NameDialog';
import UploadDialog from '@/features/files/UploadDialog';
interface CollectionsTableDropdownProps {
	collection: Collection;
}

export function CollectionsTableDropdown({
	collection,
}: CollectionsTableDropdownProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [renameOpen, setRenameOpen] = useState(false);
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const deleteCollection = useDeleteCollection();
	const renameCollection = useRenameCollection();

	const navigate = useNavigate();

	const delete_fn = async () => {
		try {
			await deleteCollection(collection.id);
			toast.success(`Deleted ${collection.name}`);
		} catch (err) {
			if (err instanceof Error)
				toast.error(`Error deleting collection: ${err.message}`);
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
					<DropdownMenuItem
						onSelect={() =>
							navigate(`/files?initial_id=${collection.id}`)
						}
					>
						Manage Collection
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => setUploadDialogOpen(true)}
					>
						Upload
					</DropdownMenuItem>

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
				onConfirm={delete_fn}
				openState={deleteDialogOpen}
				setOpenState={setDeleteDialogOpen}
			/>
			<NameDialog
				onSubmit={(name: string) =>
					renameCollection(collection.id, name)
				}
				title='Rename Collection'
				placeholder={collection.name}
				submitText='Rename'
				openState={renameOpen}
				setOpenState={setRenameOpen}
			/>
			<UploadDialog
				openState={uploadDialogOpen}
				setOpenState={setUploadDialogOpen}
				initial_id={collection.id}
			/>
		</>
	);
}
