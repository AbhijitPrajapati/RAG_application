import React from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import type { File } from '@/types';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<File>[] = [
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
		accessorKey: 'uploaded_at',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Uploaded At
					<ArrowUpDown className='h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) =>
			new Date(row.getValue('uploaded_at')).toLocaleDateString(),
	},
	{
		accessorKey: 'number_chunks',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Chunks
					<ArrowUpDown className='h-4 w-4' />
				</Button>
			);
		},
	},
	{
		id: 'actions',
		cell: 'Actions',
	},
];
