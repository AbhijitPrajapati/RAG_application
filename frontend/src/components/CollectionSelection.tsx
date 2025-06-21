import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useCollections } from '@/stores/useCollectionStore';

interface CollectionSelectionProps {
	selectedCollectionIds: Set<number>;
	toggleSelectedCollection: (id: number) => void;
}

export default function CollectionSelection({
	selectedCollectionIds,
	toggleSelectedCollection,
}: CollectionSelectionProps) {
	const collections = useCollections();

	// collections = ['collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3','collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3'];
	// replace max-h-[200px] with just h-[200px] to make it the mininum height
	return (
		<div className='w-full p-3'>
			<Label className='text-center m-2 p-1'>Collections</Label>
			<ScrollArea className='border rounded-2xl [&>[data-radix-scroll-area-viewport]]:max-h-[200px] w-full p-4'>
				<div>
					{collections.map(({ id, name }) => (
						<div key={id}>
							<Checkbox
								checked={selectedCollectionIds.has(id)}
								onCheckedChange={() =>
									toggleSelectedCollection(id)
								}
							/>
							<label>{name}</label>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
