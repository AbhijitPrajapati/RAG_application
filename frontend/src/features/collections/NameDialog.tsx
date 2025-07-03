import React, { useState } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollections } from '@/stores/useCollectionStore';
import DialogExit from '@/components/dialog/DialogExit';

interface NameDialogProps {
	onSubmit: (name: string) => void;
	title: string;
	placeholder?: string;
	submitText: string;
	openState: boolean;
	setOpenState: (open: boolean) => void;
}

export default function NameDialog({
	onSubmit,
	title,
	placeholder,
	submitText,
	openState,
	setOpenState,
}: NameDialogProps) {
	const [name, setName] = useState<string>('');
	const collection = useCollections();
	const disallowedNames = collection.map((c) => c.name);

	const openChange = (open: boolean) => {
		if (!open) {
			setName('');
		}
		setOpenState(open);
	};

	return (
		<Dialog open={openState} onOpenChange={openChange}>
			<DialogContent
				className='w-lg h-56 max-w-none p-8'
				showCloseButton={false}
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogExit />
				</DialogHeader>

				<Input
					type='text'
					placeholder={placeholder}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setName(e.target.value);
					}}
					className='mx-auto'
				/>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							className='mx-auto w-40'
							onClick={() => {
								onSubmit(name);
								setName('');
							}}
							disabled={disallowedNames.includes(name)}
						>
							{submitText}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
