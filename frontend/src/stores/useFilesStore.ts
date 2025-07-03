import { create } from 'zustand';
import type { File as CustomFile } from '@/types';
import {
	getFiles,
	deleteFile,
	uploadFiles,
	bulkDeleteFiles,
	getDocument,
} from '@/services/files';

interface FilesState {
	files: CustomFile[];
	fetchFiles: (collection_id: number) => void;
	deleteFile: (file_id: number) => void;
	deleteFiles: (file_ids: Array<number>) => void;
	uploadFiles: (collection_id: number, files: Array<File>) => void;
	getFile: (file_id: number) => Promise<string>;
}

const useFilesStore = create<FilesState>((set, get) => ({
	files: [],
	fetchFiles: async (collection_id: number) => {
		const data = await getFiles(collection_id);
		set({ files: data });
	},
	deleteFile: async (file_id: number) => {
		await deleteFile(file_id);
		set({ files: get().files.filter((f) => f.id !== file_id) });
	},
	deleteFiles: async (file_ids: Array<number>) => {
		await bulkDeleteFiles(file_ids);
		set({ files: get().files.filter((f) => !file_ids.includes(f.id)) });
	},
	uploadFiles: async (collection_id: number, files: Array<File>) => {
		const res = await uploadFiles(files, collection_id);
		const newFiles = res.files.map(({ ...file }) => ({
			...file,
			collection_id,
		}));
		set({ files: [...get().files, ...newFiles] });
	},
	getFile: async (file_id: number) => {
		const content = await getDocument(file_id);
		return content['document'];
	},
}));

export const useFiles = () => useFilesStore((state) => state.files);
export const useFetchFiles = () => useFilesStore((state) => state.fetchFiles);
export const useDeleteFile = () => useFilesStore((state) => state.deleteFile);
export const useDeleteFiles = () => useFilesStore((state) => state.deleteFiles);
export const useUploadFiles = () => useFilesStore((state) => state.uploadFiles);
export const useGetFile = () => useFilesStore((state) => state.getFile);
