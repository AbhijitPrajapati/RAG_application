from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from chromadb import PersistentClient
# from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

from ollama import pull
from sentence_transformers import CrossEncoder, SentenceTransformer

from backend.doc_collections.router import collections_router
from backend.documents.router import documents_router
from backend.query.router import query_router

EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # chroma_embedding_func = SentenceTransformerEmbeddingFunction(
    #     model_name=EMBEDDING_MODEL, device="cuda"
    # )
    app.state.chroma = PersistentClient(
        "backend/db/chroma_db"
    ).get_or_create_collection(
        "documents",  # embedding_function=chroma_embedding_func
    )
    pull("mistral:7b-instruct-v0.2-q5_K_M", stream=True)
    app.state.embedding_model = SentenceTransformer(EMBEDDING_MODEL, device="cuda")
    app.state.reranker = CrossEncoder(
        "BAAI/bge-reranker-base",
        device="cuda",
        cache_folder="backend/reranker_cache",
    )

    yield

    app.state.chroma = None
    app.state.generation_model = None
    app.state.embedding_model = None
    app.state.reranker = None


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(collections_router)
app.include_router(query_router)
app.include_router(documents_router)
