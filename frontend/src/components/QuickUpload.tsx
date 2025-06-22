import React, { useState, useRef } from 'react';
import { useCollections } from '@/stores/useCollectionStore';
import { _uploadFiles } from '@/services';
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

	const upload = async () => {
		if (!collectionId) {
			toast('Please select a collection');
			return;
		}

		if (!files || files.length === 0) {
			toast('Please select file(s)');
			return;
		}

		setUploading(true);

		try {
			const data = await _uploadFiles(files, collectionId);
			const text =
				data.uploaded_files.length === 1
					? data.uploaded_files[0]
					: `${data.uploaded_files.length} files`;

			toast(`${text} uploaded`);
		} catch (err) {
			toast(`Error uploading files: ${err}`);
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	return (
		<div className='w-full p-3'>
			<Dialog>
				<DialogTrigger asChild>
					<Button className='w-full'>Quick Upload</Button>
				</DialogTrigger>
				<DialogContent className='min-w-[500px] min-h-[200px] max-w-none p-8'>
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
							disabled={uploading}
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
