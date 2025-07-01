import React from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import type { File } from '@/types';
import SortableDataTableHeader from '@/components/SortableDataTableHeader';

import FilesTableDropdown from '@/features/files/FilesTableDropdown';
import { selectColumn } from '@/components/DataTableSelectColumn';

export const columns: ColumnDef<File>[] = [
	selectColumn as ColumnDef<File>,
	{
		accessorKey: 'id',
		header: 'Id',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'uploaded_at',
		header: ({ column }) => (
			<SortableDataTableHeader column={column} label='Uploaded At' />
		),
		cell: ({ row }) => (
			<div className='ml-3'>
				{new Date(row.getValue('uploaded_at')).toLocaleDateString()}
			</div>
		),
	},
	{
		accessorKey: 'number_chunks',
		header: ({ column }) => (
			<SortableDataTableHeader column={column} label='Chunks' />
		),
		cell: ({ row }) => (
			<div className='ml-3'>{row.getValue('number_chunks')}</div>
		),
	},
	{
		accessorKey: 'length',
		header: ({ column }) => (
			<SortableDataTableHeader column={column} label='Length' />
		),
		cell: ({ row }) => <div className='ml-3'>{row.getValue('length')}</div>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <FilesTableDropdown file={row.original} />,
	},
];
