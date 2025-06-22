from fastapi import FastAPI, File, UploadFile, Form, Body, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from chromadb import PersistentClient

from models import Query, CollectionResponse, CollectionDeletionResponse, BulkCollectionDeletionResponse, UploadResponse, CollectionCreationResponse, CollectionCreationRequest
from data.data_handler import add_documents, collections, delete_collections, create_collection
from llm.load import load_model
from rag.query_engine import query
from data.sqlalchemy_setup import get_db

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


@app.post('/query', response_class=StreamingResponse)
async def query_rag(req: Query):
    return StreamingResponse(query(req.query, app.state.model, app.state.chroma, req.selected_collection_ids, req.max_tokens, req.n_chunks, req.temperature), media_type='text/event-stream')

@app.post('/upload', response_model=UploadResponse)
async def upload_files(collection_id: int = Form(...), files: list[UploadFile] = File(...), sql_db = Depends(get_db)):
    names = []
    contents = []
    for f in files:
        names.append(f.filename)
        t = await f.read()
        contents.append(t.decode())

    add_documents(app.state.chroma, sql_db, contents, names, collection_id)
    return UploadResponse(uploaded_files=names)


@app.get('/collections', response_model=list[CollectionResponse])
async def get_collections(sql_db = Depends(get_db)):
    return collections(sql_db)

@app.delete('/collections/{collection_id}', response_model=CollectionDeletionResponse)
async def delete_collection(collection_id: int, sql_db = Depends(get_db)):
    delete_collections(app.state.chroma, sql_db, [collection_id])
    return CollectionDeletionResponse(collection_id=collection_id)

@app.post('/collections/bulk-delete', response_model=BulkCollectionDeletionResponse)
async def delete_collections_bulk(collection_ids: list[int] = Body(...), sql_db = Depends(get_db)):
    delete_collections(app.state.chroma, sql_db, collection_ids)
    return BulkCollectionDeletionResponse(collection_ids=collection_ids)

@app.post('/collections', response_model=CollectionCreationResponse)
async def _create_collection(req: CollectionCreationRequest, sql_db = Depends(get_db)):
    return CollectionCreationResponse(collection=create_collection(req.name, sql_db))

# @app.get('/files')
# async def get_files(collection_name: str):
#     return {'files': files(app.state.chroma, collection_name)}