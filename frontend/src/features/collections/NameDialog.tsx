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
import { X } from 'lucide-react';

interface NameDialogProps {
	onSubmit: (name: string) => void;
	title: string;
	placeholder: string;
	submitText: string;
	openState: boolean;
	setOpenState: (open: boolean) => void;
	disableSubmit: (name: string) => boolean;
}

export default function NameDialog({
	onSubmit,
	title,
	placeholder,
	submitText,
	openState,
	setOpenState,
	disableSubmit,
}: NameDialogProps) {
	const [name, setName] = useState<string>('');

	return (
		<div>
			<Dialog open={openState} onOpenChange={setOpenState}>
				<DialogContent
					className='min-w-[500px] min-h-[200px] max-w-none p-8'
					showCloseButton={false}
					aria-describedby={undefined}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogClose asChild>
							<Button
								variant='ghost'
								className='absolute right-4 top-4 p-2 rounded-full'
								onClick={() => setName('')}
							>
								<X className='h-4 w-4' />
							</Button>
						</DialogClose>
					</DialogHeader>

					<Input
						type='text'
						placeholder={placeholder}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setName(e.target.value);
						}}
						className='my-3'
					/>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								className='mx-auto min-w-[150px]'
								onClick={() => {
									onSubmit(name);
									setName('');
								}}
								disabled={disableSubmit(name)}
							>
								{submitText}
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
