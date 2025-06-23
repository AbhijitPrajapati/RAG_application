import React, { useState } from 'react';
import { createCollection } from '@/stores/useCollectionStore';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from './ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CollectionCreation() {
	const [name, setName] = useState<string>('');

	return (
		<div className='w-full p-3'>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Create</Button>
				</DialogTrigger>
				<DialogContent className='min-w-[500px] min-h-[200px] max-w-none p-8'>
					<DialogHeader>
						<DialogTitle>Create Collection</DialogTitle>
					</DialogHeader>

					<Input
						type='text'
						placeholder='Collection Name'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setName(e.target.value);
						}}
					/>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								className='mx-auto min-w-[150px]'
								onClick={() => {
									createCollection(name);
								}}
							>
								Create
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
