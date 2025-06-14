import { create } from 'zustand';
import axios from 'axios';

const useCollectionStore = create((set) => ({
    collections: [],
    isLoading: false,
    error: null,
    
    fetchCollections: async () => {
        set({ isLoading: true, error: null });
        axios.get('http://localhost:8000/collections')
        .then((res) => {
            set({ collections: res.data['collections'] })
        })
        .catch((err) => {
            set({ error: err })
        })
        .finally(() => {
            set({ isLoading: false })
        });
    }
}));