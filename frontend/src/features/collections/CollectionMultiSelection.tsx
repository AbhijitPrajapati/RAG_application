import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCollections } from '@/stores/useCollectionStore';

interface CollectionMultiSelectionProps {
	selectedCollectionIds: Set<number>;
	toggleSelectedCollection: (id: number) => void;
}

export default function CollectionMultiSelection({
	selectedCollectionIds,
	toggleSelectedCollection,
}: CollectionMultiSelectionProps) {
	const collections = useCollections();

	// collections = ['collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3','collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3'];
	// replace max-h-[200px] with just h-[200px] to make it the mininum height
	return (
		<div>
			<Label className='text-center m-2 p-1'>Collections</Label>
			<ScrollArea className='w-full p-4 border rounded-2xl [&>[data-radix-scroll-area-viewport]]:max-h-[200px] min-w-[300px]'>
				{collections.map(({ id, name }) => (
					<div key={id}>
						<Checkbox
							checked={selectedCollectionIds.has(id)}
							onCheckedChange={() => toggleSelectedCollection(id)}
						/>
						<label>{name}</label>
					</div>
				))}
			</ScrollArea>
		</div>
	);
}
