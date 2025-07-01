import React, { useMemo } from 'react';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import ConfigSlider from './ConfigSlider';
import type { Config } from '@/types';

interface ConfigDrawerProps {
	config: Config;
	updateConfig: <K extends keyof Config>(key: K, value: Config[K]) => void;
	resetConfig: () => void;
}

export default function ConfigDrawer({
	config,
	updateConfig,
	resetConfig,
}: ConfigDrawerProps) {
	const { n_chunks, max_tokens, temperature } = config;

	const curriedUpdaters: Record<string, (value: number) => void> = useMemo(
		() =>
			Object.keys(config).reduce(
				(acc, key) => {
					acc[key] = (value: number) => {
						updateConfig(key as keyof Config, value);
					};
					return acc;
				},
				{} as Record<string, (value: number) => void>
			),
		[config, updateConfig]
	);

	return (
		<div className='w-full'>
			<Drawer>
				<DrawerTrigger asChild>
					<Button className='w-full'>Configurations</Button>
				</DrawerTrigger>

				<DrawerContent aria-describedby={undefined}>
					<DrawerHeader>
						<DrawerTitle className='text-lg'>
							Configurations
						</DrawerTitle>
					</DrawerHeader>
					<DrawerFooter>
						<div className='w-7/10 mx-auto'>
							<ConfigSlider
								min={1}
								max={10}
								step={1}
								label='N Chunks'
								value={n_chunks}
								setValue={curriedUpdaters.n_chunks}
							/>
							<ConfigSlider
								min={64}
								max={2048}
								step={32}
								label='Max Tokens'
								value={max_tokens}
								setValue={curriedUpdaters.max_tokens}
							/>
							<ConfigSlider
								min={0}
								max={1}
								step={0.05}
								label='Temperature'
								value={temperature}
								setValue={curriedUpdaters.temperature}
							/>
						</div>

						<div className='flex flex-row mx-auto p-2 gap-x-4'>
							<DrawerClose asChild>
								<Button variant='outline'>Cancel</Button>
							</DrawerClose>
							<Button onClick={resetConfig}>Reset</Button>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
