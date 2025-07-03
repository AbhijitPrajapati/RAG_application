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
	setConfig: React.Dispatch<React.SetStateAction<Config>>;
	defaultConfig: Config;
}

export default function ConfigDrawer({
	config,
	setConfig,
	defaultConfig,
}: ConfigDrawerProps) {
	const curriedUpdaters: Record<string, (value: number) => void> = useMemo(
		() =>
			Object.keys(config).reduce(
				(acc, key) => {
					acc[key] = (value: number) => {
						setConfig((prev: Config) => ({
							...prev,
							[key]: value,
						}));
					};
					return acc;
				},
				{} as Record<string, (value: number) => void>
			),
		[config, setConfig]
	);

	const { n_chunks, max_tokens, temperature } = config;

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button className='w-full' variant='secondary'>
					Configurations
				</Button>
			</DrawerTrigger>

			<DrawerContent aria-describedby={undefined} className='p-3'>
				<DrawerHeader>
					<DrawerTitle className='text-lg'>
						Configurations
					</DrawerTitle>
				</DrawerHeader>
				<div className='mx-auto w-7xl p-1'>
					<ConfigSlider
						min={1}
						max={10}
						step={1}
						label='N Chunks'
						value={n_chunks}
						setValue={curriedUpdaters.n_chunks}
						defaultValue={defaultConfig.n_chunks}
					/>
					<ConfigSlider
						min={64}
						max={2048}
						step={32}
						label='Max Tokens'
						value={max_tokens}
						setValue={curriedUpdaters.max_tokens}
						defaultValue={defaultConfig.max_tokens}
					/>
					<ConfigSlider
						min={0}
						max={1}
						step={0.05}
						label='Temperature'
						value={temperature}
						setValue={curriedUpdaters.temperature}
						defaultValue={defaultConfig.temperature}
					/>
				</div>
				<DrawerFooter className='flex flex-row mx-auto p-6 gap-x-4 w-3xs'>
					<DrawerClose asChild>
						<Button variant='outline' className='w-1/2'>
							Cancel
						</Button>
					</DrawerClose>
					<Button
						onClick={() => setConfig(defaultConfig)}
						className='w-1/2'
					>
						Reset
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
