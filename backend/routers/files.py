from fastapi import APIRouter, status, File, UploadFile, Depends, Request
from models import UploadFilesResposne, FileResponse, FileBulkDeletionRequest
from data.sqlalchemy_setup import get_db
from data.documents import add_documents, read_files, files, delete_documents

files_router = APIRouter()

@files_router.post('/collections/{collection_id}/files', response_model=UploadFilesResposne, status_code=status.HTTP_201_CREATED)
async def upload_files(request: Request, collection_id: int, files: list[UploadFile] = File(...), sql_db = Depends(get_db)):
    names, contents = await read_files(files)
    file_ids = add_documents(request.app.state.chroma, sql_db, contents, names, collection_id)
    return UploadFilesResposne(files_ids=file_ids)

@files_router.get('/collections/{collection_id}/files', response_model=list[FileResponse])
async def get_files(collection_id: int, sql_db = Depends(get_db)):
    return files(sql_db, collection_id)

@files_router.delete('/files/{file_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(file_id: int, request: Request, sql_db = Depends(get_db)):
    delete_documents(request.app.state.chroma, sql_db, [file_id])
    return

files_router.post('/files/bulk-delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_files_bulk(req: FileBulkDeletionRequest, request: Request, sql_db= Depends(get_db)):
    delete_documents(request.app.state.chroma, sql_db, req.file_ids)
    return