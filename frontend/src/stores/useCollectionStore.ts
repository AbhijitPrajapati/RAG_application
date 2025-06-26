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
	deleteCollection: (id: number) => void;
	deleteCollections: (ids: Array<number>) => void;
	createCollection: (name: string) => void;
	renameCollection: (collection_id: number, name: string) => void;
}

const useCollectionStore = create<CollectionsState>((set, get) => ({
	collections: [],
	isLoading: false,

	fetchCollections: async () => {
		set({ isLoading: true });
		const data = await _getCollections();
		set({ collections: data });
		set({ isLoading: false });
	},
	deleteCollection: async (id: number) => {
		await _deleteCollection(id);
		get().fetchCollections();
	},
	deleteCollections: async (ids: Array<number>) => {
		await _bulkDeleteCollections(ids);
		get().fetchCollections();
	},
	createCollection: async (name: string) => {
		await _createCollection(name);
		get().fetchCollections();
	},
	renameCollection: async (collection_id: number, name: string) => {
		await _renameCollection(collection_id, name);
		get().fetchCollections();
	},
}));

export const useCollections = () =>
	useCollectionStore((state) => state.collections);
export const useFetchCollections = () =>
	useCollectionStore((state) => state.fetchCollections);
export const useDeleteCollection = () =>
	useCollectionStore((state) => state.deleteCollection);
export const useDeleteCollections = () =>
	useCollectionStore((state) => state.deleteCollections);
export const useCreateCollection = () =>
	useCollectionStore((state) => state.createCollection);
export const useRenameCollection = () =>
	useCollectionStore((state) => state.renameCollection);

// export const deleteCollection = async (id: number) => {
// 	await _deleteCollection(id);
// 	useCollectionStore.getState().fetchCollections();
// };
// export const deleteCollections = async (ids: Array<number>) => {
// 	await _bulkDeleteCollections(ids);
// 	useCollectionStore.getState().fetchCollections();
// };
// export const createCollection = async (name: string) => {
// 	await _createCollection(name);
// 	useCollectionStore.getState().fetchCollections();
// };
// export const renameCollection = async (collection_id: number, name: string) => {
// 	await _renameCollection(collection_id, name);
// 	useCollectionStore.getState().fetchCollections();
// };
