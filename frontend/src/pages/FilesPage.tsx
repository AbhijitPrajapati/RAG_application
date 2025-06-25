import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollectionSelection from '@/features/collections/CollectionSelection';
import useFiles from '@/hooks/useFiles';
import type { File } from '@/types';
import { type Table } from '@tanstack/react-table';
import { columns } from '@/features/files/FileTableColumns';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UploadDialog from '@/features/upload/UploadDialog';

export default function FilesPage() {
	const [searchParams] = useSearchParams();
	const initialId = Number(searchParams.get('initial_id'));
	const [openUpload, setOpenUpload] = useState(false);

	const [collectionIds, setCollectionIds] = useState<Set<number>>(
		new Set([initialId])
	);

	const toggleCollection = (id: number) => {
		const newSet = new Set(collectionIds);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		setCollectionIds(newSet);
	};

	const data = useFiles(collectionIds);

	return (
		<DataTable
			data={data}
			columns={columns}
			renderControls={(table: Table<File>) => (
				<>
					<CollectionSelection
						selectedCollectionIds={collectionIds}
						toggleSelectedCollection={toggleCollection}
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
						className='max-w-sm'
					/>
					<Button className='' onClick={() => setOpenUpload(true)}>
						Upload
					</Button>
					<UploadDialog
						openState={openUpload}
						setOpenState={setOpenUpload}
					/>
				</>
			)}
		/>
	);
}
