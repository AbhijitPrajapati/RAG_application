import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollectionSelection from '@/components/CollectionSelection';

export default function FilesPage() {
	const [searchParams] = useSearchParams();
	const initialId = Number(searchParams.get('initial_id'));

	const [collectionIds, setCollectionIds] = useState<Set<number>>(
		new Set([initialId])
	);

	const toggleCollection = (id: number) => {
		const newSet = new Set(collectionIds);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		setCollectionIds(newSet);
	};

	return (
		<div className='flex'>
			<CollectionSelection
				selectedCollectionIds={collectionIds}
				toggleSelectedCollection={toggleCollection}
			/>
			<div className='mx-auto'></div>
		</div>
	);
}
