import React from 'react';
import { columns } from '@/features/collections/CollectionsTableColumns';
import { DataTable } from '@/components/DataTable';
import {
	useCollections,
	useDeleteCollections,
} from '@/stores/useCollectionStore';
import type { Collection } from '@/types';
import { Input } from '@/components/ui/input';
import CollectionCreation from '@/features/collections/CollectionCreation';
import BulkDeletion from '@/components/BulkDeletion';
import type { Table } from '@tanstack/react-table';

export default function CollectionsPage() {
	const data = useCollections();
	const deleteCollections = useDeleteCollections();

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
						className='max-w-sm'
					/>
					<CollectionCreation />

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
