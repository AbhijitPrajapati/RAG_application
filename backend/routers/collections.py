from fastapi import APIRouter, Request, status, Depends
from services.collections import get, delete, create, rename
from data.sql.sqlalchemy_setup import get_db
from models import CollectionResponse, CollectionCreationRequest, CollectionCreationResponse, CollectionRenameRequest, CollectionBulkDeletionRequest

collections_router = APIRouter(prefix='/collections')

@collections_router.get('/', response_model=list[CollectionResponse])
async def get_collections(sql_db = Depends(get_db)):
    return get(sql_db)

@collections_router.delete('/{collection_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(collection_id: int, request: Request, sql_db = Depends(get_db)):
    delete(request.app.state.chroma, sql_db, [collection_id])
    return


@collections_router.post('/bulk-delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_collections_bulk(req: CollectionBulkDeletionRequest, request: Request, sql_db = Depends(get_db)):
    delete(request.app.state.chroma, sql_db, req.collection_ids)
    return

@collections_router.post('/', response_model=CollectionCreationResponse, status_code=status.HTTP_201_CREATED)
async def create_collection(req: CollectionCreationRequest, sql_db = Depends(get_db)):
    return CollectionCreationResponse(collection_id=create(req.name, sql_db)) # type: ignore

@collections_router.patch('/{collection_id}', status_code=status.HTTP_204_NO_CONTENT)
async def rename_collection(collection_id: int, req: CollectionRenameRequest, sql_db = Depends(get_db)):
    rename(collection_id, req.new_name, sql_db)
    return