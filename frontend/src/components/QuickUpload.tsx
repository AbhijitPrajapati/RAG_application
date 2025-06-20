import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useCollections } from '@/stores/useCollectionStore';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import { Input } from './ui/input';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'


export default function QuickUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [collectionId, setCollectionId] = useState<string | null>(null);
    const collections = useCollections();

    const upload = () => {
        if (!collectionId) {
            toast('Please select a collection');
            return;
        }

        if (!files || files.length === 0) {
            toast('Please select file(s)');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('collection_id', collectionId);


        axios.post('http://localhost:8000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            // fetch('http://localhost:8000/upload', {
            //     method: 'POST',
            //     body: formData
            // })
            .then(() => toast('Files successfully uploaded'))
            .catch((e) => toast('Error Uploading Files: ' + e.message))
            .finally(() => {
                setUploading(false);
                setFiles([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            });
    };

    return (
        <div className='w-full p-3'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='w-full'>Quick Upload</Button>
                </DialogTrigger>
                <DialogContent className='min-w-[500px] min-h-[200px] max-w-none p-8'>
                    <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                    </DialogHeader>

                    <Select onValueChange={(e) => setCollectionId(e)}>
                        <SelectTrigger className='w-[300px]'>
                            <SelectValue placeholder='Select a Collection' />
                        </SelectTrigger>
                        <SelectContent>
                            {collections.map(({ id, name }) => (
                                <div key={id}>
                                    <SelectItem value={id}>{name}</SelectItem>
                                </div>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input type='file' ref={fileInputRef} className='' multiple onChange={(e) => {
                        setFiles(Array.from(e.target.files ?? []))
                    }} />

                    <DialogFooter>
                        <Button className='mx-auto min-w-[150px]' disabled={uploading} onClick={upload}>Upload</Button>
                    </DialogFooter>
                </DialogContent>
                <Toaster />
            </Dialog>
        </div>
    );
}