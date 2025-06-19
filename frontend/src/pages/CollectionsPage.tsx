import React from 'react';
import { useCollections } from '@/stores/useCollectionStore';
import { Collection } from '@/types';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function CollectionsPage() {
    const columns: ColumnDef<Collection>[] = [
        {
            accessorKey: 'id',
            header: 'Id',
        },
        {
            accessorKey: 'name',
            header: 'Name'
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString()
        },
        {
            accessorKey: 'last_modified',
            header: 'Last Modified',
            cell: ({ row }) => new Date(row.getValue('last_modified')).toLocaleDateString()
        },
        {
            accessorKey: 'number_files',
            header: 'Files'
        }
    ];
    
    const table = useReactTable({
        data: useCollections(),
        columns,
        getCoreRowModel: getCoreRowModel()
    });
    
    return (
        <div className='rounded-md border m-10'>
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                            )}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    );
}