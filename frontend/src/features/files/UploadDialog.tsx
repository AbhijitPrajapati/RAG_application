import React, { useRef, useState } from 'react';
import { uploadFiles } from '@/services';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import CollectionSelection from '@/features/collections/CollectionSelection';
import { useFetchCollections } from '@/stores/useCollectionStore';

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
	const [collectionId, setCollectionId] = useState<number | null>(
		initial_id ?? null
	);
	const updateCollections = useFetchCollections();

	const openChange = (open: boolean) => {
		if (!open) {
			setFiles([]);
			setCollectionId(null);
		}
		setOpenState(open);
	};

	const upload = async () => {
		setUploading(true);
		try {
			await uploadFiles(files, collectionId!);
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
			updateCollections();
		}
	};

	return (
		<Dialog open={openState} onOpenChange={openChange}>
			<DialogContent
				className='min-w-[500px] min-h-[200px] max-w-none p-8 gap-y-4'
				aria-describedby={undefined}
				showCloseButton={false}
			>
				<DialogHeader className='m-1'>
					<DialogTitle>Upload Files</DialogTitle>
					<DialogClose asChild>
						<Button
							variant='ghost'
							className='absolute right-4 top-4 p-2 rounded-full'
						>
							<X className='h-4 w-4' />
						</Button>
					</DialogClose>
				</DialogHeader>

				<CollectionSelection
					setSelectedId={setCollectionId}
					defaultId={collectionId ?? undefined}
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

				<DialogFooter>
					<Button
						className='mx-auto min-w-[150px]'
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
