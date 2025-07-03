import React, { useState } from 'react';
import type { File } from '@/types';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/dialog/ConfimationDialog';
import { useDeleteFile } from '@/stores/useFilesStore';
import { toast } from 'sonner';
import ViewFileDialog from '@/features/files/ViewFileDialog';

interface FilesTableDropdownProps {
	file: File;
}

export default function FilesTableDropdown({ file }: FilesTableDropdownProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const deleteFile = useDeleteFile();

	const delete_fn = async () => {
		try {
			deleteFile(file.id);
			toast.success(`Deleted ${file.name}`);
		} catch (err) {
			if (err instanceof Error) {
				toast.error(`Error deleting file: ${err.message}`);
			}
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem onSelect={() => setViewDialogOpen(true)}>
						View
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => setDeleteDialogOpen(true)}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmationDialog
				onConfirm={delete_fn}
				openState={deleteDialogOpen}
				setOpenState={setDeleteDialogOpen}
			/>
			<ViewFileDialog
				openState={viewDialogOpen}
				setOpenState={setViewDialogOpen}
				file={file}
			/>
		</>
	);
}
