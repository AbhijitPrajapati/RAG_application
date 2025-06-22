import React, { useState } from 'react';
import { columns } from '@/components/CollectionsTableColumns';
import { DataTable } from '@/components/DataTable';
import { useCollections, deleteCollections } from '@/stores/useCollectionStore';
import {
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table';
import type { Collection } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

	const deleteBulk = async () => {
		try {
			const data = await deleteCollections(
				Object.keys(rowSelection).map(Number)
			);
			const text =
				data.collection_ids.length === 1
					? `collection ids ${data.uploaded_files[0]}`
					: `${data.uploaded_files.length} collections`;

			toast(`Deleted ${text}`);
		} catch (err) {
			toast(`Error deleting collections: ${err}`);
		}
	};

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
				<Button>Create</Button>
				<Button onClick={deleteBulk}>Delete</Button>
			</div>
			<DataTable table={table} />
		</div>
	);
}
