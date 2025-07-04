import { useEffect, useState } from 'react';

export default function useSelectedCollectionIds() {
	const [selectedCollectionIds, setSelectedCollectionIds] = useState<
		Set<number>
	>(() => {
		const session = sessionStorage.getItem('selectedCollectionIds');
		return session
			? new Set(JSON.parse(session) as number[])
			: new Set<number>();
	});
	useEffect(() => {
		sessionStorage.setItem(
			'selectedCollectionIds',
			JSON.stringify(Array.from(selectedCollectionIds))
		);
	}, [selectedCollectionIds]);

	return [selectedCollectionIds, setSelectedCollectionIds] as const;
}
