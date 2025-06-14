import { create } from 'zustand';

// interface ConfigState {
//     n_chunks: number;
//     max_tokens: number;
//     temperature: number;
  
//     setNChunks: (val: number) => void;
//     setMaxTokens: (val: number) => void;
//     setTemperature: (val: number) => void;
  
//     reset: () => void;
// }

const DEFAULT_CONFIG = {
    n_chunks: 4,
    max_tokens: 512,
    temperature: 0.7
  }

const useConfig = create((set) => ({
    ...DEFAULT_CONFIG,

    setNChunks: (val) => set({n_chunks: val}),
    setMaxTokens: (val) => set({max_tokens: val}),
    setTemperature: (val) => set({temperature: val}),

    reset: () => set(DEFAULT_CONFIG)

}));