from pydantic import BaseModel, field_validator
from datetime import datetime

class Query(BaseModel):
    query: str
    selected_collection_ids: list[int]
    n_chunks: int
    max_tokens: int
    temperature: float

    @field_validator('query')
    def query_must_be_non_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Empty query')
        if len(v.strip()) < 3:
            raise ValueError('Query too short')
        if len(v) > 1000:
            raise ValueError('Query too long')
        return v

class CollectionResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    last_modified: datetime
    number_files: int

    class Config:
        from_attributes = True

class FileResponse(BaseModel):
    id: int
    name: str
    collection_id: int   
    number_chunks: int     
    length: int         
    uploaded_at: datetime 

    class Config:
        from_attributes = True

class CollectionCreationRequest(BaseModel):
    name: str

class CollectionCreationResponse(BaseModel):
    collection_id: int

class CollectionRenameRequest(BaseModel):
    new_name: str

class CollectionBulkDeletionRequest(BaseModel):
    collection_ids: list[int]

class UploadFilesResponse(BaseModel):
    files_ids: list[int]

class FileBulkDeletionRequest(BaseModel):
    file_ids: list[int]

class DocumentResponse(BaseModel):
    document: str