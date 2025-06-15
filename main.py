from fastapi import FastAPI, File, UploadFile, Form, Response
from starlette.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from chromadb import PersistentClient
from datetime import datetime

from data.data_handler import add_documents, collections, files
from model.load import load_model
from rag.query_engine import query
from data.sqlite_setup import SessionLocal

async def lifespan(app: FastAPI):
    app.state.chroma = PersistentClient('data/chroma_db').get_collection('documents')
    app.state.sqlite = SessionLocal()
    # app.state.model = load_model()

    yield

    app.state.chroma = None
    app.state.sqlite.close()
    app.state.model = None

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class Query(BaseModel):
    query: str
    selected_collection_ids: list[int]
    n_chunks: int
    max_tokens: int
    temperature: float

@app.post('/query')
async def query_rag(req: Query):
    return StreamingResponse(query(req.query, app.state.model, app.state.chroma, req.selected_collection_ids, req.max_tokens, req.n_chunks, req.temperature), media_type='text/event-stream')

@app.post('/upload', status_code=204)
async def upload_files(collection_id: int = Form(...), files: list[UploadFile] = File(...)):
    names = []
    contents = []
    for f in files:
        names.append(f.filename)
        t = await f.read()
        contents.append(t.decode())

    add_documents(app.state.chroma, app.state.sqlite, contents, names, collection_id)
    return Response(status_code=204)

class CollectionResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    last_modified: datetime
    number_files: int

    class Config:
        orm_mode: True

@app.get('/collections', response_model=list[CollectionResponse])
async def get_collections():
    return collections(app.state.sqlite)

# @app.get('/files')
# async def get_files(collection_name: str):
#     return {'files': files(app.state.chroma, collection_name)}