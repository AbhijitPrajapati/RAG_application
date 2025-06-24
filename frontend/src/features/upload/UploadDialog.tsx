import React, { useRef, useState } from 'react';
import { useCollections } from '@/stores/useCollectionStore';
import { uploadFiles } from '@/services';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface UploadDialogProps {
	openState: boolean;
	closeDialog: () => void;
	initial_id?: number;
}

export default function UploadDialog({
	openState,
	closeDialog,
	initial_id,
}: UploadDialogProps) {
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [collectionId, setCollectionId] = useState<number | null>(
		initial_id ? initial_id : null
	);
	const collections = useCollections();

	const resetState = () => {
		setFiles([]);
		setCollectionId(null);
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
		}
	};

	return (
		<Dialog open={openState}>
			<DialogContent
				className='min-w-[500px] min-h-[200px] max-w-none p-8'
				aria-describedby={undefined}
				showCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>Upload Files</DialogTitle>
					<Button
						variant='ghost'
						className='absolute right-4 top-4 p-2 rounded-full'
						onClick={() => {
							resetState();
							closeDialog();
						}}
					>
						<X className='h-4 w-4' />
					</Button>
				</DialogHeader>

				<Select
					onValueChange={(e) => setCollectionId(Number(e))}
					defaultValue={collectionId?.toString()}
				>
					<SelectTrigger className='w-[300px]'>
						<SelectValue placeholder='Select a Collection' />
					</SelectTrigger>
					<SelectContent>
						{collections.map(({ id, name }) => (
							<div key={id}>
								<SelectItem value={id.toString()}>
									{name}
								</SelectItem>
							</div>
						))}
					</SelectContent>
				</Select>

				<Input
					type='file'
					ref={fileInputRef}
					className=''
					multiple
					onChange={(e) => {
						setFiles(Array.from(e.target.files ?? []));
					}}
				/>

				<DialogFooter>
					<Button
						className='mx-auto min-w-[150px]'
						disabled={!collectionId || !files?.length || uploading}
						onClick={upload}
					>
						Upload
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
