import React, { useState, useRef } from 'react';
import { useCollections } from '@/stores/useCollectionStore';
import { uploadFiles } from '@/services';
import { Button } from './ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { Input } from './ui/input';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';

export default function QuickUpload() {
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [collectionId, setCollectionId] = useState<number | null>(null);
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
			toast.error(`Error uploading files: ${err}`);
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	return (
		<div className='w-full p-3'>
			<Dialog onOpenChange={resetState}>
				<DialogTrigger asChild>
					<Button className='w-full'>Quick Upload</Button>
				</DialogTrigger>
				<DialogContent
					className='min-w-[500px] min-h-[200px] max-w-none p-8'
					aria-describedby={undefined}
				>
					<DialogHeader>
						<DialogTitle>Upload Files</DialogTitle>
					</DialogHeader>

					<Select onValueChange={(e) => setCollectionId(Number(e))}>
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
							disabled={
								!collectionId || !files?.length || uploading
							}
							onClick={upload}
						>
							Upload
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
