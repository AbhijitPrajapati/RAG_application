import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollectionSelection from '@/components/CollectionSelection';
import { getFiles } from '@/services';
import type { File } from '@/types';
import {
	type SortingState,
	type ColumnFiltersState,
	useReactTable,
	getSortedRowModel,
	getCoreRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';
import { columns } from '@/components/FileTableColumns';
import { DataTable } from '@/components/DataTable';

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

	const [data, setData] = useState<Array<File>>([]);
	const fetchData = async () => {
		setData(await getFiles(Array.from(collectionIds)));
	};
	useEffect(() => {
		fetchData();
	}, []);

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
		<div className='flex'>
			<div className='w-2/10'>
				<CollectionSelection
					selectedCollectionIds={collectionIds}
					toggleSelectedCollection={toggleCollection}
				/>
			</div>
			<div className='w-8/10'>
				<DataTable table={table} />
			</div>
		</div>
	);
}
