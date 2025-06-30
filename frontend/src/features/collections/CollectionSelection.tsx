import React from 'react';
import { useCollections } from '@/stores/useCollectionStore';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface CollectionSelectionProps {
	setSelectedId: (id: number) => void;
	defaultId?: number;
	className?: string;
}

export default function CollectionSelection({
	setSelectedId,
	defaultId,
	className,
}: CollectionSelectionProps) {
	const collections = useCollections();

	return (
		<Select
			defaultValue={defaultId?.toString()}
			onValueChange={(value: string) => setSelectedId(Number(value))}
			disabled={collections.length === 0}
		>
			<SelectTrigger className={className}>
				<SelectValue placeholder='Select a Collection' />
			</SelectTrigger>
			<SelectContent>
				{collections.map(({ id, name }) => (
					<div key={id}>
						<SelectItem value={id.toString()}>{name}</SelectItem>
					</div>
				))}
			</SelectContent>
		</Select>
	);
}
