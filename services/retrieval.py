from storage.sql import get_documents
from storage.sql import get_db


def list_documents():
    with get_db() as db:
        return get_documents(db)


def query_documents(query, n_chunks, top_n):
    from storage.chroma import query_chunks
    from models.cross_encoder import rerank

    with get_db() as db:
        document_ids = [d.id for d in get_documents(db)]
    chunks = query_chunks(query, document_ids, n_chunks)
    assert chunks is not None
    return rerank(query, chunks[0], top_n)
