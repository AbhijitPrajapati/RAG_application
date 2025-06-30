import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import type { Column } from '@tanstack/react-table';
import type { DataTableType } from '@/types';

interface SortableDataTableHeaderProps<T extends DataTableType> {
	column: Column<T>;
	label: string;
}

export default function SortableDataTableHeader<T extends DataTableType>({
	column,
	label,
}: SortableDataTableHeaderProps<T>) {
	return (
		<Button
			variant='ghost'
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		>
			{label}
			<ArrowUpDown className='h-4 w-4' />
		</Button>
	);
}
