import { responseOkay } from '@/services/util';

export const deleteCollection = async (id: number) => {
	const res = await fetch(`http://localhost:8000/collections/${id}`, {
		method: 'DELETE',
	});
	await responseOkay(res);
};

export const bulkDeleteCollections = async (ids: Array<number>) => {
	const res = await fetch('http://localhost:8000/collections/bulk-delete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ collection_ids: ids }),
	});
	await responseOkay(res);
};

export const getCollections = async () => {
	const res = await fetch('http://localhost:8000/collections', {
		method: 'GET',
	});
	await responseOkay(res);
	return res.json();
};

export const createCollection = async (name: string) => {
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

export const renameCollection = async (id: number, name: string) => {
	const res = await fetch(`http://localhost:8000/collections/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ new_name: name }),
	});
	await responseOkay(res);
};
