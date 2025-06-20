import React from 'react';
import { columns } from './columns';
import { DataTable } from './DataTable';
import { useCollections } from '@/stores/useCollectionStore';

export default function CollectionsPage() {
	return (
		<div className='container mx-auto py-10'>
			<DataTable columns={columns} data={useCollections()} />
		</div>
	);
}
