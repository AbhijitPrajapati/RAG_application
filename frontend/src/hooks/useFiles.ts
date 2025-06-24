import { getFiles } from '@/services';
import { useEffect, useState } from 'react';
import type { File } from '@/types';

export default function useFiles(collection_ids: Set<number>) {
	const [data, setData] = useState<Array<File>>([]);

	useEffect(() => {
		const fetchData = async () => {
			setData(await getFiles(Array.from(collection_ids)));
		};
		fetchData();
	}, [collection_ids]);

	return data;
}
