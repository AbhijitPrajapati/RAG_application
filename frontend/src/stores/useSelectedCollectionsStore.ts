import { create } from 'zustand';
interface SelectedCollectionsState {
	selected_ids: Set<number>;
	toggleCollection: (id: number) => void;
}

const useSelectedCollectionsStore = create<SelectedCollectionsState>((set) => ({
	selected_ids: new Set<number>(),

	toggleCollection: (id) => {
		set((state) => {
			const newSet = new Set(state.selected_ids);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return { selected_ids: newSet };
		});
	},
}));

export const useSelectedIds = () =>
	useSelectedCollectionsStore((state) => state.selected_ids);
export const useToggleCollection = () =>
	useSelectedCollectionsStore((state) => state.toggleCollection);
