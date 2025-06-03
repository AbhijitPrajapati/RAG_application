from fastapi import FastAPI, File, UploadFile
from starlette.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from data.data_handler import load_collection, add_documents
from model.load import load_model
from rag.query_engine import query

async def lifespan(app: FastAPI):
    app.state.collection = load_collection()
    app.state.model = load_model()

    yield

    app.state.collection = None
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

@app.post('/query')
async def query_rag(req: Query):
    return StreamingResponse(query(req.query, app.state.model, app.state.collection), media_type='text/event-stream')

@app.post('/upload')
async def upload_files(files: list[UploadFile] = File(...)):
    names = []
    contents = []
    for f in files:
        names.append(f.filename)
        t = await f.read()
        contents.append(t.decode())

    add_documents(app.state.collection, contents, names)