import { responseOkay } from '@/services/util';
import type { Config } from '@/types';

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
