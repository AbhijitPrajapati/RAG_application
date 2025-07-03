import { responseOkay } from '@/services/util';

export const getFiles = async (collection_id: number) => {
	const res = await fetch(
		`http://localhost:8000/collections/${collection_id}/files`,
		{
			method: 'GET',
		}
	);
	await responseOkay(res);
	return res.json();
};

export const deleteFile = async (file_id: number) => {
	const res = await fetch(`http://localhost:8000/files/${file_id}`, {
		method: 'GET',
	});
	await responseOkay(res);
};

export const bulkDeleteFiles = async (file_ids: Array<number>) => {
	const res = await fetch('http://localhost:8000/files/bulk-delete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(file_ids),
	});
	await responseOkay(res);
};

export const getDocument = async (file_id: number) => {
	const res = await fetch(`http://localhost:8000/files/${file_id}`, {
		method: 'GET',
	});
	await responseOkay(res);
	return res.json();
};

export const uploadFiles = async (files: File[], collectionId: number) => {
	const formData = new FormData();
	files.forEach((file) => formData.append('files', file));

	const res = await fetch(
		`http://localhost:8000/collections/${collectionId}/files`,
		{
			method: 'POST',
			body: formData,
		}
	);
	await responseOkay(res);
	return res.json();
};
