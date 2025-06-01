import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length == 0) {
      toast('Please select file(s)');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    setUploading(true);

    try {

      await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      });

      toast('File successfully uploaded');

    } catch (err) {
      toast('Error Uploading File: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type='file'
          multiple
          onChange={handleFileChange}
        />
        <Button
          type='submit'
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
        <Toaster/>
      </form>
    </div>
  );
}