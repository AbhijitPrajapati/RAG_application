import React, { useState } from 'react';
import { useCreateCollection } from '@/stores/useCollectionStore';
import { Button } from '@/components/ui/button';
import NameDialog from './NameDialog';

export default function CollectionCreation() {
	const [creationOpen, setCreationOpen] = useState(false);
	const createCollection = useCreateCollection();

	return (
		<>
			<Button
				onClick={() => setCreationOpen(true)}
				className='align-middle'
			>
				Create
			</Button>
			<NameDialog
				onSubmit={createCollection}
				title='Create Collection'
				submitText='Create'
				openState={creationOpen}
				setOpenState={setCreationOpen}
			/>
		</>
	);
}
