import React, { useRef, useState } from 'react';
import { useUploadFiles } from '@/stores/useFilesStore';
import { useFetchCollections } from '@/stores/useCollectionStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import CollectionSelection from '@/features/collections/CollectionSelection';
import DialogExit from '@/components/dialog/DialogExit';

interface UploadDialogProps {
	openState: boolean;
	setOpenState: (open: boolean) => void;
	initial_id?: number;
}

export default function UploadDialog({
	openState,
	setOpenState,
	initial_id,
}: UploadDialogProps) {
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [collectionId, setCollectionId] = useState<number | undefined>(
		initial_id
	);
	const uploadFiles = useUploadFiles();

	const fetchCollections = useFetchCollections();

	const openChange = (open: boolean) => {
		if (!open) {
			setFiles([]);
			setCollectionId(initial_id);
		}
		setOpenState(open);
	};

	const upload = async () => {
		setUploading(true);
		try {
			uploadFiles(collectionId!, files);
			fetchCollections();
			const text =
				files.length === 1 ? files[0].name : `${files.length} files`;
			toast.success(`${text} uploaded`);
		} catch (err) {
			if (err instanceof Error)
				toast.error(`Error uploading files: ${err.message}`);
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			setFiles([]);
		}
	};

	return (
		<Dialog open={openState} onOpenChange={openChange}>
			<DialogContent
				className='p-8'
				aria-describedby={undefined}
				showCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>Upload Files</DialogTitle>
					<DialogExit />
				</DialogHeader>

				<div className='space-y-4 m-4'>
					<CollectionSelection
						setSelectedId={setCollectionId}
						defaultId={collectionId}
						className='w-full'
					/>

					<Input
						type='file'
						ref={fileInputRef}
						multiple
						onChange={(e) => {
							setFiles(Array.from(e.target.files ?? []));
						}}
					/>
				</div>
				<DialogFooter>
					<Button
						className='mx-auto w-40'
						disabled={!collectionId || !files?.length || uploading}
						onClick={(e) => {
							e.stopPropagation();
							upload();
						}}
					>
						Upload
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
