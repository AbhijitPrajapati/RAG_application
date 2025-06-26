from fastapi import APIRouter, status, File, UploadFile, Depends, Request
from models import UploadFilesResposne, FileResponse
from data.sqlalchemy_setup import get_db
from data.documents import add_documents, read_files, files

files_router = APIRouter(prefix='/collections')

@files_router.post('/{collection_id}/files', response_model=UploadFilesResposne, status_code=status.HTTP_201_CREATED)
async def upload_files(request: Request, collection_id: int, files: list[UploadFile] = File(...), sql_db = Depends(get_db)):
    names, contents = await read_files(files)
    file_ids = add_documents(request.app.state.chroma, sql_db, contents, names, collection_id)
    return UploadFilesResposne(files_ids=file_ids)

@files_router.get('/{collection_id}/files', response_model=list[FileResponse])
async def get_files(collection_id: int, sql_db = Depends(get_db)):
    return files(sql_db, collection_id)