import React, { useState } from 'react';
import { createCollection, useCollections } from '@/stores/useCollectionStore';
import { Button } from '@/components/ui/button';
import NameDialog from './NameDialog';

export default function CollectionCreation() {
	const [creationOpen, setCreationOpen] = useState(false);
	const collections = useCollections();

	return (
		<div>
			<Button
				onClick={() => setCreationOpen(true)}
				className='align-middle'
			>
				Create
			</Button>
			<NameDialog
				onSubmit={createCollection}
				title='Create Collection'
				placeholder='Collection Name'
				submitText='Create'
				openState={creationOpen}
				closeDialog={() => setCreationOpen(false)}
				disableSubmit={(name: string) =>
					collections.map((c) => c.name).includes(name)
				}
			/>
		</div>
	);
}
