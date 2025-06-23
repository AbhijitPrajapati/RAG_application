import React, { useState } from 'react';
import { columns } from '@/components/CollectionsTableColumns';
import { DataTable } from '@/components/DataTable';
import { useCollections } from '@/stores/useCollectionStore';
import {
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table';
import type { Collection } from '@/types';
import { Input } from '@/components/ui/input';
import CollectionCreation from '@/components/CollectionCreation';
import CollectionBulkDeletion from '@/components/CollectionBulkDeletion';

export default function CollectionsPage() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const data = useCollections();
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onRowSelectionChange: setRowSelection,
		getRowId: (row: Collection) => row.id.toString(),
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className='container mx-auto py-10'>
			<div className='flex flex-row items-center py-4 gap-x-4'>
				<Input
					placeholder='Search'
					value={
						(table.getColumn('name')?.getFilterValue() as string) ??
						''
					}
					onChange={(event) =>
						table
							.getColumn('name')
							?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				<CollectionCreation />

				<CollectionBulkDeletion
					deletion_ids={Object.keys(rowSelection).map(Number)}
				/>
			</div>
			<DataTable table={table} />
		</div>
	);
}
