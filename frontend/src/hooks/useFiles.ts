import { getFiles } from '@/services';
import { useEffect, useState } from 'react';
import type { File } from '@/types';

export default function useFiles(collection_id: number) {
	const [data, setData] = useState<Array<File>>([]);

	useEffect(() => {
		const fetchData = async () => {
			setData(await getFiles(collection_id));
		};
		fetchData();
	}, [collection_id]);

	return data;
}
