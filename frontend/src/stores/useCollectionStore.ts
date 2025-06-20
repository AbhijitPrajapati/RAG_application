import { create } from 'zustand';
import axios from 'axios';
import { Collection } from '@/types';

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
        await axios.get('http://localhost:8000/collections')
            .then((res) => {
                set({ collections: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                set({ isLoading: false })
            });
    }
}));

export const useCollections = () => useCollectionStore((state) => state.collections);
export const useFetchCollections = () => useCollectionStore((state) => state.fetchCollections);