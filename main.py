from fastapi import FastAPI, File, UploadFile, Form
from starlette.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from data.data_handler import load_db, add_documents, collections, files
from model.load import load_model
from rag.query_engine import query

async def lifespan(app: FastAPI):
    app.state.db = load_db()
    app.state.model = load_model()

    yield

    app.state.db = None
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
    selected_collections: list[str]
    n_chunks: int
    max_tokens: int
    temperature: float

@app.post('/query')
async def query_rag(req: Query):
    return StreamingResponse(query(req.query, app.state.model, app.state.db, req.selected_collections, req.max_tokens, req.n_chunks, req.temperature), media_type='text/event-stream')

@app.post('/upload')
async def upload_files(collection_name: str = Form(...), files: list[UploadFile] = File(...)):
    names = []
    contents = []
    for f in files:
        names.append(f.filename)
        t = await f.read()
        contents.append(t.decode())

    add_documents(app.state.db, contents, names, collection_name)

@app.get('/collections')
async def get_collections():
    return {'collections': collections(app.state.db)}

# @app.get('/files')
# async def get_files(collection_name: str):
#     return {'files': files(app.state.db, collection_name)}
