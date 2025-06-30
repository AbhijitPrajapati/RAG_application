import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { DataTableType } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

export const selectColumn: ColumnDef<DataTableType> = {
	id: 'select',
	header: ({ table }) => (
		<Checkbox
			checked={
				table.getIsAllRowsSelected() ||
				(table.getIsSomeRowsSelected() && 'indeterminate')
			}
			onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
		/>
	),
	cell: ({ row }) => (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(value) => row.toggleSelected(!!value)}
		/>
	),
	enableSorting: false,
};
