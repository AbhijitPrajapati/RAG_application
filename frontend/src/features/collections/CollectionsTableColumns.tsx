import React from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import type { Collection } from '@/types';

import { CollectionsTableDropdown } from './CollectionsTableDropdown';
import SortableDataTableHeader from '@/components/SortableDataTableHeader';
import { selectColumn } from '@/components/DataTableSelectColumn';

export const columns: ColumnDef<Collection>[] = [
	selectColumn as ColumnDef<Collection>,
	{
		accessorKey: 'id',
		header: 'Id',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<SortableDataTableHeader column={column} label='Created At' />
		),
		cell: ({ row }) => (
			<div className='ml-3'>
				{new Date(row.getValue('created_at')).toLocaleDateString()}
			</div>
		),
	},
	{
		accessorKey: 'last_modified',
		header: ({ column }) => (
			<SortableDataTableHeader column={column} label='Last Modified' />
		),
		cell: ({ row }) => (
			<div className='ml-3'>
				{new Date(row.getValue('last_modified')).toLocaleDateString()}
			</div>
		),
	},
	{
		accessorKey: 'number_files',
		header: ({ column }) => (
			<SortableDataTableHeader column={column} label='Files' />
		),
		cell: ({ row }) => (
			<div className='ml-3'>{row.getValue('number_files')}</div>
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<CollectionsTableDropdown collection={row.original} />
		),
	},
];
