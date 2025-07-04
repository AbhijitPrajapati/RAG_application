import type { Config } from '@/types';
import { useEffect, useState } from 'react';

export default function useConfig(defaultConfig: Config) {
	const [config, setConfig] = useState<Config>(() => {
		const local = localStorage.getItem('config');
		return local ? JSON.parse(local) : defaultConfig;
	});

	useEffect(() => {
		localStorage.setItem('config', JSON.stringify(config));
	}, [config]);

	return [config, setConfig] as const;
}
