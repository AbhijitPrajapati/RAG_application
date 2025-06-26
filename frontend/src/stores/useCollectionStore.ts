import { create } from 'zustand';
import type { Collection } from '@/types';
import {
	getCollections,
	deleteCollection,
	bulkDeleteCollections,
	createCollection,
	renameCollection,
} from '@/services';

interface CollectionsState {
	collections: Collection[];
	fetchCollections: () => void;
	deleteCollection: (id: number) => void;
	deleteCollections: (ids: Array<number>) => void;
	createCollection: (name: string) => void;
	renameCollection: (collection_id: number, name: string) => void;
}

const useCollectionStore = create<CollectionsState>((set, get) => ({
	collections: [],

	fetchCollections: async () => {
		const data = await getCollections();
		set({ collections: data });
	},
	deleteCollection: async (id: number) => {
		await deleteCollection(id);
		get().fetchCollections();
	},
	deleteCollections: async (ids: Array<number>) => {
		await bulkDeleteCollections(ids);
		get().fetchCollections();
	},
	createCollection: async (name: string) => {
		await createCollection(name);
		get().fetchCollections();
	},
	renameCollection: async (collection_id: number, name: string) => {
		await renameCollection(collection_id, name);
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
