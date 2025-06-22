import React from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import type { Collection } from '@/types';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CollectionsTableDropdown } from '@/components/CollectionsTableDropdown';

export const columns: ColumnDef<Collection>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllRowsSelected() ||
					(table.getIsSomeRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) =>
					table.toggleAllRowsSelected(!!value)
				}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
			/>
		),
		enableSorting: false,
	},
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
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Created At
					<ArrowUpDown className='h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) =>
			new Date(row.getValue('created_at')).toLocaleDateString(),
	},
	{
		accessorKey: 'last_modified',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Last Modified
					<ArrowUpDown className='h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) =>
			new Date(row.getValue('last_modified')).toLocaleDateString(),
	},
	{
		accessorKey: 'number_files',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Files
					<ArrowUpDown className='h-4 w-4' />
				</Button>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return (
				<CollectionsTableDropdown
					collection={row.original}
				></CollectionsTableDropdown>
			);
		},
	},
];
