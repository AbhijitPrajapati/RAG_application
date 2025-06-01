from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from ..model.model import load_model
from ..data.data_handler import load_collection, add_documents
from ..rag.query_engine import query

async def lifespan(app: FastAPI):
    app.state.collection = load_collection()
    app.state.model = load_model()

    yield

    app.state.collection = None
    app.state.model = None

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class Query(BaseModel):
    query: str

@app.post('/query')
async def query_rag(req: Query):
    return {'response': query(req.query, app.state.model, app.state.collection)}

@app.post('/upload')
async def upload_files(files: list[UploadFile] = File(...)):
    print(files[0].filename)

    names = []
    contents = []
    for f in files:
        names.append(f.filename)
        contents.append(f.read())

    add_documents(app.state.collection, contents, names)



