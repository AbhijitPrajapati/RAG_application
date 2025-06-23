import type { Config } from '@/types';

const fetchOkay = async (res: Response) => {
	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText || `HTTP ${res.status}`);
	}
	return res;
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

	await fetchOkay(res);
	return res.body;
};

export const _deleteCollection = async (id: number) => {
	const res = await fetch(`http://localhost:8000/collections/${id}`, {
		method: 'DELETE',
	});
	await fetchOkay(res);
	return res.status;
};

export const _uploadFiles = async (files: File[], collectionId: number) => {
	const formData = new FormData();
	files.forEach((file) => formData.append('files', file));
	formData.append('collection_id', collectionId.toString());

	const res = await fetch('http://localhost:8000/upload', {
		method: 'POST',
		body: formData,
	});
	await fetchOkay(res);
	return res.status;
};

export const _bulkDeleteCollections = async (ids: Array<number>) => {
	const res = await fetch('http://localhost:8000/collections/bulk-delete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(ids),
	});

	await fetchOkay(res);
	return res.status;
};

export const _getCollections = async () => {
	const res = await fetch('http://localhost:8000/collections', {
		method: 'GET',
	});
	await fetchOkay(res);
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
	await fetchOkay(res);
	return res.json();
};
