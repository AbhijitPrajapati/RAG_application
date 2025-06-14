import { create } from 'zustand';

const useSelectedCollectionsStore = create((set) => ({
    selected: [],

    toggleCollection: (name) => {
        set((state) => {
          const exists = state.selected.includes(name);
          return {
            selected: exists
              ? state.selected.filter((c) => c !== name)
              : [...state.selected, name],
          };
        });
    }
}));