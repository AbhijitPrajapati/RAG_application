import React, { useState } from 'react';
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
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from './ui/dialog'


export default function QuickUpload( { collections } ) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [collection, setCollection] = useState<string | null>(null);

    const upload = () => {
        if (!collection) {
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
        formData.append('collection_name', collection);

        fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData
        })
        .then(() => toast('File successfully uploaded'))
        .catch((e) => toast('Error Uploading File: ' + e.message))
        .finally(() => setUploading(false));
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

                    <Select onValueChange={(e) => setCollection(e)}>
                        <SelectTrigger className='w-[300px]'>
                            <SelectValue placeholder='Select a Collection' />
                        </SelectTrigger>
                        <SelectContent>
                            {collections.map((name) => (
                                <div key={name}>
                                    <SelectItem value={name}>{name}</SelectItem>
                                </div>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input type='file'  className='' multiple onChange={(e) => {
                        setFiles(Array.from(e.target.files ?? []))
                    }}/>

                    <DialogFooter>
                        <Button className='mx-auto min-w-[150px]' disabled={uploading} onClick={upload}>Upload</Button>
                    </DialogFooter>
                </DialogContent>
                <Toaster/>
            </Dialog>
        </div>
    );
}