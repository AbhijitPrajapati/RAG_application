from fastapi import FastAPI, File, UploadFile, Form, Body, Depends
from fastapi import status, Response
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from chromadb import PersistentClient

from models import Query, CollectionResponse, UploadResponse, CollectionCreationResponse, CollectionCreationRequest
from .data.documents import add_documents, read_files
from .data.collections import collections, delete_collections, create_collection
from llm.load import load_model
from rag.query_engine import query
from data.sqlalchemy_setup import get_db
from .errors import AppError

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.chroma = PersistentClient('data/chroma_db').get_collection('documents')
    # app.state.model = load_model()

    yield

    app.state.chroma = None
    app.state.model = None

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.exception_handler(AppError)
async def error_handler(exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={'detail': exc.detail}
    )

@app.post('/query', response_class=StreamingResponse)
async def query_rag(req: Query):
    return StreamingResponse(query(req.query, app.state.model, app.state.chroma, req.selected_collection_ids, req.max_tokens, req.n_chunks, req.temperature), media_type='text/event-stream')

@app.post('/upload', response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_files(collection_id: int = Form(...), files: list[UploadFile] = File(...), sql_db = Depends(get_db)):
    names, contents = await read_files(files)
    add_documents(app.state.chroma, sql_db, contents, names, collection_id)
    return UploadResponse(uploaded_files=names)


@app.get('/collections', response_model=list[CollectionResponse])
async def get_collections(sql_db = Depends(get_db)):
    return collections(sql_db)

@app.delete('/collections/{collection_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(collection_id: int, sql_db = Depends(get_db)):
    delete_collections(app.state.chroma, sql_db, [collection_id])
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post('/collections/bulk-delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_collections_bulk(collection_ids: list[int] = Body(...), sql_db = Depends(get_db)):
    delete_collections(app.state.chroma, sql_db, collection_ids)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.post('/collections', response_model=CollectionCreationResponse, status_code=status.HTTP_201_CREATED)
async def _create_collection(req: CollectionCreationRequest, sql_db = Depends(get_db)):
    return CollectionCreationResponse(collection=create_collection(req.name, sql_db))

# @app.get('/files')
# async def get_files(collection_name: str):
#     return {'files': files(app.state.chroma, collection_name)}