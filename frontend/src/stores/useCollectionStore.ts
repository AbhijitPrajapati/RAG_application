import { create } from 'zustand';
import type { Collection } from '@/types';
import {
	_getCollections,
	_deleteCollection,
	_bulkDeleteCollections,
	_createCollection,
} from '@/services';

interface CollectionsState {
	collections: Collection[];
	isLoading: boolean;
	fetchCollections: () => void;
}

const useCollectionStore = create<CollectionsState>((set) => ({
	collections: [],
	isLoading: false,

	fetchCollections: async () => {
		set({ isLoading: true });
		const data = await _getCollections();
		set({ collections: data });
		set({ isLoading: false });
	},
}));

export const useCollections = () =>
	useCollectionStore((state) => state.collections);
export const useFetchCollections = () =>
	useCollectionStore((state) => state.fetchCollections);

export const deleteCollection = async (id: number) => {
	const data = await _deleteCollection(id);
	useCollectionStore.getState().fetchCollections();
	return data;
};
export const deleteCollections = async (ids: Array<number>) => {
	const data = await _bulkDeleteCollections(ids);
	useCollectionStore.getState().fetchCollections();
	return data;
};
export const createCollection = async (name: string) => {
	const data = await _createCollection(name);
	useCollectionStore.getState().fetchCollections();
	return data;
};
