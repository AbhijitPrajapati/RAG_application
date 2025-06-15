
from .chunking import chunk_document
from .sqlite_setup import Collection
from datetime import datetime

def files(chroma_db, collection_id):
    m = chroma_db.get(include=['metadatas'], where={'collection_id': collection_id})['metadatas']
    return set([e['source'] for e in m])

def add_documents(chroma_db, sqlite, texts, filenames, collection_id, chunk_max_words=400, chunk_overlap_sentences=1):
    chunks, metadata = [], []
    for text, filename in zip(texts, filenames):
        c, m = chunk_document(text, chunk_max_words, chunk_overlap_sentences)
        for meta in m: meta.update({'source': filename, 'collection_id': collection_id})
        chunks.extend(c)
        metadata.extend(m) 
    
    id_start = chroma_db.count()
    ids = [str(i) for i in range(id_start, id_start + len(chunks))]

    chroma_db.add(documents=chunks, ids=ids, metadatas=metadata)

    sqlite.query(Collection).filter(Collection.id == collection_id).update({
        Collection.number_files: Collection.number_files + len(texts),
        Collection.last_modified: datetime.now()
    })
    sqlite.commit()

def collections(sqlite_db):
    return sqlite_db.query(Collection).all()

