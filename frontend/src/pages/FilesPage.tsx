import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	useFiles,
	useFetchFiles,
	useDeleteFiles,
} from '@/stores/useFilesStore';
import type { File } from '@/types';
import { type Table } from '@tanstack/react-table';
import { columns } from '@/features/files/FileTableColumns';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UploadDialog from '@/features/files/UploadDialog';
import CollectionSelection from '@/features/collections/CollectionSelection';
import BulkDeletion from '@/components/BulkDeletion';

export default function FilesPage() {
	const [searchParams] = useSearchParams();
	const initialId = Number(searchParams.get('initial_id'));
	const [openUpload, setOpenUpload] = useState(false);
	const deleteFiles = useDeleteFiles();

	const [collectionId, setCollectionId] = useState<number>(initialId);
	const fetchFiles = useFetchFiles();

	useEffect(() => {
		fetchFiles(collectionId);
	}, [collectionId]);

	const data = useFiles();

	return (
		<DataTable
			data={data}
			columns={columns}
			renderControls={(table: Table<File>) => (
				<>
					<CollectionSelection
						setSelectedId={setCollectionId}
						defaultId={initialId}
						className='w-1/4'
					/>

					<Input
						placeholder='Search'
						value={
							(table
								.getColumn('name')
								?.getFilterValue() as string) ?? ''
						}
						onChange={(event) =>
							table
								.getColumn('name')
								?.setFilterValue(event.target.value)
						}
						className='w-1/4'
					/>
					<Button onClick={() => setOpenUpload(true)}>Upload</Button>
					<UploadDialog
						openState={openUpload}
						setOpenState={setOpenUpload}
						initial_id={collectionId}
						key={collectionId}
					/>
					<BulkDeletion
						deletion_items={data.filter((f) =>
							Object.keys(table.getState().rowSelection)
								.map(Number)
								.includes(f.id)
						)}
						item_type='files'
						deletion_func={(ids: Array<number>) =>
							deleteFiles(collectionId, ids)
						}
					/>
				</>
			)}
		/>
	);
}
