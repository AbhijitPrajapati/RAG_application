import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
	useCollections,
	useCreateCollection,
} from '@/stores/useCollectionStore';
import NameDialog from '@/features/collections/NameDialog';
interface CollectionMultiSelectionProps {
	selectedCollectionIds: Set<number>;
	toggleSelectedCollection: (id: number) => void;
}

export default function CollectionMultiSelection({
	selectedCollectionIds,
	toggleSelectedCollection,
}: CollectionMultiSelectionProps) {
	const collections = useCollections();
	const createCollection = useCreateCollection();
	const [creationOpen, setCreationOpen] = useState(false);

	return (
		<>
			<Label className='text-center !text-base'>Collections</Label>
			<ScrollArea className='w-full p-4 border-2 rounded-2xl [&>[data-radix-scroll-area-viewport]]:max-h-32 h-24'>
				{collections.length > 0 ? (
					collections.map(({ id, name }) => (
						<div key={id} className='ml-2'>
							<Checkbox
								checked={selectedCollectionIds.has(id)}
								onCheckedChange={() =>
									toggleSelectedCollection(id)
								}
							/>
							<label className='ml-2'>{name}</label>
						</div>
					))
				) : (
					<div className='text-center'>
						<p>No collections exist.</p>
						<span
							className='underline underline-offset-4 decoration-foreground/45 cursor-pointer'
							onClick={() => setCreationOpen(true)}
						>
							Create One
						</span>
						<NameDialog
							onSubmit={createCollection}
							title='Create Collection'
							submitText='Create'
							openState={creationOpen}
							setOpenState={setCreationOpen}
						/>
					</div>
				)}
			</ScrollArea>
		</>
	);
}
