from pydantic import BaseModel
from datetime import datetime

class CollectionResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    last_modified: datetime
    number_files: int

    class Config:
        from_attributes = True


class CollectionCreationRequest(BaseModel):
    name: str

class CollectionCreationResponse(BaseModel):
    collection_id: int
    created_at: datetime

class CollectionRenameRequest(BaseModel):
    new_name: str

class CollectionBulkDeletionRequest(BaseModel):
    collection_ids: list[int]
