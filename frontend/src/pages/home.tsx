import React from 'react';

import Query from '../components/query';
import FileUploader from '../components/file_upload';

export default function Home() {
  return (
    <div>  
      <Query />
      <FileUploader />
    </div>
  );
}