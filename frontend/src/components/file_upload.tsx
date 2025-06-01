import React, { useState } from 'react';

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [response, setResponse] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length == 0) {
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    setUploading(true);

    try {

      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));

    } catch (err) {
      setResponse('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='file'
          multiple
          onChange={handleFileChange}
        />
        <button
          type='submit'
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {response && (
        <div>
          <strong>Response:</strong>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}