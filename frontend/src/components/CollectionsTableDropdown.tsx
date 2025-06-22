import React from 'react';

import { deleteCollection } from '@/stores/useCollectionStore';

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

interface CollectionsTableDropdownProps {
	collection: Collection;
}

export function CollectionsTableDropdown({
	collection,
}: CollectionsTableDropdownProps) {
	const delete_fn = async (id: number) => {
		try {
			const data = await deleteCollection(id);
			toast(`Collection id deleted: ${data.collection_id}`);
		} catch (err) {
			toast(`Error deleting collection: ${err}`);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='h-8 w-8 p-0'>
					<span className='sr-only'>Open menu</span>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem>Manage Collection</DropdownMenuItem>
				<DropdownMenuItem>Rename</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => delete_fn(collection.id)}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
