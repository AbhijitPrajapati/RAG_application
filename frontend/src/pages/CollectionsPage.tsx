import React, { useState } from 'react';
import { columns } from '@/features/collections/CollectionsTableColumns';
import { DataTable } from '@/components/datatable/DataTable';
import {
	useCollections,
	useCreateCollection,
	useDeleteCollections,
} from '@/stores/useCollectionStore';
import type { Collection } from '@/types';
import { Input } from '@/components/ui/input';
// import CollectionCreation from '@/features/collections/CollectionCreation';
import BulkDeletion from '@/components/BulkDeletion';
import type { Table } from '@tanstack/react-table';
import NameDialog from '@/features/collections/NameDialog';
import { Button } from '@/components/ui/button';

export default function CollectionsPage() {
	const data = useCollections();
	const deleteCollections = useDeleteCollections();
	const createCollection = useCreateCollection();
	const [creationOpen, setCreationOpen] = useState(false);

	return (
		<DataTable
			data={data}
			columns={columns}
			renderControls={(table: Table<Collection>) => (
				<>
					<Input
						placeholder='Search'
						value={
							(table
								.getColumn('name')
								?.getFilterValue() as string) ?? ''
						}
						onChange={(event) =>
							table
								.getColumn('name')
								?.setFilterValue(event.target.value)
						}
						className='w-sm'
					/>

					{/* <CollectionCreation /> */}

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

					<BulkDeletion
						deletion_items={data.filter((c) =>
							Object.keys(table.getState().rowSelection)
								.map(Number)
								.includes(c.id)
						)}
						item_type='collections'
						deletion_func={deleteCollections}
					/>
				</>
			)}
		/>
	);
}
