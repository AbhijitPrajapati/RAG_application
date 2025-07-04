from pydantic import BaseModel
from datetime import datetime

class FileResponse(BaseModel):
    id: int
    name: str
    collection_id: int   
    number_chunks: int     
    length: int         
    uploaded_at: datetime 

    class Config:
        from_attributes = True


class UploadFilesResponse(BaseModel):
    class File(BaseModel):
        id: int
        name: str
        length: int
        number_chunks: int

    files: list[File]


class FileBulkDeletionRequest(BaseModel):
    file_ids: list[int]

class DocumentResponse(BaseModel):
    document: str