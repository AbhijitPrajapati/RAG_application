import React from 'react';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/drawer';

import { Button } from './ui/button';
import ConfigSlider from './ConfigSlider';
import { useConfigControls } from '@/stores/useConfigStore';

export default function ConfigDrawer() {
	const {
		n_chunks,
		max_tokens,
		temperature,
		setNChunks,
		setMaxTokens,
		setTemperature,
		reset,
	} = useConfigControls();

	return (
		<div className='w-full p-3'>
			<Drawer>
				<DrawerTrigger asChild>
					<Button className='w-full'>Configurations</Button>
				</DrawerTrigger>

				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Configurations</DrawerTitle>
					</DrawerHeader>
					<DrawerFooter>
						<div className='w-7/10 mx-auto'>
							<ConfigSlider
								min={1}
								max={10}
								step={1}
								label='N Chunks'
								value={n_chunks}
								setValue={setNChunks}
							/>
							<ConfigSlider
								min={64}
								max={2048}
								step={32}
								label='Max Tokens'
								value={max_tokens}
								setValue={setMaxTokens}
							/>
							<ConfigSlider
								min={0}
								max={1}
								step={0.05}
								label='Temperature'
								value={temperature}
								setValue={setTemperature}
							/>
						</div>

						<div className='flex flex-row mx-auto p-2 gap-x-4'>
							<DrawerClose>
								<Button variant='outline'>Cancel</Button>
							</DrawerClose>
							<Button onClick={reset}>Reset</Button>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
