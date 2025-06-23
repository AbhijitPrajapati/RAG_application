import { create } from 'zustand';
import type { Collection } from '@/types';
import {
	_getCollections,
	_deleteCollection,
	_bulkDeleteCollections,
	_createCollection,
	_renameCollection,
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
	await _deleteCollection(id);
	useCollectionStore.getState().fetchCollections();
};
export const deleteCollections = async (ids: Array<number>) => {
	await _bulkDeleteCollections(ids);
	useCollectionStore.getState().fetchCollections();
};
export const createCollection = async (name: string) => {
	await _createCollection(name);
	useCollectionStore.getState().fetchCollections();
};
export const renameCollection = async (collection_id: number, name: string) => {
	await _renameCollection(collection_id, name);
	useCollectionStore.getState().fetchCollections();
};
