import { create } from 'zustand';
import type { Collection } from '@/types';
import {
	getCollections,
	deleteCollection,
	bulkDeleteCollections,
	createCollection,
	renameCollection,
} from '@/services/collections';

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
		set({ collections: get().collections.filter((c) => c.id !== id) });
	},
	deleteCollections: async (ids: Array<number>) => {
		await bulkDeleteCollections(ids);
		set({
			collections: get().collections.filter((c) => !ids.includes(c.id)),
		});
	},
	createCollection: async (name: string) => {
		const res = await createCollection(name);
		const newCollection = {
			id: res.collection_id,
			name: name,
			created_at: res.created_at,
			last_modified: res.created_at,
			number_files: 0,
		};
		set({
			collections: [...get().collections, newCollection],
		});
	},
	renameCollection: async (collection_id: number, name: string) => {
		await renameCollection(collection_id, name);
		set({
			collections: get().collections.map((c) =>
				c.id === collection_id ? { ...c, name: name } : c
			),
		});
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
