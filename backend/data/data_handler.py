
from .chunking import chunk_document
from .sqlalchemy_setup import Collection
from datetime import datetime

def files(chroma_db, collection_id):
    m = chroma_db.get(include=['metadatas'], where={'collection_id': collection_id})['metadatas']
    return set([e['source'] for e in m])

def add_documents(chroma_db, sql_db, texts, filenames, collection_id, chunk_max_words=400, chunk_overlap_sentences=1):
    chunks, metadata = [], []
    
    for text, filename in zip(texts, filenames):
        c, m = chunk_document(text, chunk_max_words, chunk_overlap_sentences)
        for meta in m: meta.update({'source': filename, 'collection_id': collection_id})
        chunks.extend(c)
        metadata.extend(m) 
    
    id_start = chroma_db.count()
    ids = [str(i) for i in range(id_start, id_start + len(chunks))]

    chroma_db.add(documents=chunks, ids=ids, metadatas=metadata)

    sql_db.query(Collection).filter(Collection.id == collection_id).update({
        Collection.number_files: Collection.number_files + len(texts),
        Collection.last_modified: datetime.now()
    })
    sql_db.commit()

def collections(sql_db):
    return sql_db.query(Collection).all()

def delete_collections(chroma_db, sql_db, collection_ids):
    chunks = chroma_db.query(where={'collection_id': 
                                    {'$in': [collection_ids]}
                                    }, include=['ids'])
    chunk_ids = chunks['ids']
    if chunk_ids:
        chroma_db.delete(ids=chunk_ids)

    sql_db.query(Collection).filter(Collection.id.in_(collection_ids)).delete()
    sql_db.commit()

def create_collection(name, sql_db):
    collection = Collection(name=name)
    sql_db.add(collection)
    sql_db.commit()
    sql_db.refresh(collection)
    return collection

