import type { Config } from '@/types';

const responseOkay = async (res: Response) => {
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.detail || `HTTP ${res.status}`);
	}
};

export const fetchRAGResponse = async (
	q: string,
	config: Config,
	selectedCollectionIds: Set<number>
) => {
	const res = await fetch('http://localhost:8000/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: q,
			selected_collection_ids: Array.from(selectedCollectionIds),
			...config,
		}),
	});

	await responseOkay(res);
	return res.body;
};

export const _deleteCollection = async (id: number) => {
	const res = await fetch(`http://localhost:8000/collections/${id}`, {
		method: 'DELETE',
	});
	await responseOkay(res);
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
};

export const _bulkDeleteCollections = async (ids: Array<number>) => {
	const res = await fetch('http://localhost:8000/collections/bulk-delete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ collection_ids: ids }),
	});
	await responseOkay(res);
};

export const _getCollections = async () => {
	const res = await fetch('http://localhost:8000/collections', {
		method: 'GET',
	});
	await responseOkay(res);
	return res.json();
};

export const _createCollection = async (name: string) => {
	const res = await fetch('http://localhost:8000/collections', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: name }),
	});
	await responseOkay(res);
	return res.json();
};

export const _renameCollection = async (id: number, name: string) => {
	const res = await fetch(`http://localhost:8000/collections/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ new_name: name }),
	});
	await responseOkay(res);
};

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
