from pydantic import BaseModel
from datetime import datetime

class Query(BaseModel):
    query: str
    selected_collection_ids: list[int]
    n_chunks: int
    max_tokens: int
    temperature: float

class CollectionResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    last_modified: datetime
    number_files: int

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    uploaded_files: list[str]

class CollectionDeletionResponse(BaseModel):
    collection_id: int

class BulkCollectionDeletionResponse(BaseModel):
    collection_ids: list[int]

class CollectionCreationResponse(BaseModel):
    collection: CollectionResponse

class CollectionCreationRequest(BaseModel):
    name: str