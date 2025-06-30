from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from chromadb import PersistentClient
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

from llm.load import load_model
from embedding_model.load import load_embedding_model
from errors import AppError

from routers.collections import collections_router
from routers.query import query_router
from routers.files import files_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.chroma = PersistentClient('data/chroma_db').get_collection('documents', embedding_function=SentenceTransformerEmbeddingFunction(model_name='BAAI/bge-small-en-v1.5', device='cuda')) # type: ignore
    # app.state.large_language_model = load_model()
    app.state.embedding_model = load_embedding_model()

    yield

    app.state.chroma = None
    app.state.large_language_model = None
    app.state.embedding_model = None

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

app.include_router(collections_router)
app.include_router(query_router)
app.include_router(files_router)

