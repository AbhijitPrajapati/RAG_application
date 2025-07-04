from fastapi import APIRouter, status, File, UploadFile, Depends, Request
from .schema import UploadFilesResponse, FileResponse, FileBulkDeletionRequest, DocumentResponse
from backend.db.sql.sqlalchemy_setup import get_db
from .service import add_documents, read_files, files, delete_documents, get_document

documents_router = APIRouter()

@documents_router.post('/collections/{collection_id}/files', response_model=UploadFilesResponse, status_code=status.HTTP_201_CREATED)
async def upload_files(request: Request, collection_id: int, files: list[UploadFile] = File(...), sql_db = Depends(get_db)):
    names, contents = await read_files(files)
    return UploadFilesResponse(files=add_documents(request.app.state.chroma, sql_db, request.app.state.embedding_model, contents, names, collection_id))

@documents_router.get('/collections/{collection_id}/files', response_model=list[FileResponse])
async def get_files(collection_id: int, sql_db = Depends(get_db)):
    return files(sql_db, collection_id)

@documents_router.delete('/files/{file_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(file_id: int, request: Request, sql_db = Depends(get_db)):
    delete_documents(request.app.state.chroma, sql_db, [file_id])
    return

@documents_router.post('/files/bulk-delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_files_bulk(req: FileBulkDeletionRequest, request: Request, sql_db= Depends(get_db)):
    delete_documents(request.app.state.chroma, sql_db, req.file_ids)
    return

@documents_router.get('/files/{file_id}', response_model=DocumentResponse)
async def get_file(file_id: int, request: Request):
    return DocumentResponse(document=get_document(request.app.state.chroma, file_id))