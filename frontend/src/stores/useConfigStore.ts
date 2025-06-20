import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

interface ConfigState {
	n_chunks: number;
	max_tokens: number;
	temperature: number;

	setNChunks: (val: number) => void;
	setMaxTokens: (val: number) => void;
	setTemperature: (val: number) => void;

	reset: () => void;
}

const DEFAULT_CONFIG = {
	n_chunks: 4,
	max_tokens: 512,
	temperature: 0.7,
};

const useConfigStore = create<ConfigState>((set) => ({
	...DEFAULT_CONFIG,

	setNChunks: (val) => set({ n_chunks: val }),
	setMaxTokens: (val) => set({ max_tokens: val }),
	setTemperature: (val) => set({ temperature: val }),

	reset: () => set(DEFAULT_CONFIG),
}));

export const useConfigControls = () =>
	useConfigStore(
		useShallow((state) => ({
			n_chunks: state.n_chunks,
			max_tokens: state.max_tokens,
			temperature: state.temperature,
			setNChunks: state.setNChunks,
			setMaxTokens: state.setMaxTokens,
			setTemperature: state.setTemperature,
			reset: state.reset,
		}))
	);

export const useConfigSnapshot = () =>
	useConfigStore(
		useShallow((state) => ({
			n_chunks: state.n_chunks,
			max_tokens: state.max_tokens,
			temperature: state.temperature,
		}))
	);
