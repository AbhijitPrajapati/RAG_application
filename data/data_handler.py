from chromadb import PersistentClient

from .chunking import chunk_documents

def load_db():
    return PersistentClient('data/chroma_db').get_collection('documents')

def collections(db):
    metadata = db.get(include=['metadatas'])['metadatas']
    return set([m['collection'] for m in metadata])

def files(db, collection):
    m = db.get(include=['metadatas'], where={'collection': collection})['metadatas']
    return set([e['source'] for e in m])

def add_documents(db, texts, filenames, collection, chunk_max_words=400, chunk_overlap_sentences=1):
    chunks, metadata = chunk_documents(texts, filenames, collection, chunk_max_words, chunk_overlap_sentences)
    
    id_start = db.count()
    ids = [str(i) for i in range(id_start, id_start + len(chunks))]

    db.add(documents=chunks, ids=ids, metadatas=metadata)