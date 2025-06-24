import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollectionSelection from '@/features/collections/CollectionSelection';
import useFiles from '@/hooks/useFiles';
import type { File } from '@/types';
import {
	type SortingState,
	type ColumnFiltersState,
	useReactTable,
	getSortedRowModel,
	getCoreRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';
import { columns } from '@/features/files/FileTableColumns';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';

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

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const data = useFiles(collectionIds);

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
		getRowId: (row: File) => row.id.toString(),
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className='container mx-auto py-10'>
			<div className='flex flex-row items-center py-4 gap-x-4'>
				<CollectionSelection
					selectedCollectionIds={collectionIds}
					toggleSelectedCollection={toggleCollection}
				/>
				<Button className='w-1/4'>Text</Button>
				<Button className='w-1/4'>Text</Button>
				<Button className='w-1/4'>Text</Button>
			</div>
			<DataTable table={table} />
		</div>
	);
}
