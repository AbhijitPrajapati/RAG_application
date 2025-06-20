'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Collection } from '@/types';

import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
		cell: () => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem>Manage Collection</DropdownMenuItem>
						<DropdownMenuItem>Rename</DropdownMenuItem>
						<DropdownMenuItem>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
